
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from '../components/common/Logo';
import { GlobeIcon, PayrollIcon, CodeIcon, ShieldCheckIcon } from '../components/icons/Icons';

const OurServicesPage: React.FC = () => {
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
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-4xl font-bold mb-4 text-center text-accent">Our Services</h1>
                    <p className="text-lg text-center text-gray-300 mb-12">
                        A comprehensive suite of financial tools designed to power your global business operations.
                    </p>

                    <div className="space-y-10">
                        <div className="flex flex-col md:flex-row items-center gap-8 bg-primary-light p-8 rounded-lg">
                            <div className="text-accent bg-accent/10 p-4 rounded-full">
                                <GlobeIcon className="w-12 h-12" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold mb-2">Cross-Border Payments</h2>
                                <p className="text-gray-300">
                                    Send and receive money internationally with unparalleled speed, transparency, and low costs. Settle payments in seconds, not days, and watch your business grow without borders.
                                </p>
                            </div>
                        </div>

                         <div className="flex flex-col md:flex-row-reverse items-center gap-8 bg-primary-light p-8 rounded-lg">
                             <div className="text-accent bg-accent/10 p-4 rounded-full">
                                <PayrollIcon className="w-12 h-12" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold mb-2">Global Payroll & Invoicing</h2>
                                <p className="text-gray-300">
                                    Pay your international team, freelancers, and contractors in their local currencies. Create and manage professional invoices to get paid faster. Automate your financial workflows and focus on what you do best.
                                </p>
                            </div>
                        </div>

                        <div className="flex flex-col md:flex-row items-center gap-8 bg-primary-light p-8 rounded-lg">
                             <div className="text-accent bg-accent/10 p-4 rounded-full">
                                <CodeIcon className="w-12 h-12" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold mb-2">Developer API</h2>
                                <p className="text-gray-300">
                                    Integrate our powerful payment infrastructure directly into your application. Our RESTful API allows you to automate payouts, accept payments, and build custom financial solutions.
                                </p>
                            </div>
                        </div>
                        
                        <div className="flex flex-col md:flex-row-reverse items-center gap-8 bg-primary-light p-8 rounded-lg">
                             <div className="text-accent bg-accent/10 p-4 rounded-full">
                                <ShieldCheckIcon className="w-12 h-12" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold mb-2">AI-Powered Security & Compliance</h2>
                                <p className="text-gray-300">
                                   Operate with confidence. Our platform uses AI for advanced fraud detection and automated KYB/AML checks, ensuring your transactions are secure and compliant with global regulations.
                                </p>
                            </div>
                        </div>

                    </div>
                </div>
            </main>
        </div>
    );
};

export default OurServicesPage;
