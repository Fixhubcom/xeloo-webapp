
import React, { useState } from 'react';
import Card from '../../components/common/Card';
import { useAuth } from '../../hooks/useAuth';
import { CheckCircleIcon, RocketIcon, CreditCardIcon } from '../../components/icons/Icons';
import Spinner from '../../components/common/Spinner';

const SubscriptionUpgradeModal: React.FC<{ onClose: () => void; onPaymentSuccess: () => void; }> = ({ onClose, onPaymentSuccess }) => {
    const [step, setStep] = useState<'options' | 'card' | 'bank' | 'processing'>('options');
    const [isProcessing, setIsProcessing] = useState(false);

    const handleCardPayment = (e: React.FormEvent) => {
        e.preventDefault();
        setStep('processing');
        setTimeout(() => {
            onPaymentSuccess();
            setIsProcessing(false);
            onClose();
        }, 2000);
    };
    
     const handleBankPayment = () => {
        setStep('processing');
        setTimeout(() => {
            onPaymentSuccess();
            setIsProcessing(false);
            onClose();
        }, 3000);
    };

    const renderContent = () => {
        switch (step) {
            case 'options':
                return (
                    <div>
                        <h2 className="text-2xl font-bold text-white mb-2">Upgrade to Pro Plan</h2>
                        <p className="text-gray-300 mb-6">Choose your preferred payment method.</p>
                        <div className="space-y-4">
                            <button onClick={() => setStep('card')} className="w-full bg-primary-light text-white font-bold py-3 px-4 rounded hover:bg-primary text-left flex items-center">
                                <CreditCardIcon className="w-6 h-6 mr-3" />
                                Pay with Card
                            </button>
                             <button onClick={() => setStep('bank')} className="w-full bg-primary-light text-white font-bold py-3 px-4 rounded hover:bg-primary text-left flex items-center">
                                <CheckCircleIcon className="w-6 h-6 mr-3" />
                                Pay with Bank Transfer
                            </button>
                        </div>
                    </div>
                );
            case 'card':
                return (
                    <div>
                        <button onClick={() => setStep('options')} className="text-sm text-accent mb-4">&larr; Back to options</button>
                        <h2 className="text-2xl font-bold text-white mb-2">Pay with Card</h2>
                        <p className="text-gray-300 mb-6">You will be charged $29.99 per month.</p>
                        <form onSubmit={handleCardPayment} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-400">Card Number</label>
                                <div className="relative mt-1">
                                    <CreditCardIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input type="text" placeholder="**** **** **** 1234" required className="w-full bg-primary p-2 pl-10 rounded border border-primary-light" />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-400">Expiry Date</label>
                                    <input type="text" placeholder="MM / YY" required className="mt-1 w-full bg-primary p-2 rounded border border-primary-light" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-400">CVC</label>
                                    <input type="text" placeholder="123" required className="mt-1 w-full bg-primary p-2 rounded border border-primary-light" />
                                </div>
                            </div>
                            <div className="pt-4">
                                <button type="submit" className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-bold text-primary bg-accent hover:opacity-90">
                                    Confirm Payment ($29.99)
                                </button>
                            </div>
                        </form>
                    </div>
                );
            case 'bank':
                 return (
                    <div>
                        <button onClick={() => setStep('options')} className="text-sm text-accent mb-4">&larr; Back to options</button>
                        <h2 className="text-2xl font-bold mb-2">Pay with Bank Transfer</h2>
                        <p className="text-gray-400 mb-4">Deposit the exact amount to the unique account details below. This is valid for this transaction only.</p>
                        <div className="bg-primary p-4 rounded-lg space-y-3">
                            <div className="text-center mb-2">
                                <p className="text-sm text-gray-400">Amount to Deposit</p>
                                <p className="text-3xl font-bold text-accent font-mono">$29.99</p>
                            </div>
                            <div className="flex justify-between"><span className="text-gray-400">Bank Name:</span> <strong className="text-white">Xeloo Subs (Providus)</strong></div>
                            <div className="flex justify-between"><span className="text-gray-400">Account Number:</span> <strong className="font-mono text-white">9{Math.floor(100000000 + Math.random() * 900000000)}</strong></div>
                            <div className="flex justify-between"><span className="text-gray-400">Beneficiary:</span> <strong className="text-white">XELOO/SUB/{Math.random().toString(36).substring(2, 8).toUpperCase()}</strong></div>
                        </div>
                        <button onClick={handleBankPayment} className="w-full mt-6 bg-accent text-primary font-bold py-3 px-4 rounded hover:opacity-90">I Have Made The Deposit</button>
                    </div>
                );
            case 'processing':
                return (
                    <div className="flex flex-col items-center justify-center py-12">
                        <Spinner className="w-12 h-12 border-4" />
                        <h2 className="text-2xl font-bold mt-4">Processing Payment...</h2>
                        <p className="text-gray-400 mt-2">Please wait while we confirm your payment.</p>
                    </div>
                );
        }
    };

    return (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 animate-fade-in p-4" onClick={onClose}>
            <div className="w-full max-w-md" onClick={e => e.stopPropagation()}>
                <Card>
                    {renderContent()}
                </Card>
            </div>
        </div>
    );
};


const SubscriptionPage: React.FC = () => {
    const { user, updateUser } = useAuth();
    const isSubscribed = user?.isSubscribed ?? false;
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handlePaymentSuccess = () => {
        updateUser({ isSubscribed: true });
    };

    return (
        <div className="space-y-8">
            <Card>
                <h2 className="text-2xl font-bold mb-2">Manage Your Subscription</h2>
                <p className="text-gray-light mb-6">
                    You are currently on the <span className="font-bold text-accent">{isSubscribed ? 'Pro Plan' : 'Free Plan'}</span>.
                </p>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Free Plan */}
                <Card className={`border-2 ${!isSubscribed ? 'border-accent' : 'border-transparent dark:border-primary-light'}`}>
                    <h3 className="text-2xl font-bold mb-2">Free</h3>
                    <p className="text-gray-light mb-4">For individuals and small businesses getting started.</p>
                    <p className="text-4xl font-extrabold mb-6">$0<span className="text-lg font-medium text-gray-light">/month</span></p>
                    <ul className="space-y-3 text-gray-light mb-8">
                        <li className="flex items-center"><CheckCircleIcon className="w-5 h-5 text-green-400 mr-2" /> Global Payments</li>
                        <li className="flex items-center"><CheckCircleIcon className="w-5 h-5 text-green-400 mr-2" /> Currency Converter</li>
                        <li className="flex items-center"><CheckCircleIcon className="w-5 h-5 text-green-400 mr-2" /> API Access</li>
                        <li className="flex items-center"><CheckCircleIcon className="w-5 h-5 text-green-400 mr-2" /> 24/7 Support</li>
                    </ul>
                    <button
                        disabled
                        className="w-full bg-gray-600 text-white font-bold py-3 px-4 rounded hover:bg-gray-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {!isSubscribed ? 'Current Plan' : 'Downgrade (Unavailable)'}
                    </button>
                </Card>

                {/* Pro Plan */}
                <Card className={`relative overflow-hidden border-2 ${isSubscribed ? 'border-accent' : 'border-transparent dark:border-primary-light'}`}>
                    <div className="absolute top-0 right-0 bg-accent text-primary px-3 py-1 text-sm font-bold rounded-bl-lg">
                        <RocketIcon className="w-4 h-4 inline-block mr-1" />
                        Pro
                    </div>
                    <h3 className="text-2xl font-bold mb-2">Pro</h3>
                    <p className="text-gray-light mb-4">For growing businesses that need advanced tools.</p>
                    <p className="text-4xl font-extrabold mb-6">$29.99<span className="text-lg font-medium text-gray-light">/month</span></p>
                     <ul className="space-y-3 text-gray-light mb-8">
                        <li className="flex items-center"><CheckCircleIcon className="w-5 h-5 text-green-400 mr-2" /> <strong>Everything in Free, plus:</strong></li>
                        <li className="flex items-center"><CheckCircleIcon className="w-5 h-5 text-green-400 mr-2" /> Professional Invoicing</li>
                        <li className="flex items-center"><CheckCircleIcon className="w-5 h-5 text-green-400 mr-2" /> Full Accounting Suite</li>
                        <li className="flex items-center"><CheckCircleIcon className="w-5 h-5 text-green-400 mr-2" /> Automated Payroll</li>
                        <li className="flex items-center"><CheckCircleIcon className="w-5 h-5 text-green-400 mr-2" /> Advanced Reporting</li>
                    </ul>
                    <button
                         onClick={() => !isSubscribed && setIsModalOpen(true)}
                         disabled={isSubscribed}
                        className="w-full bg-accent text-primary font-bold py-3 px-4 rounded hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isSubscribed ? 'Current Plan' : 'Upgrade to Pro'}
                    </button>
                </Card>
            </div>
            {isModalOpen && <SubscriptionUpgradeModal onClose={() => setIsModalOpen(false)} onPaymentSuccess={handlePaymentSuccess} />}
        </div>
    );
};

export default SubscriptionPage;