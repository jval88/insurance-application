import React from 'react';

import { AddressFormData } from '../types/types';

const AddressView: React.FC<{ addressData: AddressFormData }> = ({ addressData }) => {
    return (
        <div>
            <div>
                <strong>Street Address: </strong> {addressData.street}
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
