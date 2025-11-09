import React from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from '../components/common/Logo';
import Card from '../components/common/Card';
import { CheckCircleIcon } from '../components/icons/Icons';

const ConfirmEmailPage: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen flex items-center justify-center bg-primary p-4">
            <div className="w-full max-w-md text-center">
                <div className="mb-8">
                    <Logo className="text-5xl" />
                </div>
                <Card>
                    <CheckCircleIcon className="w-16 h-16 text-accent mx-auto mb-4" />
                    <h1 className="text-2xl font-bold text-white mb-2">Registration Successful!</h1>
                    <p className="text-gray-300 mb-6">We've sent a confirmation link to your email address. Please check your inbox to activate your account.</p>
                    <button 
                        onClick={() => navigate('/login')} 
                        className="w-full bg-accent text-primary font-bold py-2 px-4 rounded hover:opacity-90"
                    >
                        Go to Login
                    </button>
                </Card>
            </div>
        </div>
    );
};

export default ConfirmEmailPage;