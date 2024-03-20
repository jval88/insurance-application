import React from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { clearLocalStorage } from '../common/util/formUtil';

const StartApplicationButton: React.FC = () => {
    const navigate = useNavigate();

    const startNewApplication = async () => {
        try {
            const response = await axios.post('http://localhost:5000/applications', {
                member: {},
                address: {},
                vehicles: [],
                additionalMembers: [],
            });
            const url = new URL(response.data.resumeRoute);
            const path = url.pathname; // This should give you "/applications/28e2668a-2019-4aaa-8d70-c53d9f4a3365"
            clearLocalStorage();
            navigate(path); // Now using just the path for navigation
        } catch (error) {
            if (axios.isAxiosError(error)) {
                console.error(
                    'Error starting new application:',
                    error.response?.data || error.message
                );
            } else if (error instanceof Error) {
                console.error('Error starting new application:', error.message);
            } else {
                console.error('An unknown error occurred');
            }
        }
    };

    return <button onClick={startNewApplication}>Start New Application</button>;
};

export default StartApplicationButton;
