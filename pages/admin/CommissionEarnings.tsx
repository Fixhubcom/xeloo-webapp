import React, { useState, useMemo } from 'react';
import Card from '../../components/common/Card';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { useTheme } from '../../context/ThemeContext';

interface CommissionEntry {
  id: string;
  transactionId: string;
  date: string; // YYYY-MM-DD
  user: string;
  userCompany: string;
  transactionAmount: number;
  commission: number;
}

// Mock data spanning 30 days
const allCommissions: CommissionEntry[] = [
    { id: 'c1', transactionId: 'txn_1', date: new Date().toISOString().split('T')[0], user: 'John Doe', userCompany: 'Creative Solutions', transactionAmount: 500, commission: 5.00 },
    { id: 'c2', transactionId: 'txn_2', date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], user: 'NewBiz Co', userCompany: 'NewBiz Co', transactionAmount: 1000, commission: 15.00 },
    { id: 'c3', transactionId: 'txn_3', date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], user: 'John Doe', userCompany: 'Creative Solutions', transactionAmount: 750, commission: 11.25 },
    { id: 'c4', transactionId: 'txn_4', date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], user: 'Jane Smith', userCompany: 'NewBiz Co', transactionAmount: 1200, commission: 18.00 },
    { id: 'c5', transactionId: 'txn_5', date: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], user: 'John Doe', userCompany: 'Creative Solutions', transactionAmount: 3500, commission: 52.50 },
    { id: 'c6', transactionId: 'txn_6', date: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], user: 'Other Biz', userCompany: 'Other Biz', transactionAmount: 2000, commission: 30.00 },
    { id: 'c7', transactionId: 'txn_7', date: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], user: 'Another Co', userCompany: 'Another Co', transactionAmount: 5000, commission: 75.00 },
];


type TimeFilter = '24h' | '7d' | '30d';

const CommissionEarnings: React.FC<{ searchQuery: string }> = ({ searchQuery }) => {
    const { theme } = useTheme();
    const [timeFilter, setTimeFilter] = useState<TimeFilter>('30d');

    const gridColor = theme === 'dark' ? '#294A21' : '#e5e7eb';
    const textColor = theme === 'dark' ? '#a8a29e' : '#6b7280';
    const barColor = theme === 'dark' ? '#FDDA1A' : '#F59E0B';
    const tooltipStyles = {
        contentStyle: {
            backgroundColor: theme === 'dark' ? '#041401' : '#ffffff',
            border: `1px solid ${theme === 'dark' ? '#294A21' : '#e5e7eb'}`,
        }
    };

    const filteredCommissions = useMemo(() => {
        const now = new Date();
        const filterDate = new Date();
        
        if (timeFilter === '24h') {
            filterDate.setDate(now.getDate() - 1);
        } else if (timeFilter === '7d') {
            filterDate.setDate(now.getDate() - 7);
        } else if (timeFilter === '30d') {
            filterDate.setDate(now.getDate() - 30);
        }

        return allCommissions.filter(c => {
            const commissionDate = new Date(c.date);
            const searchMatch = !searchQuery || 
                c.user.toLowerCase().includes(searchQuery.toLowerCase()) || 
                c.userCompany.toLowerCase().includes(searchQuery.toLowerCase()) ||
                c.transactionId.toLowerCase().includes(searchQuery.toLowerCase());

            return commissionDate >= filterDate && searchMatch;
        });
    }, [timeFilter, searchQuery]);
    
    const totalCommission = useMemo(() => {
        return filteredCommissions.reduce((sum, c) => sum + c.commission, 0);
    }, [filteredCommissions]);

    // Data for the chart
    const chartData = useMemo(() => {
        const dataMap = new Map<string, number>();
        filteredCommissions.forEach(c => {
            const date = c.date;
            dataMap.set(date, (dataMap.get(date) || 0) + c.commission);
        });
        return Array.from(dataMap.entries()).map(([date, commission]) => ({ date, commission })).sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    }, [filteredCommissions]);

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <div className="flex space-x-2 p-1 bg-white dark:bg-primary-light rounded-lg">
                    {(['24h', '7d', '30d'] as TimeFilter[]).map(filter => (
                        <button
                            key={filter}
                            onClick={() => setTimeFilter(filter)}
                            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${timeFilter === filter ? 'bg-accent text-primary' : 'text-gray-500 dark:text-gray-300 hover:bg-slate-100 dark:hover:bg-primary'}`}
                        >
                            Last {filter === '24h' ? '24 Hours' : filter.replace('d', ' Days')}
                        </button>
                    ))}
                </div>
                 <Card className="text-center p-4">
                    <h3 className="text-sm text-gray-500 dark:text-gray-400">Total Commission ({timeFilter.replace('h', ' hours').replace('d', ' days')})</h3>
                    <p className="text-2xl font-bold text-accent">{totalCommission.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</p>
                </Card>
            </div>
            
            <Card>
                 <h3 className="text-xl font-bold mb-4">Daily Commission Breakdown</h3>
                <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                        <XAxis dataKey="date" stroke={textColor} fontSize={12} />
                        <YAxis stroke={textColor} fontSize={12} tickFormatter={(value) => `$${value}`} />
                        <Tooltip {...tooltipStyles} formatter={(value: number) => [value.toLocaleString('en-US', { style: 'currency', currency: 'USD' }), 'Commission']} />
                        <Bar dataKey="commission" fill={barColor} />
                    </BarChart>
                </ResponsiveContainer>
            </Card>

            <Card>
                <h2 className="text-xl font-bold mb-4">Commission Log</h2>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                        <thead className="text-xs text-gray-500 dark:text-gray-400 uppercase bg-slate-100 dark:bg-primary">
                            <tr>
                                <th className="px-6 py-3">Date</th>
                                <th className="px-6 py-3">User</th>
                                <th className="px-6 py-3">Transaction ID</th>
                                <th className="px-6 py-3 text-right">Transaction Amount</th>
                                <th className="px-6 py-3 text-right">Commission Earned</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredCommissions.map(c => (
                                <tr key={c.id} className="bg-white dark:bg-primary-light border-b border-slate-100 dark:border-primary">
                                    <td className="px-6 py-4">{c.date}</td>
                                    <td className="px-6 py-4">
                                        <div className="font-medium text-slate-800 dark:text-white">{c.user}</div>
                                        <div className="text-xs">{c.userCompany}</div>
                                    </td>
                                    <td className="px-6 py-4 font-mono">{c.transactionId}</td>
                                    <td className="px-6 py-4 font-mono text-right">{c.transactionAmount.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</td>
                                    <td className="px-6 py-4 font-mono text-right text-accent">{c.commission.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</td>
                                </tr>
                            ))}
                            {filteredCommissions.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="text-center py-8 text-gray-500 dark:text-gray-400">No commissions found for this period.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );
}

export default CommissionEarnings;