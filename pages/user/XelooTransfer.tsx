import React, { useState, useEffect, useCallback, useRef } from 'react';
import Card from '../../components/common/Card';
import Spinner from '../../components/common/Spinner';
import { useAuth } from '../../hooks/useAuth';
import { CheckCircleIcon, SearchIcon, UsersIcon } from '../../components/icons/Icons';

// Mock user data for search simulation
const mockXelooUsers: { [key: string]: { name: string, company: string } } = {
    'janedoe': { name: 'Jane Doe', company: 'Creative Solutions' },
    'acmeinc': { name: 'Acme Inc.', company: 'Acme Incorporated' },
    'lagosventures': { name: 'Lagos Ventures', company: 'LV Capital' },
};

interface XelooTransferProps {
    initialUsername?: string;
}

const XelooTransfer: React.FC<XelooTransferProps> = ({ initialUsername }) => {
    const { user } = useAuth();
    const [step, setStep] = useState<'form' | 'confirm' | 'success'>('form');
    
    // Form state
    const [username, setUsername] = useState(initialUsername || '');
    const [amount, setAmount] = useState('');
    const [foundUser, setFoundUser] = useState<{ name: string, company: string } | null>(null);
    const [isSearching, setIsSearching] = useState(false);
    const [searchError, setSearchError] = useState('');
    const searchTimeout = useRef<number | null>(null);

    // Flow state
    const [isProcessing, setIsProcessing] = useState(false);
    const [paymentError, setPaymentError] = useState('');
    
    const fromCurrency = user?.preferredCurrency || 'USD';
    
    const searchUser = useCallback((searchUsername: string) => {
        setIsSearching(true);
        setFoundUser(null);
        setSearchError('');
        // Simulate API call
        setTimeout(() => {
            const userFound = mockXelooUsers[searchUsername.toLowerCase()];
            if (userFound) {
                setFoundUser(userFound);
            } else {
                setSearchError('User not found.');
            }
            setIsSearching(false);
        }, 500);
    }, []);

    useEffect(() => {
        if (initialUsername) {
            setUsername(initialUsername);
        }
    }, [initialUsername]);

    useEffect(() => {
        if (searchTimeout.current) {
            clearTimeout(searchTimeout.current);
        }
        if (username) {
            searchTimeout.current = window.setTimeout(() => {
                searchUser(username);
            }, 300); // Debounce
        } else {
            setFoundUser(null);
            setSearchError('');
        }
    }, [username, searchUser]);

    const handleInitiate = (e: React.FormEvent) => {
        e.preventDefault();
        if (foundUser && parseFloat(amount) > 0) {
            setPaymentError('');
            setStep('confirm');
        }
    };

    const handleConfirm = () => {
        setIsProcessing(true);
        setPaymentError('');
        // Simulate API call
        setTimeout(() => {
             if (Math.random() < 0.1) { // 10% chance of failure
                setPaymentError('An unexpected error occurred. Please try again.');
                setIsProcessing(false);
                return;
            }
            setIsProcessing(false);
            setStep('success');
        }, 2000);
    };
    
    const resetForm = () => {
        setUsername('');
        setAmount('');
        setFoundUser(null);
        setSearchError('');
        setPaymentError('');
        setStep('form');
    };


    if (step === 'success') {
        return (
            <Card className="max-w-2xl mx-auto text-center">
                <CheckCircleIcon className="w-16 h-16 text-green-400 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-green-400 mb-2">Transfer Successful!</h2>
                <p className="text-gray-light mb-6">
                    {parseFloat(amount).toLocaleString('en-US', { style: 'currency', currency: fromCurrency })} has been sent to {foundUser?.name} (@{username}).
                </p>
                <button onClick={resetForm} className="bg-accent text-primary font-bold py-2 px-6 rounded hover:bg-yellow-400">
                    Make Another Transfer
                </button>
            </Card>
        );
    }
    
    if (step === 'confirm') {
        return (
             <Card className="max-w-2xl mx-auto">
                <h2 className="text-2xl font-bold mb-4">Confirm Transfer</h2>
                <div className="bg-primary p-4 rounded-lg space-y-3">
                    <div className="flex justify-between items-center text-gray-light">
                        <span>Sending To:</span>
                        <div className="text-right">
                            <span className="font-semibold text-white">{foundUser?.name}</span>
                            <span className="block text-xs text-gray-400">@{username}</span>
                        </div>
                    </div>
                    <div className="flex justify-between items-center text-gray-light">
                        <span>Amount:</span>
                        <span className="font-mono text-white">{parseFloat(amount).toLocaleString('en-US', { style: 'currency', currency: fromCurrency })}</span>
                    </div>
                     <hr className="border-gray-medium" />
                     <div className="flex justify-between items-center text-gray-light">
                        <span>Fee:</span>
                        <span className="font-mono text-green-400 font-bold">ZERO</span>
                    </div>
                    <div className="flex justify-between items-center font-bold text-white text-lg">
                        <span>You Pay:</span>
                        <span className="font-mono text-accent">{parseFloat(amount).toLocaleString('en-US', { style: 'currency', currency: fromCurrency })}</span>
                    </div>
                </div>
                 {paymentError && <p className="text-red-400 text-center mt-4">{paymentError}</p>}
                <div className="flex justify-end space-x-4 mt-6">
                    <button onClick={() => setStep('form')} disabled={isProcessing} className="bg-gray-medium text-white font-bold py-2 px-6 rounded hover:bg-gray-500 disabled:opacity-50">
                        Back
                    </button>
                    <button onClick={handleConfirm} disabled={isProcessing} className="bg-accent text-primary font-bold py-2 px-6 rounded hover:bg-yellow-400 disabled:bg-gray-500 flex items-center justify-center w-32">
                        {isProcessing ? <Spinner /> : 'Confirm & Send'}
                    </button>
                </div>
            </Card>
        );
    }

    return (
        <Card className="max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold mb-2">Send to a Xeloo User</h2>
            <p className="text-gray-light mb-6">Instantly send funds to any user on Xeloo with zero fees using their unique username.</p>
            <form onSubmit={handleInitiate} className="space-y-4">
                 <div>
                    <label className="block text-sm font-medium text-gray-light">Recipient's Username</label>
                    <div className="relative mt-1">
                        <UsersIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input 
                            type="text" 
                            value={username} 
                            onChange={e => setUsername(e.target.value)} 
                            placeholder="e.g., janedoe" 
                            className="w-full bg-gray-dark p-2 pl-10 rounded border border-gray-medium" 
                            required 
                        />
                        <div className="absolute right-3 top-1/2 -translate-y-1/2">
                            {isSearching && <Spinner />}
                            {foundUser && !isSearching && <CheckCircleIcon className="w-5 h-5 text-green-400" />}
                        </div>
                    </div>
                    {searchError && !isSearching && <p className="text-red-400 text-xs mt-1">{searchError}</p>}
                    {foundUser && !isSearching && <p className="text-green-400 text-xs mt-1">User found: {foundUser.name}</p>}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-light">Amount to Send ({fromCurrency})</label>
                    <input type="number" step="0.01" value={amount} onChange={e => setAmount(e.target.value)} placeholder="0.00" className="mt-1 w-full bg-gray-dark p-2 rounded border border-gray-medium" required />
                </div>
                
                <button type="submit" disabled={!foundUser || !amount} className="w-full bg-accent text-primary font-bold py-3 px-4 rounded hover:bg-yellow-400 disabled:bg-gray-500 disabled:cursor-not-allowed flex justify-center items-center">
                    Review Transfer
                </button>
            </form>
        </Card>
    );
};

export default XelooTransfer;