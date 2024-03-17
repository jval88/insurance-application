import React, { useEffect, useState } from 'react';
import UserForm from './components/UserForm';
import AddressForm from './components/AddressForm';
import VehiclesForm from './components/VehiclesForm';
import { IUserFormData, IAddressFormData, IVehicle } from './types/types';
import Header from './components/Header';
import ConfirmationView from './components/ConfirmationView';
import QuoteView from './components/QuoteView';

function App() {
    const [step, setStep] = useState<number>(() => Number(localStorage.getItem('step')) || 1);
    const [userData, setUserData] = useState<IUserFormData>(() =>
        JSON.parse(localStorage.getItem('userData') || '{}')
    );
    const [addressData, setAddressData] = useState<IAddressFormData>(() =>
        JSON.parse(localStorage.getItem('addressData') || '{}')
    );
    const [vehiclesData, setVehiclesData] = useState<IVehicle[]>(() =>
        JSON.parse(localStorage.getItem('vehiclesData') || '[]')
    );

    useEffect(() => {
        localStorage.setItem('step', step.toString());
        localStorage.setItem('userData', JSON.stringify(userData));
        localStorage.setItem('addressData', JSON.stringify(addressData));
        localStorage.setItem('vehiclesData', JSON.stringify(vehiclesData));
    }, [step, userData, addressData, vehiclesData]);

    const addVehicle = () => {
        const newVehicle: IVehicle = { vin: '', year: null, make: '', model: '' };
        setVehiclesData([...vehiclesData, newVehicle]);
    };

    const removeVehicle = (index: number) => {
        const updatedVehicles = vehiclesData.filter((_, i) => i !== index);
        setVehiclesData(updatedVehicles);
    };

    const editVehicle = (vehicleIndex: number, updatedVehicle: IVehicle) => {
        const newVehiclesData = [...vehiclesData];
        newVehiclesData[vehicleIndex] = updatedVehicle;
        setVehiclesData(newVehiclesData);
    };

    const nextStep = () => setStep(step + 1);
    const prevStep = () => setStep(step - 1);

    const renderStep = () => {
        switch (step) {
            case 1:
                return (
                    <React.Fragment>
                        <Header>
                            <h3>Enter your Information</h3>
                        </Header>
                        <UserForm
                            userData={userData}
                            onChange={(updatedUserData) => setUserData(updatedUserData)}
                        />
                    </React.Fragment>
                );
            case 2:
                return (
                    <React.Fragment>
                        <Header>
                            <h3>Enter your Address</h3>
                        </Header>
                        <AddressForm
                            addressData={addressData}
                            onChange={(updatedAddressData) => setAddressData(updatedAddressData)}
                        />
                    </React.Fragment>
                );
            case 3:
                return (
                    <React.Fragment>
                        <Header>
                            <h3>Add/Remove Vehicles</h3>
                        </Header>
                        {vehiclesData.map((vehicle: IVehicle, index: number) => (
                            <div key={index}>
                                <Header>
                                    <h4>Vehicle {index + 1}</h4>
                                </Header>
                                <VehiclesForm
                                    index={index}
                                    vehicle={vehicle}
                                    onChange={editVehicle}
                                    removeVehicle={removeVehicle}
                                />
                            </div>
                        ))}
                        <button onClick={addVehicle}>Add Vehicle</button>
                    </React.Fragment>
                );
            case 4:
                return (
                    <React.Fragment>
                        <Header>
                            <h3>Confirm your Information</h3>
                        </Header>
                        <ConfirmationView
                            userData={userData}
                            addressData={addressData}
                            vehiclesData={vehiclesData}
                            onEdit={() => setStep(1)} // Go back to step 1 to edit
                        />
                    </React.Fragment>
                );
            case 5:
                return (
                    <React.Fragment>
                        <Header>
                            <h3>Your Quote</h3>
                        </Header>
                        <QuoteView />
                    </React.Fragment>
                );
            default:
                return <div>Unknown step</div>;
        }
    };

    return (
        <div>
            {renderStep()}
            {step > 1 && step < 5 && <button onClick={prevStep}>Back</button>}
            {step < 4 && <button onClick={nextStep}>Next</button>}
            {step === 4 && <button onClick={() => setStep(5)}>Submit</button>}
        </div>
    );
}

export default App;
