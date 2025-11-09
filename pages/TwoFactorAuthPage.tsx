import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Logo from '../components/common/Logo';
import Spinner from '../components/common/Spinner';

const TwoFactorAuthPage: React.FC = () => {
    const [code, setCode] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const location = useLocation();
    const destination = location.state?.destination || '/';

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        // Mock verification
        setTimeout(() => {
            if (code === '123456') {
                navigate(destination, { replace: true });
            } else {
                setError('Invalid code. Hint: 123456');
                setIsLoading(false);
            }
        }, 1000);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-primary p-4">
            <div className="w-full max-w-sm">
                <div className="text-center mb-8">
                    <Logo className="text-5xl" />
                </div>
                <div className="bg-primary-light border border-primary rounded-lg shadow-xl p-8">
                    <h2 className="text-2xl font-bold text-center text-white mb-2">Two-Factor Authentication</h2>
                    <p className="text-center text-gray-300 mb-6">Enter the 6-digit code from your authenticator app.</p>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="code" className="sr-only">Verification Code</label>
                            <input
                                id="code"
                                type="text"
                                value={code}
                                onChange={(e) => setCode(e.target.value)}
                                required
                                maxLength={6}
                                className="mt-1 block w-full bg-primary border border-primary-light rounded-md shadow-sm py-3 px-4 text-white text-center text-2xl tracking-[0.5rem] focus:outline-none focus:ring-accent focus:border-accent"
                                placeholder="------"
                            />
                        </div>
                        {error && <p className="text-yellow-400 text-sm text-center">{error}</p>}
                        <div>
                            <button
                                type="submit"
                                disabled={isLoading || code.length < 6}
                                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-bold text-primary bg-accent hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent focus:ring-offset-primary-light disabled:bg-gray-700 disabled:cursor-not-allowed transition-colors"
                            >
                                {isLoading ? <Spinner className="w-5 h-5 text-primary" /> : 'Verify'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default TwoFactorAuthPage;