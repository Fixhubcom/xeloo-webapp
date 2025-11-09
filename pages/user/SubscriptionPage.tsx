
import React from 'react';
import Card from '../../components/common/Card';
import { useAuth } from '../../hooks/useAuth';
import { CheckCircleIcon, RocketIcon } from '../../components/icons/Icons';

const SubscriptionPage: React.FC = () => {
    const { user } = useAuth();
    const isSubscribed = user?.isSubscribed ?? false;

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
                        disabled={!isSubscribed}
                        className="w-full bg-gray-600 text-white font-bold py-3 px-4 rounded hover:bg-gray-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {!isSubscribed ? 'Current Plan' : 'Downgrade'}
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
                         disabled={isSubscribed}
                        className="w-full bg-accent text-primary font-bold py-3 px-4 rounded hover:bg-yellow-400 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isSubscribed ? 'Current Plan' : 'Upgrade to Pro'}
                    </button>
                </Card>
            </div>
        </div>
    );
};

export default SubscriptionPage;
