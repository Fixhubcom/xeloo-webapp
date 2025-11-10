import React, { useState } from 'react';
import Card from '../../components/common/Card';
import Spinner from '../../components/common/Spinner';
import { useAuth } from '../../hooks/useAuth';
import { CheckCircleIcon } from '../../components/icons/Icons';

const TaxPayments: React.FC = () => {
    const { user } = useAuth();
    const [view, setView] = useState<'form' | 'confirm' | 'payin' | 'processing' | 'success'>('form');
    
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
    const [generatedDetails, setGeneratedDetails] = useState<{ bankName: string, accountNumber: string, beneficiary: string } | null>(null);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        if (!tin || !amount || !periodStart || !periodEnd) {
            setError('Please fill all required fields.');
            return;
        }
        setView('confirm');
    };

    const handleProceedToPayIn = () => {
        const randomSuffix = Math.random().toString(36).substring(2, 8).toUpperCase();
        setGeneratedDetails({
            bankName: 'Xeloo TaxPay (Providus Bank)',
            accountNumber: `8${Math.floor(100000000 + Math.random() * 900000000)}`,
            beneficiary: `FIRS/${randomSuffix}`,
        });
        setView('payin');
    };

    const handleConfirmPayment = () => {
        setView('processing');
        // Simulate API call to tax authority
        setTimeout(() => {
            const txId = `XELOO-TAX-${Date.now()}`;
            setTransactionId(txId);
            setIsProcessing(false);
            setView('success');
        }, 3000);
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

    const renderConfirm = () => (
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
            </div>
            <div className="flex justify-end space-x-4 mt-6">
                <button onClick={() => setView('form')} className="bg-gray-700 text-white font-bold py-2 px-6 rounded hover:bg-gray-600">
                    Back
                </button>
                <button onClick={handleProceedToPayIn} className="bg-accent text-primary font-bold py-2 px-6 rounded hover:opacity-90">
                    Proceed to Payment
                </button>
            </div>
        </Card>
    );

    const renderPayIn = () => (
        <Card>
            <h2 className="text-2xl font-bold mb-2">Complete Your Tax Payment</h2>
            <p className="text-gray-400 mb-4">To proceed, please deposit the exact amount to the unique account details below. These details are valid for this transaction only.</p>
            <div className="bg-primary p-4 rounded-lg space-y-3">
                <div className="text-center mb-2">
                    <p className="text-sm text-gray-400">Total Amount to Deposit</p>
                    <p className="text-3xl font-bold text-accent font-mono">{parseFloat(amount).toLocaleString('en-NG', { style: 'currency', currency: 'NGN' })}</p>
                </div>
                {generatedDetails && (
                    <>
                        <div className="flex justify-between"><span className="text-gray-400">Bank Name:</span> <strong className="text-white">{generatedDetails.bankName}</strong></div>
                        <div className="flex justify-between"><span className="text-gray-400">Account Number:</span> <strong className="font-mono text-white">{generatedDetails.accountNumber}</strong></div>
                        <div className="flex justify-between"><span className="text-gray-400">Beneficiary:</span> <strong className="text-white">{generatedDetails.beneficiary}</strong></div>
                    </>
                )}
            </div>
            <button onClick={handleConfirmPayment} className="w-full mt-6 bg-accent text-primary font-bold py-3 px-4 rounded hover:opacity-90">I Have Made The Payment</button>
        </Card>
    );
    
    const renderProcessing = () => (
         <Card className="text-center">
            <Spinner className="w-12 h-12 mx-auto border-4" />
            <h2 className="text-2xl font-bold mt-4">Confirming Your Deposit...</h2>
            <p className="text-gray-400 mt-2">Once confirmed, we will instantly process the payment to FIRS.</p>
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
        case 'payin': return renderPayIn();
        case 'processing': return renderProcessing();
        case 'success': return renderSuccess();
        default: return renderForm();
    }
};

export default TaxPayments;
