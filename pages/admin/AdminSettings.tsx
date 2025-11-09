
import React, { useState } from 'react';
import Card from '../../components/common/Card';

type SettingsTab = 'Platform' | 'Notifications' | 'Integrations';

const AdminSettings: React.FC = () => {
    const [activeTab, setActiveTab] = useState<SettingsTab>('Platform');

    const renderTabContent = () => {
        switch (activeTab) {
            case 'Platform':
                return (
                    <div className="space-y-6">
                        <div>
                            <h3 className="text-lg font-semibold text-white">Fee Structure</h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
                                <div>
                                    <label className="text-sm text-gray-400">Cross-Border Transfer Fee (%)</label>
                                    <input type="number" defaultValue="1.5" step="0.01" className="w-full bg-primary p-2 rounded border border-primary-light mt-1" />
                                </div>
                                <div>
                                    <label className="text-sm text-gray-400">FX Spread (%)</label>
                                    <input type="number" defaultValue="0.05" step="0.01" className="w-full bg-primary p-2 rounded border border-primary-light mt-1" />
                                </div>
                                <div>
                                    <label className="text-sm text-gray-400">Merchant Listing Fee (fixed USD)</label>
                                    <input type="number" defaultValue="5.00" step="0.01" className="w-full bg-primary p-2 rounded border border-primary-light mt-1" />
                                </div>
                            </div>
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-white">Transaction Limits</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                                <div>
                                    <label className="text-sm text-gray-400">Max Daily Transfer (USD)</label>
                                    <input type="number" defaultValue="10000" className="w-full bg-primary p-2 rounded border border-primary-light mt-1" />
                                </div>
                                <div>
                                    <label className="text-sm text-gray-400">Max Single Transaction (USD)</label>
                                    <input type="number" defaultValue="5000" className="w-full bg-primary p-2 rounded border border-primary-light mt-1" />
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-end">
                            <button className="bg-accent text-primary font-bold py-2 px-6 rounded hover:opacity-90">Save Platform Settings</button>
                        </div>
                    </div>
                );
            case 'Notifications':
                return (
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-white">Email Notification Templates</h3>
                        <p className="text-gray-400 text-sm">Manage the content of automated emails sent to users.</p>
                        <div className="space-y-3">
                            <div className="flex justify-between items-center p-3 bg-primary rounded-md">
                                <span>Welcome Email</span>
                                <button className="font-medium text-accent hover:underline text-sm">Edit Template</button>
                            </div>
                            <div className="flex justify-between items-center p-3 bg-primary rounded-md">
                                <span>Payment Confirmation</span>
                                <button className="font-medium text-accent hover:underline text-sm">Edit Template</button>
                            </div>
                            <div className="flex justify-between items-center p-3 bg-primary rounded-md">
                                <span>Password Reset</span>
                                <button className="font-medium text-accent hover:underline text-sm">Edit Template</button>
                            </div>
                        </div>
                    </div>
                );
            case 'Integrations':
                return (
                    <div className="space-y-6">
                        <div>
                            <h3 className="text-lg font-semibold text-white">KYC/KYB Provider</h3>
                            <p className="text-gray-400 text-sm mt-1">Configure your third-party identity verification service.</p>
                            <div className="mt-2">
                                <label className="text-sm text-gray-400">Provider API Key</label>
                                <input type="password" placeholder="**************" className="w-full bg-primary p-2 rounded border border-primary-light mt-1" />
                            </div>
                        </div>
                         <div>
                            <h3 className="text-lg font-semibold text-white">Blockchain Explorer API</h3>
                            <p className="text-gray-400 text-sm mt-1">API key for services like Hedera's explorer to fetch transaction data.</p>
                             <div className="mt-2">
                                <label className="text-sm text-gray-400">Explorer API Key</label>
                                <input type="password" placeholder="**************" className="w-full bg-primary p-2 rounded border border-primary-light mt-1" />
                            </div>
                        </div>
                        <div className="flex justify-end">
                            <button className="bg-accent text-primary font-bold py-2 px-6 rounded hover:opacity-90">Save Integration Settings</button>
                        </div>
                    </div>
                );
        }
    };
    
    return (
        <Card>
            <h2 className="text-2xl font-bold mb-6">Platform Settings</h2>
            <div className="flex space-x-2 p-1 bg-primary rounded-lg mb-6">
                {(['Platform', 'Notifications', 'Integrations'] as SettingsTab[]).map(tab => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`w-full text-center px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === tab ? 'bg-accent text-primary' : 'text-gray-400 hover:bg-primary-light'}`}
                    >
                        {tab}
                    </button>
                ))}
            </div>
            <div>
                {renderTabContent()}
            </div>
        </Card>
    );
};

export default AdminSettings;
