import React from 'react';

export default function SustainabilitySection() {
    return (
        <section id="left-separator" className="relative w-full h-auto my-14">
            <div className="carousel-wrapper absolute w-full h-full left-0 right-0 bottom-0 top-0 z-0">
                <div className="w-full ml-auto h-full bg-center relative z-10 bg-cover lg:bg-fixed" style={{ backgroundImage: "url(https://storage.googleapis.com/img-goland/goland/warm-wall-texture-green-1.png)" }}></div>
            </div>

            <section id="cta-footer" className="relative w-full h-auto overflow-hidden">
                <div className="max-w-screen-xl bg-verde px-5 py-4 w-11/12 md:w-5/6 lg:w-4/5 flex flex-col mx-auto relative gap-y-1 rounded-r-lg">
                    <h2 className="main-title text-white text-xl md:text-2xl xl:text-2xl mb-2">Pioneros, en Uruguay y la región somos los primeros en producir e industrializar semillas de cáñamo. </h2>
                    <div className="absolute overlay-left bg-verde right-full top-0 bottom-0 w-full"></div>
                </div>
                <div id="cta-overlay" className="hidden md:block absolute z-30 top-0 bottom-0 left-0 h-full w-full right-0 transition-all duration-700 delay-100 ease-in-out"></div>
            </section>
        </section>
    );
}
