
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from '../common/Logo';
import { TwitterIcon, LinkedInIcon, InstagramIcon, YouTubeIcon } from '../icons/Icons';

const Footer: React.FC = () => {
    const navigate = useNavigate();
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
                    <div><h3 className="font-bold mb-4">Pages</h3><ul className="space-y-2 text-gray-300">
                        <li><a href="#/about-us" className="hover:text-accent">About Us</a></li>
                        <li><a href="#/services" className="hover:text-accent">Our Services</a></li>
                        <li><a href="#/contact-us" className="hover:text-accent">Contact Us</a></li>
                        <li><a href="#/product" className="hover:text-accent">Product</a></li>
                    </ul></div>
                    <div><h3 className="font-bold mb-4">Product</h3><ul className="space-y-2 text-gray-300">
                        <li><a href="#/cross-border" className="hover:text-accent">Cross-border</a></li>
                        <li><a href="#/payroll-info" className="hover:text-accent">Payroll</a></li>
                        <li><a href="#/resources" className="hover:text-accent">Resources</a></li>
                    </ul></div>
                    <div><h3 className="font-bold mb-4">Extra</h3><ul className="space-y-2 text-gray-300">
                        <li><a href="#/terms" className="hover:text-accent">Terms</a></li>
                        <li><a href="#/privacy-policy" className="hover:text-accent">Privacy Policy</a></li>
                        <li><a href="#/affiliate" className="hover:text-accent">Affiliate</a></li>
                    </ul></div>
                </div>

                <div className="border-t border-primary-light pt-6 flex flex-col md:flex-row justify-between items-center text-gray-400 text-sm">
                    <p>© {new Date().getFullYear()} Xeloo ・All rights reserved by Fix Hub Communications Ltd</p>
                    <button onClick={scrollToTop} className="hover:text-accent">Return to top ↑</button>
                </div>
                
                {/* Specialized Login Links Row */}
                <div className="mt-8 pt-4 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center text-xs text-gray-600 space-y-2 md:space-y-0">
                    <button 
                        onClick={() => navigate('/admin/login')} 
                        className="hover:text-accent transition-colors text-left w-full md:w-auto"
                    >
                        Admin Access
                    </button>
                    
                    <button 
                        onClick={() => navigate('/merchant/login')} 
                        className="hover:text-accent transition-colors text-center w-full md:w-auto"
                    >
                        Merchant Portal
                    </button>
                    
                    <button 
                        onClick={() => navigate('/partner/login')} 
                        className="hover:text-accent transition-colors text-right w-full md:w-auto"
                    >
                        Partner Login
                    </button>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
