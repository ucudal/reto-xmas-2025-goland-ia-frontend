import qaData from '../data/qa.json';

export async function askAI(question) {
    const qLower = question.trim().toLowerCase();
    
    const match = qaData.find(
        q => q.question.trim().toLowerCase() === qLower
    );
    
    const answer = match
        ? match.answer
        : 'Lo siento, no puedo responder esa pregunta.';
    
    return { answer};
}

export default {
    askAI
};
