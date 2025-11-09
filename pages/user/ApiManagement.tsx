import React, { useState } from 'react';
import Card from '../../components/common/Card';
import Spinner from '../../components/common/Spinner';

const ApiManagement: React.FC = () => {
    const [apiKey, setApiKey] = useState<string | null>('xel_sk_test_************************a1b2');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const generateNewKey = () => {
        // In a real app, this would be a secure, random string from the server.
        const newKey = `xel_sk_test_${[...Array(24)].map(() => Math.random().toString(36)[2]).join('')}${Math.random().toString(16).slice(10, 14)}`;
        setApiKey(newKey);
    };

    const handleSupportSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);
        setIsSuccess(false);
        // Simulate API call
        setTimeout(() => {
            setIsSubmitting(false);
            setIsSuccess(true);
            (e.target as HTMLFormElement).reset();
             setTimeout(() => setIsSuccess(false), 5000); // Reset success state after 5s
        }, 1500);
    }

    return (
        <div className="space-y-8">
            <Card>
                <h2 className="text-2xl font-bold mb-2">API Key & Webhooks</h2>
                <p className="text-gray-400 mb-6">Use your API key to integrate Xeloo's payment services into your application.</p>
                <div className="bg-primary p-4 rounded-lg">
                    {apiKey ? (
                        <>
                            <p className="text-gray-400 mb-2">Your secret API key:</p>
                            <p className="font-mono text-white bg-primary-light p-3 rounded-md break-all">{apiKey}</p>
                            <div className="flex space-x-4 mt-4">
                                <button onClick={generateNewKey} className="bg-gray-700 text-white font-bold py-2 px-4 rounded hover:bg-gray-600">Generate New Key</button>
                                <button onClick={() => setApiKey(null)} className="bg-red-800/50 text-red-300 font-bold py-2 px-4 rounded hover:bg-red-800/80">Revoke Key</button>
                            </div>
                        </>
                    ) : (
                         <div>
                            <p className="text-gray-400 mb-4">You do not have an active API key.</p>
                             <button onClick={generateNewKey} className="bg-accent text-primary font-bold py-2 px-4 rounded hover:opacity-90">Generate API Key</button>
                        </div>
                    )}
                </div>
            </Card>

            <Card>
                <h2 className="text-2xl font-bold mb-2">Developer Support</h2>
                <p className="text-gray-400 mb-6">Need help with your integration? Our developer success team is here to assist you.</p>
                
                <div className="flex space-x-4 mb-8">
                    <a href="#" className="font-semibold text-accent hover:underline">Read API Documentation</a>
                    <a href="#" className="font-semibold text-accent hover:underline">View System Status</a>
                </div>

                {isSuccess ? (
                    <div className="text-center p-4 bg-accent/10 text-accent rounded-md">
                        <p className="font-semibold">Your message has been sent!</p>
                        <p className="text-sm">Our support team will get back to you shortly.</p>
                    </div>
                ) : (
                    <form onSubmit={handleSupportSubmit} className="space-y-4">
                        <div>
                             <label htmlFor="subject" className="block text-sm font-medium text-gray-400 mb-1">Subject</label>
                             <input id="subject" type="text" placeholder="e.g., Webhook setup question" required className="w-full bg-primary p-2 rounded border border-primary-light" />
                        </div>
                        <div>
                             <label htmlFor="message" className="block text-sm font-medium text-gray-400 mb-1">Message</label>
                            <textarea id="message" rows={5} placeholder="Describe your issue or question in detail..." required className="w-full bg-primary p-2 rounded border border-primary-light"></textarea>
                        </div>
                        <div className="flex justify-end">
                            <button type="submit" disabled={isSubmitting} className="w-48 bg-accent text-primary font-bold py-2.5 px-4 rounded hover:opacity-90 flex items-center justify-center disabled:bg-gray-500">
                                {isSubmitting ? <Spinner /> : 'Contact Support'}
                            </button>
                        </div>
                    </form>
                )}
            </Card>
        </div>
    );
};

export default ApiManagement;