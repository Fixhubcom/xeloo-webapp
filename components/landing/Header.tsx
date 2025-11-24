
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from '../common/Logo';

const Header: React.FC = () => {
    const navigate = useNavigate();
    return (
        <header className="absolute top-0 left-0 right-0 z-20 py-4 px-8">
            <div className="container mx-auto flex justify-between items-center">
                <Logo className="text-3xl" />
                <nav className="hidden md:flex items-center space-x-8 text-white">
                    <button onClick={() => navigate('/business')} className="hover:text-accent transition-colors">Business</button>
                    <button onClick={() => navigate('/product')} className="hover:text-accent transition-colors">Product</button>
                    <button onClick={() => navigate('/api')} className="hover:text-accent transition-colors">API</button>
                </nav>
                <div className="space-x-2">
                    <button onClick={() => navigate('/login')} className="text-white font-medium py-2 px-4 rounded-md hover:text-accent transition-colors">Log In</button>
                    <button onClick={() => navigate('/onboarding')} className="bg-accent text-primary font-bold py-2 px-4 rounded-md hover:opacity-90 transition-colors">
                        Sign Up
                    </button>
                </div>
            </div>
        </header>
    );
};

export default Header;
