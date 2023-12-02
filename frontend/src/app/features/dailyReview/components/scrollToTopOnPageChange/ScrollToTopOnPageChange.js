import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTopOnPageChange = () => {
  const location = useLocation();

  useEffect(() => {
    // Scroll to the top of the page on location change
    window.scrollTo(0, 0);
  }, [location.pathname]); // Only run the effect when the pathname changes

  return null; // don't render anything in the DOM
};

export default ScrollToTopOnPageChange;
