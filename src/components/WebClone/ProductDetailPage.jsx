import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';
import Header from './Header';
import Footer from './Footer';

const productsData = {
    HempButter: {
        title: "Crema de Maní & Hemp Protein",
        subtitle: "Descubre la perfecta combinación de sabor, nutrición y funcionalidad",
        image: "https://storage.googleapis.com/img-goland/goland/crema-mani-front-ok.png", // Using the image from header
        description: "Nuestro producto único en la región está diseñado para quienes buscan un snack delicioso y saludable, enriquecido con proteína vegetal de alta calidad y fibra alimentaria.",
        whyUnique: "Nuestra mantequilla de maní con proteína de cáñamo no solo es un alimento funcional; es un compromiso con la innovación en nutrición. Inspirada en las tendencias globales y producida localmente, redefine lo que significa comer saludable en la región.",
        usage: "Ideal para untar en tostadas, agregar a tus batidos de proteínas, o simplemente disfrutar como un snack saludable y satisfactorio.",
        features: [
            { title: "Fortalece tu día", text: "Una fuente de energía ideal para empezar el día o como snack post-entrenamiento." },
            { title: "Amiga del medio ambiente", text: "Elaborada con ingredientes eco-amigables, contribuyendo a un planeta más sostenible." },
            { title: "Versatilidad culinaria", text: "Úsala en tus recetas favoritas como smoothies, bowls de avena, o postres saludables." },
            { title: "Proteína extra", text: "Ideal para atletas, veganos y cualquier persona que desee fortalecer su ingesta diaria de proteínas." },
            { title: "Alta en fibra", text: "Apoya una digestión saludable y contribuye al bienestar intestinal." },
            { title: "Ingredientes 100% naturales", text: "Elaborada con maní seleccionado y proteína de cáñamo de origen sostenible." },
            { title: "Libre de aditivos artificiales", text: "Sin conservantes, azúcares añadidos ni aceites hidrogenados." },
            { title: "Sabor delicioso y textura cremosa", text: "Perfecta para untar, mezclar en batidos o disfrutar directamente." }
        ]
    },
    // Placeholders for other products to avoid 404s
    HempCoffee: {
        title: "Hemp Coffee",
        subtitle: "Experimenta el balance perfecto entre sabor y nutrición",
        description: "Nuestro Hemp Coffee variedad Moka es una mezcla de café molido de alta calidad con un 20% de proteína de cáñamo. Innovador y único en la región, este café aporta un toque delicioso y nutrientes esenciales de origen vegetal a tu rutina diaria.",
        whyUnique: "Este Hemp Coffee revoluciona la experiencia del café, combinando lo mejor del sabor tradicional con el poder nutritivo de la proteína de cáñamo. Un producto diseñado para satisfacer tanto el paladar como las necesidades de salud.",
        usage: "Prepara una taza utilizando tu máquina de café preferida, disfruta sola o acompaña con tus desayunos o snacks favoritos. La opción ideal para cualquier momento del día.",
        image: "https://storage.googleapis.com/img-goland/goland/coffee-front.png",
        features: [
            { title: "Nutrición completa", text: "Cada taza no solo aporta energía, sino también nutrientes esenciales para tu bienestar." },
            { title: "Innovación regional", text: "Una fusión pionera que combina la tradición del café Moka con los beneficios modernos del cáñamo." },
            { title: "Apto para todos", text: "Ideal para veganos, personas activas y amantes del café que buscan algo más que una bebida convencional." },
            { title: "Variedad Moka", text: "Café molido cuidadosamente seleccionado para un sabor rico, intenso y aromático." },
            { title: "20% de proteína", text: "Una fuente vegetal que complementa tu dieta con aminoácidos esenciales y fibra natural." },
            { title: "Energía con nutrición", text: "Perfecto para empezar el día o mantener tu energía en equilibrio, combinando cafeína natural con beneficios adicionales." },
            { title: "Versatilidad", text: "Diseñado para máquinas de café, con preparación rápida y sencilla." }
        ]
    },
    HempFlour: {
        title: "Hemp Protein",
        description: "Proteína vegetal completa derivada de la semilla de cáñamo.",
        image: "https://goland-group.com/_nuxt/img/hemp-protein.c264c84.png",
        features: []
    },
    HempHearth: {
        title: "Hemp Hearts",
        description: "Corazones de semilla de cáñamo descascarados, ricos en omegas.",
        image: "https://goland-group.com/_nuxt/img/hearts-front.535f995.png",
        features: []
    },
    HempSeedOil: {
        title: "Hemp Seed Oil",
        description: "Aceite prensado en frío de semillas de cáñamo.",
        image: "https://storage.googleapis.com/img-goland/goland/oil-front-new.png",
        features: []
    }
};

export default function ProductDetailPage() {
    const { productId } = useParams();
    const product = productsData[productId];

    useEffect(() => {
        AOS.init({
            duration: 1000,
            once: true,
        });
        window.scrollTo(0, 0); // Scroll to top on navigation
    }, [productId]);

    if (!product) {
        return (
            <div className="font-sans text-gray-900 antialiased bg-white min-h-screen flex flex-col">
                <Header />
                <main className="flex-grow flex items-center justify-center pt-32">
                    <div className="text-center">
                        <h2 className="text-3xl font-bold text-verde mb-4">Producto no encontrado</h2>
                        <Link to="/productos" className="text-azul underline">Volver a productos</Link>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    return (
        <div className="font-sans text-gray-900 antialiased bg-white">
            <Header />
            <main className="pt-32 pb-20">
                <div className="container max-w-screen-xl mx-auto px-5">
                    {/* Breadcrumb / Back link */}
                    <div className="mb-8">
                        <Link to="/productos" className="text-gray-500 hover:text-verde text-sm uppercase font-bold tracking-wider flex items-center gap-2">
                            ← Volver a Productos
                        </Link>
                    </div>

                    <div className="flex flex-col lg:flex-row gap-12 lg:gap-20 items-start">
                        {/* Image Column */}
                        <div className="w-full lg:w-1/3 flex justify-center" data-aos="fade-right">
                            <div className="relative w-full max-w-md bg-gray-50 rounded-2xl p-8 flex items-center justify-center shadow-lg">
                                {/* Green circle background effect */}
                                <div className="absolute inset-0 bg-verde/5 rounded-2xl transform rotate-3"></div>
                                <img
                                    src={product.image}
                                    alt={product.title}
                                    className="w-full h-auto object-contain relative z-10 hover:scale-105 transition-transform duration-500"
                                />
                            </div>
                        </div>

                        {/* Content Column */}
                        <div className="w-full lg:w-2/3" data-aos="fade-left">
                            <h1 className="text-3xl lg:text-5xl font-bold text-verde mb-4 uppercase leading-tight font-serif">{product.title}</h1>
                            {product.subtitle && <p className="text-xl text-gray-600 mb-6 font-light">{product.subtitle}</p>}

                            <div className="prose max-w-none text-gray-700 space-y-6">
                                <p className="leading-relaxed text-lg">{product.description}</p>

                                {product.whyUnique && (
                                    <div className="bg-green-50 p-6 rounded-xl border-l-4 border-verde">
                                        <h3 className="text-lg font-bold text-verde mb-2 uppercase">Por qué es única</h3>
                                        <p>{product.whyUnique}</p>
                                    </div>
                                )}

                                {product.usage && (
                                    <div>
                                        <h3 className="text-lg font-bold text-verde mb-2 uppercase border-b border-gray-200 pb-2 inline-block">Recomendación de uso</h3>
                                        <p>{product.usage}</p>
                                    </div>
                                )}

                                {/* Action Buttons */}
                                <div className="flex flex-wrap gap-4 pt-6">
                                    <a href="/contacto" className="bg-white border-2 border-verde text-verde hover:bg-verde hover:text-white px-8 py-3 rounded-full font-bold uppercase transition-all duration-300 shadow-sm hover:shadow-md">
                                        Solicitar Info
                                    </a>
                                    <a href="https://shop.goland-group.com/" target="_blank" className="bg-verde border-2 border-verde text-white hover:bg-white hover:text-verde px-8 py-3 rounded-full font-bold uppercase transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-1">
                                        Comprar
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Features Grid */}
                    {product.features && product.features.length > 0 && (
                        <div className="mt-24" data-aos="fade-up">
                            <h3 className="text-2xl font-bold text-verde mb-10 text-center uppercase border-b border-gray-100 pb-4">Información Nutricional y Beneficios</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                                {product.features.map((feature, idx) => (
                                    <div key={idx} className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow border border-gray-50 h-full">
                                        <h4 className="font-bold text-verde mb-3">{feature.title}</h4>
                                        <p className="text-sm text-gray-600 leading-relaxed">{feature.text}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </main>
            <Footer />

            {/* Floating Buttons - Duplicated for now to ensure consistency across pages */}
            <a href="https://api.whatsapp.com/send?phone=59897088691" target="_blank" className="fixed shadow-2xl bottom-[216px] right-10 bg-verde hover:bg-green-600 z-50 p-4 rounded-full hover:-translate-y-2 transform transition-all ease-in-out duration-300">
                <img src="https://storage.googleapis.com/img-goland/goland/wapp.png" alt="" className="w-10" />
            </a>

            <a href="https://shop.goland-group.com/" target="_blank" className="fixed shadow-2xl bottom-32 right-10 bg-verde hover:bg-green-600 z-50 p-4 rounded-full hover:-translate-y-2 transform transition-all ease-in-out duration-300">
                <img src="https://storage.googleapis.com/img-goland/goland/bolsa.png" alt="" className="w-10" />
            </a>
        </div>
    );
}
