import React from 'react';

export default function PromoSection() {
    return (
        <section className="max-w-screen-xl mx-auto my-5 lg:my-20 px-5 xl:px-0 rounded-xl">
            <div className="flex flex-col lg:flex-row rounded-xl shadow-2xl">
                <div className="w-full lg:w-3/5 text-white py-14 lg:py-32 bg-texture rounded-l-xl rounded-r-xl lg:rounded-r-none">
                    <div className="px-10 lg:pr-48">
                        <div className="flex flex-col justify-center items-center text-center uppercase gap-y-8">
                            <h1 className="text-2xl lg:text-4xl">¡Promo Goland!</h1>
                            <div className="space-y-4">
                                <p className="text-sm lg:text-base">Aprovechá las promos en nuestra Tienda Online.</p>
                                <p className="text-sm lg:text-base">¡Hay más de un 20% de descuento!</p>
                            </div>
                            <a href="https://shop.goland-group.com/" target="_blank" className="rounded-full bg-white text-verde flex w-max uppercase py-2 px-6 shadow-none hover:bg-verde hover:text-white transition-all ease-in-out duration-500 border border-white text-sm lg:text-base">
                                Ver promociones
                            </a>
                        </div>
                    </div>
                </div>
                <div className="w-full lg:w-2/5 relative bg-products rounded-r-xl">
                    <img src="https://storage.googleapis.com/img-goland/goland/hearts-front.png" alt="" className="absolute w-80 xl:w-96 lg:top-4 xl:-top-10 lg:right-80 hidden lg:block" />
                </div>
            </div>
        </section>
    );
}
