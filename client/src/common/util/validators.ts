type ValidatorType = 'REQUIRE' | 'MINLENGTH' | 'MAXLENGTH' | 'MIN' | 'MAX' | 'NUMERIC' | 'MIN_AGE';

export type Validator = {
    type: ValidatorType;
    val?: number;
};

export const VALIDATOR_TYPE_REQUIRE: ValidatorType = 'REQUIRE';
export const VALIDATOR_TYPE_MINLENGTH: ValidatorType = 'MINLENGTH';
export const VALIDATOR_TYPE_MAXLENGTH: ValidatorType = 'MAXLENGTH';
export const VALIDATOR_TYPE_MIN: ValidatorType = 'MIN';
export const VALIDATOR_TYPE_MAX: ValidatorType = 'MAX';
export const VALIDATOR_TYPE_NUMERIC: ValidatorType = 'NUMERIC';
export const VALIDATOR_TYPE_AGE_MIN: ValidatorType = 'MIN_AGE';

function calculateAge(birthdate: string): number {
    const birthDate = new Date(birthdate);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--; // Not yet had birthday this year
    }
    return age;
}

export const VALIDATOR_REQUIRE = (): Validator => ({ type: VALIDATOR_TYPE_REQUIRE });
export const VALIDATOR_MINLENGTH = (val: number): Validator => ({
    type: VALIDATOR_TYPE_MINLENGTH,
    val: val,
});
export const VALIDATOR_MAXLENGTH = (val: number): Validator => ({
    type: VALIDATOR_TYPE_MAXLENGTH,
    val: val,
});
export const VALIDATOR_MIN = (val: number): Validator => ({ type: VALIDATOR_TYPE_MIN, val: val });
export const VALIDATOR_MAX = (val: number): Validator => ({ type: VALIDATOR_TYPE_MAX, val: val });
export const VALIDATOR_NUMERIC = (): Validator => ({ type: VALIDATOR_TYPE_NUMERIC });
export const VALIDATOR_AGE_MIN = (val: number) => {
    return { type: VALIDATOR_TYPE_AGE_MIN, val: val };
};

export const validate = (value: string | number, validators: Validator[]): string | null => {
    for (const validator of validators) {
        if (
            validator.type === VALIDATOR_TYPE_REQUIRE &&
            (value === null || value.toString().trim().length === 0)
        ) {
            return 'Field is required';
        }
        if (
            validator.type === VALIDATOR_TYPE_MINLENGTH &&
            value.toString().trim().length < validator.val!
        ) {
            return `Minimum length is ${validator.val}`;
        }
        if (
            validator.type === VALIDATOR_TYPE_MAXLENGTH &&
            value.toString().trim().length > validator.val!
        ) {
            return `Maximum length is ${validator.val}`;
        }
        if (validator.type === VALIDATOR_TYPE_MIN && +value < validator.val!) {
            return `Minimum value is ${validator.val}`;
        }
        if (validator.type === VALIDATOR_TYPE_MAX && +value > validator.val!) {
            return `Maximum value is ${validator.val}`;
        }
        if (validator.type === VALIDATOR_TYPE_NUMERIC && isNaN(Number(value))) {
            return 'Must be a number';
        }
        if (validator.type === VALIDATOR_TYPE_AGE_MIN && typeof value === 'string') {
            const age = calculateAge(value); // Ensure this function returns a number
            if (age < validator.val!) {
                return `Age must be at least ${validator.val} years.`;
            }
        }
    }
    return null; // If none of the validators failed, return null (no error)
};
