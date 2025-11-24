
import React from 'react';
import Header from '../components/landing/Header';
import Hero from '../components/landing/Hero';
import TrustedBy from '../components/landing/TrustedBy';
import Features from '../components/landing/Features';
import ValueProp from '../components/landing/ValueProp';
import Stats from '../components/landing/Stats';
import Testimonials from '../components/landing/Testimonials';
import Pricing from '../components/landing/Pricing';
import FAQ from '../components/landing/FAQ';
import CTA from '../components/landing/CTA';
import Footer from '../components/landing/Footer';

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
