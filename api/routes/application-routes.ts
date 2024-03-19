import { Router } from 'express';
const { check } = require('express-validator');

import * as Controllers from '../controllers/application';

const routes = Router();

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

routes.post('/', Controllers.createApplication);

routes.get('/:id', Controllers.getApplication);

routes.put(
    '/:id',
    [
        check('member.firstName')
            .optional()
            .notEmpty()
            .withMessage('First name of the primary member cannot be empty'),
        check('member.lastName')
            .optional()
            .notEmpty()
            .withMessage('Last name of the primary member cannot be empty'),
        check('member.dateOfBirth')
            .optional()
            .custom((value: string) => {
                if (!value) return true;
                const age = calculateAge(value);
                if (age < 16) {
                    throw new Error('Primary member must be at least 16 years old');
                }
                return true;
            }),
        check('address.street').optional().notEmpty().withMessage('Street cannot be empty'),
        check('address.city').optional().notEmpty().withMessage('City cannot be empty'),
        check('address.state').optional().notEmpty().withMessage('State cannot be empty'),
        check('address.zipCode').optional().isNumeric().withMessage('Zip code must be numeric'),
        check('vehicles').optional().isArray().withMessage('Vehicles must be an array'),
        check('vehicles.*.vin').optional().notEmpty().withMessage('Each vehicle must have a VIN'),
        check('vehicles.*.year')
            .optional()
            .isNumeric()
            .withMessage('Vehicle year must be numeric')
            .isInt({ min: 1985, max: new Date().getFullYear() + 1 })
            .withMessage(`Vehicle year must be between 1985 and ${new Date().getFullYear() + 1}`),
        check('vehicles.*.make').optional().notEmpty().withMessage('Each vehicle must have a make'),
        check('vehicles.*.model')
            .optional()
            .notEmpty()
            .withMessage('Each vehicle must have a model'),
        check('additionalMembers.*.firstName')
            .optional()
            .notEmpty()
            .withMessage('Each additional member’s first name cannot be empty'),
        check('additionalMembers.*.lastName')
            .optional()
            .notEmpty()
            .withMessage('Each additional member’s last name cannot be empty'),
        check('additionalMembers.*.dateOfBirth')
            .optional()
            .custom((value: string) => {
                if (!value) return true;
                const age = calculateAge(value);
                if (age < 16) {
                    throw new Error('Each additional member must be at least 16 years old');
                }
                return true;
            }),
        check('additionalMembers.*.relationship')
            .optional()
            .notEmpty()
            .withMessage('Each additional member’s relationship cannot be empty'),
    ],
    Controllers.updateApplication
);

routes.post(
    '/:id/submit',
    [
        check('member.firstName')
            .notEmpty()
            .withMessage('First name of the primary member is required'),
        check('member.lastName')
            .notEmpty()
            .withMessage('Last name of the primary member is required'),
        check('member.dateOfBirth')
            .notEmpty()
            .withMessage('Date of birth of the primary member is required')
            .custom((value: string) => {
                const age = calculateAge(value);
                if (age < 16) {
                    throw new Error('Primary member must be at least 16 years old');
                }
                return true;
            }),
        check('address.street').notEmpty().withMessage('Street is required'),
        check('address.city').notEmpty().withMessage('City is required'),
        check('address.state').notEmpty().withMessage('State is required'),
        check('address.zipCode')
            .notEmpty()
            .withMessage('Zip code is required')
            .isNumeric()
            .withMessage('Zip code must be numeric'),
        check('vehicles')
            .isArray({ min: 1, max: 3 })
            .withMessage('Must have 1 to 3 vehicles')
            .notEmpty()
            .withMessage('Vehicle information is required'),
        check('vehicles.*.vin').notEmpty().withMessage('Each vehicle must have a VIN'),
        check('vehicles.*.year')
            .notEmpty()
            .withMessage('Each vehicle must have a year')
            .isNumeric()
            .withMessage('Vehicle year must be numeric')
            .isInt({ min: 1985, max: new Date().getFullYear() + 1 })
            .withMessage(`Vehicle year must be between 1985 and ${new Date().getFullYear() + 1}`),
        check('vehicles.*.make').notEmpty().withMessage('Each vehicle must have a make'),
        check('vehicles.*.model').notEmpty().withMessage('Each vehicle must have a model'),
        check('additionalMembers.*.firstName')
            .notEmpty()
            .withMessage('Each additional member must have a first name'),
        check('additionalMembers.*.lastName')
            .notEmpty()
            .withMessage('Each additional member must have a last name'),
        check('additionalMembers.*.dateOfBirth')
            .notEmpty()
            .withMessage('Each additional member must have a date of birth')
            .custom((value: string) => {
                const age = calculateAge(value);
                if (age < 16) {
                    throw new Error('Each additional member must be at least 16 years old');
                }
                return true;
            }),
        check('additionalMembers.*.relationship')
            .notEmpty()
            .withMessage('Each additional member must have a relationship specified'),
    ],
    Controllers.validateAndUpdateApplication
);

export default routes;
