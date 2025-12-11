import React from 'react';
import ChatServices from '../../services/ChatServices';

export default function ChatbotButton({ onClick }) {
    async function handleTestClick() {
        const question = '¿Qué son los Hemp Hearts?';
        try {
            const res = await ChatServices.askAI(question);
            const answer = res.answer;
            alert('IA: ' + answer);
            console.log('Respuesta:', res);
        } catch (err) {
            alert('✗ Error: ' + err.message);
            console.error(err);
        }
    }

    return (
        <button
            onClick={handleTestClick}
            aria-label="Open Chatbot"
            className="fixed shadow-2xl bottom-10 right-10 bg-verde hover:bg-green-600 z-50 p-4 rounded-full hover:-translate-y-2 transform transition-all ease-in-out duration-300 flex items-center justify-center cursor-pointer"
        >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                width="40"
                height="40"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-bot"
            >
                <path d="M12 8V4H8" />
                <rect width="16" height="12" x="4" y="8" rx="2" />
                <path d="M2 14h2" />
                <path d="M20 14h2" />
                <path d="M15 13v2" />
                <path d="M9 13v2" />
            </svg>
        </button>
    );
}
