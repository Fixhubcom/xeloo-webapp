
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from '../components/common/Logo';
import Card from '../components/common/Card';
import { CodeIcon } from '../components/icons/Icons';

const ApiPage: React.FC = () => {
    const navigate = useNavigate();

    const codeSnippet = `
const xeloo = require('xeloo-node');
const client = xeloo('YOUR_SECRET_KEY');

async function makePayment() {
  try {
    const payment = await client.payments.create({
      amount: 50000, // in cents
      currency: 'usd',
      destination: 'acct_12345',
      description: 'Payment for INV-001'
    });
    console.log('Payment successful:', payment.id);
  } catch (error) {
    console.error('Payment failed:', error.message);
  }
}

makePayment();
    `;

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
                    <div className="text-center mb-12">
                        <div className="inline-block bg-accent/10 text-accent p-4 rounded-full mb-4">
                            <CodeIcon className="w-12 h-12" />
                        </div>
                        <h1 className="text-4xl font-bold text-accent">Developer API</h1>
                        <p className="text-lg text-gray-300 mt-2">Integrate Xeloo's global payment infrastructure into your application.</p>
                    </div>

                    <Card className="mb-8">
                        <h2 className="text-2xl font-bold mb-3">Powerful, Simple, and Secure</h2>
                        <p className="text-gray-300">
                            Our RESTful API provides a straightforward way to harness the power of Xeloo. Whether you're building an e-commerce platform, a marketplace, or a SaaS application, our API lets you automate payouts, accept payments, and manage your financial operations programmatically.
                        </p>
                    </Card>

                    <Card>
                        <h2 className="text-2xl font-bold mb-4">Getting Started</h2>
                        <p className="text-gray-300 mb-4">
                            Start building in minutes. Check out our comprehensive documentation and use our client libraries for a quick integration. Here's a quick example using our Node.js library:
                        </p>
                        <div className="bg-gray-900 rounded-lg p-4 font-mono text-sm text-gray-200 overflow-x-auto">
                            <pre><code>{codeSnippet.trim()}</code></pre>
                        </div>
                         <div className="mt-6 flex flex-col sm:flex-row gap-4">
                            <button className="bg-accent text-primary font-bold py-2 px-6 rounded-lg hover:opacity-90">
                                Read Full Documentation
                            </button>
                             <button onClick={() => navigate('/onboarding')} className="border border-accent text-accent font-bold py-2 px-6 rounded-lg hover:bg-accent hover:text-primary transition-colors">
                                Get Your API Keys
                            </button>
                        </div>
                    </Card>
                </div>
            </main>
        </div>
    );
};

export default ApiPage;
