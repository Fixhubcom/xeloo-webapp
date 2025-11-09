
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from '../components/common/Logo';
import Card from '../components/common/Card';
import { GlobeIcon, RocketIcon, PercentIcon } from '../components/icons/Icons';

const CrossBorderPage: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="bg-primary text-white min-h-screen">
            <header className="py-4 px-8 bg-primary-light shadow-md">
                <div className="container mx-auto flex justify-between items-center">
                    <Logo className="text-3xl" />
                    <button onClick={() => navigate('/')} className="text-accent font-medium hover:underline">
                        &larr; Back to Home
                    </button>
                </div>
            </header>

            <main className="container mx-auto py-12 px-4 md:px-8">
                <div className="max-w-4xl mx-auto text-center">
                    <div className="inline-block bg-accent/10 text-accent p-4 rounded-full mb-4">
                        <GlobeIcon className="w-12 h-12" />
                    </div>
                    <h1 className="text-4xl font-bold mb-4 text-accent">Borderless Payments, Reimagined</h1>
                    <p className="text-lg text-gray-300 mb-12">
                        Send and receive funds globally with the speed, transparency, and low cost that your business deserves.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center mb-12">
                    <Card>
                        <RocketIcon className="w-10 h-10 text-accent mx-auto mb-3" />
                        <h3 className="text-xl font-bold">Instant Settlement</h3>
                        <p className="text-gray-300 mt-2">Funds arrive in the recipient's local bank account in seconds, not days.</p>
                    </Card>
                    <Card>
                        <PercentIcon className="w-10 h-10 text-accent mx-auto mb-3" />
                        <h3 className="text-xl font-bold">Transparent Low Fees</h3>
                        <p className="text-gray-300 mt-2">A flat 1.5% fee on all transactions. No hidden charges, no surprises.</p>
                    </Card>
                    <Card>
                        <GlobeIcon className="w-10 h-10 text-accent mx-auto mb-3" />
                        <h3 className="text-xl font-bold">Multi-Currency Support</h3>
                        <p className="text-gray-300 mt-2">Pay and get paid in dozens of local currencies around the world.</p>
                    </Card>
                </div>
                
                <Card>
                    <h2 className="text-2xl font-bold mb-3 text-center">How It Works</h2>
                    <div className="flex flex-col md:flex-row justify-around items-center text-center mt-6">
                        <div><p className="text-xl font-bold mb-2">1. Fund Your Wallet</p><p className="text-sm">Initiate a transfer from your local bank account.</p></div>
                        <div className="text-accent my-4 md:my-0 text-2xl">&rarr;</div>
                        <div><p className="text-xl font-bold mb-2">2. Xeloo Converts</p><p className="text-sm">We handle the currency conversion instantly at the best rates.</p></div>
                        <div className="text-accent my-4 md:my-0 text-2xl">&rarr;</div>
                        <div><p className="text-xl font-bold mb-2">3. Instant Payout</p><p className="text-sm">Funds are settled directly into the recipient's local bank account.</p></div>
                    </div>
                </Card>

                <div className="text-center mt-12">
                     <button onClick={() => navigate('/onboarding')} className="bg-accent text-primary font-bold py-3 px-8 rounded-lg text-lg hover:opacity-90">
                        Start Sending Money
                    </button>
                </div>
            </main>
        </div>
    );
};

export default CrossBorderPage;
