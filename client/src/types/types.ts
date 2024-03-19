import { Errors } from '../common/util/formUtil';

export interface IUserFormData {
    firstName: string;
    lastName: string;
    dateOfBirth: string;
}

export interface IAddressFormData {
    street: string;
    city: string;
    state: string;
    zipCode: string;
}

export interface IVehicle {
    vin: string;
    year: number | null;
    make: string;
    model: string;
}

export interface IUserFormProps {
    userData: IUserFormData;
    onChange: (userData: IUserFormData) => void;
    errors: Errors;
}

export interface IAddressFormProps {
    addressData: IAddressFormData;
    onChange: (addressData: IAddressFormData) => void;
    errors: Errors;
}

export interface IVehiclesFormProps {
    vehicle: IVehicle;
    onChange: (index: number, updatedVehicle: IVehicle) => void;
    index: number;
    errors: Errors;
    removeVehicle: (index: number) => void;
}

export interface IConfirmationViewProps {
    userData: IUserFormData;
    addressData: IAddressFormData;
    vehiclesData: IVehicle[];
    onEdit: () => void;
}
