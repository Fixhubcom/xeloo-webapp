
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from '../components/common/Logo';
import Card from '../components/common/Card';
import { ArrowRightIcon } from '../components/icons/Icons';

const ResourcesPage: React.FC = () => {
    const navigate = useNavigate();

    const resources = [
        { title: 'The Ultimate Guide to Cross-Border Payments for Small Businesses', category: 'Guide', link: '#' },
        { title: 'Case Study: How Acme Inc. Reduced Transfer Fees by 80%', category: 'Case Study', link: '#' },
        { title: '5 Common Mistakes to Avoid When Paying International Freelancers', category: 'Article', link: '#' },
        { title: 'Understanding KYC and AML in the Digital Age', category: 'White Paper', link: '#' },
        { title: 'Xeloo Product Update: AI-Powered Accounting is Here', category: 'Product Update', link: '#' },
        { title: 'Case Study: Scaling a Global Marketplace with Xeloo\'s API', category: 'Case Study', link: '#' },
    ];

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
                    <h1 className="text-4xl font-bold mb-4 text-center text-accent">Resources</h1>
                    <p className="text-lg text-center text-gray-300 mb-12">
                        Insights, guides, and stories to help you navigate the world of global finance.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {resources.map((resource, index) => (
                             <Card key={index} className="flex flex-col justify-between hover:border-accent transition-colors">
                                <div>
                                    <p className="text-sm font-bold text-accent mb-2">{resource.category}</p>
                                    <h2 className="text-xl font-bold text-white mb-4">{resource.title}</h2>
                                </div>
                                <a href={resource.link} className="flex items-center font-semibold text-accent mt-4">
                                    Read More <ArrowRightIcon className="w-4 h-4 ml-2" />
                                </a>
                            </Card>
                        ))}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default ResourcesPage;
