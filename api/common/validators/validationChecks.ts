const { check } = require('express-validator');

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

export const putChecks = [
    check('userData.firstName')
        .optional({ checkFalsy: true })
        .notEmpty()
        .withMessage('First name of the primary member cannot be empty'),
    check('userData.lastName')
        .optional({ checkFalsy: true })
        .notEmpty()
        .withMessage('Last name of the primary member cannot be empty'),
    check('userData.dateOfBirth')
        .optional({ checkFalsy: true })
        .custom((value: string) => {
            if (!value) return true;
            const age = calculateAge(value);
            if (age < 16) {
                throw new Error('Primary member must be at least 16 years old');
            }
            return true;
        }),
    check('addressData.street')
        .optional({ checkFalsy: true })
        .notEmpty()
        .withMessage('Street cannot be empty'),
    check('addressData.city')
        .optional({ checkFalsy: true })
        .notEmpty()
        .withMessage('City cannot be empty'),
    check('addressData.state')
        .optional({ checkFalsy: true })
        .notEmpty()
        .withMessage('State cannot be empty'),
    check('addressData.zipCode')
        .optional({ checkFalsy: true })
        .isNumeric()
        .withMessage('Zip code must be numeric'),
    check('vehiclesData')
        .optional({ checkFalsy: true })
        .isArray()
        .withMessage('Vehicles must be an array'),
    check('vehiclesData.*.vin')
        .optional({ checkFalsy: true })
        .notEmpty()
        .withMessage('Each vehicle must have a VIN'),
    check('vehiclesData.*.year')
        .optional({ checkFalsy: true })
        .isNumeric()
        .withMessage('Vehicle year must be numeric')
        .isInt({ min: 1985, max: new Date().getFullYear() + 1 })
        .withMessage(`Vehicle year must be between 1985 and ${new Date().getFullYear() + 1}`),
    check('vehiclesData.*.make')
        .optional({ checkFalsy: true })
        .notEmpty()
        .withMessage('Each vehicle must have a make'),
    check('vehiclesData.*.model')
        .optional({ checkFalsy: true })
        .notEmpty()
        .withMessage('Each vehicle must have a model'),
    check('additionalMembersData.*.firstName')
        .optional({ checkFalsy: true })
        .notEmpty()
        .withMessage('Each additional member’s first name cannot be empty'),
    check('additionalMembersData.*.lastName')
        .optional({ checkFalsy: true })
        .notEmpty()
        .withMessage('Each additional member’s last name cannot be empty'),
    check('additionalMembersData.*.dateOfBirth')
        .optional({ checkFalsy: true })
        .custom((value: string) => {
            if (!value) return true;
            const age = calculateAge(value);
            if (age < 16) {
                throw new Error('Each additional member must be at least 16 years old');
            }
            return true;
        }),
    check('additionalMembersData.*.relationship')
        .optional({ checkFalsy: true })
        .notEmpty()
        .withMessage('Each additional member’s relationship cannot be empty'),
];

export const submitChecks = [
    // Check primary member details
    check('userData.firstName')
        .notEmpty()
        .withMessage('First name of the primary member is required'),
    check('userData.lastName')
        .notEmpty()
        .withMessage('Last name of the primary member is required'),
    check('userData.dateOfBirth')
        .notEmpty()
        .withMessage('Date of birth of the primary member is required')
        .custom((value: string) => {
            const age = calculateAge(value);
            if (age < 16) {
                throw new Error('Primary member must be at least 16 years old');
            }
            return true;
        }),

    // Check address details
    check('addressData.street').notEmpty().withMessage('Street is required'),
    check('addressData.city').notEmpty().withMessage('City is required'),
    check('addressData.state').notEmpty().withMessage('State is required'),
    check('addressData.zipCode')
        .notEmpty()
        .withMessage('Zip code is required')
        .isInt()
        .withMessage('Zip code must be numeric'),

    // Check vehicle details
    check('vehiclesData').isArray({ min: 1, max: 3 }).withMessage('Must have 1 to 3 vehicles'),
    check('vehiclesData.*.vin').notEmpty().withMessage('Each vehicle must have a VIN'),
    check('vehiclesData.*.year')
        .notEmpty()
        .withMessage('Each vehicle must have a year')
        .isInt({ min: 1985, max: new Date().getFullYear() + 1 })
        .withMessage(`Vehicle year must be between 1985 and ${new Date().getFullYear() + 1}`),
    check('vehiclesData.*.make').notEmpty().withMessage('Each vehicle must have a make'),
    check('vehiclesData.*.model').notEmpty().withMessage('Each vehicle must have a model'),

    // Check additional members' details
    check('additionalMembersData.*.firstName')
        .notEmpty()
        .withMessage('Each additional member must have a first name'),
    check('additionalMembersData.*.lastName')
        .notEmpty()
        .withMessage('Each additional member must have a last name'),
    check('additionalMembersData.*.dateOfBirth')
        .notEmpty()
        .withMessage('Each additional member must have a date of birth')
        .custom((value: string) => {
            const age = calculateAge(value);
            if (age < 16) {
                throw new Error('Each additional member must be at least 16 years old');
            }
            return true;
        }),
    check('additionalMembersData.*.relationship')
        .notEmpty()
        .withMessage('Each additional member must have a relationship specified'),
];
