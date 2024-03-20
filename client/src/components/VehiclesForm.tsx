import React from 'react';

import { VehiclesFormProps } from '../types/types';

const VehiclesForm = ({ vehicle, onChange, index, removeVehicle, errors }: VehiclesFormProps) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        onChange(index, { ...vehicle, [name]: value });
    };

    return (
        <form>
            <div>
                <label htmlFor="vin">VIN:</label>
                <input
                    type="text"
                    id="vin"
                    name="vin"
                    value={vehicle.vin || ''}
                    onChange={handleChange}
                />
                {errors.vin && <p className="error">{errors.vin}</p>}
            </div>
            <div>
                <label htmlFor="year">Year:</label>
                <input
                    type="number"
                    id="year"
                    name="year"
                    value={vehicle.year || ''}
                    onChange={handleChange}
                />
                {errors.year && <p className="error">{errors.year}</p>}
            </div>
            <div>
                <label htmlFor="make">Make:</label>
                <input
                    type="text"
                    id="make"
                    name="make"
                    value={vehicle.make || ''}
                    onChange={handleChange}
                />
                {errors.make && <p className="error">{errors.make}</p>}
            </div>
            <div>
                <label htmlFor="model">Model:</label>
                <input
                    type="text"
                    id="model"
                    name="model"
                    value={vehicle.model || ''}
                    onChange={handleChange}
                />
                {errors.model && <p className="error">{errors.model}</p>}
            </div>
            <button type="button" onClick={() => removeVehicle(index)}>
                Remove Vehicle
            </button>
        </form>
    );
};

export default VehiclesForm;
