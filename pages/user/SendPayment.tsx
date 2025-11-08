
import React, { useState, useEffect } from 'react';
import Card from '../../components/common/Card';
import Spinner from '../../components/common/Spinner';

// Mock exchange rate
const MOCK_USD_TO_NGN_RATE = 1450.50;

const SendPayment: React.FC = () => {
    const [amount, setAmount] = useState('');
    const [recipientCountry, setRecipientCountry] = useState('Nigeria');
    const [rate, setRate] = useState(MOCK_USD_TO_NGN_RATE);
    const [commission, setCommission] = useState(0);
    const [total, setTotal] = useState(0);
    const [receivedAmount, setReceivedAmount] = useState(0);
    const [isProcessing, setIsProcessing] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    useEffect(() => {
        const numAmount = parseFloat(amount);
        if (!isNaN(numAmount) && numAmount > 0) {
            const calculatedCommission = numAmount * 0.015;
            setCommission(calculatedCommission);
            setTotal(numAmount + calculatedCommission);
            setReceivedAmount(numAmount * rate);
        } else {
            setCommission(0);
            setTotal(0);
            setReceivedAmount(0);
        }
    }, [amount, rate]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsProcessing(true);
        setIsSuccess(false);
        setTimeout(() => {
            setIsProcessing(false);
            setIsSuccess(true);
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
                    <label className="block text-sm font-medium text-gray-light">Recipient's Bank Details</label>
                    <input type="text" placeholder="Account Number" className="mt-1 w-full bg-gray-dark p-2 rounded border border-gray-medium" required />
                    <input type="text" placeholder="Bank Name" className="mt-2 w-full bg-gray-dark p-2 rounded border border-gray-medium" required />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-light">Recipient's Email</label>
                    <input type="email" placeholder="recipient@email.com" className="mt-1 w-full bg-gray-dark p-2 rounded border border-gray-medium" required />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-light">Recipient's Country</label>
                    <select value={recipientCountry} onChange={e => setRecipientCountry(e.target.value)} className="mt-1 w-full bg-gray-dark p-2 rounded border border-gray-medium">
                        <option>Nigeria</option>
                        <option>Ghana</option>
                        <option>Kenya</option>
                        <option>United Kingdom</option>
                    </select>
                </div>
                 <div>
                    <label className="block text-sm font-medium text-gray-light">Amount to Send (USD)</label>
                    <input type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="0.00" className="mt-1 w-full bg-gray-dark p-2 rounded border border-gray-medium" required />
                </div>

                {total > 0 && (
                <div className="bg-primary p-4 rounded-lg space-y-3">
                    <div className="flex justify-between items-center text-gray-light">
                        <span>Exchange Rate:</span>
                        <span className="font-mono text-white">1 USD = {rate.toFixed(2)} NGN</span>
                    </div>
                    <div className="flex justify-between items-center text-gray-light">
                        <span>Recipient Gets:</span>
                        <span className="font-mono text-green-400 font-bold">{receivedAmount.toLocaleString('en-US', { style: 'currency', currency: 'NGN' })}</span>
                    </div>
                    <hr className="border-gray-medium" />
                    <div className="flex justify-between items-center text-gray-light">
                        <span>Commission (1.5%):</span>
                        <span className="font-mono text-white">${commission.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center text-white font-bold text-lg">
                        <span>You Pay:</span>
                        <span className="font-mono text-accent">${total.toFixed(2)}</span>
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
