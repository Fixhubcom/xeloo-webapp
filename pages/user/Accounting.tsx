
import React, { useState, useMemo } from 'react';
import Card from '../../components/common/Card';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { JournalEntry, Bill } from '../../types';
import AIAccountingAssistant from './accounting/AIAccountingAssistant';
import { SparklesIcon, InvoiceIcon } from '../../components/icons/Icons';

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
const COLORS = ['#FDDA1A', '#FFFFFF', '#a8a29e'];

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
        <div className="mb-6 flex flex-wrap justify-center gap-2 p-1 bg-primary rounded-lg">
            {views.map(view => (
                <button
                    key={view.name}
                    onClick={() => setActiveView(view.name)}
                    className={`flex-grow sm:flex-grow-0 flex items-center justify-center text-center px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeView === view.name ? 'bg-accent text-primary' : 'text-gray-300 hover:bg-primary-light'}`}
                >
                    {view.icon}
                    {view.name}
                </button>
            ))}
        </div>
    );
};

const ReportTable: React.FC<{ title: string, sections: { title: string, items: { name: string, value: number }[], total: number }[], grandTotal?: { label: string, value: number } }> = ({ title, sections, grandTotal }) => (
    <div className="bg-primary-light p-4 sm:p-6 rounded-lg">
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
                            <tr className="border-t border-primary">
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

interface AccountingProps {
    searchQuery: string;
}

const Accounting: React.FC<AccountingProps> = ({ searchQuery }) => {
    const [activeView, setActiveView] = useState<AccountingView>('Dashboard');
    const [accounts, setAccounts] = useState(initialAccounts);
    const [journalEntries, setJournalEntries] = useState<JournalEntry[]>(initialJournalEntries);
    const [bills, setBills] = useState<Bill[]>(mockBills);
    const [activeReport, setActiveReport] = useState<ReportType>('pnl');

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

    const renderView = () => {
        switch (activeView) {
            case 'Dashboard':
                 const totalRevenue = accounts.filter(a => a.type === 'Revenue').reduce((sum, acc) => sum + acc.balance, 0);
                 const totalExpenses = accounts.filter(a => a.type === 'Expense').reduce((sum, acc) => sum + acc.balance, 0);
                 const netIncome = totalRevenue - totalExpenses;
                return (
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <Card className="text-center"><h3 className="text-lg text-gray-400">Total Revenue</h3><p className="text-3xl font-bold text-accent">${totalRevenue.toLocaleString()}</p></Card>
                            <Card className="text-center"><h3 className="text-lg text-gray-400">Total Expenses</h3><p className="text-3xl font-bold text-yellow-400">${totalExpenses.toLocaleString()}</p></Card>
                            <Card className="text-center"><h3 className="text-lg text-gray-400">Net Income</h3><p className="text-3xl font-bold text-accent">${netIncome.toLocaleString()}</p></Card>
                        </div>
                        <Card>
                            <h3 className="text-xl font-bold mb-4">Income vs Expense</h3>
                             <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={pnlData}>
                                    <XAxis dataKey="name" stroke="#a8a29e" />
                                    <YAxis stroke="#a8a29e" />
                                    <Tooltip contentStyle={{ backgroundColor: '#041401', border: '1px solid #294A21' }} />
                                    <Bar dataKey="value" fill="#FDDA1A" />
                                </BarChart>
                            </ResponsiveContainer>
                        </Card>
                        <Card>
                             <h3 className="text-xl font-bold mb-4">Expense Breakdown</h3>
                             <ResponsiveContainer width="100%" height={300}>
                                 <PieChart>
                                     <Pie data={expenseBreakdown} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
                                        {expenseBreakdown.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                                     </Pie>
                                     <Tooltip contentStyle={{ backgroundColor: '#041401', border: '1px solid #294A21' }} />
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
                            <table className="w-full text-sm text-left text-gray-400">
                                <thead className="text-xs text-gray-400 uppercase bg-primary"><tr><th className="px-6 py-3">Code</th><th className="px-6 py-3">Account Name</th><th className="px-6 py-3">Type</th><th className="px-6 py-3 text-right">Balance</th></tr></thead>
                                <tbody>{accounts.map(acc => (<tr key={acc.code} className="bg-primary-light border-b border-primary"><td className="px-6 py-4">{acc.code}</td><td className="px-6 py-4 font-medium text-white">{acc.name}</td><td className="px-6 py-4">{acc.type}</td><td className="px-6 py-4 font-mono text-right">${acc.balance.toLocaleString()}</td></tr>))}</tbody>
                            </table>
                        </div>
                    </Card>
                );
            case 'Journal':
                 return (
                    <Card>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left text-gray-400">
                                <thead className="text-xs text-gray-400 uppercase bg-primary"><tr><th className="px-6 py-3">Date</th><th className="px-6 py-3">Description</th><th className="px-6 py-3">Account</th><th className="px-6 py-3 text-right">Debit</th><th className="px-6 py-3 text-right">Credit</th></tr></thead>
                                <tbody>
                                    {filteredJournalEntries.map(entry => (<tr key={entry.id} className="bg-primary-light border-b border-primary"><td className="px-6 py-4">{entry.date}</td><td className="px-6 py-4 font-medium text-white">{entry.description}</td><td className="px-6 py-4">{entry.account}</td><td className="px-6 py-4 font-mono text-yellow-400 text-right">{entry.debit > 0 ? entry.debit.toFixed(2) : '-'}</td><td className="px-6 py-4 font-mono text-accent text-right">{entry.credit > 0 ? entry.credit.toFixed(2) : '-'}</td></tr>))}
                                    {filteredJournalEntries.length === 0 && (
                                        <tr>
                                            <td colSpan={5} className="text-center py-8 text-gray-400">No journal entries found.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </Card>
                );
            case 'Bills':
                 const StatusBadge: React.FC<{ status: Bill['status'] }> = ({ status }) => {
                    const classes = { 'Paid': 'bg-green-500/20 text-green-300', 'Unpaid': 'bg-yellow-500/20 text-yellow-300', 'Overdue': 'bg-red-500/20 text-red-300' };
                    return <span className={`px-2 py-1 text-xs font-medium rounded-full ${classes[status]}`}>{status}</span>;
                };
                return (
                    <Card>
                        <div className="flex justify-between items-center mb-4">
                             <h2 className="text-xl font-bold">Bills to Pay</h2>
                             <button className="bg-accent text-primary font-bold py-2 px-4 rounded hover:opacity-90">Add New Bill</button>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left text-gray-400">
                                <thead className="text-xs text-gray-400 uppercase bg-primary">
                                    <tr><th className="px-4 py-3">Vendor</th><th className="px-4 py-3">Due Date</th><th className="px-4 py-3 text-right">Amount</th><th className="px-4 py-3">Status</th><th className="px-4 py-3">Action</th></tr>
                                </thead>
                                <tbody>
                                    {bills.map(bill => (
                                        <tr key={bill.id} className="bg-primary-light border-b border-primary">
                                            <td className="px-4 py-3 font-medium text-white">{bill.vendorName}</td>
                                            <td className="px-4 py-3">{bill.dueDate}</td>
                                            <td className="px-4 py-3 text-right font-mono">{bill.amount.toLocaleString('en-US', {style: 'currency', currency: bill.currency})}</td>
                                            <td className="px-4 py-3"><StatusBadge status={bill.status} /></td>
                                            <td className="px-4 py-3">{bill.status === 'Unpaid' && <button className="text-accent text-xs font-bold">Pay Now</button>}</td>
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
                            return <div className="bg-primary-light p-4 rounded-lg">
                                <h3 className="text-xl font-bold text-center mb-4">General Ledger</h3>
                                <div className="space-y-6 max-h-[60vh] overflow-y-auto pr-2">
                                    {accounts.map(account => {
                                        const entries = journalEntries.filter(e => e.account === `${account.code} - ${account.name}`);
                                        let runningBalance = account.balance - entries.reduce((acc, e) => acc + e.debit - e.credit, 0); // Calculate opening balance
                                        return (
                                        <div key={account.code}>
                                            <h4 className="font-bold text-accent">{account.code} - {account.name}</h4>
                                            <table className="w-full text-sm mt-2">
                                                <thead className="text-xs text-gray-400 uppercase bg-primary"><tr><th className="px-2 py-1">Date</th><th className="px-2 py-1">Description</th><th className="px-2 py-1 text-right">Debit</th><th className="px-2 py-1 text-right">Credit</th><th className="px-2 py-1 text-right">Balance</th></tr></thead>
                                                <tbody>
                                                     <tr className="border-b border-primary"><td colSpan={4} className="px-2 py-1 text-gray-400">Opening Balance</td><td className="px-2 py-1 font-mono text-right text-gray-400">{runningBalance.toFixed(2)}</td></tr>
                                                    {entries.map(entry => {
                                                        runningBalance += entry.debit - entry.credit;
                                                        return <tr key={entry.id} className="border-b border-primary"><td className="px-2 py-1">{entry.date}</td><td className="px-2 py-1">{entry.description}</td><td className="px-2 py-1 font-mono text-right text-yellow-400">{entry.debit > 0 ? entry.debit.toFixed(2) : null}</td><td className="px-2 py-1 font-mono text-right text-accent">{entry.credit > 0 ? entry.credit.toFixed(2) : null}</td><td className="px-2 py-1 font-mono text-right">{runningBalance.toFixed(2)}</td></tr>
                                                    })}
                                                    <tr className="font-bold bg-primary"><td colSpan={4} className="px-2 py-1 text-white">Closing Balance</td><td className="px-2 py-1 font-mono text-right text-white">{account.balance.toFixed(2)}</td></tr>
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
                        <div className="mb-4 flex flex-wrap justify-center gap-2 p-1 bg-primary-light rounded-lg">
                            {reports.map(r => <button key={r.id} onClick={() => setActiveReport(r.id)} className={`flex-1 px-3 py-1.5 rounded text-sm font-semibold ${activeReport === r.id ? 'bg-accent text-primary' : 'text-gray-300 hover:bg-primary'}`}>{r.name}</button>)}
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
            {renderView()}
        </div>
    )
}

export default Accounting;