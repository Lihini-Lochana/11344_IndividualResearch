import { useEffect, useRef, useContext } from "react";
import {
  useLocation,
  useNavigationType
} from "react-router-dom";

import { TrackingContext } from "../context/TrackingContext";

export default function BrowserBackTracker() {

  const location = useLocation();
  const navigationType = useNavigationType();

  const {
    trackBackClick,
    trackInteraction
  } = useContext(TrackingContext);

  const previousPathRef = useRef(location.pathname);
  const isFirstNavigationRef = useRef(true);

  useEffect(() => {

    // Ignore initial page load
    if (isFirstNavigationRef.current) {

      isFirstNavigationRef.current = false;
      previousPathRef.current = location.pathname;

      return;
    }

    // Browser / mobile Back navigation
    if (navigationType === "POP") {

      trackBackClick("browser_back");

      trackInteraction(
        "browser_back_navigation",
        {
          from: previousPathRef.current,
          to: location.pathname,
          navigationType: "POP"
        }
      );
    }

    previousPathRef.current = location.pathname;

  }, [
    location.pathname,
    navigationType,
    trackBackClick,
    trackInteraction
  ]);

  return null;
}