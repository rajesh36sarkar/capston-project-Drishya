import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Component to reset page scroll positioning when routes change.
 */
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Reset browser viewport back to coordinates (0, 0) smoothly on navigation changes
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [pathname]);

  return null;
};

export default ScrollToTop;