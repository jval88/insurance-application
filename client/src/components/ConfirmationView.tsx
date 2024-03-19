import React from 'react';

import { ConfirmationViewProps } from '../types/types';
import UserView from './UserView';
import AddressView from './AddressView';
import VehicleView from './VehicleView';

const ConfirmationView: React.FC<ConfirmationViewProps> = ({
    userData,
    addressData,
    vehiclesData,
    onEdit,
}) => {
    return (
        <div>
            <h4>Your Information</h4>
            <UserView userData={userData}></UserView>
            <h4>Address Details</h4>
            <AddressView addressData={addressData}></AddressView>
            <h4>Vehicles</h4>
            {vehiclesData.map((vehicle, index) => (
                <React.Fragment>
                    <h4>Vehicle {index + 1}</h4>
                    <VehicleView key={index} vehicle={vehicle}></VehicleView>
                </React.Fragment>
            ))}
            <button onClick={onEdit}>Edit</button>
        </div>
    );
};

export default ConfirmationView;
