
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from '../components/common/Logo';

const PrivacyPolicyPage: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="bg-primary text-gray-100 min-h-screen">
            <header className="py-4 px-8 bg-primary-light shadow-md">
                <div className="container mx-auto flex justify-between items-center">
                    <Logo className="text-3xl" />
                    <button onClick={() => navigate('/')} className="text-accent font-medium hover:underline">
                        &larr; Back to Home
                    </button>
                </div>
            </header>

            <main className="container mx-auto py-12 px-4 md:px-8">
                <div className="max-w-4xl mx-auto bg-primary-light p-8 rounded-lg shadow-lg">
                    <h1 className="text-3xl font-bold mb-6 text-white">Privacy Policy</h1>
                    <div className="space-y-4 text-gray-light prose dark:prose-invert">
                        <p><strong>Last updated:</strong> {new Date().toLocaleDateString()}</p>

                        <h2 className="text-xl font-semibold text-gray-200">1. Information We Collect</h2>
                        <p>
                           We collect information that you provide directly to us when you create an account, use our services, or communicate with us. This may include personal information such as your name, email address, phone number, and financial information necessary for processing transactions. We also collect information automatically as you navigate through the site.
                        </p>

                        <h2 className="text-xl font-semibold text-gray-200">2. How We Use Your Information</h2>
                        <p>
                           We use the information we collect to operate, maintain, and provide the features and functionality of the Service, to process transactions, for compliance purposes (such as KYC/AML), to communicate with you, and to personalize your experience.
                        </p>

                        <h2 className="text-xl font-semibold text-gray-200">3. Data Security</h2>
                        <p>
                            The security of your data is important to us. We use commercially acceptable means to protect your Personal Information, including encryption and secure server infrastructure. However, remember that no method of transmission over the Internet or method of electronic storage is 100% secure.
                        </p>

                        <h2 className="text-xl font-semibold text-gray-200">4. Data Retention</h2>
                        <p>
                            We will retain your Personal Information only for as long as is necessary for the purposes set out in this Privacy Policy. We will retain and use your information to the extent necessary to comply with our legal obligations, resolve disputes, and enforce our policies.
                        </p>

                        <h2 className="text-xl font-semibold text-gray-200">5. Your Data Protection Rights</h2>
                        <p>
                            Depending on your location, you may have certain rights under data protection laws. These may include the right to access, update, or delete the information we have on you. If you wish to be informed about what Personal Information we hold about you and if you want it to be removed from our systems, please contact us.
                        </p>
                        
                        <h2 className="text-xl font-semibold text-gray-200">6. Changes to This Privacy Policy</h2>
                        <p>
                           We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page. You are advised to review this Privacy Policy periodically for any changes.
                        </p>

                    </div>
                </div>
            </main>
        </div>
    );
};

export default PrivacyPolicyPage;
