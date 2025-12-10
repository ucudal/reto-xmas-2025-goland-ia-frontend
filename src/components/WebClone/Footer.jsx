import React from 'react';

export default function Footer() {
    return (
        <footer className="w-full h-auto mx-auto bg-white border-t border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-5 w-full mx-auto py-12 md:py-20 px-5 items-stretch max-w-screen-xl">
                <div className="space-y-3">
                    <a href="/" aria-current="page" className="flex justify-center md:justify-start items-center w-full h-full">
                        <img src="https://goland-group.com/_nuxt/img/logo-footer.0ee78e8.png" alt="" className="w-24 lg:w-32 h-auto" />
                    </a>
                </div>
                <div className="space-y-3">
                    <a href="/productos" className="btn-footer-link block w-max font-bold text-xl text-gray-800">Menú</a>
                    <ul className="space-y-1 text-base md:text-lg text-gray-600">
                        <li><a href="/hemp-food/" className="btn-footer-link1">Hemp Food</a></li>
                        <li><a href="/productos/" className="btn-footer-link1">Productos</a></li>
                        <li><a href="/nosotros/" className="btn-footer-link1">Nosotros</a></li>
                        <li><a href="/blog/" className="btn-footer-link1">Recetas</a></li>
                        <li><a href="/tiendas/" className="btn-footer-link1">Tiendas</a></li>
                    </ul>
                </div>
                <div className="space-y-3">
                    <a href="/contacto" className="font-bold text-xl block w-max btn-footer-link text-gray-800">Contactanos</a>
                    <ul className="space-y-1 text-base md:text-lg text-gray-600">
                        <li className="flex items-start py-1 btn-footer-link w-max">
                            <a href="#" className="pr-3">Ruta interbalnearia KM 29, <br /> Canelones, Uruguay.</a>
                        </li>
                        <li className="flex items-center py-1 btn-footer-link w-max">
                            <a href="https://api.whatsapp.com/send?phone=59897088691" target="_blank" className="pr-3">+59897088691</a>
                        </li>
                        <li className="flex items-center py-1 btn-footer-link w-max">
                            <a href="mailto:info@goland-group.com">info@goland-group.com</a>
                        </li>
                    </ul>
                </div>
                <div className="space-y-3 flex flex-col justify-start items-center text-gray-800">
                    <li className="flex items-center justify-center px-1 py-2 lg:py-0 gap-x-5">
                        {/* Social Icons would go here */}
                        <a href="https://shop.goland-group.com/" className="px-2 py-1 border border-verde text-white bg-verde hover:bg-white hover:text-verde font-bold uppercase text-base lg:text-sm rounded-full cursor-pointer transition-all ease-in-out duration-500">SHOP</a>
                    </li>
                    <div><img src="https://storage.googleapis.com/img-goland/goland/uy.png" alt="" className="w-40" /></div>
                </div>
            </div>
            <div className="p-8 w-full bg-gris">
                <div className="max-w-screen-xl mx-auto flex justify-end items-center w-full">
                    <div className="text-verde text-xs text-right">
                        Made with ❤️ by Digital Fellow.<br /><strong>© 2025 Goland Co. Todos los derechos reservados.</strong>
                    </div>
                </div>
            </div>
        </footer>
    );
}
