
import React, { useState, useEffect } from 'react';
import Card from '../../components/common/Card';
import Spinner from '../../components/common/Spinner';
import { useAuth } from '../../hooks/useAuth';

const MOCK_RATES: { [key: string]: number } = {
    USD: 1,
    NGN: 1450.50,
    GHS: 13.10,
    KES: 129.50,
    GBP: 0.79,
    EUR: 0.92,
};

const countryToCurrency: { [key: string]: string } = {
    'Nigeria': 'NGN',
    'Ghana': 'GHS',
    'Kenya': 'KES',
    'United Kingdom': 'GBP',
    'USA': 'USD',
}

interface Recipient {
    id: string;
    name: string;
    country: string;
    accountNumber: string;
    bankName: string;
    email: string;
}

const mockRecipients: Recipient[] = [
    { id: 'rec_1', name: 'Acme Inc.', country: 'USA', accountNumber: '**** **** **** 1234', bankName: 'Chase Bank', email: 'billing@acme.com' },
    { id: 'rec_2', name: 'Lagos Ventures', country: 'Nigeria', accountNumber: '**** **** **** 5678', bankName: 'Access Bank', email: 'accounts@lagosventures.ng' },
];

const SendPayment: React.FC = () => {
    const { user } = useAuth();
    const defaultAccount = user?.bankAccounts?.find(a => a.isDefault) || user?.bankAccounts?.[0];

    const [amount, setAmount] = useState('');
    const [fromAccountId, setFromAccountId] = useState(defaultAccount?.id || '');
    
    // Recipient state
    const [recipients, setRecipients] = useState(mockRecipients);
    const [selectedRecipientId, setSelectedRecipientId] = useState('');
    const [recipientName, setRecipientName] = useState('');
    const [recipientCountry, setRecipientCountry] = useState('Nigeria');
    const [recipientAccountNumber, setRecipientAccountNumber] = useState('');
    const [recipientBankName, setRecipientBankName] = useState('');
    const [recipientEmail, setRecipientEmail] = useState('');
    const [saveRecipient, setSaveRecipient] = useState(false);
    
    // Rate & calculation state
    const [rates, setRates] = useState(MOCK_RATES);
    const [rateJustUpdated, setRateJustUpdated] = useState(false);
    const [commission, setCommission] = useState(0);
    const [total, setTotal] = useState(0);
    const [receivedAmount, setReceivedAmount] = useState(0);
    
    // UI/Flow state
    const [isConfirming, setIsConfirming] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [paymentError, setPaymentError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    // Scheduling state
    const [isScheduled, setIsScheduled] = useState(false);
    const [scheduleDate, setScheduleDate] = useState('');


    const fromCurrency = user?.bankAccounts?.find(acc => acc.id === fromAccountId)?.currency || 'USD';
    const toCurrency = countryToCurrency[recipientCountry] || 'USD';
    
    useEffect(() => {
        if (selectedRecipientId && selectedRecipientId !== 'new') {
            const recipient = recipients.find(r => r.id === selectedRecipientId);
            if (recipient) {
                setRecipientName(recipient.name);
                setRecipientCountry(recipient.country);
                setRecipientAccountNumber(recipient.accountNumber);
                setRecipientBankName(recipient.bankName);
                setRecipientEmail(recipient.email);
            }
        } else {
             setRecipientName('');
             setRecipientAccountNumber('');
             setRecipientBankName('');
             setRecipientEmail('');
        }
    }, [selectedRecipientId, recipients]);

    useEffect(() => {
        const interval = setInterval(() => {
            setRates(prevRates => {
                const newRates = { ...prevRates };
                for (const currency in newRates) {
                    if (currency !== 'USD') {
                        const factor = 1 + (Math.random() - 0.5) * 0.01; // Fluctuate by +/- 0.5%
                        newRates[currency] = prevRates[currency] * factor;
                    }
                }
                return newRates;
            });
            setRateJustUpdated(true);
            setTimeout(() => setRateJustUpdated(false), 1000);
        }, 3000); // Update every 3 seconds

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const numAmount = parseFloat(amount);
        if (!isNaN(numAmount) && numAmount > 0 && rates[fromCurrency] && rates[toCurrency]) {
            const calculatedCommission = numAmount * 0.015;
            setCommission(calculatedCommission);
            setTotal(numAmount + calculatedCommission);
            
            const baseAmount = numAmount / rates[fromCurrency]; // Convert to USD base
            const convertedAmount = baseAmount * rates[toCurrency];
            setReceivedAmount(convertedAmount);
        } else {
            setCommission(0);
            setTotal(0);
            setReceivedAmount(0);
        }
    }, [amount, rates, fromCurrency, toCurrency]);

    const handleInitiatePayment = (e: React.FormEvent) => {
        e.preventDefault();
        setPaymentError('');
        setIsConfirming(true);
    };

    const handleConfirmPayment = () => {
        setIsProcessing(true);
        setPaymentError('');

        // Simulate API call with random failure
        setTimeout(() => {
            if (Math.random() < 0.2) { // 20% chance of failure
                setPaymentError('Transaction failed due to an unexpected issue. Please try again.');
                setIsProcessing(false);
                return;
            }

            if (saveRecipient && selectedRecipientId === 'new') {
                const newRecipient: Recipient = {
                    id: `rec_${Date.now()}`,
                    name: recipientName,
                    country: recipientCountry,
                    accountNumber: `**** **** **** ${recipientAccountNumber.slice(-4)}`,
                    bankName: recipientBankName,
                    email: recipientEmail,
                };
                setRecipients(prev => [...prev, newRecipient]);
            }
            
            setIsProcessing(false);
            setIsConfirming(false);
            setIsSuccess(true);
            setSuccessMessage(isScheduled
                ? `Payment successfully scheduled for ${scheduleDate}!`
                : 'Payment Sent Successfully!'
            );
            setAmount('');
            setSelectedRecipientId('');
        }, 2000);
    };

    const resetForm = () => {
        setIsSuccess(false);
        setSuccessMessage('');
        setAmount('');
        setSelectedRecipientId('');
        setRecipientName('');
        setRecipientCountry('Nigeria');
        setRecipientAccountNumber('');
        setRecipientBankName('');
        setRecipientEmail('');
        setSaveRecipient(false);
        setIsScheduled(false);
        setScheduleDate('');
    };

    if (isSuccess) {
        return (
            <Card className="max-w-lg mx-auto text-center">
                <h2 className="text-2xl font-bold text-green-400 mb-4">{successMessage}</h2>
                <p className="text-gray-light mb-6">The transaction details have been recorded.</p>
                <button onClick={resetForm} className="bg-accent text-primary font-bold py-2 px-6 rounded hover:bg-yellow-400">
                    Make Another Payment
                </button>
            </Card>
        );
    }

    return (
        <>
            <Card className="max-w-2xl mx-auto">
                <h2 className="text-2xl font-bold mb-6">Send Payment Globally</h2>
                <form onSubmit={handleInitiatePayment} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-light">Send From</label>
                        <select value={fromAccountId} onChange={e => setFromAccountId(e.target.value)} className="mt-1 w-full bg-gray-dark p-2 rounded border border-gray-medium">
                            {user?.bankAccounts?.map(acc => (
                                <option key={acc.id} value={acc.id}>
                                    {acc.bankName} ({acc.currency}) - {acc.accountNumber}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-light">Amount to Send ({fromCurrency})</label>
                        <input type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="0.00" className="mt-1 w-full bg-gray-dark p-2 rounded border border-gray-medium" required />
                    </div>

                    <fieldset className="border border-gray-medium rounded p-4 space-y-4">
                        <legend className="text-lg font-semibold px-2">Recipient</legend>
                        <div>
                            <label className="block text-sm font-medium text-gray-light">Saved Recipient</label>
                            <select value={selectedRecipientId} onChange={e => setSelectedRecipientId(e.target.value)} className="mt-1 w-full bg-gray-dark p-2 rounded border border-gray-medium">
                                <option value="">Select a recipient</option>
                                {recipients.map(r => <option key={r.id} value={r.id}>{r.name} - {r.country}</option>)}
                                <option value="new">-- Add New Recipient --</option>
                            </select>
                        </div>

                        {(selectedRecipientId === 'new' || !selectedRecipientId) && (
                            <>
                                <input type="text" placeholder="Recipient's Full Name or Company" value={recipientName} onChange={e => setRecipientName(e.target.value)} className="w-full bg-gray-dark p-2 rounded border border-gray-medium" required />
                                <select value={recipientCountry} onChange={e => setRecipientCountry(e.target.value)} className="w-full bg-gray-dark p-2 rounded border border-gray-medium">
                                    <option>Nigeria</option>
                                    <option>Ghana</option>
                                    <option>Kenya</option>
                                    <option>United Kingdom</option>
                                    <option>USA</option>
                                </select>
                                <input type="text" placeholder="Account Number" value={recipientAccountNumber} onChange={e => setRecipientAccountNumber(e.target.value)} className="w-full bg-gray-dark p-2 rounded border border-gray-medium" required />
                                <input type="text" placeholder="Bank Name" value={recipientBankName} onChange={e => setRecipientBankName(e.target.value)} className="w-full bg-gray-dark p-2 rounded border border-gray-medium" required />
                                <input type="email" placeholder="Recipient's Email" value={recipientEmail} onChange={e => setRecipientEmail(e.target.value)} className="w-full bg-gray-dark p-2 rounded border border-gray-medium" required />
                                {selectedRecipientId === 'new' && (
                                     <div className="flex items-center">
                                        <input id="save-recipient" type="checkbox" checked={saveRecipient} onChange={e => setSaveRecipient(e.target.checked)} className="h-4 w-4 rounded border-gray-300 text-accent focus:ring-accent" />
                                        <label htmlFor="save-recipient" className="ml-2 block text-sm text-gray-light">Save recipient for future payments</label>
                                    </div>
                                )}
                            </>
                        )}
                    </fieldset>
                    
                    <div className="flex items-center space-x-4">
                        <div className="flex items-center">
                            <input id="schedule-payment" type="checkbox" checked={isScheduled} onChange={e => setIsScheduled(e.target.checked)} className="h-4 w-4 rounded border-gray-300 text-accent focus:ring-accent" />
                            <label htmlFor="schedule-payment" className="ml-2 block text-sm text-gray-light">Schedule for later?</label>
                        </div>
                        {isScheduled && (
                             <input type="date" value={scheduleDate} onChange={e => setScheduleDate(e.target.value)} required={isScheduled} min={new Date().toISOString().split("T")[0]} className="bg-gray-dark p-2 rounded border border-gray-medium" />
                        )}
                    </div>


                    {total > 0 && (
                    <div className="bg-primary p-4 rounded-lg space-y-3">
                        <div className={`flex justify-between items-center text-gray-light transition-colors duration-500 ${rateJustUpdated ? 'text-green-300' : ''}`}>
                            <span>Exchange Rate:</span>
                            <span className="font-mono text-white">1 {fromCurrency} ≈ {(rates[toCurrency] / rates[fromCurrency]).toFixed(4)} {toCurrency}</span>
                        </div>
                        <div className="flex justify-between items-center text-gray-light">
                            <span>Recipient Gets:</span>
                            <span className="font-mono text-green-400 font-bold">{receivedAmount.toLocaleString('en-US', { style: 'currency', currency: toCurrency, minimumFractionDigits: 2 })}</span>
                        </div>
                        <hr className="border-gray-medium" />
                        <div className="flex justify-between items-center text-gray-light">
                            <span>Commission (1.5%):</span>
                            <span className="font-mono text-white">{commission.toLocaleString('en-US', { style: 'currency', currency: fromCurrency })}</span>
                        </div>
                        <div className="flex justify-between items-center text-white font-bold text-lg">
                            <span>You Pay:</span>
                            <span className="font-mono text-accent">{total.toLocaleString('en-US', { style: 'currency', currency: fromCurrency })}</span>
                        </div>
                    </div>
                    )}
                    
                    <button type="submit" disabled={!amount} className="w-full bg-accent text-primary font-bold py-3 px-4 rounded hover:bg-yellow-400 disabled:bg-gray-500 disabled:cursor-not-allowed flex justify-center items-center">
                        {isScheduled ? 'Schedule Payment' : 'Confirm & Send'}
                    </button>
                </form>
            </Card>

            {isConfirming && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 animate-fade-in">
                    <Card className="max-w-md w-full">
                        <h2 className="text-2xl font-bold mb-4">{isScheduled ? 'Confirm Schedule' : 'Confirm Payment'}</h2>
                        <div className="space-y-2 text-gray-light mb-6">
                            <p><strong>Sending:</strong> <span className="font-mono text-accent">{total.toLocaleString('en-US', { style: 'currency', currency: fromCurrency })}</span></p>
                            <p><strong>To:</strong> <span className="text-white">{recipientName}</span></p>
                            <p><strong>Recipient Gets:</strong> <span className="font-mono text-green-400">{receivedAmount.toLocaleString('en-US', { style: 'currency', currency: toCurrency })}</span></p>
                            {isScheduled && <p><strong>Scheduled for:</strong> <span className="text-white">{scheduleDate}</span></p>}
                        </div>

                        {paymentError && <p className="text-red-400 text-center mb-4">{paymentError}</p>}
                        
                        <div className="flex justify-end space-x-4">
                            <button onClick={() => setIsConfirming(false)} disabled={isProcessing} className="bg-gray-medium text-white font-bold py-2 px-6 rounded hover:bg-gray-500 disabled:opacity-50">
                                Cancel
                            </button>
                            <button onClick={handleConfirmPayment} disabled={isProcessing} className="bg-accent text-primary font-bold py-2 px-6 rounded hover:bg-yellow-400 disabled:bg-gray-500 flex items-center justify-center w-40">
                                {isProcessing ? <Spinner /> : isScheduled ? 'Confirm Schedule' : 'Confirm & Send'}
                            </button>
                        </div>
                    </Card>
                </div>
            )}
        </>
    );
};

export default SendPayment;
