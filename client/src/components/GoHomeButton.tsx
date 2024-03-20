import React from 'react';
import { useNavigate } from 'react-router-dom';

const GoHomeButton: React.FC = () => {
    const navigate = useNavigate();

    const goHome = () => {
        navigate('/');
    };
    return <button onClick={goHome}>Go Home</button>;
};

export default GoHomeButton;
