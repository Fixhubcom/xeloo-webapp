
import React, { useState } from 'react';
import Card from '../../components/common/Card';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

type AccountingView = 'Dashboard' | 'Chart of Accounts' | 'Journal' | 'Reports';

// Mock Data
const accounts = [
    { code: '1010', name: 'Cash and Bank', type: 'Asset', balance: 100245.50 },
    { code: '1200', name: 'Accounts Receivable', type: 'Asset', balance: 15000.00 },
    { code: '1500', name: 'Equipment', type: 'Asset', balance: 25000.00 },
    { code: '2010', name: 'Accounts Payable', type: 'Liability', balance: 8500.00 },
    { code: '2200', name: 'Loans Payable', type: 'Liability', balance: 30000.00 },
    { code: '3010', name: 'Owner\'s Capital', type: 'Equity', balance: 50000.00 },
    { code: '3300', name: 'Retained Earnings', type: 'Equity', balance: 42745.50 },
    { code: '4010', name: 'Service Revenue', type: 'Revenue', balance: 95000.00 },
    { code: '5010', name: 'Software Subscriptions', type: 'Expense', balance: 2500.00 },
    { code: '5020', name: 'Marketing', type: 'Expense', balance: 5000.00 },
    { code: '5030', name: 'Rent', type: 'Expense', balance: 12000.00 },
];

const journalEntries = [
    { id: 1, date: '2024-07-22', description: 'Client Payment - Acme Inc.', account: '1010 - Cash and Bank', debit: 495.00, credit: 0 },
    { id: 2, date: '2024-07-22', description: 'Client Payment - Acme Inc.', account: '4010 - Service Revenue', debit: 0, credit: 495.00 },
    { id: 3, date: '2024-07-21', description: 'Payout - Lagos Ventures', account: '2010 - Accounts Payable', debit: 1015.00, credit: 0 },
    { id: 4, date: '2024-07-21', description: 'Payout - Lagos Ventures', account: '1010 - Cash and Bank', debit: 0, credit: 1015.00 },
];

const pnlData = [
    { name: 'Revenue', value: 95000 },
    { name: 'Expenses', value: 19500 },
];
const expenseBreakdown = [
    { name: 'Software', value: 2500 },
    { name: 'Marketing', value: 5000 },
    { name: 'Rent', value: 12000 },
]
const COLORS = ['#4ade80', '#f87171', '#fdda1a'];

const ViewSwitcher: React.FC<{ activeView: AccountingView, setActiveView: (view: AccountingView) => void }> = ({ activeView, setActiveView }) => {
    const views: AccountingView[] = ['Dashboard', 'Chart of Accounts', 'Journal', 'Reports'];
    return (
        <div className="mb-6 flex space-x-2 p-1 bg-primary-light rounded-lg">
            {views.map(view => (
                <button
                    key={view}
                    onClick={() => setActiveView(view)}
                    className={`w-full text-center px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeView === view ? 'bg-accent text-primary' : 'text-gray-light hover:bg-gray-dark'}`}
                >
                    {view}
                </button>
            ))}
        </div>
    );
};

const ReportTable: React.FC<{ title: string, sections: { title: string, items: { name: string, value: number }[], total: number }[], grandTotal?: { label: string, value: number } }> = ({ title, sections, grandTotal }) => (
    <div className="bg-primary-light p-6 rounded-lg">
        <h3 className="text-xl font-bold text-center mb-4">{title}</h3>
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
                        <tr className="border-t border-gray-medium">
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
);


const Accounting: React.FC = () => {
    const [activeView, setActiveView] = useState<AccountingView>('Dashboard');

    const renderView = () => {
        switch (activeView) {
            case 'Dashboard': {
                 const totalRevenue = accounts.filter(a => a.type === 'Revenue').reduce((sum, acc) => sum + acc.balance, 0);
                 const totalExpenses = accounts.filter(a => a.type === 'Expense').reduce((sum, acc) => sum + acc.balance, 0);
                 const netIncome = totalRevenue - totalExpenses;
                return (
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <Card className="text-center"><h3 className="text-lg text-gray-light">Total Revenue</h3><p className="text-3xl font-bold text-green-400">${totalRevenue.toLocaleString()}</p></Card>
                            <Card className="text-center"><h3 className="text-lg text-gray-light">Total Expenses</h3><p className="text-3xl font-bold text-red-400">${totalExpenses.toLocaleString()}</p></Card>
                            <Card className="text-center"><h3 className="text-lg text-gray-light">Net Income</h3><p className="text-3xl font-bold text-accent">${netIncome.toLocaleString()}</p></Card>
                        </div>
                        <Card>
                            <h3 className="text-xl font-bold mb-4">Income vs Expense</h3>
                             <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={pnlData}>
                                    <XAxis dataKey="name" stroke="#9ca3af" />
                                    <YAxis stroke="#9ca3af" />
                                    <Tooltip contentStyle={{ backgroundColor: '#111827', border: '1px solid #374151' }} />
                                    <Bar dataKey="value" fill="#fdda1a" />
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
                                     <Tooltip contentStyle={{ backgroundColor: '#111827', border: '1px solid #374151' }} />
                                 </PieChart>
                            </ResponsiveContainer>
                        </Card>
                    </div>
                );
            }
            case 'Chart of Accounts':
                return (
                    <Card>
                        <table className="w-full text-sm text-left text-gray-light">
                            <thead className="text-xs text-gray-400 uppercase bg-primary"><tr><th className="px-6 py-3">Code</th><th className="px-6 py-3">Account Name</th><th className="px-6 py-3">Type</th><th className="px-6 py-3 text-right">Balance</th></tr></thead>
                            <tbody>{accounts.map(acc => (<tr key={acc.code} className="bg-primary-light border-b border-gray-medium"><td className="px-6 py-4">{acc.code}</td><td className="px-6 py-4 font-medium text-white">{acc.name}</td><td className="px-6 py-4">{acc.type}</td><td className="px-6 py-4 font-mono text-right">${acc.balance.toLocaleString()}</td></tr>))}</tbody>
                        </table>
                    </Card>
                );
            case 'Journal':
                 return (
                    <Card>
                        <table className="w-full text-sm text-left text-gray-light">
                            <thead className="text-xs text-gray-400 uppercase bg-primary"><tr><th className="px-6 py-3">Date</th><th className="px-6 py-3">Description</th><th className="px-6 py-3">Account</th><th className="px-6 py-3 text-right">Debit</th><th className="px-6 py-3 text-right">Credit</th></tr></thead>
                            <tbody>{journalEntries.map(entry => (<tr key={entry.id} className="bg-primary-light border-b border-gray-medium"><td className="px-6 py-4">{entry.date}</td><td className="px-6 py-4 font-medium text-white">{entry.description}</td><td className="px-6 py-4">{entry.account}</td><td className="px-6 py-4 font-mono text-red-400 text-right">{entry.debit > 0 ? entry.debit.toFixed(2) : '-'}</td><td className="px-6 py-4 font-mono text-green-400 text-right">{entry.credit > 0 ? entry.credit.toFixed(2) : '-'}</td></tr>))}</tbody>
                        </table>
                    </Card>
                );
            case 'Reports': {
                const assets = accounts.filter(a => a.type === 'Asset');
                const totalAssets = assets.reduce((sum, a) => sum + a.balance, 0);
                const liabilities = accounts.filter(a => a.type === 'Liability');
                const totalLiabilities = liabilities.reduce((sum, a) => sum + a.balance, 0);
                const equity = accounts.filter(a => a.type === 'Equity');
                const totalEquity = equity.reduce((sum, a) => sum + a.balance, 0);

                const revenues = accounts.filter(a => a.type === 'Revenue');
                const totalRevenues = revenues.reduce((sum, a) => sum + a.balance, 0);
                const expenses = accounts.filter(a => a.type === 'Expense');
                const totalExpenses = expenses.reduce((sum, a) => sum + a.balance, 0);
                const netIncome = totalRevenues - totalExpenses;

                return (
                    <div className="space-y-8">
                        <ReportTable
                            title="Balance Sheet"
                            sections={[
                                { title: 'Assets', items: assets.map(a => ({ name: a.name, value: a.balance })), total: totalAssets },
                                { title: 'Liabilities', items: liabilities.map(a => ({ name: a.name, value: a.balance })), total: totalLiabilities },
                                { title: 'Equity', items: equity.map(a => ({ name: a.name, value: a.balance })), total: totalEquity },
                            ]}
                            grandTotal={{ label: 'Total Liabilities & Equity', value: totalLiabilities + totalEquity }}
                        />
                         <ReportTable
                            title="Profit & Loss Statement"
                            sections={[
                                { title: 'Revenue', items: revenues.map(a => ({ name: a.name, value: a.balance })), total: totalRevenues },
                                { title: 'Expenses', items: expenses.map(a => ({ name: a.name, value: a.balance })), total: totalExpenses },
                            ]}
                            grandTotal={{ label: 'Net Income', value: netIncome }}
                        />
                    </div>
                )
            }
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