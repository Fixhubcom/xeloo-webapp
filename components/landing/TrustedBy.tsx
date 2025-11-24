
import React from 'react';

const TrustedBy: React.FC = () => (
    <div className="py-8 bg-primary">
        <div className="container mx-auto text-center">
            <p className="text-sm text-gray-400 uppercase tracking-widest mb-6">Trusted by industry leaders:</p>
            <div
                className="w-full inline-flex flex-nowrap overflow-hidden [mask-image:_linear-gradient(to_right,transparent_0,_black_128px,_black_calc(100%-200px),transparent_100%)]"
            >
                <ul className="flex items-center justify-center md:justify-start [&>li]:mx-8 animate-infinite-scroll">
                    <li className="text-gray-400 text-2xl font-bold">Stripe</li>
                    <li className="text-gray-400 text-2xl font-bold">Flutterwave</li>
                    <li className="text-gray-400 text-2xl font-bold">Paystack</li>
                    <li className="text-gray-400 text-2xl font-bold">Wise</li>
                    <li className="text-gray-400 text-2xl font-bold">Chipper Cash</li>
                </ul>
                <ul className="flex items-center justify-center md:justify-start [&>li]:mx-8 animate-infinite-scroll" aria-hidden="true">
                    <li className="text-gray-400 text-2xl font-bold">Stripe</li>
                    <li className="text-gray-400 text-2xl font-bold">Flutterwave</li>
                    <li className="text-gray-400 text-2xl font-bold">Paystack</li>
                    <li className="text-gray-400 text-2xl font-bold">Wise</li>
                    <li className="text-gray-400 text-2xl font-bold">Chipper Cash</li>
                </ul>
            </div>
        </div>
    </div>
);

export default TrustedBy;
