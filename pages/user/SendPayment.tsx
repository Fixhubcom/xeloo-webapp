
import React, { useState, useEffect, useCallback, useRef } from 'react';
import Card from '../../components/common/Card';
import Spinner from '../../components/common/Spinner';
import { useAuth } from '../../hooks/useAuth';
import { CheckCircleIcon, SwitchVerticalIcon } from '../../components/icons/Icons';
import BankDetailsForm from '../../components/payment/BankDetailsForm';

// In a real app, these would come from a global state/config fetched from the backend,
// which is managed by the Admin.
const TRANSACTION_FEE_PERCENT = 1.5;
const FX_SPREAD_PERCENT = 0.09;

const MOCK_RATES: { [key: string]: number } = { USD: 1, NGN: 1480.0, GHS: 14.5, KES: 130.0, GBP: 0.79, EUR: 0.92, CAD: 1.37, USDT: 1, CNY: 7.25, ZAR: 18.2, INR: 83.5, BRL: 5.15, AUD: 1.5 };
const countryToCurrency: { [key: string]: string } = { 'United States': 'USD', 'Nigeria': 'NGN', 'Ghana': 'GHS', 'Kenya': 'KES', 'United Kingdom': 'GBP', 'Germany': 'EUR', 'Canada': 'CAD', 'China': 'CNY', 'South Africa': 'ZAR', 'India': 'INR', 'Brazil': 'BRL', 'Australia': 'AUD' };
const countries = Object.keys(countryToCurrency);
const currencyToSymbol: { [key: string]: string } = { USD: '$', NGN: '₦', GHS: '₵', KES: 'KSh', GBP: '£', EUR: '€', CAD: '$', USDT: '$', CNY: '¥', ZAR: 'R', INR: '₹', BRL: 'R$', AUD: '$' };


// Mock user data for Xeloo Transfer search simulation
const mockXelooUsers: { [key: string]: { name: string, company: string } } = {
    'janedoe': { name: 'Jane Doe', company: 'Creative Solutions' },
    'acmeinc': { name: 'Acme Inc.', company: 'Acme Incorporated' },
};

type PaymentStep = 'input' | 'details' | 'confirm' | 'deposit' | 'processing' | 'success';
type PaymentMethod = 'bank' | 'usdt' | 'xeloo';

interface SendPaymentProps {
    initialUsername?: string;
    openAddFundsModal: () => void;
}

const SendPayment: React.FC<SendPaymentProps> = ({ initialUsername, openAddFundsModal }) => {
    const { user, updateWalletBalance } = useAuth();
    const [step, setStep] = useState<PaymentStep>('input');

    // Amount state
    const [activeInput, setActiveInput] = useState<'send' | 'receive'>('send');
    const [sendAmount, setSendAmount] = useState('');
    const [receiveAmount, setReceiveAmount] = useState('');
    const [fromCurrency, setFromCurrency] = useState(user?.preferredCurrency || 'USD');
    const [recipientCountry, setRecipientCountry] = useState('Nigeria');
    const [toCurrency, setToCurrency] = useState('NGN');
    const [effectiveRate, setEffectiveRate] = useState(0);
    const [fee, setFee] = useState(0);
    const [totalCost, setTotalCost] = useState(0);

    // Details state
    const [recipientName, setRecipientName] = useState('');
    const [recipientEmail, setRecipientEmail] = useState('');
    const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('bank');
    const [bankDetails, setBankDetails] = useState({ accountNumber: '', bankName: '', routingNumber: '', iban: '', swiftCode: '' });
    const [xelooUsername, setXelooUsername] = useState(initialUsername || '');
    const [foundUser, setFoundUser] = useState<{ name: string, company: string } | null>(null);
    const [isSearching, setIsSearching] = useState(false);
    const searchTimeout = useRef<number | null>(null);
    
    // Flow state
    const [isProcessing, setIsProcessing] = useState(false);
    const hasSufficientFunds = (user?.walletBalance || 0) >= totalCost;

    // Initial setup if coming from directory
    useEffect(() => {
        if (initialUsername) {
            setPaymentMethod('xeloo');
            setXelooUsername(initialUsername);
            setStep('details');
        }
    }, [initialUsername]);

    // Currency calculation logic
    useEffect(() => {
        const rateFrom = MOCK_RATES[fromCurrency] || 0;
        const rateTo = MOCK_RATES[toCurrency] || 0;
        if (rateFrom === 0 || rateTo === 0) return;

        const baseRate = rateTo / rateFrom;
        const currentEffectiveRate = baseRate * (1 - FX_SPREAD_PERCENT / 100);
        setEffectiveRate(currentEffectiveRate);

        if (activeInput === 'send') {
            const send = parseFloat(sendAmount);
            if (!isNaN(send) && send > 0) {
                const calculatedFee = send * (TRANSACTION_FEE_PERCENT / 100);
                const amountToConvert = send - calculatedFee;
                const received = amountToConvert * currentEffectiveRate;
                setFee(calculatedFee);
                setTotalCost(send);
                setReceiveAmount(received.toFixed(2));
            } else {
                setFee(0);
                setTotalCost(0);
                setReceiveAmount('');
            }
        } else if (activeInput === 'receive') {
            const received = parseFloat(receiveAmount);
            if (!isNaN(received) && received > 0) {
                const amountToConvert = received / currentEffectiveRate;
                const send = amountToConvert / (1 - TRANSACTION_FEE_PERCENT / 100);
                const calculatedFee = send - amountToConvert;
                setFee(calculatedFee);
                setTotalCost(send);
                setSendAmount(send.toFixed(2));
            } else {
                setFee(0);
                setTotalCost(0);
                setSendAmount('');
            }
        }
    }, [sendAmount, receiveAmount, fromCurrency, toCurrency, activeInput]);
    
    // Xeloo user search logic
    const searchUser = useCallback((searchUsername: string) => {
        setIsSearching(true);
        setFoundUser(null);
        setTimeout(() => {
            const userFound = mockXelooUsers[searchUsername.toLowerCase()];
            if (userFound) setFoundUser(userFound);
            setIsSearching(false);
        }, 500);
    }, []);

    useEffect(() => {
        if (paymentMethod === 'xeloo') {
            if (searchTimeout.current) clearTimeout(searchTimeout.current);
            if (xelooUsername) {
                searchTimeout.current = window.setTimeout(() => searchUser(xelooUsername), 300);
            } else {
                setFoundUser(null);
            }
        }
    }, [xelooUsername, paymentMethod, searchUser]);
    
    const handlePaymentMethodChange = (method: PaymentMethod) => {
        setPaymentMethod(method);
        if (method === 'usdt') {
            // Force the sender's currency to USDT for this flow
            setFromCurrency('USDT');
        }
    };


    const handleContinueToDetails = () => setStep('details');
    
    const handleConfirmPayment = () => {
        setIsProcessing(true);
        setTimeout(() => {
            updateWalletBalance(-totalCost);
            setIsProcessing(false);
            setStep('success');
        }, 2000);
    };
    
    const reset = () => {
        setStep('input');
        setSendAmount('');
        setReceiveAmount('');
        // reset other fields
    }

    const renderInputStep = () => (
        <Card>
            <h2 className="text-2xl font-bold mb-6">Send Payment</h2>
            <div className="space-y-2">
                {/* You Send */}
                <div className="bg-primary p-4 rounded-lg">
                    <label className="text-sm text-gray-400">You send</label>
                    <div className="flex items-center">
                        <select value={fromCurrency} onChange={e => setFromCurrency(e.target.value)} className="bg-primary-light border-r border-primary rounded-l-md font-bold text-white px-4 py-2 focus:outline-none appearance-none">
                            {Object.keys(MOCK_RATES).map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                        <div className="relative flex-grow">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-2xl text-gray-400">{currencyToSymbol[fromCurrency]}</span>
                            <input type="number" value={sendAmount} onChange={e => setSendAmount(e.target.value)} onFocus={() => setActiveInput('send')} placeholder="0.00" className="w-full bg-primary-light rounded-r-md text-right font-mono text-2xl text-white focus:outline-none pl-10 pr-4 py-2" />
                        </div>
                    </div>
                </div>

                {/* Swap & Rate */}
                <div className="flex items-center justify-between py-2 px-4">
                    <SwitchVerticalIcon className="w-5 h-5 text-gray-400" />
                    <p className="text-xs text-accent font-mono">1 {fromCurrency} ≈ {effectiveRate.toFixed(4)} {toCurrency}</p>
                </div>
                
                {/* Recipient Gets */}
                 <div className="bg-primary p-4 rounded-lg">
                    <label className="text-sm text-gray-400">Recipient gets</label>
                     <div className="flex items-center">
                        <select value={recipientCountry} onChange={e => { setRecipientCountry(e.target.value); setToCurrency(countryToCurrency[e.target.value]); }} disabled={toCurrency === 'USDT'} className="bg-primary-light border-r border-primary rounded-l-md font-bold text-white px-4 py-2 focus:outline-none appearance-none disabled:opacity-50">
                            {countries.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                         <div className="relative flex-grow">
                             <span className="absolute left-3 top-1/2 -translate-y-1/2 text-2xl text-gray-400">{currencyToSymbol[toCurrency]}</span>
                            <input type="number" value={receiveAmount} onChange={e => setReceiveAmount(e.target.value)} onFocus={() => setActiveInput('receive')} placeholder="0.00" className="w-full bg-primary-light rounded-r-md text-right font-mono text-2xl text-white focus:outline-none pl-10 pr-4 py-2" />
                        </div>
                    </div>
                </div>
            </div>

            {totalCost > 0 && (
                <div className="mt-6 space-y-2 text-sm">
                    <div className="flex justify-between text-gray-400"><span>Transaction Fee (1.5%):</span><span className="font-mono">{fee.toLocaleString(undefined, {style:'currency', currency: fromCurrency === 'USDT' ? 'USD' : fromCurrency})}</span></div>
                    <hr className="border-primary-light" />
                    <div className="flex justify-between font-bold text-white text-base"><span>Total Cost:</span><span className="font-mono">{totalCost.toLocaleString(undefined, {style:'currency', currency: fromCurrency === 'USDT' ? 'USD' : fromCurrency})}</span></div>
                </div>
            )}
            <button onClick={handleContinueToDetails} disabled={!(totalCost > 0)} className="w-full mt-6 bg-accent text-primary font-bold py-3 px-4 rounded hover:opacity-90 disabled:bg-gray-500">Continue</button>
        </Card>
    );
    
    const renderDetailsStep = () => (
         <Card>
            <h2 className="text-2xl font-bold mb-4">Recipient Details</h2>
            <div className="bg-primary p-3 rounded-md mb-4 flex justify-between text-sm">
                <div><span className="text-gray-400">You send: </span><strong className="text-white">{totalCost.toLocaleString(undefined, {style:'currency', currency: fromCurrency === 'USDT' ? 'USD' : fromCurrency})}</strong></div>
                <div><span className="text-gray-400">They get: </span><strong className="text-accent">{parseFloat(receiveAmount).toLocaleString(undefined, {style:'currency', currency: toCurrency === 'USDT' ? 'USD' : toCurrency})}</strong></div>
            </div>
            <div className="space-y-4">
                <div>
                    <label className="text-sm font-medium text-gray-400 mb-2 block">Payment Method</label>
                    <div className="grid grid-cols-3 gap-2">
                         <button onClick={() => handlePaymentMethodChange('bank')} className={`p-3 rounded-md border-2 text-center text-sm font-semibold ${paymentMethod === 'bank' ? 'border-accent bg-accent/10' : 'border-primary-light bg-primary'}`}>
                            Bank Transfer
                        </button>
                         <button onClick={() => handlePaymentMethodChange('usdt')} className={`p-3 rounded-md border-2 text-center text-sm font-semibold ${paymentMethod === 'usdt' ? 'border-accent bg-accent/10' : 'border-primary-light bg-primary'}`}>
                            Pay to Bank w/ USDT
                        </button>
                         <button onClick={() => handlePaymentMethodChange('xeloo')} className={`p-3 rounded-md border-2 text-center text-sm font-semibold ${paymentMethod === 'xeloo' ? 'border-accent bg-accent/10' : 'border-primary-light bg-primary'}`}>
                            Xeloo User
                        </button>
                    </div>
                </div>
                
                {paymentMethod === 'bank' && <BankDetailsForm 
                    recipientName={recipientName}
                    setRecipientName={setRecipientName}
                    recipientEmail={recipientEmail}
                    setRecipientEmail={setRecipientEmail}
                    bankDetails={bankDetails}
                    setBankDetails={setBankDetails}
                />}
                
                {paymentMethod === 'usdt' && (
                     <div className="space-y-4 pt-2">
                        <p className="text-xs text-yellow-400 -mb-2">
                            The "You send" amount has been updated to USDT. The recipient will receive funds in their bank account.
                        </p>
                        <BankDetailsForm 
                            recipientName={recipientName}
                            setRecipientName={setRecipientName}
                            recipientEmail={recipientEmail}
                            setRecipientEmail={setRecipientEmail}
                            bankDetails={bankDetails}
                            setBankDetails={setBankDetails}
                        />
                    </div>
                )}


                {paymentMethod === 'xeloo' && (
                     <div>
                        <label className="text-sm font-medium text-gray-400 block mb-1">Recipient's Username</label>
                        <input value={xelooUsername} onChange={e => setXelooUsername(e.target.value)} placeholder="@username" className="w-full bg-primary p-2 rounded border border-primary-light" required />
                        {isSearching && <p className="text-xs text-gray-400 mt-1">Searching...</p>}
                        {foundUser && <p className="text-xs text-accent mt-1">✓ User found: {foundUser.name} ({foundUser.company})</p>}
                    </div>
                )}
            </div>
            <div className="flex justify-between items-center mt-6">
                <button onClick={() => setStep('input')} className="text-gray-400 hover:text-white">Back</button>
                <button onClick={() => setStep('confirm')} disabled={(paymentMethod === 'xeloo' && !foundUser) || (paymentMethod === 'usdt' && !bankDetails.accountNumber)} className="bg-accent text-primary font-bold py-2 px-6 rounded hover:opacity-90 disabled:bg-gray-500">
                    Review Transfer
                </button>
            </div>
        </Card>
    );

    const renderConfirmStep = () => {
        return (
            <Card className="max-w-2xl mx-auto">
                <h2 className="text-2xl font-bold mb-4">Confirm Transfer</h2>
                <div className="bg-primary p-4 rounded-lg space-y-3">
                    <div className="flex justify-between items-center text-gray-light">
                        <span>Sending To:</span>
                        <div className="text-right">
                            <span className="font-semibold text-white">{paymentMethod === 'xeloo' ? foundUser?.name : recipientName}</span>
                            <span className="block text-xs text-gray-400">{paymentMethod === 'xeloo' ? `@${xelooUsername}` : recipientEmail}</span>
                        </div>
                    </div>
                    {paymentMethod === 'bank' && (
                         <div className="flex justify-between items-center text-gray-light">
                            <span>Bank Details:</span>
                            <div className="text-right">
                                <span className="font-mono text-white text-sm">{bankDetails.bankName} - {bankDetails.accountNumber}</span>
                            </div>
                        </div>
                    )}
                    {paymentMethod === 'usdt' && (
                         <div className="flex justify-between items-center text-gray-light">
                            <span>Bank Details:</span>
                            <div className="text-right">
                                <span className="font-mono text-white text-sm break-all">{bankDetails.bankName} - {bankDetails.accountNumber}</span>
                            </div>
                        </div>
                    )}
                    <hr className="border-primary-light" />
                    <div className="flex justify-between items-center font-bold text-white text-lg">
                        <span>Total Cost:</span>
                        <span className="font-mono text-accent">{totalCost.toLocaleString('en-US', { style: 'currency', currency: fromCurrency === 'USDT' ? 'USD' : fromCurrency })}</span>
                    </div>
                     <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-400">Your Wallet Balance:</span>
                        <span className="font-mono text-white">{(user?.walletBalance || 0).toLocaleString('en-US', { style: 'currency', currency: user?.preferredCurrency || 'USD' })}</span>
                    </div>
                </div>

                {!hasSufficientFunds && (
                    <div className="mt-4 p-3 bg-yellow-500/10 text-yellow-300 text-center rounded-lg">
                        <p className="font-bold">Insufficient Wallet Funds</p>
                        <p className="text-sm">Your wallet balance is too low to pay directly. You can add funds or pay via an external transfer.</p>
                    </div>
                )}

                <div className="mt-6 space-y-3">
                     <p className="text-sm font-semibold text-gray-400">Choose Payment Method:</p>
                    
                    <button 
                        onClick={handleConfirmPayment} 
                        disabled={isProcessing || !hasSufficientFunds} 
                        className="w-full bg-accent text-primary font-bold py-3 px-4 rounded hover:opacity-90 flex items-center justify-center disabled:bg-gray-700 disabled:text-gray-400 disabled:cursor-not-allowed"
                    >
                        {isProcessing ? <Spinner /> : 'Pay from Wallet'}
                    </button>

                    <button 
                        onClick={() => setStep('deposit')}
                        disabled={isProcessing}
                        className="w-full bg-primary-light text-white font-bold py-3 px-4 rounded hover:bg-primary"
                    >
                        {fromCurrency === 'USDT' ? 'Pay via Crypto Wallet' : 'Pay via Bank Transfer'}
                    </button>
                </div>

                <div className="flex justify-between items-center mt-6">
                    <button onClick={() => setStep('details')} disabled={isProcessing} className="text-gray-400 hover:text-white">
                        &larr; Back to Details
                    </button>
                    {!hasSufficientFunds && (
                         <button onClick={openAddFundsModal} className="text-sm font-bold text-accent hover:underline">
                            + Add Funds to Wallet
                        </button>
                    )}
                </div>
            </Card>
        );
    }
    
     const handleConfirmDeposit = () => {
        setIsProcessing(true);
        setTimeout(() => {
            setIsProcessing(false);
            setStep('success');
        }, 3000);
    };

    const renderDepositStep = () => {
        const isCrypto = fromCurrency === 'USDT';
        const depositAmount = totalCost;

        return (
            <Card className="max-w-2xl mx-auto">
                 <h2 className="text-2xl font-bold mb-2">{isCrypto ? 'Pay with Crypto' : 'Pay via Bank Transfer'}</h2>
                <p className="text-gray-400 mb-4">To complete the transfer, please send the exact amount below to the provided address.</p>
                <div className="bg-primary p-4 rounded-lg space-y-3">
                    <div className="text-center mb-2">
                        <p className="text-sm text-gray-400">Amount to Deposit</p>
                        <p className="text-3xl font-bold text-accent font-mono">{depositAmount.toLocaleString('en-US', { style: 'currency', currency: fromCurrency === 'USDT' ? 'USD' : fromCurrency })}</p>
                    </div>

                    {isCrypto ? (
                         <>
                            <div className="flex justify-between"><span className="text-gray-400">Network:</span> <strong className="text-white">Tron (TRC20)</strong></div>
                            <div className="flex justify-between"><span className="text-gray-400">USDT Address:</span> <strong className="font-mono text-white break-all">T******************************WXYZ</strong></div>
                            <p className="text-xs text-yellow-400 text-center pt-2">Send only USDT (TRC20) to this address. Sending any other currency will result in a loss of funds.</p>
                        </>
                    ) : (
                        <>
                            <div className="flex justify-between"><span className="text-gray-400">Bank Name:</span> <strong className="text-white">Xeloo Pay-In (Providus)</strong></div>
                            <div className="flex justify-between"><span className="text-gray-400">Account Number:</span> <strong className="font-mono text-white">9{Math.floor(100000000 + Math.random() * 900000000)}</strong></div>
                            <div className="flex justify-between"><span className="text-gray-400">Beneficiary:</span> <strong className="text-white">XELOO/{Math.random().toString(36).substring(2, 8).toUpperCase()}</strong></div>
                            <p className="text-xs text-yellow-400 text-center pt-2">This account is for this transaction only. Do not save for future use.</p>
                        </>
                    )}
                </div>
                <div className="flex justify-end space-x-4 mt-6">
                    <button onClick={() => setStep('confirm')} className="bg-gray-700 text-white font-bold py-2 px-4 rounded hover:bg-gray-600">Back</button>
                    <button onClick={handleConfirmDeposit} className="bg-accent text-primary font-bold py-2 px-4 rounded hover:opacity-90">I've Made the Deposit</button>
                </div>
            </Card>
        )
    }

    const renderSuccessStep = () => (
        <Card className="text-center">
            <CheckCircleIcon className="w-16 h-16 text-green-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-green-400 mb-2">Transfer in Progress!</h2>
            <p className="text-gray-light mb-6">
                Your payment has been sent from your wallet. The transfer is now being processed and will be completed shortly.
            </p>
            <button onClick={reset} className="bg-accent text-primary font-bold py-2 px-6 rounded hover:opacity-90">
                Make Another Payment
            </button>
        </Card>
    );

    switch(step) {
        case 'input': return renderInputStep();
        case 'details': return renderDetailsStep();
        case 'confirm': return renderConfirmStep();
        case 'deposit': return renderDepositStep();
        case 'success': return renderSuccessStep();
        default: return renderInputStep();
    }
};

export default SendPayment;
