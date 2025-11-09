
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

const SendPayment: React.FC = () => {
    const { user } = useAuth();
    const defaultAccount = user?.bankAccounts?.find(a => a.isDefault) || user?.bankAccounts?.[0];

    const [amount, setAmount] = useState('');
    const [recipientCountry, setRecipientCountry] = useState('Nigeria');
    const [fromAccountId, setFromAccountId] = useState(defaultAccount?.id || '');
    
    const [rates, setRates] = useState(MOCK_RATES);
    const [commission, setCommission] = useState(0);
    const [total, setTotal] = useState(0);
    const [receivedAmount, setReceivedAmount] = useState(0);
    const [isProcessing, setIsProcessing] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const fromCurrency = user?.bankAccounts?.find(acc => acc.id === fromAccountId)?.currency || 'USD';
    const toCurrency = countryToCurrency[recipientCountry] || 'USD';

    // Simulate real-time rate fluctuation
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

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsProcessing(true);
        setIsSuccess(false);
        setTimeout(() => {
            setIsProcessing(false);
            setIsSuccess(true);
            setAmount('');
        }, 2000);
    };

    if (isSuccess) {
        return (
            <Card className="max-w-lg mx-auto text-center">
                <h2 className="text-2xl font-bold text-green-400 mb-4">Payment Sent Successfully!</h2>
                <p className="text-gray-light mb-6">Your transaction has been initiated and will be settled within minutes.</p>
                <button onClick={() => setIsSuccess(false)} className="bg-accent text-primary font-bold py-2 px-6 rounded hover:bg-yellow-400">
                    Send Another Payment
                </button>
            </Card>
        );
    }

    return (
        <Card className="max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold mb-6">Send Payment Globally</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
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
                 <div>
                    <label className="block text-sm font-medium text-gray-light">Recipient's Country</label>
                    <select value={recipientCountry} onChange={e => setRecipientCountry(e.target.value)} className="mt-1 w-full bg-gray-dark p-2 rounded border border-gray-medium">
                        <option>Nigeria</option>
                        <option>Ghana</option>
                        <option>Kenya</option>
                        <option>United Kingdom</option>
                        <option>USA</option>
                    </select>
                </div>
                 <div>
                    <label className="block text-sm font-medium text-gray-light">Recipient's Bank Details</label>
                    <input type="text" placeholder="Account Number" className="mt-1 w-full bg-gray-dark p-2 rounded border border-gray-medium" required />
                    <input type="text" placeholder="Bank Name" className="mt-2 w-full bg-gray-dark p-2 rounded border border-gray-medium" required />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-light">Recipient's Email</label>
                    <input type="email" placeholder="recipient@email.com" className="mt-1 w-full bg-gray-dark p-2 rounded border border-gray-medium" required />
                </div>

                {total > 0 && (
                <div className="bg-primary p-4 rounded-lg space-y-3">
                    <div className="flex justify-between items-center text-gray-light">
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
                
                <button type="submit" disabled={isProcessing || !amount} className="w-full bg-accent text-primary font-bold py-3 px-4 rounded hover:bg-yellow-400 disabled:bg-gray-500 disabled:cursor-not-allowed flex justify-center items-center">
                    {isProcessing ? <Spinner /> : 'Confirm & Send'}
                </button>
            </form>
        </Card>
    );
};

export default SendPayment;
