const { validationResult } = require('express-validator');
import { Request, Response, NextFunction } from 'express';

import db from '../db';
const HttpError = require('../models/http-error');
import { Vehicle, Member, Address } from '@prisma/client'; // Import types from Prisma client

async function updateApplicationData(
    appId: string,
    data: {
        member?: Member;
        address?: Address;
        vehicles?: Vehicle[];
        additionalMembers?: Member[];
    }
): Promise<any> {
    return await db.$transaction(async (transaction) => {
        const { member, address, vehicles, additionalMembers } = data;

        // Primary Member handling
        let updatedMemberId = null;
        if (member) {
            const upsertedMember = await transaction.member.upsert({
                where: { id: member.id || undefined },
                update: member,
                create: {
                    ...member,
                },
            });
            updatedMemberId = upsertedMember.id;
        }

        // Address handling
        if (address) {
            await transaction.address.upsert({
                where: { applicationId: appId },
                update: address,
                create: { ...address, applicationId: appId },
            });
        }

        // Vehicles handling: delete all existing and recreate from provided data
        await transaction.vehicle.deleteMany({ where: { applicationId: appId } });
        if (vehicles && vehicles.length > 0) {
            await transaction.vehicle.createMany({
                data: vehicles.map((vehicle) => ({
                    ...vehicle,
                    applicationId: appId,
                })),
            });
        }

        // Additional Members handling: delete all existing and recreate from provided data assuming they can't be on other applications
        await transaction.member.deleteMany({ where: { additionalApplicationId: appId } });
        if (additionalMembers && additionalMembers.length > 0) {
            await transaction.member.createMany({
                data: additionalMembers.map((member) => ({
                    ...member,
                    additionalApplicationId: appId,
                })),
            });
        }

        // Update the application itself
        const updatedApp = await transaction.application.update({
            where: { id: appId },
            data: {
                ...(updatedMemberId ? { memberId: updatedMemberId } : {}), // Only update memberId if a new/updated member is provided
            },
            include: { member: true, address: true, vehicles: true, additionalMembers: true },
        });

        return updatedApp;
    });
}

export async function createApplication(req: Request, res: Response, next: NextFunction) {
    const { member, address, vehicles } = req.body;

    try {
        const app = await db.application.create({
            data: {
                ...req.body,
                member: member ? { create: member } : undefined,
                address: address ? { create: address } : undefined,
                vehicles: vehicles && vehicles.length ? { create: vehicles } : undefined,
            },
            include: { member: true, address: true, vehicles: true, additionalMembers: true },
        });

        const resumeRoute = `https://localhost/5173/${app.id}`;

        res.json({
            message: `Start a new insurance application with id ${app.id}`,
            application: app,
            resumeRoute: resumeRoute, // Resume route for frontend
        });
    } catch (error) {
        next(new HttpError('Creating the application failed, please try again.', 500));
    }
}

export async function getApplication(req: Request, res: Response, next: NextFunction) {
    const id = req.params.id;

    try {
        const app = await db.application.findUnique({ where: { id } });
        if (!app) {
            return next(new HttpError('Could not find an application for the provided id.', 404));
        }
        res.json(app);
    } catch (error) {
        next(error);
    }
}

export async function updateApplication(req: Request, res: Response, next: NextFunction) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(new HttpError('Invalid inputs passed, please check your data.', 422));
    }

    try {
        const updatedApp = await updateApplicationData(req.params.id, req.body);
        res.json(updatedApp);
    } catch (error) {
        next(new HttpError('Updating application failed, please try again.', 500));
    }
}

export async function validateAndUpdateApplication(
    req: Request,
    res: Response,
    next: NextFunction
) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(new HttpError('Invalid inputs passed, please check your data.', 422));
    }

    const appId = req.params.id;
    const data = req.body;

    try {
        const existingApp = await db.application.findUnique({ where: { id: appId } });
        if (!existingApp) {
            return next(new HttpError('Application not found', 404));
        }

        const updatedApp = await db.application.update({ where: { id: appId }, data });

        // Generate a random number for quote
        const validationNumber = Math.random() * 1000;

        res.json({
            message: `Updated insurance application with id ${appId}`,
            application: updatedApp,
            validationNumber: validationNumber,
        });
    } catch (error) {
        next(error instanceof Error ? error : new Error('Unknown Error occurred'));
    }
}

export async function deleteApplication(req: Request, res: Response, next: NextFunction) {
    const appId = req.params.id;

    try {
        const existingApp = await db.application.findUnique({ where: { id: appId } });
        if (!existingApp) {
            return next(new HttpError('Application not found', 404));
        }
        await db.application.delete({ where: { id: appId } });

        res.json({ message: `Deleted application with id ${appId}` });
    } catch (error) {
        next(error instanceof Error ? error : new Error('Unknown Error occurred'));
    }
}
