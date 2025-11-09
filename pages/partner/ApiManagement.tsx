
import React, { useState } from 'react';
import Card from '../../components/common/Card';

const ApiManagement: React.FC = () => {
    const [apiKey] = useState<string>('xel_pk_live_************************3c4d');
    const [webhookUrl, setWebhookUrl] = useState('https://api.yourcompany.com/webhooks/xeloo');
    
    const webhookEvents = [
        { id: 'payment.successful', label: 'Payment Successful' },
        { id: 'payment.failed', label: 'Payment Failed' },
        { id: 'payout.initiated', label: 'Payout Initiated' },
        { id: 'payout.completed', label: 'Payout Completed' },
    ];

    return (
        <div className="space-y-8">
            <Card>
                <h2 className="text-2xl font-bold mb-2">API Keys</h2>
                <p className="text-gray-light mb-6">Use your API keys to authenticate requests to the Xeloo API.</p>
                <div className="bg-primary p-4 rounded-lg space-y-4">
                    <div>
                        <p className="text-gray-light mb-1 text-sm">Publishable Key:</p>
                        <p className="font-mono text-white bg-gray-dark p-3 rounded-md break-all">{apiKey}</p>
                    </div>
                     <div>
                        <p className="text-gray-light mb-1 text-sm">Secret Key:</p>
                        <p className="font-mono text-white bg-gray-dark p-3 rounded-md break-all">Click to reveal</p>
                    </div>
                </div>
            </Card>
            <Card>
                <h2 className="text-2xl font-bold mb-2">Webhook Configuration</h2>
                <p className="text-gray-light mb-6">Configure a webhook endpoint to receive real-time notifications about events.</p>
                <div className="space-y-6">
                    <div>
                        <label htmlFor="webhookUrl" className="block text-sm font-medium text-gray-light mb-1">Endpoint URL</label>
                        <input id="webhookUrl" type="url" value={webhookUrl} onChange={e => setWebhookUrl(e.target.value)} className="w-full bg-gray-dark p-2 rounded border border-gray-medium" />
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-white mb-2">Events to send</h3>
                        <div className="grid grid-cols-2 gap-4">
                            {webhookEvents.map(event => (
                                <div key={event.id} className="flex items-center">
                                    <input id={event.id} type="checkbox" defaultChecked className="h-4 w-4 rounded border-gray-300 text-accent focus:ring-accent" />
                                    <label htmlFor={event.id} className="ml-3 block text-sm text-gray-light">{event.label}</label>
                                </div>
                            ))}
                        </div>
                    </div>
                     <div className="flex justify-end">
                        <button className="bg-accent text-primary font-bold py-2 px-6 rounded hover:bg-yellow-400">Save Webhook</button>
                    </div>
                </div>
            </Card>
        </div>
    );
};

export default ApiManagement;
