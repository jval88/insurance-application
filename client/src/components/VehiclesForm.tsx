import { IVehiclesFormProps } from '../types/types';
import { handleGenericInputChange } from './formUtil';

export default function VehiclesForm({
    vehicle,
    onChange,
    index,
    removeVehicle,
}: IVehiclesFormProps) {
    const handleVehicleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        handleGenericInputChange(event, vehicle, (updatedVehicle) => {
            onChange(index, updatedVehicle);
        });
    };
    return (
        <form>
            <div>
                <label htmlFor="vin">VIN:</label>
                <input
                    type="text"
                    id="vin"
                    name="vin"
                    value={vehicle.vin}
                    onChange={handleVehicleChange}
                />
            </div>
            <div>
                <label htmlFor="year">Year:</label>
                <input
                    type="number"
                    id="year"
                    name="year"
                    value={vehicle.year || ''}
                    onChange={handleVehicleChange}
                />
            </div>
            <div>
                <label htmlFor="make">Make:</label>
                <input
                    type="text"
                    id="make"
                    name="make"
                    value={vehicle.make}
                    onChange={handleVehicleChange}
                />
            </div>
            <div>
                <label htmlFor="model">Model:</label>
                <input
                    type="text"
                    id="model"
                    name="model"
                    value={vehicle.model}
                    onChange={handleVehicleChange}
                />
            </div>
            <button type="button" onClick={() => removeVehicle(index)}>
                Remove Vehicle
            </button>
        </form>
    );
}
