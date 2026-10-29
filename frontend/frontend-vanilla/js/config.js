// URL base de la API. En local usa el backend de tu máquina;
// publicado (GitHub Pages) usa el backend de Render.
// Cuando tengan la URL real de Render, reemplacen PRODUCTION_API_URL.
const AppConfig = (() => {
  const LOCAL_API_URL = 'http://localhost:3000/api';
  const PRODUCTION_API_URL = 'https://pintunort-api.onrender.com/api';
  const isLocal = ['localhost', '127.0.0.1', ''].includes(window.location.hostname);

  return {
    API_URL: isLocal ? LOCAL_API_URL : PRODUCTION_API_URL,
  };
})();
