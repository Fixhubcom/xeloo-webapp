import React, { useState } from 'react';
import Card from '../../components/common/Card';
import { BankAccount } from '../../types';
import PasswordStrengthIndicator from '../../components/common/PasswordStrengthIndicator';

const mockBankAccounts: BankAccount[] = [
    { id: 'acc_merc_1', bankName: 'GTBank', accountNumber: '**** **** **** 1111', country: 'Nigeria', currency: 'NGN', isDefault: true },
    { id: 'acc_merc_2', bankName: 'Bank of America', accountNumber: '**** **** **** 2222', country: 'USA', currency: 'USD' },
];

type SettingsTab = 'Profile' | 'Payout Accounts' | 'Security' | 'Notifications';

const MerchantSettings: React.FC = () => {
    const [activeTab, setActiveTab] = useState<SettingsTab>('Payout Accounts');
    const [bankAccounts, setBankAccounts] = useState<BankAccount[]>(mockBankAccounts);
    const [showAddAccountForm, setShowAddAccountForm] = useState(false);
    const [newPassword, setNewPassword] = useState('');
    const [is2FAEnabled, setIs2FAEnabled] = useState(false);

    const handleAddAccount = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = new FormData(e.currentTarget);
        const newAccount: BankAccount = {
            id: `acc_merc_${Date.now()}`,
            bankName: form.get('bankName') as string,
            accountNumber: `**** **** **** ${ (form.get('accountNumber') as string).slice(-4)}`,
            country: form.get('country') as string,
            currency: form.get('currency') as string,
        };
        setBankAccounts(prev => [...prev, newAccount]);
        setShowAddAccountForm(false);
        e.currentTarget.reset();
    };

    const renderTabContent = () => {
        switch (activeTab) {
            case 'Profile':
                return (
                    <Card>
                        <h3 className="text-xl font-bold mb-4">Business Profile</h3>
                         <form className="space-y-4">
                            <div>
                                <label className="text-sm text-gray-400">Company Name</label>
                                <input defaultValue="Digital Assets LLC" className="w-full bg-primary p-2 rounded border border-primary-light mt-1" />
                            </div>
                            <div>
                                <label className="text-sm text-gray-400">Contact Email</label>
                                <input type="email" defaultValue="sales@digitalassets.com" className="w-full bg-primary p-2 rounded border border-primary-light mt-1" />
                            </div>
                            <div className="flex justify-end pt-2">
                                <button type="submit" className="bg-accent text-primary font-bold py-2 px-6 rounded hover:opacity-90">Save Profile</button>
                            </div>
                        </form>
                    </Card>
                );
            case 'Payout Accounts':
                return (
                    <Card>
                        <h3 className="text-xl font-bold mb-2">Payout Settings</h3>
                        <p className="text-gray-400 mb-6">Manage the bank accounts where you receive your sales payouts.</p>
                        <div className="space-y-3 mb-6">
                            {bankAccounts.map(account => (
                                <div key={account.id} className="flex items-center justify-between p-4 bg-primary rounded-md">
                                    <div>
                                        <p className="font-semibold text-white flex items-center">
                                            {account.bankName} ({account.currency})
                                            {account.isDefault && <span className="ml-2 text-xs bg-accent text-primary font-bold px-2 py-0.5 rounded-full">Default</span>}
                                        </p>
                                        <p className="text-sm text-gray-400">{account.accountNumber} - {account.country}</p>
                                    </div>
                                    {!account.isDefault && (
                                        <button className="text-xs font-medium text-accent hover:underline">Set as Default</button>
                                    )}
                                </div>
                            ))}
                        </div>
                        {!showAddAccountForm ? (
                            <button onClick={() => setShowAddAccountForm(true)} className="bg-accent/20 text-accent font-bold py-2 px-4 rounded hover:bg-accent/40">
                                Add New Payout Account
                            </button>
                        ) : (
                            <form onSubmit={handleAddAccount} className="space-y-4 pt-4 border-t border-primary">
                                <h3 className="font-semibold text-white">Add New Account</h3>
                                <input name="bankName" placeholder="Bank Name" required className="w-full bg-primary p-2 rounded border border-primary-light" />
                                <input name="accountNumber" placeholder="Account Number" required className="w-full bg-primary p-2 rounded border border-primary-light" />
                                <input name="country" placeholder="Country (e.g., Nigeria)" required className="w-full bg-primary p-2 rounded border border-primary-light" />
                                <input name="currency" placeholder="Currency (e.g., NGN)" required className="w-full bg-primary p-2 rounded border border-primary-light" />
                                <div className="flex justify-end space-x-3">
                                    <button type="button" onClick={() => setShowAddAccountForm(false)} className="bg-gray-700 text-white font-bold py-2 px-4 rounded hover:bg-gray-600">Cancel</button>
                                    <button type="submit" className="bg-accent text-primary font-bold py-2 px-4 rounded hover:opacity-90">Save Account</button>
                                </div>
                            </form>
                        )}
                    </Card>
                );
            case 'Security':
                 return (
                    <Card>
                        <h3 className="text-xl font-bold mb-4">Security Settings</h3>
                         <div className="space-y-6">
                            <div className="border-b border-primary pb-6">
                                <h3 className="text-lg font-semibold text-white mb-2">Change Password</h3>
                                <div className="max-w-sm space-y-3">
                                    <input type="password" placeholder="New Password" value={newPassword} onChange={e => setNewPassword(e.target.value)} className="w-full bg-primary p-2 rounded border border-primary-light" />
                                    <PasswordStrengthIndicator password={newPassword} />
                                    <button className="bg-primary-light text-white font-bold py-2 px-4 rounded hover:opacity-90 text-sm">Update Password</button>
                                </div>
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-white mb-2">Two-Factor Authentication (2FA)</h3>
                                {is2FAEnabled ? (
                                    <div className="flex items-center justify-between p-3 bg-accent/10 rounded-md">
                                        <p className="text-accent font-medium">2FA is enabled.</p>
                                        <button onClick={() => setIs2FAEnabled(false)} className="bg-red-500/20 text-red-400 font-bold py-1 px-3 rounded hover:bg-red-500/40 text-sm">Disable</button>
                                    </div>
                                ) : (
                                    <div>
                                        <p className="text-gray-400 mb-4 text-sm">Add an extra layer of security to your account.</p>
                                        <button onClick={() => setIs2FAEnabled(true)} className="bg-accent text-primary font-bold py-2 px-4 rounded hover:opacity-90">Enable 2FA</button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </Card>
                );
            case 'Notifications':
                 return (
                    <Card>
                        <h3 className="text-xl font-bold mb-4">Notification Preferences</h3>
                        <div className="space-y-4">
                             <div className="flex items-center justify-between p-3 bg-primary rounded-md">
                                <label htmlFor="new-sale" className="text-white">New Sale Notification</label>
                                <input id="new-sale" type="checkbox" defaultChecked className="h-5 w-5 rounded border-gray-300 text-accent focus:ring-accent" />
                            </div>
                             <div className="flex items-center justify-between p-3 bg-primary rounded-md">
                                <label htmlFor="payout-confirm" className="text-white">Payout Confirmation</label>
                                <input id="payout-confirm" type="checkbox" defaultChecked className="h-5 w-5 rounded border-gray-300 text-accent focus:ring-accent" />
                            </div>
                        </div>
                    </Card>
                );
        }
    }

    return (
        <div>
             <div className="mb-6 flex space-x-2 p-1 bg-primary rounded-lg">
                {(['Profile', 'Payout Accounts', 'Security', 'Notifications'] as SettingsTab[]).map(tab => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`w-full text-center px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === tab ? 'bg-accent text-primary' : 'text-gray-400 hover:bg-primary-light'}`}
                    >
                        {tab}
                    </button>
                ))}
            </div>
            {renderTabContent()}
        </div>
    );
};

export default MerchantSettings;