import React, { useState } from 'react';
import { SupportIcon } from '../icons/Icons';
import Spinner from './Spinner';

const faqs = [
    {
        question: 'How do I send a payment?',
        answer: 'Navigate to the "Send Payment" page from the sidebar. Fill in the recipient\'s details, the amount you want to send, and choose which of your bank accounts to send from. You will see a final confirmation screen before the payment is sent.'
    },
    {
        question: 'How can I add a new bank account?',
        answer: 'Go to Settings > Bank Accounts. Click on the "Add New Account" button and fill in the required details. The account will then be available for sending payments.'
    },
    {
        question: 'Is my data secure?',
        answer: 'Yes, we use industry-standard encryption for all data in transit and at rest. We also offer Two-Factor Authentication (2FA) for an extra layer of security on your account, which you can set up in the Settings page.'
    },
];

const FAQItem: React.FC<{ q: string, a: string }> = ({ q, a }) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div className="border-b border-primary py-3">
            <button onClick={() => setIsOpen(!isOpen)} className="w-full flex justify-between items-center text-left text-gray-800 dark:text-white font-semibold">
                <span>{q}</span>
                <span className={`transform transition-transform ${isOpen ? 'rotate-180' : ''}`}>▼</span>
            </button>
            {isOpen && <p className="mt-2 text-gray-600 dark:text-gray-300">{a}</p>}
        </div>
    )
}


const HelpWidget: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setIsSuccess(false);
        // Simulate API call
        setTimeout(() => {
            setIsSubmitting(false);
            setIsSuccess(true);
        }, 1500)
    }

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="fixed bottom-8 right-8 bg-accent text-primary w-14 h-14 rounded-full shadow-lg flex items-center justify-center hover:opacity-90 transition-transform transform hover:scale-110"
                aria-label="Open Help and Support"
            >
                <SupportIcon className="w-8 h-8" />
            </button>

            {isOpen && (
                <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 animate-fade-in" onClick={() => setIsOpen(false)}>
                    <div className="bg-white dark:bg-primary-light rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
                        <header className="p-4 border-b border-gray-200 dark:border-primary">
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Help & Support</h2>
                        </header>
                        <main className="p-6 overflow-y-auto space-y-6">
                            <div>
                                <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">Frequently Asked Questions</h3>
                                {faqs.map(faq => <FAQItem key={faq.question} q={faq.question} a={faq.answer} />)}
                            </div>
                            <div className="border-t border-gray-200 dark:border-primary pt-6">
                                <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">Contact Support</h3>
                                {isSuccess ? (
                                    <div className="text-center p-4 bg-accent/10 text-accent rounded-md">
                                        <p className="font-semibold">Your message has been sent!</p>
                                        <p className="text-sm">Our support team will get back to you shortly.</p>
                                    </div>
                                ) : (
                                    <form onSubmit={handleSubmit} className="space-y-4">
                                        <input type="text" placeholder="Subject" required className="w-full bg-gray-100 dark:bg-primary p-2 rounded border border-gray-300 dark:border-primary" />
                                        <textarea rows={4} placeholder="How can we help?" required className="w-full bg-gray-100 dark:bg-primary p-2 rounded border border-gray-300 dark:border-primary"></textarea>
                                        <button type="submit" disabled={isSubmitting} className="w-full bg-accent text-primary font-bold py-2 px-4 rounded hover:opacity-90 flex items-center justify-center disabled:bg-gray-500">
                                            {isSubmitting ? <Spinner /> : 'Send Message'}
                                        </button>
                                    </form>
                                )}
                            </div>
                        </main>
                        <footer className="p-4 border-t border-gray-200 dark:border-primary flex justify-end">
                            <button onClick={() => setIsOpen(false)} className="bg-gray-500 text-white font-bold py-2 px-6 rounded hover:bg-gray-600">
                                Close
                            </button>
                        </footer>
                    </div>
                </div>
            )}
        </>
    );
};

export default HelpWidget;