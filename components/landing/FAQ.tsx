
import React, { useState } from 'react';

const FAQItem: React.FC<{ q: string, a: string }> = ({ q, a }) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div className="border-b border-primary-light py-4">
            <button onClick={() => setIsOpen(!isOpen)} className="w-full flex justify-between items-center text-left text-lg font-semibold">
                <span>{q}</span>
                <span className={`transform transition-transform text-accent ${isOpen ? 'rotate-45' : ''}`}>+</span>
            </button>
            {isOpen && <p className="mt-3 text-gray-300">{a}</p>}
        </div>
    );
}

const FAQ: React.FC = () => {
    const faqs = [
        { q: 'What makes Xeloo different from traditional money transfer services?', a: 'Xeloo uses blockchain technology and an AI-powered platform to offer instant settlements, significantly lower fees (1.5%), and enhanced security compared to traditional services that can take days and charge up to 15%.' },
        { q: 'How fast are payments processed?', a: 'Payments are processed in seconds. Our modern infrastructure ensures that recipients get their money almost instantly.' },
        { q: 'What are your fees?', a: 'We charge a flat 1.5% fee on transactions. For businesses, we offer subscription plans that provide additional features like accounting, invoicing, and escrow services.' },
        { q: 'Is Xeloo secure?', a: 'Yes. We employ AI-powered fraud detection, biometric authentication, and blockchain-backed operations to ensure the highest level of security for your transactions and data.' },
        { q: 'Can businesses use Xeloo for payroll?', a: 'Absolutely. Our platform includes streamlined payroll processing, making it easy to pay employees and freelancers across borders.' },
        { q: 'Do you provide accounting and invoicing features?', a: 'Yes, our Business and Pro plans include integrated accounting and invoicing tools to help you manage your finances efficiently.' },
        { q: 'Can I integrate Xeloo into my website or app?', a: 'Yes, we provide a robust API that allows you to integrate our payment gateway directly into your website or application to receive payments from customers globally.' },
        { q: 'Who can use Xeloo?', a: 'Xeloo is for everyone! Individuals, freelancers, and businesses of all sizes can use our platform for cross-border payments.' },
        { q: 'In which countries is Xeloo available?', a: 'We are constantly expanding our network. Currently, we support payments to a wide range of countries across Africa and beyond. Please check our supported countries list for details.' },
        { q: 'How do I get started?', a: 'Getting started is easy! Just click the "Create free account" button, and our AI-powered onboarding will guide you through the simple setup process.' },
    ];

    return (
        <section className="py-20">
            <div className="container mx-auto px-4 max-w-4xl">
                <h2 className="text-3xl md:text-4xl font-bold text-center mb-8">Frequently asked questions</h2>
                <div>
                    {faqs.map((faq, i) => <FAQItem key={i} q={faq.q} a={faq.a} />)}
                </div>
                 <p className="text-center mt-8 text-gray-300">Have another question? <a href="#/contact-us" className="text-accent font-semibold hover:underline">Talk to our team →</a></p>
            </div>
        </section>
    );
};

export default FAQ;
