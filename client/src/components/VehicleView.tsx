import React from 'react';
import { IVehicle } from '../types/types';

const VehicleView: React.FC<{ vehicle: IVehicle }> = ({ vehicle }) => {
    return (
        <div>
            <div>
                <strong>VIN: </strong> {vehicle.vin}
            </div>
            <div>
                <strong>Year: </strong> {vehicle.year}
            </div>
            <div>
                <strong>Make: </strong> {vehicle.make}
            </div>
            <div>
                <strong>Model: </strong> {vehicle.model}
            </div>
        </div>
    );
};

export default VehicleView;
