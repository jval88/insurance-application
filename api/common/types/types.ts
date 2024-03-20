import { Vehicle, Member, Address } from '@prisma/client';

export type ApplicationData = {
    member?: Member;
    address?: Address;
    vehicles?: Vehicle[];
    additionalMembers?: Member[];
};
