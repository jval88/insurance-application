import React, { useEffect, useState } from 'react';

import UserForm from './components/UserForm';
import AddressForm from './components/AddressForm';
import VehiclesForm from './components/VehiclesForm';
import { UserFormData, AddressFormData, Vehicle } from './types/types';
import Header from './components/Header';
import QuoteView from './components/QuoteView';
import { Errors, validateForm } from './common/util/formUtil';

function App() {
    const initialErrorsState: { user: Errors; address: Errors; vehicle: Errors[] } = {
        user: {} as Errors,
        address: {} as Errors,
        vehicle: [],
    };

    const defaultUserFormData: UserFormData = {
        firstName: '',
        lastName: '',
        dateOfBirth: '',
    };

    const defaultAddressFormData: AddressFormData = {
        street: '',
        city: '',
        state: '',
        zipCode: '',
    };

    const defaultVehicleData: Vehicle = {
        vin: '',
        year: 0,
        make: '',
        model: '',
    };

    const [errors, setErrors] = useState(initialErrorsState);

    const [userData, setUserData] = useState<UserFormData>(() =>
        JSON.parse(localStorage.getItem('userData') || JSON.stringify(defaultUserFormData))
    );

    const [addressData, setAddressData] = useState<AddressFormData>(() =>
        JSON.parse(localStorage.getItem('addressData') || JSON.stringify(defaultAddressFormData))
    );

    const [vehiclesData, setVehiclesData] = useState<Vehicle[]>(() =>
        JSON.parse(localStorage.getItem('vehiclesData') || JSON.stringify([defaultVehicleData]))
    );

    const [step, setStep] = useState<number>(() => Number(localStorage.getItem('step')) || 0);
    const [showVehicleMessage, setShowVehicleMessage] = useState<string>('');

    useEffect(() => {
        //add logic later to retrieve from db
        localStorage.setItem('step', localStorage.getItem('step') || '0');
        localStorage.setItem('userData', localStorage.getItem('userData') || '{}');
        localStorage.setItem('addressData', localStorage.getItem('addressData') || '{}');
        localStorage.setItem('vehiclesData', localStorage.getItem('vehiclesData') || '[]');
    }, []);

    const addVehicle = () => {
        const newVehicle: Vehicle = { vin: '', year: null, make: '', model: '' };
        setVehiclesData([...vehiclesData, newVehicle]);
    };

    const removeVehicle = (index: number) => {
        const updatedVehicles = vehiclesData.filter((_, i) => i !== index);
        setVehiclesData(updatedVehicles);
    };

    const editVehicle = (vehicleIndex: number, updatedVehicle: Vehicle) => {
        const newVehiclesData = [...vehiclesData];
        newVehiclesData[vehicleIndex] = updatedVehicle;
        setVehiclesData(newVehiclesData);
        localStorage.setItem('vehiclesData', JSON.stringify(newVehiclesData));
    };

    const handleSubmit = () => {
        const userValidation = validateForm(userData, 'user');
        const addressValidation = validateForm(addressData, 'address');
        const vehicleValidations = vehiclesData.map((vehicle) => validateForm(vehicle, 'vehicle'));

        const allValid =
            userValidation.isValid &&
            addressValidation.isValid &&
            vehicleValidations.every((v) => v.isValid);

        const userErrors: Errors = userValidation.newErrors;
        const addressErrors: Errors = addressValidation.newErrors;
        const vehicleErrors: Errors[] = vehicleValidations.map((v) => v.newErrors);

        //update Errors state
        setErrors({
            user: userErrors,
            address: addressErrors,
            vehicle: vehicleErrors,
        });
        if (vehiclesData.length === 0) {
            setShowVehicleMessage('You must add at least one vehicle.');
        } else if (vehiclesData.length > 3) {
            setShowVehicleMessage('You can have a maximum of 3 vehicles.');
        } else {
            setShowVehicleMessage('');
            if (allValid) {
                setStep(step + 1);
            }
        }
    };

    switch (step) {
        case 0:
            return (
                <React.Fragment>
                    <Header>
                        <h3>Welcome to the Insurance Application</h3>
                    </Header>
                    <button onClick={() => setStep(1)}>Start New Application</button>
                </React.Fragment>
            );
        case 1:
            return (
                <React.Fragment>
                    <Header>
                        <h3>Member Information</h3>
                    </Header>
                    <UserForm
                        errors={errors.user}
                        userData={userData}
                        onChange={(updatedUserData) => {
                            setUserData(updatedUserData);
                            localStorage.setItem('userData', JSON.stringify(updatedUserData));
                        }}
                    />
                    <Header>
                        <h3>Address</h3>
                    </Header>
                    <AddressForm
                        errors={errors.address}
                        addressData={addressData}
                        onChange={(updatedAddressData) => {
                            setAddressData(updatedAddressData);
                            localStorage.setItem('addressData', JSON.stringify(updatedAddressData));
                        }}
                    />
                    <Header>
                        <h3>Add/Remove Vehicles</h3>
                    </Header>
                    {showVehicleMessage && <p className="error">{showVehicleMessage}</p>}
                    {vehiclesData.map((vehicle: Vehicle, index: number) => (
                        <div key={index}>
                            <Header>
                                <h4>Vehicle {index + 1}</h4>
                            </Header>
                            <VehiclesForm
                                key={index}
                                errors={errors.vehicle[index] || {}}
                                index={index}
                                vehicle={vehicle}
                                onChange={editVehicle}
                                removeVehicle={removeVehicle}
                            />
                        </div>
                    ))}
                    <button onClick={addVehicle}>Add Vehicle</button>
                    <button onClick={handleSubmit}>Submit</button>
                </React.Fragment>
            );
        case 2:
            return (
                <React.Fragment>
                    <Header>
                        <h3>Your Quote</h3>
                    </Header>
                    <QuoteView />
                    <button
                        onClick={() => {
                            // Reset application data
                            setStep(0);
                            setUserData({
                                firstName: '',
                                lastName: '',
                                dateOfBirth: '',
                            });
                            setAddressData({
                                street: '',
                                city: '',
                                state: '',
                                zipCode: '',
                            });
                            setVehiclesData([]);
                            // Also clear localStorage
                            localStorage.clear();
                        }}
                    >
                        Go to Home
                    </button>
                </React.Fragment>
            );
        default:
            return <div>Unknown step</div>;
    }
}

export default App;
