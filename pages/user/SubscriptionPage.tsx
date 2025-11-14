import React, { useState } from 'react';
import Card from '../../components/common/Card';
import { useAuth } from '../../hooks/useAuth';
import { CheckCircleIcon, RocketIcon, CreditCardIcon } from '../../components/icons/Icons';
import Spinner from '../../components/common/Spinner';

const SubscriptionPaymentModal: React.FC<{ onClose: () => void; onPaymentSuccess: () => void; }> = ({ onClose, onPaymentSuccess }) => {
    const [isProcessing, setIsProcessing] = useState(false);

    const handlePayment = (e: React.FormEvent) => {
        e.preventDefault();
        setIsProcessing(true);
        // Simulate API call
        setTimeout(() => {
            onPaymentSuccess();
            setIsProcessing(false);
            onClose();
        }, 2000);
    };

    return (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 animate-fade-in p-4" onClick={onClose}>
            <div className="w-full max-w-md" onClick={e => e.stopPropagation()}>
                <Card>
                    <h2 className="text-2xl font-bold text-white mb-2">Upgrade to Pro Plan</h2>
                    <p className="text-gray-300 mb-6">You will be charged $29.99 per month.</p>
                    <form onSubmit={handlePayment} className="space-y-4">
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
                             <button
                                type="submit"
                                disabled={isProcessing}
                                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-bold text-primary bg-accent hover:opacity-90 disabled:bg-gray-500"
                            >
                                {isProcessing ? <Spinner /> : 'Confirm Payment ($29.99)'}
                            </button>
                        </div>
                    </form>
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
                    <p className="text-4xl font-extrabold mb-6">$29<span className="text-lg font-medium text-gray-light">/month</span></p>
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
            {isModalOpen && <SubscriptionPaymentModal onClose={() => setIsModalOpen(false)} onPaymentSuccess={handlePaymentSuccess} />}
        </div>
    );
};

export default SubscriptionPage;