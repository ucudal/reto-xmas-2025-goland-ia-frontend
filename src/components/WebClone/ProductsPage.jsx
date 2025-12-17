import React, { useEffect } from 'react'
import AOS from 'aos'
import 'aos/dist/aos.css'
import Header from './Header'
import ProductLine from './ProductLine'
import Footer from './Footer'

export default function ProductsPage() {
    useEffect(() => {
        AOS.init({
            duration: 1000,
            once: true,
        })
    }, [])

    return (
        <div className="font-sans text-gray-900 antialiased bg-white">
            <Header />
            <main className="pt-20"> {/* Add padding top because header is fixed */}
                <ProductLine />
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
    )
}
