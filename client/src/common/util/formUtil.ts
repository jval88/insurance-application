import React from 'react';
import {
    VALIDATOR_AGE_MIN,
    VALIDATOR_MAX,
    VALIDATOR_MIN,
    VALIDATOR_NUMERIC,
    VALIDATOR_REQUIRE,
    Validator,
    validate,
} from './validators';

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

export const VALIDATION_SCHEMAS = {
    user: {
        firstName: [VALIDATOR_REQUIRE()],
        lastName: [VALIDATOR_REQUIRE()],
        dateOfBirth: [VALIDATOR_REQUIRE(), VALIDATOR_AGE_MIN(16)],
    },
    address: {
        street: [VALIDATOR_REQUIRE()],
        city: [VALIDATOR_REQUIRE()],
        state: [VALIDATOR_REQUIRE()],
        zipCode: [VALIDATOR_REQUIRE(), VALIDATOR_NUMERIC()],
    },
    vehicle: {
        vin: [VALIDATOR_REQUIRE()],
        year: [VALIDATOR_NUMERIC(), VALIDATOR_MIN(1985), VALIDATOR_MAX(new Date().getFullYear())],
        make: [VALIDATOR_REQUIRE()],
        model: [VALIDATOR_REQUIRE()],
    },
};

interface Schema {
    [key: string]: Validator[];
}

export interface Errors {
    [field: string]: string;
}

export const validateForm = (
    data: { [key: string]: any },
    schemaName: keyof typeof VALIDATION_SCHEMAS
): { isValid: boolean; newErrors: Errors } => {
    const schema = VALIDATION_SCHEMAS[schemaName] as Schema;
    const newErrors: Errors = {};
    let isValid = true;

    Object.keys(schema).forEach((field) => {
        const validators = schema[field] as Validator[];
        const value = data[field];
        const error = validate(value, validators);
        if (error) {
            newErrors[field] = error;
            isValid = false; // If any validation fails, mark the whole form as invalid
        }
    });

    return { isValid, newErrors };
};