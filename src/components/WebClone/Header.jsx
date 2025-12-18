import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export default function Header() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <nav id="navbar" className="navbar fixed-top fixed top-0 z-50 w-full flex flex-wrap items-start lg:items-center justify-between p-5 transition-all ease-in-out duration-500 h-auto bg-white lg:bg-white text-gray-900">
            <div className="container max-w-screen-xl mx-auto flex flex-col lg:flex-row flex-nowrap items-start lg:items-center justify-between h-full lg:h-auto">
                <div className="w-full relative flex justify-between items-center lg:w-auto lg:static lg:block lg:justify-start flex-grow">
                    <Link to="/" className="nav-link text-sm font-bold leading-relaxed inline-block mr-4 py-2 whitespace-nowrap uppercase text-white">
                        <img id="nav-logo" src="https://goland-group.com/_nuxt/img/logo-full.30c60fd.png" alt="" className="h-6 md:h-10 w-auto transition-all ease-in-out duration-300" />
                    </Link>
                    <div className="cursor-pointer w-14 h-14 flex lg:hidden justify-center items-center relative z-10">
                        <button aria-label="Main Menu" className={`menu cursor-pointer w-10 h-7 md:w-14 md:h-14 z-10 ${isOpen ? 'opened' : 'closed'}`} onClick={() => setIsOpen(!isOpen)}>
                            <span></span> <span></span> <span></span>
                        </button>
                    </div>
                </div>

                <div className={`flex-shrink w-auto mb-5 lg:mb-0 justify-center lg:justify-start items-center bg-transparent lg:shadow-none transition-all ease-in-out duration-500 mx-auto ${isOpen ? 'flex h-full' : 'hidden h-0'} lg:flex lg:h-full`}>
                    <ul className="flex flex-col lg:flex-row list-none lg:ml-auto navbar-items py-5 lg:py-0 justify-center lg:justify-start items-center lg:items-stretch navbar-list">
                        <li className="nav-link flex items-center justify-center lg:justify-start py-2 lg:py-0">
                            <a href="/nosotros" className="nav-link btn-navlink px-4 flex items-center text-lg lg:text-sm uppercase font-bold text-verde rounded-full py-1">Nosotros</a>
                        </li>
                        <li className="nav-link nav-link-grow-up flex items-center justify-center lg:justify-start py-2 lg:py-0">
                            <a href="/hemp-food" className="nav-link btn-navlink px-4 flex items-center text-lg lg:text-sm uppercase font-bold text-verde rounded-full py-1">Hemp Food</a>
                        </li>
                        <li className="megamenu-link-2 hoverable hidden lg:block text-verde transition-all ease-in-out duration-500 group">
                            <Link to="/productos" className="megamenu-link relative block py-6 px-4 lg:py-2 text-lg lg:text-sm font-bold uppercase transition-all ease-in-out rounded-full overflow-hidden">Productos</Link>
                            {/* Mega Menu Dropdown - Added delay and safer transition */}
                            {/* Mega Menu Dropdown - Wrapped for safe hover bridge */}
                            <div className="mega-menu lg:absolute left-0 right-0 z-50 top-full pt-10 -mt-10 invisible opacity-0 group-hover:visible group-hover:opacity-100 group-hover:delay-0 transition-all ease-in-out duration-300 delay-300">
                                <div className="bg-white shadow-xl p-6">
                                    <div className="container mx-auto max-w-screen-2xl w-full flex flex-wrap justify-center transition-all ease-in-out duration-500">
                                        {/* Items would go here, simplified for now as per original code structure */}
                                        <ul className="w-full sm:w-1/2 lg:w-1/5 p-1 relative flex flex-col items-center border-verde border-b sm:border-r lg:border-b-0">
                                            <a href="/productos/HempButter" className="w-full h-full px-4 pb-6 pt-6 lg:pt-3 flex flex-col items-center bg-white hover:bg-verde transition-all ease-in-out duration-500 text-verde hover:text-white rounded-lg">
                                                <div className="flex justify-center h-36 w-auto items-center"><img src="https://storage.googleapis.com/img-goland/goland/crema-mani-front-ok.png" alt="" className="object-contain object-center w-auto h-full mx-auto" /></div>
                                                <h5 className="font-bold text-xl uppercase text-center mb-2">Crema de Maní & Hemp Protein</h5>
                                            </a>
                                        </ul>
                                        <ul className="w-full sm:w-1/2 lg:w-1/5 p-1 relative flex flex-col items-center border-verde border-b sm:border-r lg:border-b-0">
                                            <a href="/productos/HempCoffee" className="w-full h-full px-4 pb-6 pt-6 lg:pt-3 flex flex-col items-center bg-white hover:bg-verde transition-all ease-in-out duration-500 text-verde hover:text-white rounded-lg">
                                                <div className="flex justify-center h-36 w-auto items-center"><img src="https://storage.googleapis.com/img-goland/goland/coffee-front.png" alt="" className="object-contain object-center w-auto h-full mx-auto" /></div>
                                                <h5 className="font-bold text-xl uppercase text-center mb-2">Hemp Coffee</h5>
                                            </a>
                                        </ul>
                                        {/* ... other menu items ... */}
                                    </div>
                                </div>
                            </div>
                        </li>
                        <li className="nav-link nav-link-grow-up flex items-center justify-center lg:justify-start py-2 lg:py-0">
                            <a href="/tiendas" className="nav-link btn-navlink px-4 flex items-center text-lg lg:text-sm uppercase font-bold text-verde rounded-full py-1">Tiendas</a>
                        </li>
                        <li className="nav-link nav-link-grow-up flex items-center justify-center lg:justify-start py-2 lg:py-0">
                            <a href="/blog" className="nav-link btn-navlink px-4 flex items-center text-lg lg:text-sm uppercase font-bold text-verde rounded-full py-1">Blog</a>
                        </li>
                        <li className="nav-link nav-link-grow-up flex items-center justify-center lg:justify-start py-2 lg:py-0">
                            <a href="/contacto" className="nav-link btn-navlink px-4 flex items-center text-lg lg:text-sm uppercase font-bold text-verde rounded-full py-1">Contacto</a>
                        </li>
                        <li className="flex items-center justify-center lg:justify-start p-2 lg:py-0">
                            <a href="https://shop.goland-group.com/" className="px-2 py-1 border border-verde text-white bg-verde hover:bg-white hover:text-verde font-bold uppercase text-base lg:text-sm rounded-full cursor-pointer transition-all ease-in-out duration-500">SHOP</a>
                        </li>
                        <li className="flex items-center justify-center lg:justify-start p-2 lg:py-0">
                            <a href="https://biotech.goland-group.com/" className="px-2 py-1 border border-azul text-white bg-azul hover:bg-white hover:text-azul font-bold uppercase text-base lg:text-sm rounded-full cursor-pointer transition-all ease-in-out duration-500">BIOTECH</a>
                        </li>
                        <li className="flex items-center justify-center lg:justify-start p-2 lg:py-0 gap-2">
                            <a href="https://www.instagram.com/golandhempfood/" target="_blank" className="text-gray-400 hover:text-gray-600">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-instagram"><rect width="20" height="20" x="2" y="2" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" x2="17.51" y1="6.5" y2="6.5" /></svg>
                            </a>
                            <a href="https://www.linkedin.com/company/goland-hemp-food" target="_blank" className="text-gray-400 hover:text-gray-600">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-linkedin"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" /><rect width="4" height="12" x="2" y="9" /><circle cx="4" cy="4" r="2" /></svg>
                            </a>
                        </li>
                        <li className="flex items-center justify-center lg:justify-start p-2 lg:py-0">
                            <a href="/en" className="text-black hover:text-gray-600 font-normal text-base lg:text-sm">ENG</a>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
}
