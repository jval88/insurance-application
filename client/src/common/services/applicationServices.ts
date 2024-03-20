import axios from 'axios';

import { UpdateApplicationProps } from '../../types/types';

const apiUrl = import.meta.env.VITE_API_URL;
console.log(apiUrl);

export const getApplication = async (appId: string) => {
    return await axios.get(`${apiUrl}/applications/${appId}`);
};

export const validateAndSubmitApplication = async ({
    id,
    userData,
    addressData,
    vehiclesData,
    additionalMembersData,
}: UpdateApplicationProps) => {
    console.log(apiUrl);
    return await axios.post(`${apiUrl}/applications/${id}/submit`, {
        userData,
        addressData,
        vehiclesData,
        additionalMembersData,
    });
};

export const putApplication = async ({
    id,
    userData,
    addressData,
    vehiclesData,
    additionalMembersData,
}: UpdateApplicationProps) => {
    return await axios.put(`${apiUrl}/applications/${id}`, {
        userData,
        addressData,
        vehiclesData,
        additionalMembersData,
    });
};
