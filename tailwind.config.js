/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                verde: '#559E48',
                azul: '#1E3A8A',
                gris: '#F3F4F6',
            },
            fontFamily: {
                sans: ['Montserrat', 'sans-serif'],
                barlow: ['Montserrat', 'sans-serif'], // Fallback alias
            }
        },
    },
    plugins: [
        require("tailwindcss-animate"),
    ],
}
