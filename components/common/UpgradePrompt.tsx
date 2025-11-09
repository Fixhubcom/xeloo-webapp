import React from 'react';
import Card from './Card';
import { RocketIcon, CheckCircleIcon } from '../icons/Icons';

interface UpgradePromptProps {
    featureName: string;
}

const UpgradePrompt: React.FC<UpgradePromptProps> = ({ featureName }) => {
    return (
        <div className="flex items-center justify-center h-full">
            <Card className="max-w-2xl text-center p-10">
                <div className="inline-block bg-accent/10 text-accent p-4 rounded-full mb-4">
                    <RocketIcon className="w-12 h-12" />
                </div>
                <h2 className="text-3xl font-bold text-white mb-3">Unlock {featureName} with a Pro Subscription</h2>
                <p className="text-gray-300 mb-8">
                    Upgrade your plan to access advanced features like professional invoicing, comprehensive accounting tools, and automated financial reports.
                </p>
                <div className="text-left space-y-3 mb-8 inline-block">
                    <p className="flex items-center"><CheckCircleIcon className="w-5 h-5 text-accent mr-2" /> <strong>Professional Invoicing</strong></p>
                    <p className="flex items-center"><CheckCircleIcon className="w-5 h-5 text-accent mr-2" /> <strong>Full Accounting Suite</strong></p>
                    <p className="flex items-center"><CheckCircleIcon className="w-5 h-5 text-accent mr-2" /> <strong>Balance Sheets & P/L Reports</strong></p>
                    <p className="flex items-center"><CheckCircleIcon className="w-5 h-5 text-accent mr-2" /> <strong>Automated Payroll</strong></p>
                </div>
                <div>
                    <button className="bg-accent text-primary font-bold py-3 px-8 rounded-lg text-lg hover:opacity-90 transition-transform transform hover:scale-105">
                        Upgrade Now
                    </button>
                </div>
                <p className="text-xs text-gray-400 mt-4">Subscription plans are managed in the Settings page.</p>
            </Card>
        </div>
    );
};

export default UpgradePrompt;