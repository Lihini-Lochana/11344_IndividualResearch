import { useEffect, useRef, useContext } from "react";

import { useLocation, useNavigationType } from "react-router-dom";

import { TrackingContext } from "../context/TrackingContext";

export default function BrowserBackTracker() {
  const location = useLocation();

  const navigationType = useNavigationType();

  const { trackBackClick, trackInteraction } = useContext(TrackingContext);

  const previousPathRef = useRef(location.pathname);

  const isFirstNavigationRef = useRef(true);

  useEffect(() => {
    if (isFirstNavigationRef.current) {
      isFirstNavigationRef.current = false;

      previousPathRef.current = location.pathname;

      return;
    }

    if (
      navigationType === "POP" &&
      previousPathRef.current !== location.pathname
    ) {
      trackBackClick();

      trackInteraction("browser_back_navigation", {
        from: previousPathRef.current,
        to: location.pathname,
        navigationType: "POP",
      });
    }

    previousPathRef.current = location.pathname;
  }, [location.pathname, navigationType]);

  return null;
}
