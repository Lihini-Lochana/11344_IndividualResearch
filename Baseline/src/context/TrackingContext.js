import { createContext, useState, useEffect } from "react";

export const TrackingContext = createContext();

export function TrackingProvider({ children }) {
  const [trackingData, setTrackingData] = useState(() => {
    const savedData = localStorage.getItem("trackingData");

    return savedData
      ? JSON.parse(savedData)
      : {
          totalClicks: 0,
          errors: 0,
          backClicks: 0,
          hesitationCount: 0,
          hesitationTimes: [],
          pagesVisited: [],
          interactionLog: [],
          success: false,
          startTime: Date.now(),
          endTime: null,
        };
  });

  useEffect(() => {
    localStorage.setItem("trackingData", JSON.stringify(trackingData));
  }, [trackingData]);

  const trackPageVisit = (pageName) => {
    setTrackingData((prev) => ({
      ...prev,

      pagesVisited: [...prev.pagesVisited, pageName],

      interactionLog: [
        ...prev.interactionLog,
        {
          type: "PAGE_VISIT",
          page: pageName,
          time: Date.now(),
        },
      ],
    }));
  };

  const trackClick = (target = "unknown") => {
    setTrackingData((prev) => ({
      ...prev,

      totalClicks: prev.totalClicks + 1,

      interactionLog: [
        ...prev.interactionLog,
        {
          type: "CLICK",
          target,
          time: Date.now(),
        },
      ],
    }));
  };

  const trackError = (error = "unknown_error") => {
    setTrackingData((prev) => ({
      ...prev,

      errors: prev.errors + 1,

      interactionLog: [
        ...prev.interactionLog,
        {
          type: "ERROR",
          error,
          time: Date.now(),
        },
      ],
    }));
  };

  const trackInteraction = (type, details = {}) => {
    setTrackingData((prev) => ({
      ...prev,

      interactionLog: [
        ...prev.interactionLog,
        {
          type,
          details,
          time: Date.now(),
        },
      ],
    }));
  };

  const trackHesitation = (seconds) => {
    setTrackingData((prev) => ({
      ...prev,

      hesitationCount: prev.hesitationCount + 1,

      hesitationTimes: [...prev.hesitationTimes, seconds],

      interactionLog: [
        ...prev.interactionLog,
        {
          type: "HESITATION",
          seconds,
          time: Date.now(),
        },
      ],
    }));
  };

  const trackBackClick = () => {
    setTrackingData((prev) => ({
      ...prev,

      backClicks: prev.backClicks + 1,

      interactionLog: [
        ...prev.interactionLog,
        {
          type: "BACK_CLICK",
          time: Date.now(),
        },
      ],
    }));
  };

  const trackSuccess = () => {
    setTrackingData((prev) => ({
      ...prev,

      success: true,

      endTime: Date.now(),

      interactionLog: [
        ...prev.interactionLog,
        {
          type: "SUCCESS",
          time: Date.now(),
        },
      ],
    }));
  };

  const getTimeOnTask = () => {
    if (!trackingData.startTime) {
      return 0;
    }

    const endTime = trackingData.endTime || Date.now();

    return Math.floor((endTime - trackingData.startTime) / 1000);
  };

  const startNewTest = () => {
    const newTrackingData = {
      totalClicks: 0,
      errors: 0,
      backClicks: 0,
      hesitationCount: 0,
      hesitationTimes: [],
      pagesVisited: [],
      interactionLog: [],
      success: false,
      startTime: Date.now(),
    };

    localStorage.setItem("trackingData", JSON.stringify(newTrackingData));

    setTrackingData(newTrackingData);
  };

  const resetTracking = () => {
    localStorage.removeItem("trackingData");

    const resetData = {
      totalClicks: 0,
      errors: 0,
      backClicks: 0,
      hesitationCount: 0,
      hesitationTimes: [],
      pagesVisited: [],
      interactionLog: [],
      success: false,
      startTime: Date.now(),
    };

    setTrackingData(resetData);
  };

  return (
    <TrackingContext.Provider
      value={{
        trackingData,

        trackPageVisit,
        trackClick,
        trackError,
        trackBackClick,
        trackInteraction,
        trackHesitation,
        trackSuccess,

        getTimeOnTask,
        startNewTest,
        resetTracking,
      }}
    >
      {children}
    </TrackingContext.Provider>
  );
}
