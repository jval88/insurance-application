import { IUserFormProps } from '../types/types';

const UserForm = ({ userData, onChange, errors }: IUserFormProps) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        onChange({ ...userData, [name]: value });
    };

    return (
        <form>
            <div>
                <label htmlFor="firstName">First Name:</label>
                <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={userData.firstName}
                    onChange={handleChange}
                />
                {errors.firstName && <p className="error">{errors.firstName}</p>}
            </div>
            <div>
                <label htmlFor="lastName">Last Name:</label>
                <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={userData.lastName}
                    onChange={handleChange}
                />
                {errors.lastName && <p className="error">{errors.lastName}</p>}
            </div>
            <div>
                <label htmlFor="dateOfBirth">Date of Birth:</label>
                <input
                    type="date"
                    id="dateOfBirth"
                    name="dateOfBirth"
                    value={userData.dateOfBirth}
                    onChange={handleChange}
                />
                {errors.dateOfBirth && <p className="error">{errors.dateOfBirth}</p>}
            </div>
        </form>
    );
};

export default UserForm;
