import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

import { UserFormData, AddressFormData, Vehicle, AdditionalMember } from '../types/types';
import UserForm from './UserForm';
import AddressForm from './AddressForm';
import VehiclesForm from './VehiclesForm';
import { ApplicationProps } from '../types/types';
import AdditionalMemberForm from './AdditionalMemberForm';
import Header from './Header';
import { Errors, clearLocalStorage, validateForm, validateSaveForm } from '../common/util/formUtil';

const Application: React.FC<ApplicationProps> = ({ setQuoteValue }) => {
    const { id } = useParams();
    const navigate = useNavigate();

    const defaultUserFormData: UserFormData = {
        firstName: '',
        lastName: '',
        dateOfBirth: '',
    };

    const defaultAdditionalMemberFormData: AdditionalMember = {
        firstName: '',
        lastName: '',
        dateOfBirth: '',
        relationship: '',
    };

    const defaultAddressFormData: AddressFormData = {
        street: '',
        city: '',
        state: '',
        zipCode: null,
    };

    const defaultVehicleData: Vehicle = {
        vin: '',
        year: null,
        make: '',
        model: '',
    };

    const initialErrorsState: {
        user: Errors;
        additionalMember: Errors[];
        address: Errors;
        vehicle: Errors[];
    } = {
        user: {} as Errors,
        additionalMember: [],
        address: {} as Errors,
        vehicle: [],
    };

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
                    const response = await axios.get(`http://localhost:5000/applications/${appId}`);
                    const { member, address, vehicles, additionalMembers } = response.data;

                    // Determine if any of the backend data is populated
                    const isAnyDataPopulated =
                        member || address || vehicles?.length > 0 || additionalMembers?.length > 0;

                    if (isAnyDataPopulated) {
                        // If any backend data is populated, use all backend data
                        const newUserData = member || defaultUserFormData;
                        localStorage.setItem('userData', JSON.stringify(newUserData));
                        setUserData(newUserData);

                        const newAddressData = address || defaultAddressFormData;
                        localStorage.setItem('addressData', JSON.stringify(newAddressData));
                        setAddressData(newAddressData);

                        const newVehiclesData = vehicles || [];
                        localStorage.setItem('vehiclesData', JSON.stringify(newVehiclesData));
                        setVehiclesData(newVehiclesData);

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
        localStorage.setItem('additionalMembersData', JSON.stringify(additionalMembersData));
    };

    const addMember = () => {
        setAdditionalMembersData([
            ...additionalMembersData,
            { firstName: '', lastName: '', dateOfBirth: '', relationship: '' },
        ]);
    };

    const removeMember = (index: number) => {
        const updatedMembers = additionalMembersData.filter((_, i) => i !== index);
        setAdditionalMembersData(updatedMembers);
    };

    const addVehicle = () => {
        const newVehicle: Vehicle = { vin: '', year: null, make: '', model: '' };
        setVehiclesData([...vehiclesData, newVehicle]);
    };

    const removeVehicle = (index: number) => {
        const updatedVehicles = vehiclesData.filter((_, i) => i !== index);
        setVehiclesData(updatedVehicles);
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
                const response = await axios.post(
                    `http://localhost:5000/applications/${id}/submit`,
                    {
                        userData,
                        addressData,
                        vehiclesData,
                        additionalMembersData,
                    }
                );

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
                await axios.put(`http://localhost:5000/applications/${id}`, {
                    userData,
                    addressData,
                    vehiclesData,
                    additionalMembersData,
                });
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
        <div>
            <Header>
                <h3>Enter your Information</h3>
            </Header>
            <UserForm errors={errors.user} userData={userData} onChange={handleUserDataChange} />
            <Header>
                <h3>Additional Members</h3>
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
            <button onClick={addMember}>Add Additional Member</button>

            <Header>
                <h3>Address</h3>
            </Header>
            <AddressForm
                errors={errors.address}
                addressData={addressData}
                onChange={handleAddressDataChange}
            />
            <Header>
                <h3>Add/Remove Vehicles</h3>
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
            <button onClick={addVehicle}>Add Vehicle</button>
            <button onClick={handleSave}>Save</button>
            <button onClick={handleSubmit}>Submit</button>
        </div>
    );
};

export default Application;
