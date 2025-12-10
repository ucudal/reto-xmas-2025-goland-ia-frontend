import { useState, useEffect } from 'react'
import hero1 from '../../assets/images/hero1.jpg'
import hero2 from '../../assets/images/hero2.jpg'
import hero3 from '../../assets/images/hero3.jpg'

export default function HeroSection() {
    const [currentSlide, setCurrentSlide] = useState(0)

    const slides = [
        { id: 1, src: hero1, alt: "Goland Hero 1" },
        { id: 2, src: hero2, alt: "Goland Hero 2" },
        { id: 3, src: hero3, alt: "Goland Hero 3" },
    ]

    const icons = [
        {
            src: 'https://goland-group.com/_nuxt/img/vegan-icon.86cdccf.svg',
            alt: 'Vegan'
        },
        {
            src: 'https://goland-group.com/_nuxt/img/plant-based-icon.9e99f3c.svg',
            alt: 'Plant Based'
        },
        {
            src: 'https://goland-group.com/_nuxt/img/ingredients-icon.a0507d1.svg',
            alt: 'Natural Ingredients'
        },
        {
            src: 'https://goland-group.com/_nuxt/img/w-preservatives-icon.12f85ea.svg',
            alt: 'Sin Preservantes'
        },
        {
            src: 'https://goland-group.com/_nuxt/img/nongmo-icon.195fa72.svg',
            alt: 'Non-GMO'
        },
        {
            src: 'https://goland-group.com/_nuxt/img/gluten-free-icon.f7b6022.svg',
            alt: 'Gluten Free'
        }
    ]

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % slides.length)
        }, 5000)
        return () => clearInterval(timer)
    }, [])

    const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length)
    const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)

    return (
        <section className="relative w-full h-screen bg-gray-200 overflow-hidden">
            {/* Slider Container */}
            <div className="relative w-full h-full">
                {slides.map((slide, index) => (
                    <div
                        key={slide.id}
                        className={`absolute inset-0 transition-opacity duration-1000 ${index === currentSlide ? "opacity-100 z-10" : "opacity-0 z-0"}`}
                    >
                        <img
                            src={slide.src}
                            alt={slide.alt}
                            className="w-full h-full object-cover"
                        />
                        {/* Overlay for better text readability */}
                        <div className="absolute inset-0 bg-black/40"></div>
                    </div>
                ))}

                {/* Main Content */}
                <div className="absolute inset-0 z-20 flex flex-col items-start justify-center px-8 md:px-16 lg:px-24">
                    <h1 className="main-title text-3xl md:text-4xl font-bold text-white mb-6 max-w-2xl leading-snug">
                        Descubrí el mejor balance de nutrientes del reino vegetal.
                    </h1>

                    <div className="flex flex-col md:flex-row gap-4 mb-8">
                        <a
                            href="https://shop.goland-group.com"
                            className="px-6 py-2 bg-white text-verde font-bold rounded-full hover:bg-gray-100 transition shadow-lg text-sm uppercase"
                        >
                            SHOP ONLINE
                        </a>
                        <a
                            href="#products"
                            className="px-6 py-2 bg-verde text-white font-bold rounded-full hover:bg-green-700 transition shadow-lg text-sm uppercase"
                        >
                            VER PRODUCTOS
                        </a>
                    </div>

                    {/* Icons Bar - Inside hero content, aligned left */}
                    <div 
                        data-aos="fade-up" 
                        className="flex flex-wrap gap-2 md:gap-3 mt-4"
                    >
                        {icons.map((icon, index) => (
                            <div
                                key={index}
                                className="bg-white/50 backdrop-blur-sm rounded-lg flex items-center justify-center w-24 h-16 md:w-32 md:h-20 lg:w-36 lg:h-22 transform hover:scale-105 hover:bg-white/80 transition-all ease-in-out duration-500 cursor-pointer"
                            >
                                <img
                                    src={icon.src}
                                    alt={icon.alt}
                                    className="max-h-12 md:max-h-14 lg:max-h-16 max-w-[90%] object-contain"
                                />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Navigation arrows */}
                <button
                    onClick={prevSlide}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-white p-2 rounded-full transition z-30 opacity-70 hover:opacity-100 text-4xl"
                >
                    ←
                </button>
                <button
                    onClick={nextSlide}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-white p-2 rounded-full transition z-30 opacity-70 hover:opacity-100 text-4xl"
                >
                    →
                </button>

                {/* Slide indicators */}
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3 z-30">
                    {slides.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => setCurrentSlide(index)}
                            className={`w-3 h-3 rounded-full transition-all ${index === currentSlide ? "bg-white scale-125" : "bg-white/50 hover:bg-white/80"}`}
                        />
                    ))}
                </div>
            </div>
        </section>
    )
}
