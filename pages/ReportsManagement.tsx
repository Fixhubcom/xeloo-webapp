
import React, { useState, useEffect } from 'react';
import Card from '../components/common/Card';
import { UserRole } from '../types';

interface Report {
    id: string;
    name: string;
    dateRange: string;
    type: string;
}

interface ReportsManagementProps {
    userRole: UserRole;
}

const ReportsManagement: React.FC<ReportsManagementProps> = ({ userRole }) => {
    const [reports, setReports] = useState<Report[]>([]);

    useEffect(() => {
        let mockReports: Report[] = [];
        const baseReports = [
            { id: 'rep-001', name: 'Q2 2024 Transaction Summary', dateRange: '01/04/2024 - 30/06/2024', type: 'Transactions' },
            { id: 'rep-002', name: 'June 2024 Full Statement', dateRange: '01/06/2024 - 30/06/2024', type: 'Account' },
        ];
        
        switch (userRole) {
            case UserRole.USER:
                mockReports = [
                    ...baseReports,
                    { id: 'rep-003', name: 'Expense Report by Category', dateRange: 'Q2 2024', type: 'Expenses' },
                ];
                break;
            case UserRole.MERCHANT:
                mockReports = [
                    ...baseReports,
                    { id: 'rep-003', name: 'Q2 2024 Payouts Report', dateRange: 'Q2 2024', type: 'Payouts' },
                    { id: 'rep-004', name: 'Sales by Currency', dateRange: 'June 2024', type: 'Sales' },
                ];
                break;
            case UserRole.PARTNER:
                mockReports = [
                    ...baseReports,
                    { id: 'rep-003', name: 'Q2 2024 Volume Report', dateRange: 'Q2 2024', type: 'Volume' },
                    { id: 'rep-004', name: 'June 2024 Commission Statement', dateRange: 'June 2024', type: 'Commission' },
                ];
                break;
        }
        setReports(mockReports);
    }, [userRole]);
    
    const handleDownload = (report: Report) => {
        const headers = ['id', 'name', 'dateRange', 'type'];
        const rows = [[report.id, report.name, report.dateRange, report.type].join(',')];
        const csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), ...rows].join('\n');
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `${report.name.replace(/\s/g, '_')}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <Card>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-white">Reports</h2>
                {/* Maybe a "Generate New Report" button later */}
            </div>
            <p className="text-gray-400 mb-6">Download your statements and transaction reports for accounting and record-keeping.</p>
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-400">
                    <thead className="text-xs text-gray-400 uppercase bg-primary">
                        <tr>
                            <th className="px-6 py-3">Report Name</th>
                            <th className="px-6 py-3">Date Range</th>
                            <th className="px-6 py-3">Type</th>
                            <th className="px-6 py-3">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {reports.map(report => (
                            <tr key={report.id} className="bg-primary-light border-b border-primary">
                                <td className="px-6 py-4 font-medium text-white">{report.name}</td>
                                <td className="px-6 py-4">{report.dateRange}</td>
                                <td className="px-6 py-4">{report.type}</td>
                                <td className="px-6 py-4">
                                    <button onClick={() => handleDownload(report)} className="font-medium text-accent hover:underline">
                                        Download CSV
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </Card>
    );
};

export default ReportsManagement;
