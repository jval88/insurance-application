import { IAddressFormProps } from '../types/types';
import { handleGenericInputChange } from './formUtil';

export default function AddressForm({ addressData, onChange }: IAddressFormProps) {
    return (
        <form>
            <div>
                <label htmlFor="street">Street Address 1:</label>
                <input
                    type="text"
                    id="street1"
                    name="street1"
                    value={addressData.street1}
                    onChange={(e) => handleGenericInputChange(e, addressData, onChange)}
                />
            </div>
            <div>
                <label htmlFor="street">Street Address 2:</label>
                <input
                    type="text"
                    id="street2"
                    name="street2"
                    value={addressData.street2}
                    onChange={(e) => handleGenericInputChange(e, addressData, onChange)}
                />
            </div>
            <div>
                <label htmlFor="city">City:</label>
                <input
                    type="text"
                    id="city"
                    name="city"
                    value={addressData.city}
                    onChange={(e) => handleGenericInputChange(e, addressData, onChange)}
                />
            </div>
            <div>
                <label htmlFor="state">State:</label>
                <input
                    type="text"
                    id="state"
                    name="state"
                    value={addressData.state}
                    onChange={(e) => handleGenericInputChange(e, addressData, onChange)}
                />
            </div>
            <div>
                <label htmlFor="zipCode">ZIP Code:</label>
                <input
                    type="text"
                    id="zipCode"
                    name="zipCode"
                    value={addressData.zipCode}
                    onChange={(e) => handleGenericInputChange(e, addressData, onChange)}
                />
            </div>
        </form>
    );
}
