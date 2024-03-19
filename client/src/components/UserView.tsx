import React from 'react';
import { IUserFormData } from '../types/types';

const UserView: React.FC<{ userData: IUserFormData }> = ({ userData }) => {
    return (
        <div>
            <div>
                <strong>First Name: </strong> {userData.firstName}
            </div>
            <div>
                <strong>Last Name: </strong> {userData.lastName}
            </div>
            <div>
                <strong>Date of Birth: </strong> {userData.dateOfBirth}
            </div>
        </div>
    );
};

export default UserView;
