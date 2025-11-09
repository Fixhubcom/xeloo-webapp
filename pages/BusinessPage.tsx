
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from '../components/common/Logo';
import { BriefcaseIcon, GlobeIcon, PayrollIcon, ShoppingBagIcon } from '../components/icons/Icons';

const BusinessPage: React.FC = () => {
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
                    <h1 className="text-4xl font-bold mb-4 text-center text-accent">Xeloo for Business</h1>
                    <p className="text-lg text-center text-gray-300 mb-12">
                        Empower your global operations with our suite of financial tools designed for businesses of all sizes. From startups to enterprises, Xeloo simplifies international payments, payroll, and more.
                    </p>

                    <div className="space-y-10">
                        <div className="flex flex-col md:flex-row items-center gap-8 bg-primary-light p-8 rounded-lg">
                            <div className="text-accent bg-accent/10 p-4 rounded-full">
                                <PayrollIcon className="w-12 h-12" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold mb-2">Global Payroll</h2>
                                <p className="text-gray-300">
                                    Pay your international team, freelancers, and contractors in their local currencies without the hassle of traditional banking. Our platform automates payroll runs, ensuring timely and accurate payments every time.
                                </p>
                            </div>
                        </div>

                        <div className="flex flex-col md:flex-row-reverse items-center gap-8 bg-primary-light p-8 rounded-lg">
                             <div className="text-accent bg-accent/10 p-4 rounded-full">
                                <BriefcaseIcon className="w-12 h-12" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold mb-2">Supplier & Vendor Payments</h2>
                                <p className="text-gray-300">
                                    Settle invoices with suppliers and vendors across the globe in seconds, not days. Lock in exchange rates and reduce the costs associated with international trade, improving your cash flow and supplier relationships.
                                </p>
                            </div>
                        </div>

                        <div className="flex flex-col md:flex-row items-center gap-8 bg-primary-light p-8 rounded-lg">
                             <div className="text-accent bg-accent/10 p-4 rounded-full">
                                <ShoppingBagIcon className="w-12 h-12" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold mb-2">E-commerce & Marketplace Payouts</h2>
                                <p className="text-gray-300">
                                    Whether you run an online store or a marketplace, Xeloo makes it easy to pay your sellers and affiliates worldwide. Integrate our API to automate mass payouts and scale your business globally.
                                </p>
                            </div>
                        </div>
                        
                        <div className="flex flex-col md:flex-row-reverse items-center gap-8 bg-primary-light p-8 rounded-lg">
                             <div className="text-accent bg-accent/10 p-4 rounded-full">
                                <GlobeIcon className="w-12 h-12" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold mb-2">Enterprise Solutions</h2>
                                <p className="text-gray-300">
                                   For large-scale operations, we offer custom integrations, dedicated account management, and enhanced security features. Contact our sales team to build a solution tailored to your enterprise needs.
                                </p>
                            </div>
                        </div>

                    </div>
                </div>
            </main>
        </div>
    );
};

export default BusinessPage;
