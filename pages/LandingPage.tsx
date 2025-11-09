
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from '../components/common/Logo';
import {
    RocketIcon,
    PercentIcon,
    ShieldCheckIcon,
    PayrollIcon,
    TwitterIcon,
    LinkedInIcon,
    InstagramIcon,
    YouTubeIcon
} from '../components/icons/Icons';

const Header: React.FC = () => {
    const navigate = useNavigate();
    return (
        <header className="absolute top-0 left-0 right-0 z-20 py-4 px-8">
            <div className="container mx-auto flex justify-between items-center">
                <Logo className="text-3xl" />
                <nav className="hidden md:flex items-center space-x-8 text-white">
                    <button onClick={() => navigate('/business')} className="hover:text-accent transition-colors">Business</button>
                    <button onClick={() => navigate('/product')} className="hover:text-accent transition-colors">Product</button>
                    <button onClick={() => navigate('/api')} className="hover:text-accent transition-colors">API</button>
                </nav>
                <div className="space-x-2">
                    <button onClick={() => navigate('/login')} className="text-white font-medium py-2 px-4 rounded-md hover:text-accent transition-colors">Log In</button>
                    <button onClick={() => navigate('/onboarding')} className="bg-accent text-primary font-bold py-2 px-4 rounded-md hover:opacity-90 transition-colors">
                        Sign Up
                    </button>
                </div>
            </div>
        </header>
    );
};

const Hero: React.FC = () => {
    const navigate = useNavigate();
    return (
        <section className="relative pt-32 pb-16 md:pt-40 md:pb-24 text-center overflow-hidden">
             <div className="absolute inset-0 bg-primary opacity-50 z-0"></div>
             <div className="absolute -top-1/4 -left-1/4 w-1/2 h-1/2 bg-accent/5 rounded-full filter blur-3xl"></div>
             <div className="absolute -bottom-1/4 -right-1/4 w-1/2 h-1/2 bg-accent/5 rounded-full filter blur-3xl"></div>
            <div className="container mx-auto px-4 relative z-10">
                <p className="font-mono text-accent tracking-widest mb-2">Fiat – Borderless – Fiat</p>
                <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-4">
                   instant cross-border transactions
                </h1>
                <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto mb-8">
                    Revolutionize Cross-Border Payments. AI-powered borderless remittances and business payments. Send money instantly with 1.5% fees, plus integrated accounting, invoicing, and payroll.
                </p>
                 <button
                    onClick={() => navigate('/onboarding')}
                    className="bg-accent text-primary font-bold py-3 px-8 rounded-lg text-lg hover:opacity-90 transition-transform transform hover:scale-105"
                >
                    Create free account
                </button>
                <p className="text-sm text-gray-400 mt-4">Rated 5 stars by 1,000+ businesses ★★★★★</p>
                
                 <div className="mt-16 max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
                    <div className="bg-primary-light p-4 rounded-lg border border-primary transform md:rotate-[-3deg] shadow-lg">
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-400">All: ▲ 33.3%</span>
                            <span className="text-lg font-bold text-white">80%</span>
                        </div>
                        <p className="text-sm text-gray-400 mt-2">Transaction</p>
                        <p className="text-2xl font-bold text-green-400">+ $2,473.65</p>
                    </div>
                     <div className="bg-primary-light p-4 rounded-lg border border-primary shadow-lg z-10">
                        <p className="text-sm text-gray-400">Performance</p>
                        <div className="w-full bg-primary h-2 rounded-full mt-2">
                            <div className="bg-accent w-3/4 h-2 rounded-full"></div>
                        </div>
                        <p className="text-right text-xs text-gray-400 mt-1">Quarter 🔻</p>
                    </div>
                     <div className="bg-primary-light p-4 rounded-lg border border-primary transform md:rotate-[3deg] shadow-lg">
                        <p className="text-sm text-gray-400">Expenses <span className="text-red-400">$123,456</span></p>
                        <p className="text-sm text-gray-400">Income <span className="text-green-400">$654,321</span></p>
                        <p className="text-lg font-bold text-white mt-1">Profit <span className="text-accent">+ $530,865</span></p>
                    </div>
                </div>

            </div>
        </section>
    );
};

const TrustedBy: React.FC = () => (
    <div className="py-8 bg-primary">
        <div className="container mx-auto text-center">
            <p className="text-sm text-gray-400 uppercase tracking-widest">Trusted by industry leaders:</p>
            <div className="flex justify-center items-center space-x-12 mt-4 text-gray-400 text-2xl font-bold">
                <span>Stripe</span>
                <span>Flutterwave</span>
                <span>Paystack</span>
            </div>
        </div>
    </div>
);

interface FeatureCardProps { icon: React.ReactNode; title: string; description: string; }
const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description }) => (
    <div className="bg-primary-light p-6 rounded-lg text-left transform hover:-translate-y-2 transition-transform duration-300">
        <div className="inline-block bg-accent/10 text-accent p-3 rounded-lg mb-4">{icon}</div>
        <h3 className="text-xl font-bold mb-2">{title}</h3>
        <p className="text-gray-300">{description}</p>
    </div>
);

const Features: React.FC = () => (
    <section className="py-20">
        <div className="container mx-auto px-4">
            <div className="text-center">
                 <h2 className="text-3xl md:text-4xl font-bold mb-4">The all-in-one solution for cross-border payment</h2>
                 <p className="text-gray-300 max-w-2xl mx-auto mb-12">See why over 10,000 people trust our platform for instant cross-border transaction for .</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <FeatureCard icon={<RocketIcon className="w-8 h-8"/>} title="Lightning Fast" description="Settlement in seconds vs days with traditional methods" />
                <FeatureCard icon={<PercentIcon className="w-8 h-8"/>} title="Ultra Low Fees" description="1.5% transaction fees vs up to 15% with traditional remittance" />
                <FeatureCard icon={<ShieldCheckIcon className="w-8 h-8"/>} title="AI-Powered Security" description="Advanced fraud detection and compliance with biometric authentication" />
                <FeatureCard icon={<PayrollIcon className="w-8 h-8"/>} title="Payroll Management" description="Streamlined payroll processing for businesses of all sizes" />
            </div>
             <div className="text-center mt-12">
                <button className="bg-accent text-primary font-bold py-3 px-8 rounded-lg hover:opacity-90">Get Started</button>
            </div>
        </div>
    </section>
);


const ValueProp: React.FC = () => (
    <section className="py-20 bg-primary-light">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center gap-12">
            <div className="md:w-1/2">
                <h2 className="text-3xl font-bold mb-4">Pay suppliers and receive payment through the smarter way</h2>
                <p className="text-gray-300 mb-6">Receive customer payment through our API, pay your remote workforce or freelances and pay suppliers in munities, saving you time to doing other things you enjoy.</p>
                <button className="border border-accent text-accent font-bold py-2 px-6 rounded-lg hover:bg-accent hover:text-primary transition-colors">Watch Demo</button>
            </div>
            <div className="md:w-1/2">
                {/* Placeholder for an image or graphic */}
                <div className="bg-primary rounded-lg p-6 border border-accent/20">
                    <img src="https://storage.googleapis.com/aistudio-ux-team-data/marketing_assets/pro_tools/4252/330_4252_20240502-16-09-58.png" alt="Xeloo Dashboard Interface" className="rounded-md shadow-2xl" />
                </div>
            </div>
        </div>
    </section>
);


const Stats: React.FC = () => (
    <section className="py-20">
        <div className="container mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div><p className="text-4xl font-bold text-accent">+$50M</p><p className="text-gray-400">Annual profit</p></div>
            <div><p className="text-4xl font-bold text-accent">5000+</p><p className="text-gray-400">5 star review</p></div>
            <div><p className="text-4xl font-bold text-accent">1M+</p><p className="text-gray-400">Transaction</p></div>
            <div><p className="text-4xl font-bold text-accent">10K+</p><p className="text-gray-400">Happy businesses</p></div>
        </div>
    </section>
);

const Testimonials: React.FC = () => {
    const testimonialData = [
        { name: 'John Smith', quote: 'This is an amazing product for international trades. Thank you for creating this platform.' },
        { name: 'Mary Adams', quote: 'Simply an amazing product. Thank you for the speed and time you save for my business.' },
        { name: 'Adekunle Suen', quote: 'This product was introduced to me at the right time. i can now pay my suppliers like the speed of light.' },
        { name: 'Janeth Adakole', quote: 'After connecting this product’s API, i was able to receive payment on my website from anywhere in the world.' },
    ];
    return (
        <section className="py-20 bg-primary-light">
            <div className="container mx-auto px-4">
                <div className="text-center">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">Hear what people are saying about us</h2>
                    <p className="text-gray-300 max-w-3xl mx-auto mb-12">Discover the smart cross-border payment for your business and instant settlement in bank accounts, account management, invoicing and payroll software for instant payment anywhere you are.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {testimonialData.map(t => (
                        <div key={t.name} className="bg-primary p-6 rounded-lg">
                            <p className="text-accent font-bold text-xl">★★★★★</p>
                            <p className="text-gray-300 my-4">"{t.quote}"</p>
                            <p className="font-bold text-white">- {t.name}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

const Pricing: React.FC = () => (
    <section className="py-20">
        <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Plans for business engagement</h2>
            <p className="text-gray-300 max-w-2xl mx-auto mb-12">Choose the right product feature for your business</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                <div className="bg-primary-light p-8 rounded-lg text-left border border-primary"><h3 className="text-2xl font-bold">Payment</h3><p className="text-gray-400 my-4">Save Time and excessive transaction cost.</p><p className="text-3xl font-bold"><span className="text-accent">1.5%</span>/per transaction</p><ul className="space-y-2 my-6 text-gray-300"><li>✓ Cross-border Payment</li><li>✓ Instant Settlement</li><li>✓ Transaction History</li><li>✓ Supports All Currencies</li><li>✓ Instant payouts</li><li>- Accounting Tools</li><li>- Invoicing Tools</li></ul><button className="w-full bg-accent text-primary font-bold py-3 rounded-lg hover:opacity-90">Choose Payment</button></div>
                <div className="bg-primary-light p-8 rounded-lg text-left border-2 border-accent transform scale-105"><h3 className="text-2xl font-bold">Business</h3><p className="text-gray-400 my-4">Save 50% <span className="line-through">$199</span></p><p className="text-3xl font-bold"><span className="text-accent">$99</span>/year</p><ul className="space-y-2 my-6 text-gray-300"><li>✓ Cross-border Payment</li><li>✓ Unlimited analytics</li><li>✓ Instant Settlement</li><li>✓ Transaction History</li><li>✓ Supports All Currencies</li><li>✓ Instant payouts & Escrow</li><li>✓ Accounting Tools</li></ul><button className="w-full bg-accent text-primary font-bold py-3 rounded-lg hover:opacity-90">Choose Business</button></div>
                <div className="bg-primary-light p-8 rounded-lg text-left border border-primary"><h3 className="text-2xl font-bold">Pro</h3><p className="text-gray-400 my-4">Save 50% <span className="line-through">$299</span></p><p className="text-3xl font-bold"><span className="text-accent">$199</span>/year</p><ul className="space-y-2 my-6 text-gray-300"><li>✓ Cross-border Payment</li><li>✓ Unlimited analytics</li><li>✓ Instant Settlement</li><li>✓ Transaction History</li><li>✓ Supports All Currencies</li><li>✓ Instant payouts & Escrow</li><li>✓ Accounting & Invoicing Tools</li></ul><button className="w-full bg-accent text-primary font-bold py-3 rounded-lg hover:opacity-90">Choose Pro</button></div>
            </div>
        </div>
    </section>
);

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
                 <p className="text-center mt-8 text-gray-300">Have another question? <a href="#" className="text-accent font-semibold hover:underline">Talk to our team →</a></p>
            </div>
        </section>
    );
};

const CTA: React.FC = () => {
    const navigate = useNavigate();
    return (
        <section className="py-20 bg-primary-light">
            <div className="container mx-auto px-4 text-center">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">Join the platform customers love.</h2>
                <p className="text-gray-300 max-w-2xl mx-auto mb-8">Trust your business with the world’s leading payment gateway.</p>
                <div className="flex justify-center space-x-4">
                    <button className="border border-accent text-accent font-bold py-3 px-6 rounded-lg hover:bg-accent hover:text-primary transition-colors">Book A Demo</button>
                    <button onClick={() => navigate('/onboarding')} className="bg-accent text-primary font-bold py-3 px-6 rounded-lg hover:opacity-90">Create free account</button>
                </div>
            </div>
        </section>
    );
};

const Footer: React.FC = () => {
    const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });
    return (
        <footer className="bg-primary pt-16 pb-8">
            <div className="container mx-auto px-8">
                <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-8">
                    <div className="col-span-2 md:col-span-1">
                        <Logo />
                        <p className="text-sm text-gray-400 mt-4">AI-powered borderless remittances and business payments.</p>
                         <div className="flex space-x-4 mt-4">
                            <a href="#" className="text-gray-300 hover:text-accent"><TwitterIcon /></a>
                            <a href="#" className="text-gray-300 hover:text-accent"><YouTubeIcon /></a>
                            <a href="#" className="text-gray-300 hover:text-accent"><InstagramIcon /></a>
                            <a href="#" className="text-gray-300 hover:text-accent"><LinkedInIcon /></a>
                        </div>
                    </div>
                    <div><h3 className="font-bold mb-4">Pages</h3><ul className="space-y-2 text-gray-300"><li><a href="#" className="hover:text-accent">About Us</a></li><li><a href="#" className="hover:text-accent">Our Services</a></li><li><a href="#" className="hover:text-accent">Contact Us</a></li></ul></div>
                    <div><h3 className="font-bold mb-4">Product</h3><ul className="space-y-2 text-gray-300"><li><a href="#" className="hover:text-accent">Cross-border</a></li><li><a href="#" className="hover:text-accent">Payroll</a></li><li><a href="#" className="hover:text-accent">Escrow</a></li></ul></div>
                    <div><h3 className="font-bold mb-4">Extra</h3><ul className="space-y-2 text-gray-300"><li><a href="#/terms" className="hover:text-accent">Terms</a></li><li><a href="#" className="hover:text-accent">Privacy Policy</a></li><li><a href="#" className="hover:text-accent">Affiliate</a></li></ul></div>
                </div>
                <div className="border-t border-primary-light pt-6 flex justify-between items-center text-gray-400 text-sm">
                    <p>© {new Date().getFullYear()} Xeloo ・All rights reserved by Fix Hub Communications Ltd</p>
                    <button onClick={scrollToTop} className="hover:text-accent">Return to top ↑</button>
                </div>
            </div>
        </footer>
    );
};


const LandingPage: React.FC = () => {
    return (
        <div className="bg-primary text-white min-h-screen">
            <Header />
            <main>
                <Hero />
                <TrustedBy />
                <Features />
                <ValueProp />
                <Stats />
                <Testimonials />
                <Pricing />
                <FAQ />
                <CTA />
            </main>
            <Footer />
        </div>
    );
};

export default LandingPage;
