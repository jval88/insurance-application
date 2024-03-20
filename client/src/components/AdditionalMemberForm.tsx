import React from 'react';

import { AdditionalMemberFormProps } from '../types/types';

const AdditionalMemberForm: React.FC<AdditionalMemberFormProps> = ({
    member,
    onChange,
    removeMember,
    index,
    errors,
}) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        onChange(index, { ...member, [name]: value });
    };

    const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const { name, value } = e.target;
        onChange(index, { ...member, [name]: value });
    };

    return (
        <div>
            <form>
                <div>
                    <label htmlFor={`firstName-${index}`}>First Name:</label>
                    <input
                        type="text"
                        id={`firstName-${index}`}
                        name="firstName"
                        value={member.firstName || ''}
                        onChange={handleChange}
                    />
                    {errors.firstName && <p className="error">{errors.firstName}</p>}
                </div>
                <div>
                    <label htmlFor={`lastName-${index}`}>Last Name:</label>
                    <input
                        type="text"
                        id={`lastName-${index}`}
                        name="lastName"
                        value={member.lastName || ''}
                        onChange={handleChange}
                    />
                    {errors.lastName && <p className="error">{errors.lastName}</p>}
                </div>
                <div>
                    <label htmlFor={`dateOfBirth-${index}`}>Date of Birth:</label>
                    <input
                        type="date"
                        id={`dateOfBirth-${index}`}
                        name="dateOfBirth"
                        value={member.dateOfBirth || ''}
                        onChange={handleChange}
                    />
                    {errors.dateOfBirth && <p className="error">{errors.dateOfBirth}</p>}
                </div>
                <div>
                    <label htmlFor={`relationship-${index}`}>Relationship:</label>
                    <select
                        id={`relationship-${index}`}
                        name="relationship"
                        value={member.relationship || ''}
                        onChange={handleSelectChange}
                    >
                        <option value="">Select relationship:</option>
                        <option value="Spouse">Spouse</option>
                        <option value="Sibling">Sibling</option>
                        <option value="Parent">Parent</option>
                        <option value="Friend">Friend</option>
                        <option value="Other">Other</option>
                    </select>
                    {errors.relationship && <p className="error">{errors.relationship}</p>}
                </div>
            </form>
            <button type="button" onClick={() => removeMember(index)}>
                Remove Member
            </button>
        </div>
    );
};

export default AdditionalMemberForm;
