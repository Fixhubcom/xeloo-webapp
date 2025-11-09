
import React, { useState } from 'react';
import Card from '../../components/common/Card';
import { BankAccount } from '../../types';

const mockBankAccounts: BankAccount[] = [
    { id: 'acc_merc_1', bankName: 'GTBank', accountNumber: '**** **** **** 1111', country: 'Nigeria', currency: 'NGN', isDefault: true },
    { id: 'acc_merc_2', bankName: 'Bank of America', accountNumber: '**** **** **** 2222', country: 'USA', currency: 'USD' },
];


const MerchantSettings: React.FC = () => {
    const [bankAccounts, setBankAccounts] = useState<BankAccount[]>(mockBankAccounts);
    const [showAddAccountForm, setShowAddAccountForm] = useState(false);
    
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

    return (
        <Card>
            <h2 className="text-2xl font-bold mb-2">Payout Settings</h2>
            <p className="text-gray-light mb-6">Manage the bank accounts where you receive your sales payouts.</p>
            <div className="space-y-3 mb-6">
                {bankAccounts.map(account => (
                    <div key={account.id} className="flex items-center justify-between p-4 bg-primary rounded-md">
                        <div>
                            <p className="font-semibold text-white flex items-center">
                                {account.bankName} ({account.currency})
                                {account.isDefault && <span className="ml-2 text-xs bg-accent text-primary font-bold px-2 py-0.5 rounded-full">Default</span>}
                            </p>
                            <p className="text-sm text-gray-light">{account.accountNumber} - {account.country}</p>
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
                <form onSubmit={handleAddAccount} className="space-y-4 pt-4 border-t border-gray-medium">
                    <h3 className="font-semibold text-white">Add New Account</h3>
                    <input name="bankName" placeholder="Bank Name" required className="w-full bg-gray-dark p-2 rounded border border-gray-medium" />
                    <input name="accountNumber" placeholder="Account Number" required className="w-full bg-gray-dark p-2 rounded border border-gray-medium" />
                    <input name="country" placeholder="Country (e.g., Nigeria)" required className="w-full bg-gray-dark p-2 rounded border border-gray-medium" />
                    <input name="currency" placeholder="Currency (e.g., NGN)" required className="w-full bg-gray-dark p-2 rounded border border-gray-medium" />
                    <div className="flex justify-end space-x-3">
                        <button type="button" onClick={() => setShowAddAccountForm(false)} className="bg-gray-medium text-white font-bold py-2 px-4 rounded hover:bg-gray-500">Cancel</button>
                        <button type="submit" className="bg-accent text-primary font-bold py-2 px-4 rounded hover:bg-yellow-400">Save Account</button>
                    </div>
                </form>
            )}
        </Card>
    );
};

export default MerchantSettings;
