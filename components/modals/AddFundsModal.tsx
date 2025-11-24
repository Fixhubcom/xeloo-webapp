
import React, { useState } from 'react';
import Card from '../common/Card';
import Spinner from '../common/Spinner';
import { CreditCardIcon, CheckCircleIcon } from '../icons/Icons';

interface AddFundsModalProps {
    onClose: () => void;
    onFund: (amount: number) => void;
}

const AddFundsModal: React.FC<AddFundsModalProps> = ({ onClose, onFund }) => {
    const [amount, setAmount] = useState('');
    const [step, setStep] = useState<'form' | 'method' | 'bank' | 'usdt' | 'processing' | 'success'>('form');

    const handleConfirmDeposit = () => {
        setStep('processing');
        setTimeout(() => {
            onFund(parseFloat(amount));
            setStep('success');
        }, 2000);
    };

    return (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 animate-fade-in p-4" onClick={onClose}>
            <Card className="w-full max-w-md" onClick={e => e.stopPropagation()}>
                {step === 'form' && (
                    <>
                        <h2 className="text-2xl font-bold mb-4">Add Funds to Your Wallet</h2>
                        <div>
                            <label className="text-sm text-gray-400">Amount (USD)</label>
                            <input type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="0.00" className="w-full mt-1 bg-primary p-2 rounded border border-primary-light" required/>
                        </div>
                        <div className="flex justify-end space-x-4 mt-6">
                            <button onClick={onClose} className="bg-gray-700 text-white font-bold py-2 px-4 rounded hover:bg-gray-600">Cancel</button>
                            <button onClick={() => setStep('method')} disabled={!amount || parseFloat(amount) <= 0} className="bg-accent text-primary font-bold py-2 px-4 rounded hover:opacity-90 disabled:bg-gray-500">Continue</button>
                        </div>
                    </>
                )}
                {step === 'method' && (
                    <>
                        <button onClick={() => setStep('form')} className="text-sm text-accent mb-4">&larr; Back to Amount</button>
                        <h2 className="text-2xl font-bold mb-2">Choose Deposit Method</h2>
                        <p className="text-gray-300 mb-6">You are depositing <span className="font-bold text-accent">{parseFloat(amount).toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</span>.</p>
                        <div className="space-y-4">
                            <button onClick={() => setStep('bank')} className="w-full bg-primary-light text-white font-bold py-3 px-4 rounded hover:bg-primary text-left flex items-center">
                                <CreditCardIcon className="w-6 h-6 mr-3" />
                                Deposit via Bank Transfer
                            </button>
                             <button onClick={() => setStep('usdt')} className="w-full bg-primary-light text-white font-bold py-3 px-4 rounded hover:bg-primary text-left flex items-center">
                                <CheckCircleIcon className="w-6 h-6 mr-3" />
                                Deposit via Crypto (USDT)
                            </button>
                        </div>
                    </>
                )}
                {step === 'bank' && (
                     <>
                        <button onClick={() => setStep('method')} className="text-sm text-accent mb-4">&larr; Back to Methods</button>
                        <h2 className="text-2xl font-bold mb-2">Bank Transfer Details</h2>
                        <p className="text-gray-400 mb-4">Deposit funds into the unique account below. The funds will be credited to your Xeloo balance instantly.</p>
                        <div className="bg-primary p-4 rounded-lg space-y-3 mt-4">
                            <div className="flex justify-between"><span className="text-gray-400">Bank Name:</span> <strong className="text-white">Xeloo Pay-In (Providus)</strong></div>
                            <div className="flex justify-between"><span className="text-gray-400">Account Number:</span> <strong className="font-mono text-white">9{Math.floor(100000000 + Math.random() * 900000000)}</strong></div>
                            <div className="flex justify-between"><span className="text-gray-400">Beneficiary:</span> <strong className="text-white">XELOO/{Math.random().toString(36).substring(2, 8).toUpperCase()}</strong></div>
                        </div>
                        <button onClick={handleConfirmDeposit} className="w-full mt-6 bg-accent text-primary font-bold py-3 px-4 rounded hover:opacity-90">I've Made the Deposit</button>
                    </>
                )}
                 {step === 'usdt' && (
                     <>
                        <button onClick={() => setStep('method')} className="text-sm text-accent mb-4">&larr; Back to Methods</button>
                        <h2 className="text-2xl font-bold mb-2">Crypto Deposit Details</h2>
                        <p className="text-gray-400 mb-4">Send the exact USDT amount to the provided address. Your balance will be credited upon confirmation.</p>
                        <div className="bg-primary p-4 rounded-lg space-y-3 mt-4">
                            <div className="flex justify-between"><span className="text-gray-400">Network:</span> <strong className="text-white">Tron (TRC20)</strong></div>
                            <div className="flex justify-between"><span className="text-gray-400">USDT Address:</span> <strong className="font-mono text-white break-all">T******************************WXYZ</strong></div>
                            <p className="text-xs text-yellow-400 text-center pt-2">Send only USDT (TRC20) to this address. Sending any other currency will result in a loss of funds.</p>
                        </div>
                        <button onClick={handleConfirmDeposit} className="w-full mt-6 bg-accent text-primary font-bold py-3 px-4 rounded hover:opacity-90">I've Made the Deposit</button>
                    </>
                )}
                {step === 'processing' && (
                    <div className="text-center py-8">
                        <Spinner className="w-12 h-12 mx-auto border-4" />
                        <h2 className="text-2xl font-bold mt-4">Confirming Deposit...</h2>
                    </div>
                )}
                 {step === 'success' && (
                    <div className="text-center py-8">
                        <h2 className="text-2xl font-bold text-accent mb-2">Funds Added!</h2>
                        <p className="text-gray-300 mb-6">{parseFloat(amount).toLocaleString('en-US', { style: 'currency', currency: 'USD' })} has been added to your wallet.</p>
                        <button onClick={onClose} className="bg-accent text-primary font-bold py-2 px-6 rounded hover:opacity-90">Done</button>
                    </div>
                )}
            </Card>
        </div>
    );
};

export default AddFundsModal;
