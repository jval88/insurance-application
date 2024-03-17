import React from 'react';
import { IAddressFormData } from '../types/types';

const AddressView: React.FC<{ addressData: IAddressFormData }> = ({ addressData }) => {
    return (
        <div>
            <div>
                <strong>Street Address 1: </strong> {addressData.street1}
            </div>
            <div>
                <strong>Street Address 2: </strong> {addressData.street2}
            </div>
            <div>
                <strong>City: </strong> {addressData.city}
            </div>
            <div>
                <strong>State: </strong> {addressData.state}
            </div>
            <div>
                <strong>ZIP Code: </strong> {addressData.zipCode}
            </div>
        </div>
    );
};

export default AddressView;
