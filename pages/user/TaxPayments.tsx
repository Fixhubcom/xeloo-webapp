

import React, { useState } from 'react';
import Card from '../../components/common/Card';
import Spinner from '../../components/common/Spinner';
import { useAuth } from '../../hooks/useAuth';
import { CheckCircleIcon } from '../../components/icons/Icons';

interface TaxPaymentsProps {
    openAddFundsModal: () => void;
}

const TaxPayments: React.FC<TaxPaymentsProps> = ({ openAddFundsModal }) => {
    const { user, updateWalletBalance } = useAuth();
    const [view, setView] = useState<'form' | 'confirm' | 'processing' | 'success'>('form');
    
    // Form state
    const [tin, setTin] = useState('');
    const [taxType, setTaxType] = useState('Personal Income Tax');
    const [amount, setAmount] = useState('');
    const [periodStart, setPeriodStart] = useState(''); // YYYY-MM-DD
    const [periodEnd, setPeriodEnd] = useState(''); // YYYY-MM-DD
    
    // Flow state
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState('');
    const [transactionId, setTransactionId] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        if (!tin || !amount || !periodStart || !periodEnd) {
            setError('Please fill all required fields.');
            return;
        }
        setView('confirm');
    };

    const handleConfirmPayment = () => {
        setView('processing');
        // Simulate API call to tax authority
        setTimeout(() => {
            const txId = `XELOO-TAX-${Date.now()}`;
            setTransactionId(txId);
            updateWalletBalance(-parseFloat(amount));
            setIsProcessing(false);
            setView('success');
        }, 2000);
    };

    const resetForm = () => {
        setView('form');
        setTin('');
        setTaxType('Personal Income Tax');
        setAmount('');
        setPeriodStart('');
        setPeriodEnd('');
        setError('');
    };

    const renderForm = () => (
        <Card className="max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold mb-2">Nigerian Tax Payments</h2>
            <p className="text-gray-400 mb-6">Pay your Federal Inland Revenue Service (FIRS) taxes directly through Xeloo.</p>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="tin" className="block text-sm font-medium text-gray-400">Tax Identification Number (TIN)</label>
                    <input id="tin" value={tin} onChange={e => setTin(e.target.value)} placeholder="Enter your 10-digit TIN" className="mt-1 w-full bg-primary p-2 rounded border border-primary-light" required />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="taxType" className="block text-sm font-medium text-gray-400">Tax Type</label>
                        <select id="taxType" value={taxType} onChange={e => setTaxType(e.target.value)} className="mt-1 w-full bg-primary p-2 rounded border border-primary-light">
                            <option>Personal Income Tax (PIT)</option>
                            <option>Company Income Tax (CIT)</option>
                            <option>Value Added Tax (VAT)</option>
                            <option>Withholding Tax (WHT)</option>
                        </select>
                    </div>
                    <div>
                        <label htmlFor="periodStart" className="block text-sm font-medium text-gray-400">Payment Period</label>
                        <div className="flex items-center gap-2 mt-1">
                            <input id="periodStart" type="date" value={periodStart} onChange={e => setPeriodStart(e.target.value)} className="grow bg-primary p-2 rounded border border-primary-light" required />
                            <span className="text-gray-400">to</span>
                            <input id="periodEnd" type="date" value={periodEnd} onChange={e => setPeriodEnd(e.target.value)} className="grow bg-primary p-2 rounded border border-primary-light" required />
                        </div>
                    </div>
                </div>

                <div>
                    <label htmlFor="amount" className="block text-sm font-medium text-gray-400">Amount (NGN)</label>
                    <input id="amount" type="number" step="0.01" value={amount} onChange={e => setAmount(e.target.value)} placeholder="0.00" className="mt-1 w-full bg-primary p-2 rounded border border-primary-light" required />
                </div>
                                
                {error && <p className="text-yellow-400 text-sm">{error}</p>}

                <div className="flex justify-end pt-4">
                    <button type="submit" className="bg-accent text-primary font-bold py-2 px-6 rounded hover:opacity-90">
                        Review Payment
                    </button>
                </div>
            </form>
        </Card>
    );

    const renderConfirm = () => {
        const hasSufficientFunds = (user?.walletBalance || 0) >= parseFloat(amount);
        return (
            <Card className="max-w-2xl mx-auto">
                <h2 className="text-2xl font-bold mb-4">Confirm Tax Payment</h2>
                <div className="bg-primary p-4 rounded-lg space-y-3 text-gray-300">
                    <div className="flex justify-between"><span>Taxpayer ID (TIN):</span><span className="font-semibold text-white">{tin}</span></div>
                    <div className="flex justify-between"><span>Tax Type:</span><span className="font-semibold text-white">{taxType}</span></div>
                    <div className="flex justify-between"><span>Payment Period:</span><span className="font-semibold text-white">{periodStart} to {periodEnd}</span></div>
                    <hr className="border-primary-light" />
                    <div className="flex justify-between items-center text-lg">
                        <span className="font-bold text-white">Total Payment:</span>
                        <span className="font-mono font-bold text-2xl text-accent">
                            {parseFloat(amount).toLocaleString('en-NG', { style: 'currency', currency: 'NGN' })}
                        </span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-400">Your Wallet Balance:</span>
                        <span className="font-mono text-white">{(user?.walletBalance || 0).toLocaleString('en-US', { style: 'currency', currency: user?.preferredCurrency || 'USD' })}</span>
                    </div>
                </div>
                {!hasSufficientFunds && (
                    <div className="mt-4 p-3 bg-yellow-500/10 text-yellow-300 text-center rounded-lg">
                        <p className="font-bold">Insufficient Funds</p>
                        <p className="text-sm">Your wallet balance is too low to complete this payment.</p>
                    </div>
                )}
                <div className="flex justify-end space-x-4 mt-6">
                    <button onClick={() => setView('form')} className="bg-gray-700 text-white font-bold py-2 px-6 rounded hover:bg-gray-600">
                        Back
                    </button>
                     {hasSufficientFunds ? (
                        <button onClick={handleConfirmPayment} className="bg-accent text-primary font-bold py-2 px-6 rounded hover:opacity-90">
                            Pay from Wallet
                        </button>
                    ) : (
                        <button onClick={openAddFundsModal} className="bg-accent text-primary font-bold py-2 px-6 rounded hover:opacity-90">
                            Add Funds
                        </button>
                    )}
                </div>
            </Card>
        );
    };
    
    const renderProcessing = () => (
         <Card className="text-center">
            <Spinner className="w-12 h-12 mx-auto border-4" />
            <h2 className="text-2xl font-bold mt-4">Submitting Payment...</h2>
            <p className="text-gray-400 mt-2">We are processing your tax payment to FIRS.</p>
        </Card>
    );

    const renderSuccess = () => (
        <Card className="max-w-2xl mx-auto text-center">
            <CheckCircleIcon className="w-16 h-16 text-green-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-green-400 mb-2">Payment Successful!</h2>
            <p className="text-gray-light mb-6">
                Your tax payment has been submitted to FIRS.
            </p>
            <div className="bg-primary p-4 rounded-lg">
                <p className="text-sm text-gray-400">Transaction Reference ID:</p>
                <p className="font-mono text-white text-lg">{transactionId}</p>
            </div>
            <button onClick={resetForm} className="mt-6 bg-accent text-primary font-bold py-2 px-6 rounded hover:opacity-90">
                Make Another Payment
            </button>
        </Card>
    );

    switch (view) {
        case 'confirm': return renderConfirm();
        case 'processing': return renderProcessing();
        case 'success': return renderSuccess();
        default: return renderForm();
    }
};

export default TaxPayments;