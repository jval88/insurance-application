import { AdditionalMember, AddressFormData, UserFormData, Vehicle } from '../../types/types';
import { Errors } from '../util/formUtil';

export const defaultUserFormData: UserFormData = {
    firstName: '',
    lastName: '',
    dateOfBirth: '',
};

export const defaultAdditionalMemberFormData: AdditionalMember = {
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    relationship: '',
};

export const defaultAddressFormData: AddressFormData = {
    street: '',
    city: '',
    state: '',
    zipCode: null,
};

export const defaultVehicleData: Vehicle = {
    vin: '',
    year: null,
    make: '',
    model: '',
};

export const initialErrorsState: {
    user: Errors;
    additionalMember: Errors[];
    address: Errors;
    vehicle: Errors[];
} = {
    user: {} as Errors,
    additionalMember: [],
    address: {} as Errors,
    vehicle: [],
};
