import React from 'react';

export default function ProductLine() {
    return (
        <section id="products-section" className="relative w-full bg-gris">
            <div data-aos="fade-up" className="max-w-screen-xl bg-verde p-5 w-full md:w-4/5 lg:w-3/4 flex flex-col mx-auto relative rounded-br-lg">
                <h2 className="main-title text-white">Nuestra línea de productos</h2>
                <div className="absolute overlay-left bg-verde right-full top-0 bottom-0 w-full"></div>
            </div>

            <div className="bg-img-wrapper relative w-full max-w-screen-xl mx-auto my-10 flex justify-center items-center">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-36 pt-10 pb-20 lg:pt-20 lg:pb-32">

                    {/* Product 1: Crema de Mani */}
                    <div className="bg-verde w-full flex rounded-md relative transition-all flex-row-reverse lg:flex-row ease-in-out duration-300 transform hover:-translate-y-1 shadow-lg hover:shadow-2xl">
                        <div className="absolute -right-4 top-8 lg:-left-10 lg:-top-2.5 lg:right-auto">
                            <img src="https://storage.googleapis.com/img-goland/goland/crema-mani-hd-2.png" alt="" className="w-20 lg:w-60" />
                        </div>
                        <div className="w-1/12 lg:w-3/12"></div>
                        <div className="text-white w-11/12 py-2 pr-2 pl-5 lg:p-5 lg:w-9/12 lg:py-10 lg:px-5 lg:ml-20 2xl:ml-14">
                            <div className="mt-4 lg:mt-0">
                                <h1 className="main-title text-lg lg:text-3xl 2xl:text-4xl">Crema de Maní & Hemp Protein</h1>
                                <p className="sub-title text-base lg:text-xl 2xl:text-2xl">Peanut Butter con hemp</p>
                            </div>
                            <div className="space-x-2 lg:space-x-5 mt-5 lg:mt-10 mb-4 lg:mb-0">
                                <a href="" className="uppercase bg-white border border-white text-verde hover:bg-verde hover:text-white transition-all ease-in-out duration-300 text-sm lg:text-base px-2 lg:px-4 py-1 lg:py-2 rounded-full">Solicitar info</a>
                                <a href="https://shop.goland-group.com/" target="_blank" className="uppercase bg-white border border-white text-verde hover:bg-verde hover:text-white transition-all ease-in-out duration-300 text-sm lg:text-base px-2 lg:px-4 py-1 lg:py-2 rounded-full">Comprar</a>
                            </div>
                        </div>
                    </div>

                    {/* Product 2: Hemp Protein */}
                    <div className="bg-verde w-full flex rounded-md relative transition-all flex-row-reverse lg:flex-row ease-in-out duration-300 transform hover:-translate-y-1 shadow-lg hover:shadow-2xl">
                        <div className="absolute -right-3 top-2 lg:right-auto lg:-left-10 lg:-top-10">
                            <img src="https://goland-group.com/_nuxt/img/hemp-protein.c264c84.png" alt="" className="w-20 lg:w-56" />
                        </div>
                        <div className="w-1/12 lg:w-3/12"></div>
                        <div className="text-white w-11/12 py-2 pr-2 pl-5 lg:p-5 lg:w-9/12 lg:py-10 lg:px-5 lg:ml-20 2xl:ml-14">
                            <div className="mt-4 lg:mt-0">
                                <h1 className="main-title text-lg lg:text-3xl 2xl:text-4xl">Hemp Protein</h1>
                                <p className="sub-title text-base lg:text-xl 2xl:text-2xl">Proteína de semilla de cáñamo</p>
                            </div>
                            <div className="space-x-2 lg:space-x-5 mt-5 lg:mt-10 mb-4 lg:mb-0">
                                <a href="" className="uppercase bg-white border border-white text-verde hover:bg-verde hover:text-white transition-all ease-in-out duration-300 text-sm lg:text-base px-2 lg:px-4 py-1 lg:py-2 rounded-full">Solicitar info</a>
                                <a href="https://shop.goland-group.com/" target="_blank" className="uppercase bg-white border border-white text-verde hover:bg-verde hover:text-white transition-all ease-in-out duration-300 text-sm lg:text-base px-2 lg:px-4 py-1 lg:py-2 rounded-full">Comprar</a>
                            </div>
                        </div>
                    </div>

                    {/* Product 3: Hemp Coffee */}
                    <div className="bg-verde flex-row-reverse lg:flex-row w-full flex rounded-md relative transition-all ease-in-out duration-300 transform hover:-translate-y-1 shadow-lg hover:shadow-2xl">
                        <div className="absolute -right-3 top-2 lg:right-auto lg:-left-10 lg:-top-16">
                            <img src="https://storage.googleapis.com/img-goland/goland/coffee-front-swiper.png" alt="" className="w-20 lg:w-60" />
                        </div>
                        <div className="w-1/12 lg:w-3/12"></div>
                        <div className="text-white w-11/12 py-2 pr-2 pl-5 lg:p-5 lg:w-9/12 lg:py-10 lg:px-5 lg:ml-20 2xl:ml-14">
                            <div className="mt-4 lg:mt-0">
                                <h1 className="main-title text-lg lg:text-3xl 2xl:text-4xl">Hemp Coffee</h1>
                                <p className="sub-title text-base lg:text-xl 2xl:text-2xl">Café molido moka</p>
                            </div>
                            <div className="space-x-2 lg:space-x-5 mt-5 lg:mt-10 mb-4 lg:mb-0">
                                <a href="" className="uppercase bg-white border border-white text-verde hover:bg-verde hover:text-white transition-all ease-in-out duration-300 text-sm lg:text-base px-2 lg:px-4 py-1 lg:py-2 rounded-full">Solicitar info</a>
                                <a href="https://shop.goland-group.com/" target="_blank" className="uppercase bg-white border border-white text-verde hover:bg-verde hover:text-white transition-all ease-in-out duration-300 text-sm lg:text-base px-2 lg:px-4 py-1 lg:py-2 rounded-full">Comprar</a>
                            </div>
                        </div>
                    </div>

                    {/* Product 4: Hemp Hearts */}
                    <div className="bg-verde flex-row-reverse lg:flex-row w-full flex rounded-md relative transition-all ease-in-out duration-300 transform hover:-translate-y-1 shadow-lg hover:shadow-2xl">
                        <div className="absolute -right-6 top-1 lg:right-auto lg:-left-16 lg:-top-20">
                            <img src="https://goland-group.com/_nuxt/img/hearts-front.535f995.png" alt="" className="w-24 lg:w-72" />
                        </div>
                        <div className="w-1/12 lg:w-3/12"></div>
                        <div className="text-white w-11/12 py-2 pr-2 pl-5 lg:p-5 lg:w-9/12 lg:py-10 lg:px-5 lg:ml-20 2xl:ml-14">
                            <div className="mt-4 lg:mt-0">
                                <h1 className="main-title text-lg lg:text-3xl 2xl:text-4xl">Hemp Hearts</h1>
                                <p className="sub-title text-base lg:text-xl 2xl:text-2xl">Semilla de cáñamo descascarada</p>
                            </div>
                            <div className="space-x-2 lg:space-x-5 mt-5 lg:mt-10 mb-4 lg:mb-0">
                                <a href="" className="uppercase bg-white border border-white text-verde hover:bg-verde hover:text-white transition-all ease-in-out duration-300 text-sm lg:text-base px-2 lg:px-4 py-1 lg:py-2 rounded-full">Solicitar info</a>
                                <a href="https://shop.goland-group.com/" target="_blank" className="uppercase bg-white border border-white text-verde hover:bg-verde hover:text-white transition-all ease-in-out duration-300 text-sm lg:text-base px-2 lg:px-4 py-1 lg:py-2 rounded-full">Comprar</a>
                            </div>
                        </div>
                    </div>

                    {/* Product 5: Hemp Oil */}
                    <div className="bg-verde flex-row-reverse lg:flex-row w-full flex rounded-md relative transition-all ease-in-out duration-300 transform hover:-translate-y-1 shadow-lg hover:shadow-2xl">
                        <div className="absolute right-1 -top-1 lg:right-auto lg:left-12 lg:-top-12">
                            <img src="https://storage.googleapis.com/img-goland/goland/oil-front-new.png" alt="" className="w-10 lg:w-20 2xl:w-24" />
                        </div>
                        <div className="w-1/12 lg:w-3/12"></div>
                        <div className="text-white w-11/12 py-2 pr-2 pl-5 lg:p-5 lg:w-9/12 lg:py-10 lg:px-5 lg:ml-20 2xl:ml-14">
                            <div className="mt-4 lg:mt-0">
                                <h1 className="main-title text-lg lg:text-3xl 2xl:text-4xl">Hemp Seed Oil</h1>
                                <p className="sub-title text-base lg:text-xl 2xl:text-2xl">Aceite de semillas de cáñamo</p>
                            </div>
                            <div className="space-x-2 lg:space-x-5 mt-5 lg:mt-10 mb-4 lg:mb-0">
                                <a href="" className="uppercase bg-white border border-white text-verde hover:bg-verde hover:text-white transition-all ease-in-out duration-300 text-sm lg:text-base px-2 lg:px-4 py-1 lg:py-2 rounded-full">Solicitar info</a>
                                <a href="https://shop.goland-group.com/" target="_blank" className="uppercase bg-white border border-white text-verde hover:bg-verde hover:text-white transition-all ease-in-out duration-300 text-sm lg:text-base px-2 lg:px-4 py-1 lg:py-2 rounded-full">Comprar</a>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}
