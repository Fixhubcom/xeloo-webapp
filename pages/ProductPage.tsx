
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from '../components/common/Logo';
import { CheckCircleIcon } from '../components/icons/Icons';
import Card from '../components/common/Card';

const ProductPage: React.FC = () => {
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
                    <h1 className="text-4xl font-bold mb-4 text-center text-accent">The Xeloo Product Suite</h1>
                    <p className="text-lg text-center text-gray-300 mb-12">
                        An integrated platform of financial tools to help you operate and grow your business globally.
                    </p>

                    <div className="space-y-8">
                        <Card>
                            <h2 className="text-2xl font-bold mb-3">Cross-Border Payments</h2>
                            <p className="text-gray-300 mb-4">The core of our platform. Send and receive money internationally with unparalleled speed and transparency.</p>
                            <ul className="space-y-2">
                                <li className="flex items-center"><CheckCircleIcon className="w-5 h-5 text-accent mr-3" />Instant settlement in local currencies.</li>
                                <li className="flex items-center"><CheckCircleIcon className="w-5 h-5 text-accent mr-3" />Flat 1.5% transaction fee, no hidden charges.</li>
                                <li className="flex items-center"><CheckCircleIcon className="w-5 h-5 text-accent mr-3" />Real-time exchange rate tracking.</li>
                            </ul>
                        </Card>
                        
                        <Card>
                            <h2 className="text-2xl font-bold mb-3">AI-Powered Platform</h2>
                            <p className="text-gray-300 mb-4">Leverage the power of artificial intelligence for a smarter, safer financial experience.</p>
                            <ul className="space-y-2">
                                <li className="flex items-center"><CheckCircleIcon className="w-5 h-5 text-accent mr-3" />Automated KYB/AML checks for fast, compliant onboarding.</li>
                                <li className="flex items-center"><CheckCircleIcon className="w-5 h-5 text-accent mr-3" />Advanced fraud detection to protect every transaction.</li>
                                <li className="flex items-center"><CheckCircleIcon className="w-5 h-5 text-accent mr-3" />AI Accounting Assistant to automate your bookkeeping.</li>
                            </ul>
                        </Card>

                        <Card>
                            <h2 className="text-2xl font-bold mb-3">Invoicing & Payroll (Pro Plan)</h2>
                            <p className="text-gray-300 mb-4">Streamline your administrative tasks with our integrated tools, available on our Pro plan.</p>
                            <ul className="space-y-2">
                                <li className="flex items-center"><CheckCircleIcon className="w-5 h-5 text-accent mr-3" />Create and send professional invoices.</li>
                                <li className="flex items-center"><CheckCircleIcon className="w-5 h-5 text-accent mr-3" />Set up recurring payments and automated payroll runs.</li>
                                <li className="flex items-center"><CheckCircleIcon className="w-5 h-5 text-accent mr-3" />Track payment statuses and manage your cash flow.</li>
                            </ul>
                        </Card>
                        
                        <Card>
                            <h2 className="text-2xl font-bold mb-3">Developer API</h2>
                            <p className="text-gray-300 mb-4">Integrate Xeloo's powerful payment infrastructure directly into your applications.</p>
                            <ul className="space-y-2">
                                <li className="flex items-center"><CheckCircleIcon className="w-5 h-5 text-accent mr-3" />RESTful API for easy integration.</li>
                                <li className="flex items-center"><CheckCircleIcon className="w-5 h-5 text-accent mr-3" />Automate payouts, accept payments, and manage users.</li>
                                <li className="flex items-center"><CheckCircleIcon className="w-5 h-5 text-accent mr-3" />Comprehensive documentation and developer support.</li>
                            </ul>
                        </Card>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default ProductPage;
