import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// En una SPA el scroll no vuelve arriba solo al cambiar de pantalla
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

export default ScrollToTop;
