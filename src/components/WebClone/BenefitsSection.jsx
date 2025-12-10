import React from 'react';

export default function BenefitsSection() {
    return (
        <section className="w-full h-auto pt-0 pb-10 md:pt-0 md:pb-20 relative">
            <div className="mx-auto flex flex-col justify-center items-center w-full relative bg-cover bg-center bg-img-wrapper lg:bg-fixed">
                <div data-aos="fade-up" className="flex justify-center items-center px-3 md:px-0 py-20"></div>
                <div className="w-full p-4 md:p-10 relative grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-5 items-stretch z-10">

                    <div data-aos="fade-up" className="grid-item-1 shadow-lg rounded-lg h-full bg-white text-center text-verde hover:bg-verde hover:text-white p-5 cursor-pointer transition-all ease-in-out duration-500 transform hover:-translate-y-2 hover:shadow-xl">
                        <h4 className="mb-2 font-bold text-lg">En la tierra está lo que necesitamos</h4>
                        <p>Las semillas de cáñamo tienen una gran cantidad de beneficios nutricionales que hacen posible una vida saludable y sustentable.</p>
                    </div>

                    <div data-aos="fade-up" data-aos-delay="150" className="grid-item-1 rounded-lg shadow-lg h-full bg-white text-center text-verde hover:bg-verde hover:text-white p-5 cursor-pointer transition-all ease-in-out duration-500 transform hover:-translate-y-2 hover:shadow-xl">
                        <h4 className="mb-2 font-bold text-lg">Equilibrados</h4>
                        <p>Aportan la mayoría de lo que el cuerpo necesita sin producir excesos ni deficiencias nutricionales.</p>
                    </div>

                    <div data-aos="fade-up" data-aos-delay="300" className="grid-item-1 rounded-lg shadow-lg h-full bg-white text-center text-verde hover:bg-verde hover:text-white p-5 cursor-pointer transition-all ease-in-out duration-500 transform hover:-translate-y-2 hover:shadow-xl">
                        <h4 className="mb-2 font-bold text-lg">Fáciles de digerir</h4>
                        <p>Las semillas no necesitan remojo ni cocción. Nuestro organismo puede extraer fácilmente lo que necesita.</p>
                    </div>

                    <div data-aos="fade-up" data-aos-delay="450" className="grid-item-1 rounded-lg shadow-lg h-full bg-white text-center text-verde hover:bg-verde hover:text-white p-5 cursor-pointer transition-all ease-in-out duration-500 transform hover:-translate-y-2 hover:shadow-xl">
                        <h4 className="mb-2 font-bold text-lg">Saludables</h4>
                        <p>Libres de toxinas, alergias, organismos genéticamente modificados o materiales no digeribles.</p>
                    </div>

                    <div data-aos="fade-up" data-aos-delay="450" className="grid-item-1 rounded-lg shadow-lg h-full bg-white text-center text-verde hover:bg-verde hover:text-white p-5 cursor-pointer transition-all ease-in-out duration-500 transform hover:-translate-y-2 hover:shadow-xl">
                        <h4 className="mb-2 font-bold text-lg">Sustentables</h4>
                        <p>Las plantas de cáñamo son muy poderosas. Crecen fácilmente sin la necesidad de pesticidas o herbicidas.</p>
                    </div>

                </div>
                <div className="absolute bottom-0 h-0 md:h-1/3 left-0 right-0 z-0 bg-white"></div>
            </div>
        </section>
    );
}
