

import React, { useState, useMemo } from 'react';
import Card from '../../components/common/Card';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { JournalEntry, Bill } from '../../types';
import AIAccountingAssistant from './accounting/AIAccountingAssistant';
import { SparklesIcon, InvoiceIcon } from '../../components/icons/Icons';
import { useTheme } from '../../context/ThemeContext';
import Spinner from '../../components/common/Spinner';
import { useAuth } from '../../hooks/useAuth';

type AccountingView = 'Dashboard' | 'AI Assistant' | 'Chart of Accounts' | 'Journal' | 'Bills' | 'Reports';
type ReportType = 'pnl' | 'balance' | 'cashflow' | 'ledger';

// Mock Data
const initialAccounts = [
    { code: '1010', name: 'Cash and Bank', type: 'Asset', balance: 100245.50 },
    { code: '1200', name: 'Accounts Receivable', type: 'Asset', balance: 15000.00 },
    { code: '1500', name: 'Equipment', type: 'Asset', balance: 25000.00 },
    { code: '2010', name: 'Accounts Payable', type: 'Liability', balance: 8500.00 },
    { code: '2200', name: 'Loans Payable', type: 'Liability', balance: 30000.00 },
    { code: '3010', name: 'Owner\'s Capital', type: 'Equity', balance: 50000.00 },
    { code: '3300', name: 'Retained Earnings', type: 'Equity', balance: 42745.50 },
    { code: '4010', name: 'Service Revenue', type: 'Revenue', balance: 95000.00 },
    { code: '5010', name: 'Software & Subscriptions', type: 'Expense', balance: 2500.00 },
    { code: '5020', name: 'Marketing', type: 'Expense', balance: 5000.00 },
    { code: '5030', name: 'Rent', type: 'Expense', balance: 12000.00 },
];

const initialJournalEntries: JournalEntry[] = [
    { id: 1, date: '2024-07-22', description: 'Client Payment - Acme Inc.', account: '1010 - Cash and Bank', debit: 495.00, credit: 0 },
    { id: 2, date: '2024-07-22', description: 'Client Payment - Acme Inc.', account: '4010 - Service Revenue', debit: 0, credit: 495.00 },
    { id: 3, date: '2024-07-21', description: 'Payout - Lagos Ventures', account: '2010 - Accounts Payable', debit: 1015.00, credit: 0 },
    { id: 4, date: '2024-07-21', description: 'Payout - Lagos Ventures', account: '1010 - Cash and Bank', debit: 0, credit: 1015.00 },
    { id: 5, date: '2024-07-20', description: 'Office Rent - July', account: '5030 - Rent', debit: 1000.00, credit: 0},
    { id: 6, date: '2024-07-20', description: 'Office Rent - July', account: '1010 - Cash and Bank', debit: 0, credit: 1000.00 },
];

const mockBills: Bill[] = [
    { id: 'bill-001', vendorName: 'Figma', issueDate: '2024-07-15', dueDate: '2024-07-30', amount: 50.00, currency: 'USD', status: 'Unpaid' },
    { id: 'bill-002', vendorName: 'AWS', issueDate: '2024-07-01', dueDate: '2024-07-25', amount: 125.50, currency: 'USD', status: 'Unpaid' },
    { id: 'bill-003', vendorName: 'Office Landlord', issueDate: '2024-07-01', dueDate: '2024-07-10', amount: 1000.00, currency: 'USD', status: 'Paid' },
];

const pnlData = [ { name: 'Revenue', value: 95000 }, { name: 'Expenses', value: 19500 }, ];
const expenseBreakdown = [ { name: 'Software', value: 2500 }, { name: 'Marketing', value: 5000 }, { name: 'Rent', value: 12000 }, ]
const COLORS_DARK = ['#FDDA1A', '#FFFFFF', '#a8a29e'];
const COLORS_LIGHT = ['#D97706', '#4B5563', '#9CA3AF'];

const ViewSwitcher: React.FC<{ activeView: AccountingView, setActiveView: (view: AccountingView) => void }> = ({ activeView, setActiveView }) => {
    const views: { name: AccountingView, icon?: React.ReactElement }[] = [
        { name: 'Dashboard' },
        { name: 'AI Assistant', icon: <SparklesIcon className="w-4 h-4 mr-2" /> },
        { name: 'Chart of Accounts' },
        { name: 'Journal' },
        { name: 'Bills', icon: <InvoiceIcon className="w-4 h-4 mr-2" /> },
        { name: 'Reports' }
    ];
    return (
        <div className="mb-6 flex flex-wrap justify-center gap-2 p-1 bg-white dark:bg-primary rounded-lg">
            {views.map(view => (
                <button
                    key={view.name}
                    onClick={() => setActiveView(view.name)}
                    className={`flex-grow sm:flex-grow-0 flex items-center justify-center text-center px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeView === view.name ? 'bg-accent text-primary' : 'text-gray-500 dark:text-gray-300 hover:bg-slate-100 dark:hover:bg-primary-light'}`}
                >
                    {view.icon}
                    {view.name}
                </button>
            ))}
        </div>
    );
};

const ReportTable: React.FC<{ title: string, sections: { title: string, items: { name: string, value: number }[], total: number }[], grandTotal?: { label: string, value: number } }> = ({ title, sections, grandTotal }) => (
    <div className="bg-white dark:bg-primary-light p-4 sm:p-6 rounded-lg">
        <h3 className="text-xl font-bold text-center mb-4">{title}</h3>
        <div className="overflow-x-auto">
            <table className="w-full">
                <tbody>
                    {sections.map(section => (
                        <React.Fragment key={section.title}>
                            <tr>
                                <td colSpan={2} className="font-bold pt-4 pb-2 text-accent">{section.title}</td>
                            </tr>
                            {section.items.map(item => (
                                <tr key={item.name}>
                                    <td className="pl-4 py-1">{item.name}</td>
                                    <td className="text-right font-mono">{item.value.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</td>
                                </tr>
                            ))}
                            <tr className="border-t border-slate-200 dark:border-primary">
                                <td className="font-semibold pt-2">Total {section.title}</td>
                                <td className="text-right font-mono font-semibold pt-2">{section.total.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</td>
                            </tr>
                        </React.Fragment>
                    ))}
                    {grandTotal && (
                        <tr className="border-t-2 border-accent mt-4">
                            <td className="font-bold pt-4 text-lg text-accent">{grandTotal.label}</td>
                            <td className="text-right font-mono font-bold pt-4 text-lg text-accent">{grandTotal.value.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    </div>
);


const ManualJournalEntryModal: React.FC<{
    accounts: { code: string; name: string; }[];
    onClose: () => void;
    onAddEntry: (newEntries: Omit<JournalEntry, 'id'>[]) => void;
}> = ({ accounts, onClose, onAddEntry }) => {
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [description, setDescription] = useState('');
    const [lines, setLines] = useState([
        { account: '', debit: '', credit: '' },
        { account: '', debit: '', credit: '' },
    ]);
    const [error, setError] = useState('');

    const handleLineChange = (index: number, field: 'account' | 'debit' | 'credit', value: string) => {
        const newLines = [...lines];
        newLines[index][field] = value;
        if (field === 'debit' && value) {
            newLines[index].credit = '';
        } else if (field === 'credit' && value) {
            newLines[index].debit = '';
        }
        setLines(newLines);
    };

    const addLine = () => setLines([...lines, { account: '', debit: '', credit: '' }]);
    const removeLine = (index: number) => {
        if (lines.length > 2) {
            setLines(lines.filter((_, i) => i !== index));
        }
    };

    const { totalDebit, totalCredit } = useMemo(() => {
        return lines.reduce((totals, line) => {
            totals.totalDebit += parseFloat(line.debit) || 0;
            totals.totalCredit += parseFloat(line.credit) || 0;
            return totals;
        }, { totalDebit: 0, totalCredit: 0 });
    }, [lines]);

    const isBalanced = totalDebit > 0 && totalDebit === totalCredit;

    const handleSubmit = () => {
        setError('');
        if (!isBalanced) {
            setError('Total debits must equal total credits and cannot be zero.');
            return;
        }
        if (!description.trim()) {
            setError('Description is required.');
            return;
        }
        if (lines.some(line => !line.account)) {
            setError('Please select an account for each line.');
            return;
        }

        const newEntries: Omit<JournalEntry, 'id'>[] = lines
            .filter(line => (parseFloat(line.debit) || 0) > 0 || (parseFloat(line.credit) || 0) > 0)
            .map(line => ({
                date,
                description,
                account: line.account,
                debit: parseFloat(line.debit) || 0,
                credit: parseFloat(line.credit) || 0,
            }));
        
        onAddEntry(newEntries);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 animate-fade-in p-4" onClick={onClose}>
            <Card className="w-full max-w-3xl" onClick={e => e.stopPropagation()}>
                <h2 className="text-2xl font-bold mb-4">Add Manual Journal Entry</h2>
                <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="md:col-span-1">
                            <label className="text-sm text-gray-400">Date</label>
                            <input type="date" value={date} onChange={e => setDate(e.target.value)} className="w-full mt-1 bg-primary p-2 rounded border border-primary-light" />
                        </div>
                        <div className="md:col-span-2">
                             <label className="text-sm text-gray-400">Description</label>
                            <input value={description} onChange={e => setDescription(e.target.value)} placeholder="Transaction description" className="w-full mt-1 bg-primary p-2 rounded border border-primary-light" />
                        </div>
                    </div>
                    
                    <div className="space-y-2">
                        {lines.map((line, index) => (
                            <div key={index} className="flex items-center gap-2">
                                <select value={line.account} onChange={e => handleLineChange(index, 'account', e.target.value)} className="w-1/2 bg-primary p-2 rounded border border-primary-light">
                                    <option value="">-- Select Account --</option>
                                    {accounts.map(acc => <option key={acc.code} value={`${acc.code} - ${acc.name}`}>{acc.code} - {acc.name}</option>)}
                                </select>
                                <input type="number" value={line.debit} onChange={e => handleLineChange(index, 'debit', e.target.value)} placeholder="Debit" className="w-1/4 bg-primary p-2 rounded border border-primary-light font-mono text-right" />
                                <input type="number" value={line.credit} onChange={e => handleLineChange(index, 'credit', e.target.value)} placeholder="Credit" className="w-1/4 bg-primary p-2 rounded border border-primary-light font-mono text-right" />
                                <button onClick={() => removeLine(index)} disabled={lines.length <= 2} className="text-red-400 hover:text-red-300 font-bold text-xl disabled:opacity-50 disabled:cursor-not-allowed">&times;</button>
                            </div>
                        ))}
                    </div>

                    <div className="flex justify-between items-center mt-4 pt-4 border-t border-primary-light">
                        <div>
                            <button onClick={addLine} className="text-sm text-accent font-semibold hover:underline">+ Add Line</button>
                        </div>
                        <div className="text-right text-sm">
                            <div className="flex gap-4 font-mono text-gray-300">
                                <span>Total Debit: {totalDebit.toFixed(2)}</span>
                                <span>Total Credit: {totalCredit.toFixed(2)}</span>
                            </div>
                            <p className={`font-bold mt-1 ${isBalanced ? 'text-green-400' : 'text-yellow-400'}`}>
                                {isBalanced ? 'Balanced' : `Out of balance by ${Math.abs(totalDebit - totalCredit).toFixed(2)}`}
                            </p>
                        </div>
                    </div>
                    {error && <p className="text-yellow-400 text-center text-sm">{error}</p>}
                </div>
                <div className="flex justify-end space-x-4 mt-6">
                    <button onClick={onClose} className="bg-gray-700 text-white font-bold py-2 px-6 rounded hover:bg-gray-600">Cancel</button>
                    <button onClick={handleSubmit} className="bg-accent text-primary font-bold py-2 px-6 rounded hover:opacity-90">Save Entry</button>
                </div>
            </Card>
        </div>
    );
};

const AddBillModal: React.FC<{
    onClose: () => void;
    onAddBill: (newBill: Omit<Bill, 'id' | 'status'>) => void;
}> = ({ onClose, onAddBill }) => {
    const [vendorName, setVendorName] = useState('');
    const [issueDate, setIssueDate] = useState(new Date().toISOString().split('T')[0]);
    const [dueDate, setDueDate] = useState('');
    const [amount, setAmount] = useState('');
    const [currency, setCurrency] = useState('USD');
    const [isSaving, setIsSaving] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        setTimeout(() => {
            onAddBill({
                vendorName,
                issueDate,
                dueDate,
                amount: parseFloat(amount),
                currency,
            });
            setIsSaving(false);
            onClose();
        }, 1000);
    };

    return (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 animate-fade-in p-4" onClick={onClose}>
            <Card className="w-full max-w-lg" onClick={e => e.stopPropagation()}>
                <h2 className="text-2xl font-bold mb-4">Add New Bill</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input value={vendorName} onChange={e => setVendorName(e.target.value)} placeholder="Vendor Name" className="w-full bg-primary p-2 rounded border border-primary-light" required />
                    <div className="grid grid-cols-2 gap-4">
                        <input value={amount} onChange={e => setAmount(e.target.value)} type="number" step="0.01" placeholder="Amount" className="w-full bg-primary p-2 rounded border border-primary-light" required />
                        <select value={currency} onChange={e => setCurrency(e.target.value)} className="w-full bg-primary p-2 rounded border border-primary-light">
                            <option>USD</option>
                            <option>NGN</option>
                            <option>EUR</option>
                            <option>GBP</option>
                        </select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-sm text-gray-400">Issue Date</label>
                            <input type="date" value={issueDate} onChange={e => setIssueDate(e.target.value)} className="w-full mt-1 bg-primary p-2 rounded border border-primary-light" />
                        </div>
                        <div>
                            <label className="text-sm text-gray-400">Due Date</label>
                            <input type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} className="w-full mt-1 bg-primary p-2 rounded border border-primary-light" required />
                        </div>
                    </div>
                    <div className="flex justify-end space-x-4 mt-6">
                        <button type="button" onClick={onClose} className="bg-gray-700 text-white font-bold py-2 px-6 rounded hover:bg-gray-600">Cancel</button>
                        <button type="submit" disabled={isSaving} className="bg-accent text-primary font-bold py-2 px-6 rounded hover:opacity-90 flex items-center justify-center w-32">
                            {isSaving ? <Spinner /> : 'Save Bill'}
                        </button>
                    </div>
                </form>
            </Card>
        </div>
    );
};

const PayBillModal: React.FC<{
    bill: Bill;
    onClose: () => void;
    onConfirm: (billId: string, amount: number) => void;
    openAddFundsModal: () => void;
}> = ({ bill, onClose, onConfirm, openAddFundsModal }) => {
    const { user } = useAuth();
    const [isProcessing, setIsProcessing] = useState(false);
    const hasSufficientFunds = (user?.walletBalance || 0) >= bill.amount;

    const handlePay = () => {
        setIsProcessing(true);
        setTimeout(() => {
            onConfirm(bill.id, bill.amount);
            setIsProcessing(false);
            onClose();
        }, 1500);
    };

    return (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 animate-fade-in p-4" onClick={onClose}>
            <Card className="w-full max-w-md" onClick={e => e.stopPropagation()}>
                <h2 className="text-2xl font-bold mb-4">Pay Bill</h2>
                <div className="bg-primary p-4 rounded-lg space-y-3">
                    <div className="flex justify-between"><span>Vendor:</span><span className="font-semibold text-white">{bill.vendorName}</span></div>
                    <div className="flex justify-between"><span>Due Date:</span><span className="font-semibold text-white">{bill.dueDate}</span></div>
                    <hr className="border-primary-light"/>
                    <div className="flex justify-between items-center font-bold text-lg"><span className="text-white">Amount Due:</span><span className="font-mono text-accent">{bill.amount.toLocaleString('en-US', { style: 'currency', currency: bill.currency })}</span></div>
                    <div className="flex justify-between text-sm"><span className="text-gray-400">Your Wallet Balance:</span><span className="font-mono text-white">{(user?.walletBalance || 0).toLocaleString('en-US', { style: 'currency', currency: user?.preferredCurrency || 'USD' })}</span></div>
                </div>

                {!hasSufficientFunds && (
                    <div className="mt-4 p-3 bg-yellow-500/10 text-yellow-300 text-center rounded-lg">
                        <p className="font-bold">Insufficient Funds</p>
                    </div>
                )}

                <div className="flex justify-end space-x-4 mt-6">
                    <button onClick={onClose} className="bg-gray-700 text-white font-bold py-2 px-6 rounded hover:bg-gray-600">Cancel</button>
                    {hasSufficientFunds ? (
                        <button onClick={handlePay} disabled={isProcessing} className="bg-accent text-primary font-bold py-2 px-6 rounded hover:opacity-90 w-40 flex justify-center items-center">
                            {isProcessing ? <Spinner/> : 'Pay from Wallet'}
                        </button>
                    ) : (
                        <button onClick={openAddFundsModal} className="bg-accent text-primary font-bold py-2 px-6 rounded hover:opacity-90">Add Funds</button>
                    )}
                </div>
            </Card>
        </div>
    );
};

interface AccountingProps {
    searchQuery: string;
    openAddFundsModal: () => void;
}

const Accounting: React.FC<AccountingProps> = ({ searchQuery, openAddFundsModal }) => {
    const { theme } = useTheme();
    const { user, updateWalletBalance } = useAuth();
    const [activeView, setActiveView] = useState<AccountingView>('Dashboard');
    const [accounts, setAccounts] = useState(initialAccounts);
    const [journalEntries, setJournalEntries] = useState<JournalEntry[]>(initialJournalEntries);
    const [bills, setBills] = useState<Bill[]>(mockBills);
    const [activeReport, setActiveReport] = useState<ReportType>('pnl');
    const [showManualEntryModal, setShowManualEntryModal] = useState(false);
    const [showAddBillModal, setShowAddBillModal] = useState(false);
    const [payingBill, setPayingBill] = useState<Bill | null>(null);

    const textColor = theme === 'dark' ? '#a8a29e' : '#475569';
    const tooltipStyles = {
        contentStyle: {
            backgroundColor: theme === 'dark' ? '#041401' : '#ffffff',
            border: `1px solid ${theme === 'dark' ? '#294A21' : '#e2e8f0'}`,
        }
    };
    const COLORS = theme === 'dark' ? COLORS_DARK : COLORS_LIGHT;
    const barFillColor = theme === 'dark' ? '#FDDA1A' : '#D97706';

    const filteredJournalEntries = useMemo(() => {
        if (!searchQuery) return journalEntries;
        const lowercasedQuery = searchQuery.toLowerCase();
        return journalEntries.filter(entry => 
            entry.description.toLowerCase().includes(lowercasedQuery) ||
            entry.account.toLowerCase().includes(lowercasedQuery)
        );
    }, [journalEntries, searchQuery]);

    const handleAddEntry = (newEntries: Omit<JournalEntry, 'id'>[]) => {
        const nextId = Math.max(0, ...journalEntries.map(e => e.id)) + 1;
        const entriesToAdd: JournalEntry[] = newEntries.map((entry, index) => ({
            ...entry,
            id: nextId + index,
        }));
        setJournalEntries(prev => [...entriesToAdd, ...prev]);
    };

    const handleAddBill = (newBillData: Omit<Bill, 'id' | 'status'>) => {
        const newBill: Bill = {
            id: `bill-${Date.now()}`,
            ...newBillData,
            status: 'Unpaid',
        };
        setBills(prev => [newBill, ...prev]);
    };
    
    const handleConfirmPayBill = (billId: string, amount: number) => {
        updateWalletBalance(-amount);
        setBills(prev => prev.map(b => b.id === billId ? { ...b, status: 'Paid' } : b));
    };

    const renderView = () => {
        switch (activeView) {
            case 'Dashboard':
                 const totalRevenue = accounts.filter(a => a.type === 'Revenue').reduce((sum, acc) => sum + acc.balance, 0);
                 const totalExpenses = accounts.filter(a => a.type === 'Expense').reduce((sum, acc) => sum + acc.balance, 0);
                 const netIncome = totalRevenue - totalExpenses;
                return (
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <Card className="text-center"><h3 className="text-lg text-gray-500 dark:text-gray-400">Total Revenue</h3><p className="text-3xl font-bold text-accent">${totalRevenue.toLocaleString()}</p></Card>
                            <Card className="text-center"><h3 className="text-lg text-gray-500 dark:text-gray-400">Total Expenses</h3><p className="text-3xl font-bold text-yellow-500 dark:text-yellow-400">${totalExpenses.toLocaleString()}</p></Card>
                            <Card className="text-center"><h3 className="text-lg text-gray-500 dark:text-gray-400">Net Income</h3><p className="text-3xl font-bold text-accent">${netIncome.toLocaleString()}</p></Card>
                        </div>
                        <Card>
                            <h3 className="text-xl font-bold mb-4">Income vs Expense</h3>
                             <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={pnlData}>
                                    <XAxis dataKey="name" stroke={textColor} />
                                    <YAxis stroke={textColor} />
                                    <Tooltip {...tooltipStyles} />
                                    <Bar dataKey="value" fill={barFillColor} />
                                </BarChart>
                            </ResponsiveContainer>
                        </Card>
                        <Card>
                             <h3 className="text-xl font-bold mb-4">Expense Breakdown</h3>
                             <ResponsiveContainer width="100%" height={300}>
                                 <PieChart>
                                     <Pie data={expenseBreakdown} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label={{ fill: textColor }}>
                                        {expenseBreakdown.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                                     </Pie>
                                     <Tooltip {...tooltipStyles} />
                                 </PieChart>
                            </ResponsiveContainer>
                        </Card>
                    </div>
                );
            case 'AI Assistant':
                return <AIAccountingAssistant onAddEntry={handleAddEntry} />;
            case 'Chart of Accounts':
                return (
                    <Card>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                                <thead className="text-xs text-gray-500 dark:text-gray-400 uppercase bg-slate-100 dark:bg-primary"><tr><th className="px-6 py-3">Code</th><th className="px-6 py-3">Account Name</th><th className="px-6 py-3">Type</th><th className="px-6 py-3 text-right">Balance</th></tr></thead>
                                <tbody>{accounts.map(acc => (<tr key={acc.code} className="bg-white dark:bg-primary-light border-b border-slate-100 dark:border-primary"><td className="px-6 py-4">{acc.code}</td><td className="px-6 py-4 font-medium text-slate-800 dark:text-white">{acc.name}</td><td className="px-6 py-4">{acc.type}</td><td className="px-6 py-4 font-mono text-right">${acc.balance.toLocaleString()}</td></tr>))}</tbody>
                            </table>
                        </div>
                    </Card>
                );
            case 'Journal':
                 return (
                    <Card>
                        <div className="flex justify-between items-center mb-4">
                             <h2 className="text-xl font-bold">Journal Entries</h2>
                            <button onClick={() => setShowManualEntryModal(true)} className="bg-accent text-primary font-bold py-2 px-4 rounded hover:opacity-90">
                                Add Manual Entry
                            </button>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                                <thead className="text-xs text-gray-500 dark:text-gray-400 uppercase bg-slate-100 dark:bg-primary"><tr><th className="px-6 py-3">Date</th><th className="px-6 py-3">Description</th><th className="px-6 py-3">Account</th><th className="px-6 py-3 text-right">Debit</th><th className="px-6 py-3 text-right">Credit</th></tr></thead>
                                <tbody>
                                    {filteredJournalEntries.map(entry => (<tr key={entry.id} className="bg-white dark:bg-primary-light border-b border-slate-100 dark:border-primary"><td className="px-6 py-4">{entry.date}</td><td className="px-6 py-4 font-medium text-slate-800 dark:text-white">{entry.description}</td><td className="px-6 py-4">{entry.account}</td><td className="px-6 py-4 font-mono text-yellow-600 dark:text-yellow-400 text-right">{entry.debit > 0 ? entry.debit.toFixed(2) : '-'}</td><td className="px-6 py-4 font-mono text-accent text-right">{entry.credit > 0 ? entry.credit.toFixed(2) : '-'}</td></tr>))}
                                    {filteredJournalEntries.length === 0 && (
                                        <tr>
                                            <td colSpan={5} className="text-center py-8 text-gray-500 dark:text-gray-400">No journal entries found.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </Card>
                );
            case 'Bills':
                 const StatusBadge: React.FC<{ status: Bill['status'] }> = ({ status }) => {
                    const classes = { 'Paid': 'bg-green-100 text-green-800 dark:bg-green-500/20 dark:text-green-300', 'Unpaid': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-500/20 dark:text-yellow-300', 'Overdue': 'bg-red-100 text-red-800 dark:bg-red-500/20 dark:text-red-300' };
                    return <span className={`px-2 py-1 text-xs font-medium rounded-full ${classes[status]}`}>{status}</span>;
                };
                return (
                    <Card>
                        <div className="flex justify-between items-center mb-4">
                             <h2 className="text-xl font-bold">Bills to Pay</h2>
                             <button onClick={() => setShowAddBillModal(true)} className="bg-accent text-primary font-bold py-2 px-4 rounded hover:opacity-90">Add New Bill</button>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                                <thead className="text-xs text-gray-500 dark:text-gray-400 uppercase bg-slate-100 dark:bg-primary">
                                    <tr><th className="px-4 py-3">Vendor</th><th className="px-4 py-3">Due Date</th><th className="px-4 py-3 text-right">Amount</th><th className="px-4 py-3">Status</th><th className="px-4 py-3">Action</th></tr>
                                </thead>
                                <tbody>
                                    {bills.map(bill => (
                                        <tr key={bill.id} className="bg-white dark:bg-primary-light border-b border-slate-100 dark:border-primary">
                                            <td className="px-4 py-3 font-medium text-slate-800 dark:text-white">{bill.vendorName}</td>
                                            <td className="px-4 py-3">{bill.dueDate}</td>
                                            <td className="px-4 py-3 text-right font-mono">{bill.amount.toLocaleString('en-US', {style: 'currency', currency: bill.currency})}</td>
                                            <td className="px-4 py-3"><StatusBadge status={bill.status} /></td>
                                            <td className="px-4 py-3">{bill.status === 'Unpaid' && <button onClick={() => setPayingBill(bill)} className="text-accent text-xs font-bold">Pay Now</button>}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </Card>
                );
            case 'Reports': 
                const reports: { id: ReportType, name: string }[] = [{id: 'pnl', name: 'P&L Statement'}, {id: 'balance', name: 'Balance Sheet'}, {id: 'cashflow', name: 'Cash Flow'}, {id: 'ledger', name: 'General Ledger'}];
                
                const renderReportContent = () => {
                    switch(activeReport) {
                        case 'pnl':
                            const revenues = accounts.filter(a => a.type === 'Revenue');
                            const totalRevenues = revenues.reduce((sum, a) => sum + a.balance, 0);
                            const expenses = accounts.filter(a => a.type === 'Expense');
                            const totalExpenses = expenses.reduce((sum, a) => sum + a.balance, 0);
                            return <ReportTable title="Profit & Loss Statement" sections={[{ title: 'Revenue', items: revenues.map(a => ({ name: a.name, value: a.balance })), total: totalRevenues }, { title: 'Expenses', items: expenses.map(a => ({ name: a.name, value: a.balance })), total: totalExpenses },]} grandTotal={{ label: 'Net Income', value: totalRevenues - totalExpenses }} />;
                        case 'balance':
                            const assets = accounts.filter(a => a.type === 'Asset');
                            const totalAssets = assets.reduce((sum, a) => sum + a.balance, 0);
                            const liabilities = accounts.filter(a => a.type === 'Liability');
                            const totalLiabilities = liabilities.reduce((sum, a) => sum + a.balance, 0);
                            const equity = accounts.filter(a => a.type === 'Equity');
                            const totalEquity = equity.reduce((sum, a) => sum + a.balance, 0);
                            return <ReportTable title="Balance Sheet" sections={[{ title: 'Assets', items: assets.map(a => ({ name: a.name, value: a.balance })), total: totalAssets }, { title: 'Liabilities', items: liabilities.map(a => ({ name: a.name, value: a.balance })), total: totalLiabilities }, { title: 'Equity', items: equity.map(a => ({ name: a.name, value: a.balance })), total: totalEquity },]} grandTotal={{ label: 'Total Liabilities & Equity', value: totalLiabilities + totalEquity }} />;
                        case 'cashflow':
                            return <ReportTable title="Cash Flow Statement" sections={[ { title: 'Operating Activities', items: [{name: 'Net Income', value: 75500}, {name: 'Change in Payables', value: -1500}], total: 74000 }, { title: 'Investing Activities', items: [{name: 'Equipment Purchase', value: -25000}], total: -25000 }, { title: 'Financing Activities', items: [{name: 'Loan Proceeds', value: 30000}, {name: 'Owner Investment', value: 50000}], total: 80000 }, ]} grandTotal={{ label: 'Net Change in Cash', value: 129000 }} />;
                        case 'ledger':
                            return <div className="bg-white dark:bg-primary-light p-4 rounded-lg">
                                <h3 className="text-xl font-bold text-center mb-4">General Ledger</h3>
                                <div className="space-y-6 max-h-[60vh] overflow-y-auto pr-2">
                                    {accounts.map(account => {
                                        const entries = journalEntries.filter(e => e.account === `${account.code} - ${account.name}`);
                                        let runningBalance = account.balance - entries.reduce((acc, e) => acc + e.debit - e.credit, 0); // Calculate opening balance
                                        return (
                                        <div key={account.code}>
                                            <h4 className="font-bold text-accent">{account.code} - {account.name}</h4>
                                            <table className="w-full text-sm mt-2">
                                                <thead className="text-xs text-gray-500 dark:text-gray-400 uppercase bg-slate-100 dark:bg-primary"><tr><th className="px-2 py-1">Date</th><th className="px-2 py-1">Description</th><th className="px-2 py-1 text-right">Debit</th><th className="px-2 py-1 text-right">Credit</th><th className="px-2 py-1 text-right">Balance</th></tr></thead>
                                                <tbody>
                                                     <tr className="border-b border-slate-200 dark:border-primary"><td colSpan={4} className="px-2 py-1 text-gray-500 dark:text-gray-400">Opening Balance</td><td className="px-2 py-1 font-mono text-right text-gray-500 dark:text-gray-400">{runningBalance.toFixed(2)}</td></tr>
                                                    {entries.map(entry => {
                                                        runningBalance += entry.debit - entry.credit;
                                                        return <tr key={entry.id} className="border-b border-slate-200 dark:border-primary"><td className="px-2 py-1">{entry.date}</td><td className="px-2 py-1">{entry.description}</td><td className="px-2 py-1 font-mono text-right text-yellow-600 dark:text-yellow-400">{entry.debit > 0 ? entry.debit.toFixed(2) : null}</td><td className="px-2 py-1 font-mono text-right text-accent">{entry.credit > 0 ? entry.credit.toFixed(2) : null}</td><td className="px-2 py-1 font-mono text-right">{runningBalance.toFixed(2)}</td></tr>
                                                    })}
                                                    <tr className="font-bold bg-slate-100 dark:bg-primary"><td colSpan={4} className="px-2 py-1 text-slate-800 dark:text-white">Closing Balance</td><td className="px-2 py-1 font-mono text-right text-slate-800 dark:text-white">{account.balance.toFixed(2)}</td></tr>
                                                </tbody>
                                            </table>
                                        </div>
                                    )})}
                                </div>
                            </div>;
                    }
                }
                
                return (
                    <div>
                        <div className="mb-4 flex flex-wrap justify-center gap-2 p-1 bg-white dark:bg-primary-light rounded-lg">
                            {reports.map(r => <button key={r.id} onClick={() => setActiveReport(r.id)} className={`flex-1 px-3 py-1.5 rounded text-sm font-semibold ${activeReport === r.id ? 'bg-accent text-primary' : 'text-gray-500 dark:text-gray-300 hover:bg-slate-100 dark:hover:bg-primary'}`}>{r.name}</button>)}
                        </div>
                        {renderReportContent()}
                    </div>
                );
            default: return null;
        }
    }

    return (
        <div>
            <ViewSwitcher activeView={activeView} setActiveView={setActiveView} />
            <Card className="my-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h3 className="text-lg text-gray-400">Wallet Balance</h3>
                        <p className="text-3xl font-bold text-white">
                            {(user?.walletBalance || 0).toLocaleString('en-US', { style: 'currency', currency: user?.preferredCurrency || 'USD' })}
                        </p>
                    </div>
                    <button onClick={openAddFundsModal} className="bg-accent text-primary font-bold py-2 px-6 rounded hover:opacity-90">
                        + Add Funds
                    </button>
                </div>
            </Card>
            {renderView()}
            {showManualEntryModal && <ManualJournalEntryModal accounts={accounts} onClose={() => setShowManualEntryModal(false)} onAddEntry={handleAddEntry} />}
            {showAddBillModal && <AddBillModal onClose={() => setShowAddBillModal(false)} onAddBill={handleAddBill} />}
            {payingBill && <PayBillModal bill={payingBill} onClose={() => setPayingBill(null)} onConfirm={handleConfirmPayBill} openAddFundsModal={openAddFundsModal} />}
        </div>
    )
}

export default Accounting;