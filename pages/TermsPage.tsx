
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from '../components/common/Logo';

const TermsPage: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="bg-gray-100 dark:bg-primary text-gray-900 dark:text-gray-100 min-h-screen">
            <header className="py-4 px-8 bg-white dark:bg-primary-light shadow-md">
                <div className="container mx-auto flex justify-between items-center">
                    <Logo className="text-3xl" />
                    <button onClick={() => navigate('/')} className="text-accent font-medium hover:underline">
                        &larr; Back to Home
                    </button>
                </div>
            </header>

            <main className="container mx-auto py-12 px-4 md:px-8">
                <div className="max-w-4xl mx-auto bg-white dark:bg-primary-light p-8 rounded-lg shadow-lg">
                    <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">Terms and Conditions</h1>
                    <div className="space-y-4 text-gray-600 dark:text-gray-light prose dark:prose-invert">
                        <p><strong>Last updated:</strong> {new Date().toLocaleDateString()}</p>

                        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">1. Introduction</h2>
                        <p>
                            Welcome to Xeloo ("Company", "we", "our", "us")! These Terms and Conditions ("Terms") govern your use of our website located at xeloo.app (together or individually "Service") operated by Xeloo. Our Privacy Policy also governs your use of our Service and explains how we collect, safeguard and disclose information that results from your use of our web pages.
                        </p>

                        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">2. Accounts</h2>
                        <p>
                            When you create an account with us, you guarantee that you are above the age of 18, and that the information you provide us is accurate, complete, and current at all times. Inaccurate, incomplete, or obsolete information may result in the immediate termination of your account on our Service.
                        </p>

                        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">3. Prohibited Uses</h2>
                        <p>
                            You may use Service only for lawful purposes and in accordance with Terms. You agree not to use Service: (a) In any way that violates any applicable national or international law or regulation. (b) For the purpose of exploiting, harming, or attempting to exploit or harm minors in any way by exposing them to inappropriate content or otherwise.
                        </p>

                        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">4. Intellectual Property</h2>
                        <p>
                            The Service and its original content (excluding Content provided by users), features and functionality are and will remain the exclusive property of Xeloo and its licensors.
                        </p>

                        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">5. Limitation Of Liability</h2>
                        <p>
                            Except as prohibited by law, you will hold us and our officers, directors, employees, and agents harmless for any indirect, punitive, special, incidental, or consequential damage, however it arises (including attorneys' fees and all related costs and expenses of litigation and arbitration, or at trial or on appeal, if any, whether or not litigation or arbitration is instituted).
                        </p>

                        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">6. Governing Law</h2>
                        <p>
                            These Terms shall be governed and construed in accordance with the laws of the jurisdiction in which the company is established, without regard to its conflict of law provisions.
                        </p>

                        <p>
                            By using our service, you agree to these terms. If you do not agree, do not use the service.
                        </p>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default TermsPage;
