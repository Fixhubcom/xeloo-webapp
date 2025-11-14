import React from 'react';
import Card from '../../components/common/Card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { useTheme } from '../../context/ThemeContext';

const userGrowthData = [
    { name: 'Jan', Users: 1200 }, { name: 'Feb', Users: 2100 }, { name: 'Mar', Users: 3500 },
    { name: 'Apr', Users: 5200 }, { name: 'May', Users: 7800 }, { name: 'Jun', Users: 10200 },
];
const volumeData = [
    { name: 'Jan', Volume: 2.4 }, { name: 'Feb', Volume: 3.1 }, { name: 'Mar', Volume: 4.5 },
    { name: 'Apr', Volume: 5.2 }, { name: 'May', Volume: 6.8 }, { name: 'Jun', Volume: 8.1 },
];
const revenueData = [
    { name: 'Commissions', value: 75320 },
    { name: 'Subscriptions', value: 12850 },
];
const COLORS_DARK = ['#FDDA1A', '#FFFFFF'];
const COLORS_LIGHT = ['#D97706', '#4B5563'];

const AdminReports: React.FC = () => {
    const { theme } = useTheme();
    const gridColor = theme === 'dark' ? '#294A21' : '#e5e7eb';
    const textColor = theme === 'dark' ? '#a8a29e' : '#6b7280';
    const tooltipStyles = {
        contentStyle: {
            backgroundColor: theme === 'dark' ? '#041401' : '#ffffff',
            border: `1px solid ${theme === 'dark' ? '#294A21' : '#e5e7eb'}`,
        }
    };
    const COLORS = theme === 'dark' ? COLORS_DARK : COLORS_LIGHT;

    return (
        <div className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card>
                    <h3 className="text-xl font-bold mb-4">User Growth</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={userGrowthData}>
                            <CartesianGrid strokeDasharray="3 3" stroke={gridColor}/>
                            <XAxis dataKey="name" stroke={textColor} />
                            <YAxis stroke={textColor} />
                            <Tooltip {...tooltipStyles} />
                            <Legend />
                            <Line type="monotone" dataKey="Users" stroke="#FDDA1A" strokeWidth={2} />
                        </LineChart>
                    </ResponsiveContainer>
                </Card>
                <Card>
                    <h3 className="text-xl font-bold mb-4">Transaction Volume (in Millions USD)</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={volumeData}>
                            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                            <XAxis dataKey="name" stroke={textColor} />
                            <YAxis stroke={textColor} />
                            <Tooltip {...tooltipStyles} />
                            <Legend />
                            <Bar dataKey="Volume" fill="#FDDA1A" />
                        </BarChart>
                    </ResponsiveContainer>
                </Card>
            </div>
            <Card>
                <h3 className="text-xl font-bold mb-4">Revenue Sources (Last 30d)</h3>
                <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                        <Pie data={revenueData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label={{fill: textColor}}>
                            {revenueData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                        </Pie>
                        <Tooltip {...tooltipStyles} />
                        <Legend />
                    </PieChart>
                </ResponsiveContainer>
            </Card>
        </div>
    );
};

export default AdminReports;