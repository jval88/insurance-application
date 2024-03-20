import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import './Application.css';
import { UserFormData, AddressFormData, Vehicle, AdditionalMember } from '../types/types';
import UserForm from './UserForm';
import AddressForm from './AddressForm';
import VehiclesForm from './VehiclesForm';
import { ApplicationProps } from '../types/types';
import AdditionalMemberForm from './AdditionalMemberForm';
import Header from './Header';
import {
    clearLocalStorage,
    formatDateToYYYYMMDD,
    validateForm,
    validateSaveForm,
} from '../common/util/formUtil';
import {
    defaultAdditionalMemberFormData,
    defaultAddressFormData,
    defaultUserFormData,
    defaultVehicleData,
    initialErrorsState,
} from '../common/defaults/applicationDefaults';
import {
    getApplication,
    putApplication,
    validateAndSubmitApplication,
} from '../common/services/applicationServices';

const Application: React.FC<ApplicationProps> = ({ setQuoteValue }) => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [errors, setErrors] = useState(initialErrorsState);
    const [userData, setUserData] = useState<UserFormData>(defaultUserFormData);
    const [addressData, setAddressData] = useState<AddressFormData>(defaultAddressFormData);
    const [vehiclesData, setVehiclesData] = useState<Vehicle[]>([defaultVehicleData]);
    const [additionalMembersData, setAdditionalMembersData] = useState<AdditionalMember[]>([
        defaultAdditionalMemberFormData,
    ]);
    const [showVehicleMessage, setShowVehicleMessage] = useState<string>('');

    const [lastFetchedAppId, setLastFetchedAppId] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async (appId: string | undefined) => {
            if (appId) {
                try {
                    const response = await getApplication(appId);
                    const { member, address, vehicles, additionalMembers } = response.data;

                    // Determine if any of the backend data is populated
                    const isAnyDataPopulated =
                        member.dateOfBirth ||
                        member.firstName ||
                        member.lastName ||
                        address.street ||
                        address.city ||
                        address.state ||
                        address.zipCode ||
                        vehicles?.length > 0 ||
                        additionalMembers?.length > 0;

                    if (isAnyDataPopulated) {
                        if (member.dateOfBirth)
                            member.dateOfBirth = formatDateToYYYYMMDD(member.dateOfBirth);
                        const newUserData = member || defaultUserFormData;
                        localStorage.setItem('userData', JSON.stringify(newUserData));
                        setUserData(newUserData);

                        const newAddressData = address || defaultAddressFormData;
                        localStorage.setItem('addressData', JSON.stringify(newAddressData));
                        setAddressData(newAddressData);

                        const newVehiclesData = vehicles || [];
                        localStorage.setItem('vehiclesData', JSON.stringify(newVehiclesData));
                        setVehiclesData(newVehiclesData);

                        additionalMembers.forEach((addMember: AdditionalMember, index: number) => {
                            if (additionalMembers[index].dateOfBirth)
                                additionalMembers[index].dateOfBirth = formatDateToYYYYMMDD(
                                    addMember.dateOfBirth
                                );
                        });
                        const newAdditionalMembersData = additionalMembers || [];
                        localStorage.setItem(
                            'additionalMembersData',
                            JSON.stringify(newAdditionalMembersData)
                        );
                        setAdditionalMembersData(newAdditionalMembersData);
                    } else {
                        // If no backend data is populated, use local storage or defaults
                        loadDefaultsFromLocalStorage();
                    }
                } catch (error) {
                    console.error('Error fetching application data:', error);
                    // Use local storage or default values if error fetching data
                    loadDefaultsFromLocalStorage();
                }
            } else {
                // Use local storage or default values if no appId
                loadDefaultsFromLocalStorage();
            }
        };

        if (id && id !== lastFetchedAppId) {
            fetchData(id);
            setLastFetchedAppId(id); // Keep track of the last fetched application ID
        }
    }, [id, lastFetchedAppId]);

    const loadDefaultsFromLocalStorage = () => {
        setUserData(
            JSON.parse(localStorage.getItem('userData') || JSON.stringify(defaultUserFormData))
        );
        setAddressData(
            JSON.parse(
                localStorage.getItem('addressData') || JSON.stringify(defaultAddressFormData)
            )
        );
        setVehiclesData(JSON.parse(localStorage.getItem('vehiclesData') || '[]'));
        setAdditionalMembersData(JSON.parse(localStorage.getItem('additionalMembersData') || '[]'));
    };

    const handleUserDataChange = (newUserData: UserFormData) => {
        setUserData(newUserData);
        localStorage.setItem('userData', JSON.stringify(newUserData));
    };

    const handleAddressDataChange = (newAddressData: AddressFormData) => {
        setAddressData(newAddressData);
        localStorage.setItem('addressData', JSON.stringify(newAddressData));
    };

    const handleMemberChange = (index: number, updatedMember: AdditionalMember) => {
        const updatedMembers = [...additionalMembersData];
        updatedMembers[index] = updatedMember;
        setAdditionalMembersData(updatedMembers);
        localStorage.setItem('additionalMembersData', JSON.stringify(updatedMembers));
    };

    const addMember = () => {
        setAdditionalMembersData([
            ...additionalMembersData,
            { firstName: '', lastName: '', dateOfBirth: '', relationship: '' },
        ]);
        localStorage.setItem('additionalMembersData', JSON.stringify(additionalMembersData));
    };

    const removeMember = (index: number) => {
        const updatedMembers = additionalMembersData.filter((_, i) => i !== index);
        setAdditionalMembersData(updatedMembers);

        const updatedErrors = [...errors.additionalMember];
        updatedErrors.splice(index, 1); // Remove the error at the same index
        setErrors({ ...errors, additionalMember: updatedErrors });

        localStorage.setItem('additionalMembersData', JSON.stringify(updatedMembers || []));
    };

    const addVehicle = () => {
        const newVehicle: Vehicle = { vin: '', year: null, make: '', model: '' };
        setVehiclesData([...vehiclesData, newVehicle]);
        localStorage.setItem('vehiclesData', JSON.stringify(vehiclesData));
    };

    const removeVehicle = (index: number) => {
        const updatedVehicles = vehiclesData.filter((_, i) => i !== index);
        setVehiclesData(updatedVehicles);

        const updatedVehicleErrors = [...errors.vehicle];
        updatedVehicleErrors.splice(index, 1); // Remove the error at the same index
        setErrors({ ...errors, vehicle: updatedVehicleErrors });

        localStorage.setItem('vehiclesData', JSON.stringify(updatedVehicles || []));
    };

    const handleVehicleChange = (vehicleIndex: number, updatedVehicle: Vehicle) => {
        const newVehiclesData = [...vehiclesData];
        newVehiclesData[vehicleIndex] = updatedVehicle;
        setVehiclesData(newVehiclesData);
        localStorage.setItem('vehiclesData', JSON.stringify(newVehiclesData));
    };

    const handleSubmit = async () => {
        const validations = {
            user: validateForm(userData, 'user'),
            address: validateForm(addressData, 'address'),
            vehicles: vehiclesData.map((vehicle) => validateForm(vehicle, 'vehicle')),
            additionalMembers: additionalMembersData.map((member) =>
                validateForm(member, 'additionalMember')
            ),
        };

        // Check the number of vehicles
        const vehicleCountValid = vehiclesData.length >= 1 && vehiclesData.length <= 3;

        const allValid =
            validations.user.isValid &&
            validations.address.isValid &&
            validations.vehicles.every((validation) => validation.isValid) &&
            validations.additionalMembers.every((validation) => validation.isValid) &&
            vehicleCountValid;

        if (allValid) {
            try {
                const response = await validateAndSubmitApplication({
                    id,
                    userData,
                    addressData,
                    vehiclesData,
                    additionalMembersData,
                });

                // Handle success (e.g., navigating to a new page)
                setQuoteValue(Number(response.data.validationNumber));
                clearLocalStorage();
                navigate(`/quote`);
            } catch (error) {
                console.error('Error submitting application:', error);
            }
        } else {
            setErrors({
                user: validations.user.newErrors,
                address: validations.address.newErrors,
                vehicle: validations.vehicles.map((v) => v.newErrors),
                additionalMember: validations.additionalMembers.map((m) => m.newErrors),
            });
            // Set the vehicle count error message if necessary
            setShowVehicleMessage(
                vehicleCountValid ? '' : 'You must have between 1 and 3 vehicles'
            );
        }
    };

    const handleSave = async () => {
        const validations = {
            user: validateSaveForm(userData, 'user'),
            address: validateSaveForm(addressData, 'address'),
            vehicles: vehiclesData.map((vehicle) => validateSaveForm(vehicle, 'vehicle')),
            additionalMembers: additionalMembersData.map((member) =>
                validateSaveForm(member, 'additionalMember')
            ),
        };
        // This does not perform full validation checks, only submits the data with minor checks
        const allValid =
            validations.user.isValid &&
            validations.address.isValid &&
            validations.vehicles.every((validation) => validation.isValid) &&
            validations.additionalMembers.every((validation) => validation.isValid);
        if (allValid) {
            try {
                await putApplication({
                    id,
                    userData,
                    addressData,
                    vehiclesData,
                    additionalMembersData,
                });
                setErrors(initialErrorsState);
            } catch (error) {
                console.error('Error saving application:', error);
            }
        } else {
            setErrors({
                user: validations.user.newErrors,
                address: validations.address.newErrors,
                vehicle: validations.vehicles.map((v) => v.newErrors),
                additionalMember: validations.additionalMembers.map((m) => m.newErrors),
            });
        }
    };

    return (
        <div className="container">
            <div className="form-section">
                <Header>
                    <h3 className="header">Enter your Information</h3>
                </Header>
                <UserForm
                    errors={errors.user}
                    userData={userData}
                    onChange={handleUserDataChange}
                />
            </div>
            <div className="members-section">
                <Header>
                    <h3 className="header">Additional Members</h3>
                </Header>
                {additionalMembersData.map((additionalMember, index) => (
                    <AdditionalMemberForm
                        key={index}
                        errors={errors.additionalMember[index] || {}}
                        index={index}
                        member={additionalMember}
                        onChange={handleMemberChange}
                        removeMember={removeMember}
                    />
                ))}
                <button onClick={addMember} className="add-button">
                    Add Additional Member
                </button>
            </div>
            <div className="form-section">
                <Header>
                    <h3 className="header">Address</h3>
                </Header>
                <AddressForm
                    errors={errors.address}
                    addressData={addressData}
                    onChange={handleAddressDataChange}
                />
            </div>
            <div className="vehicles-section">
                <Header>
                    <h3 className="header">Add/Remove Vehicles</h3>
                </Header>
                {showVehicleMessage && <p className="error">{showVehicleMessage}</p>}
                {vehiclesData.map((vehicle, index) => (
                    <VehiclesForm
                        key={index}
                        errors={errors.vehicle[index] || {}}
                        index={index}
                        vehicle={vehicle}
                        onChange={handleVehicleChange}
                        removeVehicle={removeVehicle}
                    />
                ))}
                <button onClick={addVehicle} className="add-button">
                    Add Vehicle
                </button>
            </div>
            <div className="form-buttons">
                <button onClick={handleSave} className="save-button">
                    Save
                </button>
                <button onClick={handleSubmit} className="submit-button">
                    Submit
                </button>
            </div>
        </div>
    );
};

export default Application;
