
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from '../components/common/Logo';

const LandingPage: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="bg-primary text-white min-h-screen flex flex-col">
            {/* Header */}
            <header className="py-4 px-8">
                <div className="container mx-auto flex justify-between items-center">
                    <Logo className="text-3xl" />
                    <nav className="hidden md:flex items-center space-x-6">
                        <a href="#" className="hover:text-accent transition-colors">Product</a>
                        <a href="#" className="hover:text-accent transition-colors">API</a>
                        <a href="#" className="hover:text-accent transition-colors">Contact</a>
                    </nav>
                    <div className="space-x-4">
                        <button onClick={() => navigate('/login')} className="text-white font-medium hover:text-accent transition-colors">Log In</button>
                        <button onClick={() => navigate('/onboarding')} className="bg-accent text-primary font-bold py-2 px-4 rounded-md hover:bg-yellow-400 transition-colors">
                            Sign Up
                        </button>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-grow flex items-center">
                <div className="container mx-auto text-center px-4">
                    <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-4">
                        Cross-Border Payments, <br />
                        <span className="text-accent">Simplified and Secured.</span>
                    </h1>
                    <p className="text-lg md:text-xl text-gray-light max-w-3xl mx-auto mb-8">
                        Xeloo is your all-in-one platform for sending, receiving, and automating global payments in local currencies. Powered by AI and blockchain for seamless, secure transactions.
                    </p>
                    <button 
                        onClick={() => navigate('/onboarding')} 
                        className="bg-accent text-primary font-bold py-3 px-8 rounded-lg text-lg hover:bg-yellow-400 transition-transform transform hover:scale-105"
                    >
                        Get Started Free
                    </button>
                </div>
            </main>

            {/* Footer */}
            <footer className="py-6 px-8 mt-16">
                <div className="container mx-auto text-center text-gray-light text-sm">
                    <p>&copy; {new Date().getFullYear()} Xeloo. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;