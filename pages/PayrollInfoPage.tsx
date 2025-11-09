
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from '../components/common/Logo';
import Card from '../components/common/Card';
import { PayrollIcon, CheckCircleIcon } from '../components/icons/Icons';

const PayrollInfoPage: React.FC = () => {
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
                        <PayrollIcon className="w-12 h-12" />
                    </div>
                    <h1 className="text-4xl font-bold mb-4 text-accent">Global Payroll, Simplified</h1>
                    <p className="text-lg text-gray-300 mb-12">
                        Pay your international team with ease. Handle salaries, and contractor payments in local currencies, all from one platform.
                    </p>
                </div>

                <Card className="mb-8">
                    <h2 className="text-2xl font-bold mb-3">Why Choose Xeloo for Payroll?</h2>
                    <p className="text-gray-300 mb-6">
                        Managing a global workforce comes with challenges. Traditional payroll systems are often slow, expensive, and complex when dealing with multiple currencies and countries. Xeloo's payroll solution is built for the modern, remote-first world.
                    </p>
                    <ul className="space-y-3">
                        <li className="flex items-start"><CheckCircleIcon className="w-5 h-5 text-accent mr-3 mt-1 flex-shrink-0" /><span><strong>Multi-Currency Payouts:</strong> Pay your team in their preferred local currency without worrying about conversions.</span></li>
                        <li className="flex items-start"><CheckCircleIcon className="w-5 h-5 text-accent mr-3 mt-1 flex-shrink-0" /><span><strong>Automated Payroll Runs:</strong> Set up recurring payment schedules (weekly, bi-weekly, monthly) and let Xeloo handle the rest.</span></li>
                        <li className="flex items-start"><CheckCircleIcon className="w-5 h-5 text-accent mr-3 mt-1 flex-shrink-0" /><span><strong>Cost-Effective:</strong> Avoid exorbitant bank fees and poor exchange rates. Our transparent pricing saves you money on every payroll run.</span></li>
                         <li className="flex items-start"><CheckCircleIcon className="w-5 h-5 text-accent mr-3 mt-1 flex-shrink-0" /><span><strong>Full Integration:</strong> Xeloo Payroll is part of our Pro subscription, fully integrated with our accounting and invoicing tools for seamless financial management.</span></li>
                    </ul>
                </Card>

                <div className="text-center mt-12">
                    <button onClick={() => navigate('/onboarding')} className="bg-accent text-primary font-bold py-3 px-8 rounded-lg text-lg hover:opacity-90">
                        Streamline Your Payroll Today
                    </button>
                </div>
            </main>
        </div>
    );
};

export default PayrollInfoPage;
