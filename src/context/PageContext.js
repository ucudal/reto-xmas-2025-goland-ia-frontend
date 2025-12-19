let pageContext = {
  url: '',
  title: '',
  content: ''
};

/**
 * Extrae el contexto de la página actual del DOM
 * @returns {Object} Contexto con url, title y content
 */
function extractPageContextFromDOM() {
  const url = window.location.pathname;
  const title = document.title || '';
  
  // Extraer contenido principal de la página
  // Buscar en elementos comunes: main, article, [role="main"], o el body
  let content = '';
  
  // Intentar obtener el contenido del main
  const main = document.querySelector('main') || 
               document.querySelector('article') || 
               document.querySelector('[role="main"]');
  
  if (main) {
    // Extraer texto de los elementos principales, excluyendo scripts, styles, etc.
    const textElements = main.querySelectorAll('h1, h2, h3, h4, h5, h6, p, li, blockquote, .prose, [class*="content"]');
    const texts = Array.from(textElements)
      .map(el => el.textContent?.trim())
      .filter(text => text && text.length > 10) // Filtrar textos muy cortos
      .slice(0, 20); // Limitar a los primeros 20 elementos para no excederse
    
    content = texts.join('\n');
  } else {
    // Si no hay main, extraer del body (más limitado)
    const bodyText = document.body.innerText || '';
    // Limitar a los primeros 2000 caracteres
    content = bodyText.substring(0, 2000);
  }
  
  return {
    url,
    title,
    content: content.trim()
  };
}

export const setPageContext = (context) => {
  pageContext = context;
};

export const getPageContext = () => {
  const currentUrl = window.location.pathname;
  
  // Si hay un contexto establecido manualmente, verificar que coincida con la URL actual
  if (pageContext && (pageContext.url || pageContext.title || pageContext.content)) {
    // Si la URL del contexto coincide con la URL actual, usarlo
    if (pageContext.url === currentUrl) {
      return pageContext;
    }
    // Si la URL no coincide, el contexto es de otra página, así que extraer del DOM actual
  }
  
  // Si no hay contexto válido o la URL no coincide, extraer automáticamente del DOM
  return extractPageContextFromDOM();
};
