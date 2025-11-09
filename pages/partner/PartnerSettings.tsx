import React, { useState } from 'react';
import Card from '../../components/common/Card';
import { useAuth } from '../../hooks/useAuth';
import PasswordStrengthIndicator from '../../components/common/PasswordStrengthIndicator';
import Spinner from '../../components/common/Spinner';

type SettingsTab = 'Profile' | 'Security' | 'Notifications';

const PartnerSettings: React.FC = () => {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState<SettingsTab>('Profile');
    
    // Profile State
    const [companyName, setCompanyName] = useState(user?.companyName || '');
    const [contactEmail, setContactEmail] = useState(user?.email || '');
    const [usdtWalletAddress, setUsdtWalletAddress] = useState('T******************************WXYZ'); // Mock saved data
    const [usdtNetwork, setUsdtNetwork] = useState('TRC20'); // Mock saved data
    const [isSaving, setIsSaving] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    // Security State
    const [newPassword, setNewPassword] = useState('');
    const [is2FAEnabled, setIs2FAEnabled] = useState(true);

    const handleProfileSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        setIsSuccess(false);
        // Simulate API call
        setTimeout(() => {
            console.log("Saving profile & wallet:", { companyName, contactEmail, usdtWalletAddress, usdtNetwork });
            setIsSaving(false);
            setIsSuccess(true);
            setTimeout(() => setIsSuccess(false), 3000);
        }, 1500);
    };

    const renderTabContent = () => {
        switch (activeTab) {
            case 'Profile':
                return (
                    <form onSubmit={handleProfileSubmit} className="space-y-6">
                        <div>
                            <h3 className="text-lg font-semibold text-white">Business Profile</h3>
                            <div className="space-y-4 mt-2">
                                <div>
                                    <label className="text-sm text-gray-400">Company Name</label>
                                    <input value={companyName} onChange={e => setCompanyName(e.target.value)} className="w-full bg-primary p-2 rounded border border-primary-light mt-1" />
                                </div>
                                <div>
                                    <label className="text-sm text-gray-400">Contact Email</label>
                                    <input type="email" value={contactEmail} onChange={e => setContactEmail(e.target.value)} className="w-full bg-primary p-2 rounded border border-primary-light mt-1" />
                                </div>
                            </div>
                        </div>

                        <div className="border-t border-primary pt-6">
                            <h3 className="text-lg font-semibold text-white">USDT Payout Wallet</h3>
                            <p className="text-sm text-gray-400 mt-1 mb-2">Configure the wallet where you will receive USDT settlements.</p>
                            <div className="space-y-4 mt-2">
                                <div>
                                    <label className="text-sm text-gray-400">USDT Wallet Address</label>
                                    <input value={usdtWalletAddress} onChange={e => setUsdtWalletAddress(e.target.value)} placeholder="Enter your USDT wallet address" className="w-full bg-primary p-2 rounded border border-primary-light mt-1 font-mono" />
                                </div>
                                 <div>
                                    <label className="text-sm text-gray-400">Base Network</label>
                                    <select value={usdtNetwork} onChange={e => setUsdtNetwork(e.target.value)} className="w-full bg-primary p-2 rounded border border-primary-light mt-1">
                                        <option value="TRC20">TRC20 (Tron)</option>
                                        <option value="ERC20">ERC20 (Ethereum)</option>
                                        <option value="BEP20">BEP20 (BNB Smart Chain)</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end items-center gap-4 pt-2">
                             {isSuccess && <span className="text-accent text-sm">Profile updated successfully!</span>}
                            <button type="submit" disabled={isSaving} className="bg-accent text-primary font-bold py-2 px-6 rounded hover:opacity-90 flex items-center justify-center w-36">
                                {isSaving ? <Spinner /> : 'Save Profile'}
                            </button>
                        </div>
                    </form>
                );
            case 'Security':
                return (
                    <div className="space-y-6">
                        <div className="border-b border-primary pb-6">
                            <h3 className="text-lg font-semibold text-white mb-2">Change Password</h3>
                            <div className="max-w-sm space-y-3">
                                <input type="password" placeholder="Current Password" className="w-full bg-primary p-2 rounded border border-primary-light" />
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
                );
            case 'Notifications':
                return (
                     <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-white">Email Notifications</h3>
                        <p className="text-sm text-gray-400">Choose which email notifications you want to receive.</p>
                        <div className="space-y-3 pt-2">
                             <div className="flex items-center justify-between p-3 bg-primary rounded-md">
                                <label htmlFor="large-txn" className="text-white">Large Transaction Alerts</label>
                                <input id="large-txn" type="checkbox" defaultChecked className="h-5 w-5 rounded border-gray-300 text-accent focus:ring-accent" />
                            </div>
                             <div className="flex items-center justify-between p-3 bg-primary rounded-md">
                                <label htmlFor="settlement-report" className="text-white">Daily Settlement Reports</label>
                                <input id="settlement-report" type="checkbox" defaultChecked className="h-5 w-5 rounded border-gray-300 text-accent focus:ring-accent" />
                            </div>
                            <div className="flex items-center justify-between p-3 bg-primary rounded-md">
                                <label htmlFor="api-alerts" className="text-white">API & Webhook Status Alerts</label>
                                <input id="api-alerts" type="checkbox" className="h-5 w-5 rounded border-gray-300 text-accent focus:ring-accent" />
                            </div>
                        </div>
                        <div className="flex justify-end pt-2">
                            <button className="bg-accent text-primary font-bold py-2 px-6 rounded hover:opacity-90">Save Preferences</button>
                        </div>
                    </div>
                );
        }
    };
    
    return (
         <Card>
            <h2 className="text-2xl font-bold mb-6">Partner Settings</h2>
            <div className="flex space-x-2 p-1 bg-primary rounded-lg mb-6">
                {(['Profile', 'Security', 'Notifications'] as SettingsTab[]).map(tab => (
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

export default PartnerSettings;
