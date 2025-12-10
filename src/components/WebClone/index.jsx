import React, { useEffect } from 'react'
import AOS from 'aos'
import 'aos/dist/aos.css'
import './WebClone.css' // Isolated styles for the clone
import Header from './Header'
import HeroSection from './HeroSection'
import FeaturesBar from './FeaturesBar'
import ProductLine from './ProductLine'
import PromoSection from './PromoSection'
import BenefitsSection from './BenefitsSection'
import SustainabilitySection from './SustainabilitySection'
import NewsSection from './NewsSection'
import Footer from './Footer'

export default function WebClone() {
    useEffect(() => {
        AOS.init({
            duration: 1000,
            once: true,
        })
    }, [])

    return (
        <div className="font-sans text-gray-900 antialiased bg-white">
            <Header />
            <main>
                <HeroSection />
                <FeaturesBar />
                <ProductLine />
                <PromoSection />
                <BenefitsSection />
                <SustainabilitySection />
                <NewsSection />
            </main>
            <Footer />

            {/* Floating Buttons */}
            <a href="https://api.whatsapp.com/send?phone=59897088691" target="_blank" className="fixed shadow-2xl bottom-[216px] right-10 bg-verde hover:bg-green-600 z-50 p-4 rounded-full hover:-translate-y-2 transform transition-all ease-in-out duration-300">
                <img src="https://storage.googleapis.com/img-goland/goland/wapp.png" alt="" className="w-10" />
            </a>

            <a href="https://shop.goland-group.com/" target="_blank" className="fixed shadow-2xl bottom-32 right-10 bg-verde hover:bg-green-600 z-50 p-4 rounded-full hover:-translate-y-2 transform transition-all ease-in-out duration-300">
                <img src="https://storage.googleapis.com/img-goland/goland/bolsa.png" alt="" className="w-10" />
            </a>
        </div>
    )
}
