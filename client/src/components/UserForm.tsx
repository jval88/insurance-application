import { IUserFormProps } from '../types/types';
import { handleGenericInputChange } from './formUtil';

export default function UserForm({ userData, onChange }: IUserFormProps) {
    return (
        <form>
            <div>
                <label htmlFor="firstName">First Name:</label>
                <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={userData.firstName}
                    onChange={(e) => handleGenericInputChange(e, userData, onChange)}
                />
            </div>
            <div>
                <label htmlFor="lastName">Last Name:</label>
                <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={userData.lastName}
                    onChange={(e) => handleGenericInputChange(e, userData, onChange)}
                />
            </div>
            <div>
                <label htmlFor="dateOfBirth">Date of Birth:</label>
                <input
                    type="date"
                    id="dateOfBirth"
                    name="dateOfBirth"
                    value={userData.dateOfBirth}
                    onChange={(e) => handleGenericInputChange(e, userData, onChange)}
                />
            </div>
        </form>
    );
}
