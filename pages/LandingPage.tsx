
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from '../components/common/Logo';
import {
    RocketIcon,
    PercentIcon,
    NoFeeIcon,
    HeadsetIcon,
    GlobeIcon,
    LocationMarkerIcon,
    TwitterIcon,
    LinkedInIcon,
    InstagramIcon,
} from '../components/icons/Icons';

// Header Component
const Header: React.FC = () => {
    const navigate = useNavigate();
    return (
        <header className="absolute top-0 left-0 right-0 z-10 py-4 px-8">
            <div className="container mx-auto flex justify-between items-center">
                <Logo className="text-3xl" />
                <nav className="hidden md:flex items-center space-x-8">
                    <a href="#" className="hover:text-accent transition-colors">Personal</a>
                    <a href="#" className="hover:text-accent transition-colors">Business</a>
                    <a href="#" className="hover:text-accent transition-colors">Company</a>
                </nav>
                <div className="space-x-4">
                    <button onClick={() => navigate('/login')} className="text-white font-medium hover:text-accent transition-colors">Log In</button>
                    <button onClick={() => navigate('/onboarding')} className="bg-accent text-primary font-bold py-2 px-4 rounded-md hover:bg-yellow-400 transition-colors">
                        Sign Up
                    </button>
                </div>
            </div>
        </header>
    );
};

// Hero Component
const Hero: React.FC = () => {
    const navigate = useNavigate();
    return (
        <section className="relative pt-32 pb-16 md:pt-48 md:pb-24 text-center overflow-hidden">
            <div className="absolute inset-0 bg-primary opacity-50"></div>
             <div className="absolute -top-1/4 -left-1/4 w-1/2 h-1/2 bg-accent/10 rounded-full filter blur-3xl"></div>
            <div className="absolute -bottom-1/4 -right-1/4 w-1/2 h-1/2 bg-accent/10 rounded-full filter blur-3xl"></div>
            <div className="container mx-auto px-4 relative z-10">
                <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-4">
                    Seamless Cross-Border Payments <br />
                    for <span className="text-accent">Africa</span>
                </h1>
                <p className="text-lg md:text-xl text-gray-light max-w-3xl mx-auto mb-8">
                    Send and receive money from anywhere in the world to Africa. We offer the best exchange rates with zero transfer fees.
                </p>
                <button
                    onClick={() => navigate('/onboarding')}
                    className="bg-accent text-primary font-bold py-3 px-8 rounded-lg text-lg hover:bg-yellow-400 transition-transform transform hover:scale-105"
                >
                    Get Started Free
                </button>
                <div className="mt-12">
                    <p className="text-sm text-gray-light uppercase tracking-widest">Trusted by over 100,000 users</p>
                    <div className="flex justify-center items-center space-x-8 mt-4 text-gray-500">
                        {/* Placeholder logos */}
                        <span className="font-semibold text-xl">Stripe</span>
                        <span className="font-semibold text-xl">Flutterwave</span>
                        <span className="font-semibold text-xl">Paystack</span>
                    </div>
                </div>
            </div>
        </section>
    );
};

// Feature Card Component
interface FeatureCardProps {
    icon: React.ReactNode;
    title: string;
    description: string;
}
const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description }) => (
    <div className="bg-primary-light p-6 rounded-lg text-center transform hover:-translate-y-2 transition-transform duration-300">
        <div className="inline-block bg-accent/10 text-accent p-4 rounded-full mb-4">
            {icon}
        </div>
        <h3 className="text-xl font-bold mb-2">{title}</h3>
        <p className="text-gray-light">{description}</p>
    </div>
);

// Features Component
const Features: React.FC = () => (
    <section className="py-20 bg-primary">
        <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose Xeloo</h2>
            <p className="text-gray-light max-w-2xl mx-auto mb-12">We are the best at what we do when it comes to cross-border payments.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <FeatureCard icon={<RocketIcon className="w-8 h-8"/>} title="Fast & Secure" description="Our blockchain-backed operations ensure your transactions are fast and secure." />
                <FeatureCard icon={<PercentIcon className="w-8 h-8"/>} title="Best Rates" description="We provide the most competitive exchange rates on the market." />
                <FeatureCard icon={<NoFeeIcon className="w-8 h-8"/>} title="Zero Fees" description="Enjoy zero transfer fees on all your cross-border transactions." />
                <FeatureCard icon={<HeadsetIcon className="w-8 h-8"/>} title="24/7 Support" description="Our dedicated support team is available around the clock to assist you." />
                <FeatureCard icon={<LocationMarkerIcon className="w-8 h-8"/>} title="Live Tracking" description="Track your payments in real-time from start to finish." />
                <FeatureCard icon={<GlobeIcon className="w-8 h-8"/>} title="Global Reach" description="Send money to multiple African countries in their local currencies." />
            </div>
        </div>
    </section>
);

// How It Works Component
const HowItWorks: React.FC = () => (
    <section className="py-20">
        <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-12">Send Money in 3 Easy Steps</h2>
            <div className="relative flex flex-col md:flex-row justify-center items-center gap-8 md:gap-16">
                 {/* Dotted line for desktop */}
                 <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 border-t-2 border-dashed border-gray-medium transform -translate-y-1/2"></div>

                <div className="relative z-10 text-center">
                    <div className="w-20 h-20 bg-primary-light border-2 border-accent text-accent rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">1</div>
                    <h3 className="text-xl font-bold">Create Account</h3>
                    <p className="text-gray-light max-w-xs">Sign up for a free account in minutes with our AI-powered onboarding.</p>
                </div>
                <div className="relative z-10 text-center">
                    <div className="w-20 h-20 bg-primary-light border-2 border-accent text-accent rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">2</div>
                    <h3 className="text-xl font-bold">Add Recipient</h3>
                    <p className="text-gray-light max-w-xs">Enter your recipient's details and the amount you want to send.</p>
                </div>
                <div className="relative z-10 text-center">
                    <div className="w-20 h-20 bg-primary-light border-2 border-accent text-accent rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">3</div>
                    <h3 className="text-xl font-bold">Send Money</h3>
                    <p className="text-gray-light max-w-xs">Confirm your transaction and your money is on its way, instantly.</p>
                </div>
            </div>
        </div>
    </section>
);

// CTA Component
const CTA: React.FC = () => {
    const navigate = useNavigate();
    return (
        <section className="py-20 bg-primary-light">
            <div className="container mx-auto px-4 text-center">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">Get Started With Xeloo Today</h2>
                <p className="text-gray-light max-w-2xl mx-auto mb-8">Create an account with us and start sending and receiving money from anywhere in the world.</p>
                <button
                    onClick={() => navigate('/onboarding')}
                    className="bg-accent text-primary font-bold py-3 px-8 rounded-lg text-lg hover:bg-yellow-400 transition-transform transform hover:scale-105"
                >
                    Create a Free Account
                </button>
            </div>
        </section>
    );
};


// Footer Component
const Footer: React.FC = () => (
    <footer className="bg-primary pt-16 pb-8">
        <div className="container mx-auto px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
                <div>
                    <h3 className="font-bold mb-4">Product</h3>
                    <ul className="space-y-2 text-gray-light">
                        <li><a href="#" className="hover:text-accent">Send Money</a></li>
                        <li><a href="#" className="hover:text-accent">Receive Money</a></li>
                        <li><a href="#" className="hover:text-accent">Payroll</a></li>
                        <li><a href="#" className="hover:text-accent">API</a></li>
                    </ul>
                </div>
                <div>
                    <h3 className="font-bold mb-4">Company</h3>
                    <ul className="space-y-2 text-gray-light">
                        <li><a href="#" className="hover:text-accent">About Us</a></li>
                        <li><a href="#" className="hover:text-accent">Careers</a></li>
                        <li><a href="#" className="hover:text-accent">Press</a></li>
                        <li><a href="#" className="hover:text-accent">Contact</a></li>
                    </ul>
                </div>
                <div>
                    <h3 className="font-bold mb-4">Legal</h3>
                    <ul className="space-y-2 text-gray-light">
                        <li><a href="#/terms" className="hover:text-accent">Terms & Conditions</a></li>
                        <li><a href="#" className="hover:text-accent">Privacy Policy</a></li>
                        <li><a href="#" className="hover:text-accent">Cookie Policy</a></li>
                    </ul>
                </div>
                 <div>
                    <h3 className="font-bold mb-4">Follow Us</h3>
                    <div className="flex space-x-4">
                        <a href="#" className="text-gray-light hover:text-accent"><TwitterIcon /></a>
                        <a href="#" className="text-gray-light hover:text-accent"><LinkedInIcon /></a>
                        <a href="#" className="text-gray-light hover:text-accent"><InstagramIcon /></a>
                    </div>
                </div>
            </div>
            <div className="border-t border-primary-light pt-6 text-center text-gray-light text-sm">
                <p>&copy; {new Date().getFullYear()} Xeloo. All rights reserved.</p>
            </div>
        </div>
    </footer>
);

const LandingPage: React.FC = () => {
    return (
        <div className="bg-primary text-white min-h-screen">
            <Header />
            <main>
                <Hero />
                <Features />
                <HowItWorks />
                <CTA />
            </main>
            <Footer />
        </div>
    );
};

export default LandingPage;
