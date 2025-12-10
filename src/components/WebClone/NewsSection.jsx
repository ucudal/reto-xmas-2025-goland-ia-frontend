import React from 'react';

export default function NewsSection() {
    return (
        <section data-fetch-key="data-v-87cdfbfe:0" className="w-full max-w-screen-xl mx-auto h-auto py-10 lg:py-20 px-5 overflow-hidden mb-16">
            <h2 data-aos="fade-up" className="main-title text-center font-bold text-verde mb-5">Novedades</h2>
            <div data-aos="fade-up" className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 py-5 w-full gap-6">

                {/* Card 1 */}
                <div className="card__news__grid flex flex-col grow bg-white shadow-lg cursor-pointer transform transition-transform duration-300 hover:-translate-y-2">
                    <div className="card__news__grid__img max-h-64 overflow-hidden rounded-t-lg">
                        <img src="https://storage.googleapis.com/img-goland/goland/blog-alternativa-vegetal-1.jpeg" alt="" className="w-full h-64 object-center object-cover" />
                    </div>
                    <div className="card__news__grid__text bg-gris border-t-2 flex flex-col px-5 py-8 justify-between flex-grow">
                        <a href="/blog/CanamoProtein" className="pb-4">
                            <h4 className="card__news__grid__text__description text-md py-2 uppercase">Noticias</h4>
                            <h3 className="card__news__grid__text__title text-verde text-xl lg:text-2xl">Proteína de cáñamo: una alternativa vegetal completa.</h3>
                        </a>
                        <a href="/blog/CanamoProtein" className="w-max lg:w-5/12 rounded-full border border-verde bg-verde hover:bg-gris hover:text-verde text-white py-2 px-6 flex flex-col justify-center items-center uppercase cursor-pointer transition-all ease-in-out duration-500 my-2">
                            <span>Leer nota</span>
                        </a>
                    </div>
                </div>

                {/* Card 2 */}
                <div className="card__news__grid flex flex-col grow bg-white shadow-lg cursor-pointer transform transition-transform duration-300 hover:-translate-y-2">
                    <div className="card__news__grid__img max-h-64 overflow-hidden rounded-t-lg">
                        <img src="https://storage.googleapis.com/img-goland/goland/image00048.jpeg" alt="" className="w-full h-64 object-center object-cover" />
                    </div>
                    <div className="card__news__grid__text bg-gris border-t-2 border-verde flex flex-col px-5 py-8 justify-between flex-grow">
                        <a href="/blog/FoodArriveLatam" className="pb-4">
                            <h4 className="card__news__grid__text__description text-md py-2 uppercase">Noticias</h4>
                            <h3 className="card__news__grid__text__title text-verde text-xl lg:text-2xl">Los alimentos a base de cáñamo llegan a América Latina</h3>
                        </a>
                        <a href="/blog/FoodArriveLatam" className="w-max lg:w-5/12 rounded-full border border-verde bg-verde hover:bg-gris hover:text-verde text-white py-2 px-6 uppercase cursor-pointer transition-all ease-in-out duration-500 flex flex-col justify-center items-center my-2">
                            <span>Leer nota</span>
                        </a>
                    </div>
                </div>

                {/* Card 3 */}
                <div className="card__news__grid flex flex-col grow bg-white shadow-lg cursor-pointer transform transition-transform duration-300 hover:-translate-y-2">
                    <div className="card__news__grid__img max-h-64 overflow-hidden rounded-t-lg">
                        <img src="https://storage.googleapis.com/img-goland/goland/goland-arg-portada-2.jpg" alt="" className="w-full h-64 object-center object-cover" />
                    </div>
                    <div className="card__news__grid__text flex-grow bg-gris border-t-2 border-verde flex flex-col px-5 py-8 justify-between flex-grow">
                        <a href="/blog/GolandArg" className="pb-4">
                            <h4 className="card__news__grid__text__description text-md py-2 uppercase">Noticias</h4>
                            <h3 className="card__news__grid__text__title text-verde text-xl lg:text-2xl">Goland Hemp Food lanza sus superalimento en Argentina</h3>
                        </a>
                        <a href="/blog/GolandArg" className="w-max lg:w-5/12 rounded-full border border-verde bg-verde hover:bg-gris hover:text-verde text-white py-2 px-6 uppercase cursor-pointer flex flex-col items-center justify-center transition-all ease-in-out duration-500 my-2">
                            <span>Leer nota</span>
                        </a>
                    </div>
                </div>

            </div>
            <div className="flex justify-center items-center pt-16">
                <a href="/blog" className="text-white hover:text-verde hover:bg-gris bg-verde transition-all ease-in-out duration-500 border-2 border-verde rounded-full py-2 px-6">VER MÁS</a>
            </div>
        </section>
    );
}
