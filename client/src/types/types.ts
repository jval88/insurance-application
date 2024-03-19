import { Errors } from '../common/util/formUtil';

export type UserFormData = {
    firstName: string;
    lastName: string;
    dateOfBirth: string;
};

export type AddressFormData = {
    street: string;
    city: string;
    state: string;
    zipCode: string;
};

export type Vehicle = {
    vin: string;
    year: number | null;
    make: string;
    model: string;
};

export type UserFormProps = {
    userData: UserFormData;
    onChange: (userData: UserFormData) => void;
    errors: Errors;
};

export type AddressFormProps = {
    addressData: AddressFormData;
    onChange: (addressData: AddressFormData) => void;
    errors: Errors;
};

export type VehiclesFormProps = {
    vehicle: Vehicle;
    onChange: (index: number, updatedVehicle: Vehicle) => void;
    index: number;
    errors: Errors;
    removeVehicle: (index: number) => void;
};

export type ConfirmationViewProps = {
    userData: UserFormData;
    addressData: AddressFormData;
    vehiclesData: Vehicle[];
    onEdit: () => void;
};
