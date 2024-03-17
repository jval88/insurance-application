export interface IUserFormData {
    firstName: string;
    lastName: string;
    dateOfBirth: string;
}

export interface IAddressFormData {
    street1: string;
    street2: string;
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
}

export interface IAddressFormProps {
    addressData: IAddressFormData;
    onChange: (addressData: IAddressFormData) => void;
}

export interface IVehiclesFormProps {
    vehicle: IVehicle;
    onChange: (index: number, updatedVehicle: IVehicle) => void;
    index: number;
    removeVehicle: (index: number) => void;
}

export interface IConfirmationViewProps {
    userData: IUserFormData;
    addressData: IAddressFormData;
    vehiclesData: IVehicle[];
    onEdit: () => void;
}
