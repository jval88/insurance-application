import React from 'react';

export const handleGenericInputChange = <T>(
    event: React.ChangeEvent<HTMLInputElement>,
    currentData: T,
    updateFunction: (newData: T) => void
) => {
    const { name, value } = event.target;
    updateFunction({
        ...currentData,
        [name]: value,
    });
};
