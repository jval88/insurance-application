const { validationResult, ValidationError } = require('express-validator');
import { Request, Response, NextFunction } from 'express';

import db from '../db';
const HttpError = require('../models/http-error');
import { ApplicationData } from '../common/types/types';

async function updateApplicationData(appId: string, data: ApplicationData): Promise<any> {
    return await db.$transaction(async (transaction) => {
        let updatedMemberId = null;
        const { member, address, vehicles, additionalMembers } = data;

        // Process the primary member's dateOfBirth if present
        if (member) {
            if (member.dateOfBirth) {
                // Convert to Date object to check validity
                const dateOfBirth = new Date(member.dateOfBirth);
                member.dateOfBirth = isNaN(dateOfBirth.getTime()) ? null : dateOfBirth;
            } else {
                // Explicitly handle null or undefined
                member.dateOfBirth = null;
            }

            // Retrieve the existing application to check if there's an existing linked member
            const existingApplication = await transaction.application.findUnique({
                where: { id: appId },
                include: { member: true },
            });

            if (existingApplication && existingApplication.member) {
                // Update existing member
                const updatedMember = await transaction.member.update({
                    where: { id: existingApplication.memberId || undefined },
                    data: member,
                });
                updatedMemberId = updatedMember.id;
            } else {
                // Create new member and link to the application
                const newMember = await transaction.member.create({
                    data: member,
                });
                updatedMemberId = newMember.id;
                await transaction.application.update({
                    where: { id: appId },
                    data: { memberId: updatedMemberId },
                });
            }
        }

        // Address handling
        if (address) {
            if (address.zipCode && !isNaN(Number(address.zipCode))) {
                address.zipCode = Number(address.zipCode);
            } else {
                address.zipCode = null; // Set to null if invalid
            }

            await transaction.address.upsert({
                where: { applicationId: appId },
                update: address,
                create: { ...address, applicationId: appId },
            });
        }

        // Vehicles handling, delete all first to handle case where some were removed
        await transaction.vehicle.deleteMany({ where: { applicationId: appId } });
        if (vehicles && vehicles.length > 0) {
            await transaction.vehicle.createMany({
                data: vehicles.map((vehicle) => {
                    // Convert year from string to number
                    if (vehicle.year && !isNaN(Number(vehicle.year))) {
                        vehicle.year = Number(vehicle.year);
                    } else {
                        vehicle.year = null; // Set to null if invalid
                    }

                    return { ...vehicle, applicationId: appId };
                }),
            });
        }

        // Additional Members handling, delete all first to handle case where some were removed
        await transaction.member.deleteMany({ where: { additionalApplicationId: appId } });
        if (additionalMembers && additionalMembers.length > 0) {
            await transaction.member.createMany({
                data:
                    additionalMembers?.map((member) => ({
                        ...member,
                        additionalApplicationId: appId,
                        dateOfBirth: member.dateOfBirth ? new Date(member.dateOfBirth) : null,
                        relationship: member.relationship ? member.relationship : null,
                    })) || [],
            });
        }

        // Return the updated application with its related data
        const updatedApp = await transaction.application.findUnique({
            where: { id: appId },
            include: { member: true, address: true, vehicles: true, additionalMembers: true },
        });

        return updatedApp;
    });
}

export async function createApplication(req: Request, res: Response, next: NextFunction) {
    const { member, address, vehicles, additionalMembers } = req.body;

    try {
        const app = await db.application.create({
            data: {
                ...req.body,
                member: member ? { create: member } : undefined,
                address: address ? { create: address } : undefined,
                vehicles: vehicles && vehicles.length ? { create: vehicles } : undefined,
                additionalMembers:
                    additionalMembers && additionalMembers.length
                        ? { create: additionalMembers }
                        : {},
            },
            include: { member: true, address: true, vehicles: true, additionalMembers: true },
        });

        const resumeRoute = `${process.env.RESUME_ROUTE}${app.id}`;

        // res.redirect(resumeRoute);
        res.status(201).json({
            message: `Start a new insurance application with id ${app.id}`,
            application: app,
            resumeRoute: resumeRoute, // Resume route for frontend
        });
    } catch (error) {
        console.error(error); // Log the full error
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        next(new HttpError(`Creating the application failed: ${errorMessage}`, 500));
    }
}

export async function getApplication(req: Request, res: Response, next: NextFunction) {
    const id = req.params.id;

    try {
        const app = await db.application.findUnique({
            where: { id },
            include: {
                member: true,
                address: true,
                vehicles: true,
                additionalMembers: true,
            },
        });
        if (!app) {
            return next(new HttpError('Could not find an application for the provided id.', 404));
        }
        res.status(200).json(app);
    } catch (error) {
        next(error);
    }
}

export async function updateApplication(req: Request, res: Response, next: NextFunction) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        // Convert the array of error objects into a more readable format
        const errorMessages = errors.array().map((error: typeof ValidationError) => ({
            field: error.param,
            message: error.msg,
        }));

        // Send the detailed error response
        return next(
            res.status(422).json({
                message: 'Invalid inputs passed, please check your data.',
                errors: errorMessages, // Include the detailed errors
            })
        );
    }

    const data = {
        member: req.body.userData,
        address: req.body.addressData,
        vehicles: req.body.vehiclesData,
        additionalMembers: req.body.additionalMembersData,
    };

    try {
        const updatedApp = await updateApplicationData(req.params.id, data);
        res.status(200).json(updatedApp);
    } catch (error) {
        console.error('Error in updateApplication:', error);

        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        next(new HttpError(`Updating the application failed: ${errorMessage}`, 500));
    }
}

export async function validateAndUpdateApplication(
    req: Request,
    res: Response,
    next: NextFunction
) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        // Convert the array of error objects into a more readable format
        const errorMessages = errors.array().map((error: typeof ValidationError) => ({
            field: error.param,
            message: error.msg,
        }));

        // Send the detailed error response
        return next(
            res.status(422).json({
                message: 'Invalid inputs passed, please check your data.',
                errors: errorMessages, // Include the detailed errors
            })
        );
    }

    const appId = req.params.id;
    const data = {
        member: req.body.userData,
        address: req.body.addressData,
        vehicles: req.body.vehiclesData,
        additionalMembers: req.body.additionalMembersData,
    };

    try {
        const updatedApp = await updateApplicationData(req.params.id, data);

        const validationNumber = Math.random() * 1000;

        res.status(200).json({
            message: `Updated insurance application with id ${appId}`,
            application: updatedApp,
            validationNumber: validationNumber,
        });
    } catch (error) {
        console.error('Error in validateAndUpdateApplication:', error);

        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        next(new HttpError(`Updating the application failed: ${errorMessage}`, 500));
    }
}
