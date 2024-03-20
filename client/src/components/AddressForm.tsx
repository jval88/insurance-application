import React from 'react';

import { AddressFormProps } from '../types/types';

const AddressForm = ({ addressData, onChange, errors }: AddressFormProps) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        onChange({ ...addressData, [name]: value });
    };

    return (
        <form>
            <div>
                <label htmlFor="street">Street Address:</label>
                <input
                    type="text"
                    id="street"
                    name="street"
                    value={addressData.street || ''}
                    onChange={handleChange}
                />
                {errors.street && <p className="error">{errors.street}</p>}
            </div>
            <div>
                <label htmlFor="city">City:</label>
                <input
                    type="text"
                    id="city"
                    name="city"
                    value={addressData.city || ''}
                    onChange={handleChange}
                />
                {errors.city && <p className="error">{errors.city}</p>}
            </div>
            <div>
                <label htmlFor="state">State:</label>
                <input
                    type="text"
                    id="state"
                    name="state"
                    value={addressData.state || ''}
                    onChange={handleChange}
                />
                {errors.state && <p className="error">{errors.state}</p>}
            </div>
            <div>
                <label htmlFor="zipCode">ZIP Code:</label>
                <input
                    type="number"
                    id="zipCode"
                    name="zipCode"
                    value={addressData.zipCode || ''}
                    onChange={handleChange}
                />
                {errors.zipCode && <p className="error">{errors.zipCode}</p>}
            </div>
        </form>
    );
};

export default AddressForm;
