
import React from 'react';

const ValueProp: React.FC = () => (
    <section className="py-20 bg-primary">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center gap-12">
            <div className="md:w-1/2">
                <div className="bg-primary-light p-8 rounded-lg">
                    <h2 className="text-3xl font-bold mb-4">Pay suppliers and receive payment through the smarter way</h2>
                    <p className="text-gray-300 mb-6">Receive customer payment through our API, pay your remote workforce or freelances and pay suppliers in munities, saving you time to doing other things you enjoy.</p>
                    <button className="border border-accent text-accent font-bold py-2 px-6 rounded-lg hover:bg-accent hover:text-primary transition-colors">Watch Demo</button>
                </div>
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

export default ValueProp;
