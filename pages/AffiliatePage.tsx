
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from '../components/common/Logo';
import Card from '../components/common/Card';
import { PercentIcon } from '../components/icons/Icons';

const AffiliatePage: React.FC = () => {
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
                        <PercentIcon className="w-12 h-12" />
                    </div>
                    <h1 className="text-4xl font-bold mb-4 text-accent">Join the Xeloo Affiliate Program</h1>
                    <p className="text-lg text-gray-300 mb-12">
                        Partner with us and earn recurring commissions by referring new users to the Xeloo platform.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center mb-12">
                    <Card>
                        <h3 className="text-xl font-bold">Generous Commissions</h3>
                        <p className="text-gray-300 mt-2">Earn up to 20% recurring commission on every transaction fee from your referrals.</p>
                    </Card>
                    <Card>
                        <h3 className="text-xl font-bold">90-Day Cookie Life</h3>
                        <p className="text-gray-300 mt-2">Get credited for any new user who signs up within 90 days of using your referral link.</p>
                    </Card>
                    <Card>
                        <h3 className="text-xl font-bold">Dedicated Support</h3>
                        <p className="text-gray-300 mt-2">Access to marketing materials and a dedicated affiliate manager to help you succeed.</p>
                    </Card>
                </div>

                <Card>
                    <h2 className="text-2xl font-bold mb-3 text-center">How It Works</h2>
                    <div className="flex flex-col md:flex-row justify-around items-center text-center mt-6">
                        <div><p className="text-2xl font-bold text-accent mb-2">1. Sign Up</p><p>Join our program in minutes.</p></div>
                        <div className="text-accent my-4 md:my-0 text-2xl">&rarr;</div>
                        <div><p className="text-2xl font-bold text-accent mb-2">2. Share</p><p>Promote Xeloo with your link.</p></div>
                        <div className="text-accent my-4 md:my-0 text-2xl">&rarr;</div>
                        <div><p className="text-2xl font-bold text-accent mb-2">3. Earn</p><p>Get paid for every new customer.</p></div>
                    </div>
                </Card>
                
                <div className="text-center mt-12">
                    <button onClick={() => navigate('/onboarding')} className="bg-accent text-primary font-bold py-3 px-8 rounded-lg text-lg hover:opacity-90">
                        Become an Affiliate Today
                    </button>
                </div>
            </main>
        </div>
    );
};

export default AffiliatePage;
