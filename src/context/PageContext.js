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
  // Siempre actualizar el contexto cuando se establece manualmente
  // Asegurarse de que la URL esté incluida
  pageContext = { 
    url: context.url || window.location.pathname,
    title: context.title || '',
    content: context.content || ''
  };
};

/**
 * Limpia el contexto cuando cambia la URL
 * Útil para forzar la extracción del DOM cuando cambias de página
 */
export const clearPageContext = () => {
  pageContext = {
    url: '',
    title: '',
    content: ''
  };
};

export const getPageContext = () => {
  const currentUrl = window.location.pathname;
  
  // SIEMPRE verificar que la URL del contexto coincida con la URL actual
  // Si no coincide, el contexto es de otra página y debemos obtener el actual
  if (pageContext && pageContext.url === currentUrl && (pageContext.content || pageContext.title)) {
    // El contexto manual coincide con la URL actual y tiene contenido, usarlo
    return pageContext;
  }
  
  // Si no hay contexto válido o la URL no coincide, SIEMPRE extraer del DOM actual
  // Esto asegura que siempre tengamos el contexto de la página actual, incluso si cambiaste de página
  const currentContext = extractPageContextFromDOM();
  
  // Actualizar el contexto guardado con el contexto actual
  pageContext = currentContext;
  
  return currentContext;
};
