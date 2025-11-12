import React, { useState } from 'react';
import Card from '../../components/common/Card';
import Spinner from '../../components/common/Spinner';

type SettingsTab = 'Platform' | 'Notifications' | 'Integrations';
type TemplateName = 'Welcome Email' | 'Payment Confirmation' | 'Password Reset';

const MOCK_TEMPLATES: { [key in TemplateName]: string } = {
    'Welcome Email': "<h1>Welcome to Xeloo, {{userName}}!</h1>\n<p>We're excited to have you on board.</p>",
    'Payment Confirmation': "<h1>Your payment has been sent!</h1>\n<p>Transaction ID: {{transactionId}}</p>",
    'Password Reset': "<h1>Password Reset Request</h1>\n<p>Click the link below to reset your password. If you did not request this, please ignore this email.</p>",
};


const EditTemplateModal: React.FC<{
    templateName: TemplateName;
    onClose: () => void;
}> = ({ templateName, onClose }) => {
    const [content, setContent] = useState(MOCK_TEMPLATES[templateName]);
    const [isSaving, setIsSaving] = useState(false);

    const handleSave = () => {
        setIsSaving(true);
        // Simulate saving
        setTimeout(() => {
            console.log(`Saving template "${templateName}":`, content);
            MOCK_TEMPLATES[templateName] = content; // "Save" to mock object
            setIsSaving(false);
            onClose();
        }, 1000);
    };

    return (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 animate-fade-in p-4">
            <Card className="w-full max-w-3xl" onClick={e => e.stopPropagation()}>
                <h2 className="text-2xl font-bold mb-4">Edit Template: <span className="text-accent">{templateName}</span></h2>
                {/* FIX: The JSX parser was misinterpreting the backticks, causing it to treat the variables inside as code. Replaced with single quotes to ensure it's parsed as plain text. */}
                <p className="text-sm text-gray-400 mb-4">You can use variables like '{{userName}}', '{{transactionId}}', etc. based on the template context.</p>
                <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="w-full h-80 bg-primary font-mono text-sm p-3 rounded border border-primary-light focus:ring-accent focus:border-accent"
                />
                <div className="flex justify-end space-x-4 mt-6">
                    <button onClick={onClose} className="bg-gray-700 text-white font-bold py-2 px-6 rounded hover:bg-gray-600">Cancel</button>
                    <button onClick={handleSave} disabled={isSaving} className="bg-accent text-primary font-bold py-2 px-6 rounded hover:opacity-90 flex items-center justify-center w-32">
                        {isSaving ? <Spinner /> : 'Save'}
                    </button>
                </div>
            </Card>
        </div>
    );
};


const AdminSettings: React.FC = () => {
    const [activeTab, setActiveTab] = useState<SettingsTab>('Platform');
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingTemplate, setEditingTemplate] = useState<TemplateName | null>(null);

    const handleEditClick = (templateName: TemplateName) => {
        setEditingTemplate(templateName);
        setIsEditModalOpen(true);
    };

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
                                    <input type="number" defaultValue="0.09" step="0.01" className="w-full bg-primary p-2 rounded border border-primary-light mt-1" />
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
                                <button onClick={() => handleEditClick('Welcome Email')} className="font-medium text-accent hover:underline text-sm">Edit Template</button>
                            </div>
                            <div className="flex justify-between items-center p-3 bg-primary rounded-md">
                                <span>Payment Confirmation</span>
                                <button onClick={() => handleEditClick('Payment Confirmation')} className="font-medium text-accent hover:underline text-sm">Edit Template</button>
                            </div>
                            <div className="flex justify-between items-center p-3 bg-primary rounded-md">
                                <span>Password Reset</span>
                                <button onClick={() => handleEditClick('Password Reset')} className="font-medium text-accent hover:underline text-sm">Edit Template</button>
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
            {isEditModalOpen && editingTemplate && (
                <EditTemplateModal 
                    templateName={editingTemplate}
                    onClose={() => setIsEditModalOpen(false)}
                />
            )}
        </Card>
    );
};

export default AdminSettings;