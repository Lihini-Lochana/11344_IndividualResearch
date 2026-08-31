import {
  createContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from "react";


export const TrackingContext = createContext();

const STORAGE_KEY = "optimizedTrackingData";

const MAX_PAGES = 100;
const MAX_INTERACTIONS = 500;
const MAX_HESITATIONS = 100;

// ======================================================
// CREATE INITIAL DATA
// ======================================================

const createInitialData = () => ({
  sessionId: Date.now(),

  

  totalClicks: 0,
  errors: 0,
  backClicks: 0,

  hesitationCount: 0,
  hesitationTimes: [],

  pagesVisited: [],
  interactionLog: [],

  decisionCount: 0,
  decisionTimes: [],
  averageDecisionTime: 0,

  success: false,
  taskCompleted: false,

  startTime: null,
  endTime: null,

  flow: null,

  flowBranch: null
});

// ======================================================
// SAFE LOCAL STORAGE SAVE
// ======================================================

const saveToStorage = (data) => {
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(data)
    );

    return true;
  } catch (error) {
    console.warn(
      "Tracking data could not be saved to localStorage:",
      error
    );

    try {
      const reducedData = {
        ...data,

        pagesVisited:
          data.pagesVisited?.slice(-30) || [],

        hesitationTimes:
          data.hesitationTimes?.slice(-30) || [],

        decisionTimes:
          data.decisionTimes?.slice(-30) || [],

        interactionLog:
          data.interactionLog?.slice(-100) || [],
      };

      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(reducedData)
      );

      return true;
    } catch (secondError) {
      console.warn(
        "Tracking data could not be saved even after reducing size:",
        secondError
      );

      return false;
    }
  }
};

const DEBUG_TRACKING = true;

const trackingLog = (label, data = {}) => {
  if (!DEBUG_TRACKING) return;

  console.log(
    `%c[TRACKING] ${label}`,
    "color:#2563EB;font-weight:bold;",
    {
      timestamp: new Date().toISOString(),
      ...data,
    }
  );
};

// ======================================================
// TRACKING PROVIDER
// ======================================================

export function TrackingProvider({ children }) {

  // ====================================================
  // STATE
  // ====================================================

  const [trackingData, setTrackingData] = useState(() => {

    try {
      const savedData =
        localStorage.getItem(STORAGE_KEY);

      if (!savedData) {
        return createInitialData();
      }

      const parsedData =
        JSON.parse(savedData);

      if (
        !parsedData ||
        typeof parsedData !== "object"
      ) {
        return createInitialData();
      }

      return {
        ...createInitialData(),
        ...parsedData,

        pagesVisited:
          Array.isArray(parsedData.pagesVisited)
            ? parsedData.pagesVisited.slice(-MAX_PAGES)
            : [],

        interactionLog:
          Array.isArray(parsedData.interactionLog)
            ? parsedData.interactionLog.slice(
                -MAX_INTERACTIONS
              )
            : [],

        hesitationTimes:
          Array.isArray(parsedData.hesitationTimes)
            ? parsedData.hesitationTimes.slice(
                -MAX_HESITATIONS
              )
            : [],

        decisionTimes:
          Array.isArray(parsedData.decisionTimes)
            ? parsedData.decisionTimes.slice(-100)
            : [],
      };

    } catch (error) {

      console.warn(
        "Invalid tracking data found. Starting fresh.",
        error
      );

      localStorage.removeItem(STORAGE_KEY);

      return createInitialData();
    }
  });

  // ====================================================
  // SAVE STATE
  // ====================================================

  useEffect(() => {
    saveToStorage(trackingData);
  }, [trackingData]);

  // ====================================================
  // START FLOW
  // ====================================================

  const startFlow = useCallback((flowName) => {

    setTrackingData((prev) => {

      // Keep the existing active session
      if (prev.flow) {
        return prev;
      }

      const startTime = Date.now();

      const flowData = {
        ...createInitialData(),

        flow: flowName,

        startTime,

        interactionLog: [
          {
            type: "FLOW_START",
            flow: flowName,
            time: startTime,
          },
        ],
      };

      saveToStorage(flowData);

      return flowData;
    });

  }, []);


 // ======================================================
// START NEW TEST
// ======================================================

const startNewTest = useCallback((flowName) => {

  const startTime = Date.now();

  const flowData = {
    ...createInitialData(),

    flow: flowName,

    startTime,

    sessionId: startTime,

    interactionLog: [
      {
        type: "FLOW_START",
        flow: flowName,
        time: startTime,
      },
    ],
  };

  console.log(
    "%c[TRACKING] NEW TEST STARTED",
    "color:#16A34A;font-weight:bold;font-size:14px;",
    {
      flow: flowName,
      sessionId: startTime,
      startTime,
      data: flowData,
    }
  );

  setTrackingData(flowData);

  saveToStorage(flowData);

}, []);


// ======================================================
// START HOME SESSION
// ======================================================

const startHomeSession = useCallback(() => {

  setTrackingData((prev) => {

    // ----------------------------------------------
    // If an active session already exists,
    // do not create another one.
    // ----------------------------------------------

    if (
      prev.startTime &&
      prev.flow === "home"
    ) {
      return prev;
    }


    // ----------------------------------------------
    // If an existing research session is active,
    // keep it.
    // ----------------------------------------------

    if (
      prev.startTime &&
      prev.taskCompleted === false &&
      prev.flow
    ) {
      return prev;
    }


    const startTime = Date.now();


    const homeData = {
      ...createInitialData(),

      flow: "home",

      startTime,

      sessionId: startTime,

      interactionLog: [
        {
          type: "FLOW_START",
          flow: "home",
          time: startTime,
        },
      ],
    };


    console.log(
      "%c[TRACKING] HOME SESSION STARTED",
      "color:#16A34A;font-weight:bold;font-size:14px;",
      {
        flow: "home",
        sessionId: startTime,
        startTime,
      }
    );


    saveToStorage(homeData);


    return homeData;

  });

}, []);


// ======================================================
// START FLOW FROM HOME
// ======================================================

const startFlowFromHome = useCallback((
  flowName,
  selectedOption = null
) => {

  if (!flowName) {
    return;
  }


  const now = Date.now();


  setTrackingData((prev) => {

    const newData = {

      ...prev,

      // ----------------------------------------------
      // Change flow
      // ----------------------------------------------

      flow: flowName,


      // ----------------------------------------------
      // Record selected branch
      // ----------------------------------------------

      flowBranch:
        selectedOption || prev.flowBranch,


      // ----------------------------------------------
      // Interaction log
      // ----------------------------------------------

      interactionLog: [

        ...(prev.interactionLog || []),

        {
          type: "FLOW_SELECTED_FROM_HOME",

          flow: flowName,

          selectedOption,

          time: now,
        },

      ].slice(-MAX_INTERACTIONS),

    };


    console.log(
      "%c[TRACKING] FLOW SELECTED FROM HOME",
      "color:#16A34A;font-weight:bold;",
      {
        flow: flowName,
        selectedOption,
        sessionId: newData.sessionId,
        totalClicks: newData.totalClicks,
        hesitationCount: newData.hesitationCount,
        decisionCount: newData.decisionCount,
      }
    );


    return newData;

  });

}, []);


//-----------------------------------
//Flow branch
//----------------------------------

const setFlowBranch = useCallback((branch) => {

  setTrackingData((prev) => ({
    ...prev,

    flowBranch: branch,

    interactionLog: [
      ...(prev.interactionLog || []),
      {
        type: "FLOW_BRANCH_SELECTED",
        branch,
        time: Date.now()
      }
    ].slice(-MAX_INTERACTIONS)
  }));

}, []);

  // ====================================================
  // PAGE VISIT
  // ====================================================

  const trackPageVisit = useCallback((pageName) => {

    if (!pageName) {
      return;
    }

    setTrackingData((prev) => ({
      ...prev,

      pagesVisited: [
        ...prev.pagesVisited,
        pageName,
      ].slice(-MAX_PAGES),

      interactionLog: [
        ...prev.interactionLog,
        {
          type: "PAGE_VISIT",
          page: pageName,
          time: Date.now(),
        },
      ].slice(-MAX_INTERACTIONS),
    }));

  }, []);

  // ====================================================
// CLICK + AUTOMATIC DECISION TIME
// ====================================================

// ======================================================
// CLICK + AUTOMATIC DECISION / ACTION TIME
// ======================================================

const trackClick = useCallback((
  target = "unknown",
  page = null
) => {

  const now = Date.now();

  setTrackingData((prev) => {

    // ==================================================
    // FIND THE MOST RECENT USER ACTION
    // ==================================================

    const interactionLog =
      prev.interactionLog || [];

    /*
      We want the timer to work like this:

      Page Visit
          ↓
        5 sec
          ↓
      Click A
          ↓
        3 sec
          ↓
      Click B

      Therefore:

      Click A = Click A - Page Visit
      Click B = Click B - Click A

      NOT:

      Click B = Click B - Page Visit
    */

    const previousEvents =
      interactionLog.filter((event) =>
        event.type === "PAGE_VISIT" ||
        event.type === "CLICK"
      );

    const previousEvent =
      previousEvents.length > 0
        ? previousEvents[previousEvents.length - 1]
        : null;


    // ==================================================
    // CALCULATE ELAPSED TIME
    // ==================================================

    let decisionTime = null;

    if (previousEvent) {

      const elapsed =
        (now - previousEvent.time) / 1000;

      if (
        elapsed >= 0 &&
        elapsed < 3600
      ) {
        decisionTime =
          Number(elapsed.toFixed(2));
      }
    }


    // ==================================================
    // CLICK EVENT
    // ==================================================

    const clickEvent = {
      type: "CLICK",

      target,

      page,

      time: now,
    };


    // ==================================================
    // EXISTING DECISION DATA
    // ==================================================

    let newDecisionCount =
      Number(prev.decisionCount) || 0;

    let newDecisionTimes =
      [
        ...(prev.decisionTimes || [])
      ];

    let newAverageDecisionTime =
      Number(prev.averageDecisionTime) || 0;

    let decisionEvent = null;


    // ==================================================
    // RECORD DECISION TIME
    // ==================================================

    if (decisionTime !== null) {

      newDecisionCount += 1;


      newDecisionTimes.push(
        decisionTime
      );


      // Keep only last 100
      newDecisionTimes =
        newDecisionTimes.slice(-100);


      // ==================================================
      // CALCULATE AVERAGE
      // ==================================================

      const totalDecisionTime =
        newDecisionTimes.reduce(
          (sum, time) =>
            sum + Number(time),
          0
        );


      newAverageDecisionTime =
        Number(
          (
            totalDecisionTime /
            newDecisionTimes.length
          ).toFixed(2)
        );


      // ==================================================
      // DECISION EVENT
      // ==================================================

      decisionEvent = {

        type: "DECISION_TIME",

        seconds: decisionTime,

        page:
          page ||
          "unknown",

        target,

        previousEventType:
          previousEvent.type,

        previousEventTime:
          previousEvent.time,

        actionTime:
          now,

        time:
          now,
      };
    }


    // ==================================================
    // SAVE EVERYTHING
    // ==================================================

    const newData = {

      ...prev,


      // ----------------------------------------------
      // Total clicks
      // ----------------------------------------------

      totalClicks:
        Number(prev.totalClicks || 0) + 1,


      // ----------------------------------------------
      // Decision metrics
      // ----------------------------------------------

      decisionCount:
        newDecisionCount,

      decisionTimes:
        newDecisionTimes,

      averageDecisionTime:
        newAverageDecisionTime,


      // ----------------------------------------------
      // Interaction log
      // ----------------------------------------------

      interactionLog: [

        ...interactionLog,

        clickEvent,

        ...(decisionEvent
          ? [decisionEvent]
          : []),

      ].slice(-MAX_INTERACTIONS),
    };


    // ==================================================
    // DEBUG
    // ==================================================

    console.log(
      "%c[TRACKING] ACTION / DECISION TIME",
      "color:#7C3AED;font-weight:bold;",
      {

        target,

        page,

        previousEvent:
          previousEvent?.type,

        previousEventTime:
          previousEvent?.time,

        currentTime:
          now,

        decisionTime,

        decisionCount:
          newDecisionCount,

        averageDecisionTime:
          newAverageDecisionTime,
      }
    );


    return newData;
  });

}, []);

  // ====================================================
  // ERROR
  // ====================================================

  const trackError = useCallback((
    error = "unknown_error",
    page = null
  ) => {

    setTrackingData((prev) => ({
      ...prev,

      errors:
        prev.errors + 1,

      interactionLog: [
        ...prev.interactionLog,
        {
          type: "ERROR",
          error,
          page,
          time: Date.now(),
        },
      ].slice(-MAX_INTERACTIONS),
    }));

  }, []);

  // ====================================================
  // INTERACTION
  // ====================================================

  const trackInteraction = useCallback((
    type,
    details = {}
  ) => {

    if (!type) {
      return;
    }

    setTrackingData((prev) => ({
      ...prev,

      interactionLog: [
        ...prev.interactionLog,
        {
          type,
          details,
          time: Date.now(),
        },
      ].slice(-MAX_INTERACTIONS),
    }));

  }, []);

   // ====================================================
  // HESITATION
  // ====================================================

  const trackHesitation = useCallback((
  seconds,
  source = "unknown"
) => {

  console.log(
    "%c========== HESITATION REQUEST ==========",
    "color:#DC2626;font-weight:bold;font-size:14px;"
  );

  console.log(
    "%c[TRACKING] HESITATION CALLED FROM:",
    "color:#DC2626;font-weight:bold;",
    source
  );

  console.log(
    "[TRACKING] Hesitation value:",
    seconds
  );

  console.trace(
    "[TRACKING] Hesitation call stack"
  );

  if (
    typeof seconds !== "number" ||
    Number.isNaN(seconds)
  ) {

    console.warn(
      "[TRACKING] Invalid hesitation value. NOT COUNTED.",
      seconds
    );

    return;
  }

  setTrackingData((prev) => {

    const previousCount =
      Number(prev.hesitationCount) || 0;

    const newCount =
      previousCount + 1;

    const hesitationEvent = {
      type: "HESITATION",
      seconds,
      source,
      time: Date.now(),
    };

    const newData = {
      ...prev,

      hesitationCount: newCount,

      hesitationTimes: [
        ...(prev.hesitationTimes || []),
        seconds,
      ].slice(-MAX_HESITATIONS),

      interactionLog: [
        ...(prev.interactionLog || []),
        hesitationEvent,
      ].slice(-MAX_INTERACTIONS),
    };

    console.log(
      "%c[TRACKING] ⚠️ HESITATION COUNTED",
      "color:#DC2626;font-weight:bold;font-size:14px;",
      {
        seconds,
        source,
        previousCount,
        newCount,
        flow: newData.flow,
        sessionId: newData.sessionId,
      }
    );

    return newData;
  });

}, []);

  // ====================================================
  // BACK CLICK
  // ====================================================

  const trackBackClick = useCallback((target = "back") => {

    console.log(
    "%c========== BACK CLICK ==========",
    "color:#DC2626;font-weight:bold;"
  );

  trackingLog("BACK_CLICK_REQUEST", {
    target,
  });

  setTrackingData((prev) => {

    const backEvent = {
      type: "BACK_CLICK",
      target,
      time: Date.now(),
    };

    const currentBackClicks =
      Number(prev.backClicks) || 0;

    const newData = {
      ...prev,

      backClicks:
        currentBackClicks + 1,

      interactionLog: [
        ...(prev.interactionLog || []),
        backEvent,
      ].slice(-MAX_INTERACTIONS),
    };

    trackingLog("BACK_CLICK_SAVED", {

      target,

      previousBackClicks:
        currentBackClicks,

      newBackClicks:
        newData.backClicks,

      totalClicks:
        newData.totalClicks,

      sessionId:
        newData.sessionId,

      flow:
        newData.flow,

      interactionCount:
        newData.interactionLog.length,

      latestEvent:
        backEvent,
    });

    return newData;
  });

}, []);

  // ====================================================
  // SUCCESS
  // ====================================================

  const trackSuccess = useCallback(() => {

    const endTime = Date.now();

    setTrackingData((prev) => ({
      ...prev,

      success: true,

      taskCompleted: true,

      endTime,

      interactionLog: [
        ...prev.interactionLog,
        {
          type: "SUCCESS",
          time: endTime,
        },
      ].slice(-MAX_INTERACTIONS),
    }));

  }, []);

  // ====================================================
  // TIME ON TASK
  // ====================================================

  const getTimeOnTask = useCallback(() => {

    if (!trackingData.startTime) {
      return 0;
    }

    if (!trackingData.endTime) {
      return Math.floor(
        (
          Date.now() -
          trackingData.startTime
        ) / 1000
      );
    }

    return Math.floor(
      (
        trackingData.endTime -
        trackingData.startTime
      ) / 1000
    );

  }, [
    trackingData.startTime,
    trackingData.endTime,
  ]);


 

  // ====================================================
  // RESET TRACKING
  // ====================================================
const resetTracking = () => {
  const freshData = {
    totalClicks: 0,
    errors: 0,
    backClicks: 0,

    hesitationCount: 0,
    hesitationTimes: [],

    decisionCount: 0,
    decisionTimes: [],

    pagesVisited: [],
    interactionLog: [],

    success: false,

    flow: null,
    flowBranch: null,

    startTime: Date.now()
  };

  setTrackingData(freshData);

  localStorage.setItem(
    "trackingData",
    JSON.stringify(freshData)
  );
};

  // ====================================================
  // CONTEXT VALUE
  // ====================================================

  const contextValue = useMemo(() => ({
    trackingData,

    startFlow,
    startNewTest,
    startHomeSession,
    startFlowFromHome,

    trackPageVisit,
    trackClick,
    trackError,
    trackBackClick,
    trackInteraction,
    trackHesitation,
    trackSuccess,

    getTimeOnTask,
    getAverageDecisionTime,

    resetTracking,

    setFlowBranch,

  }), [
    trackingData,

    startFlow,
    startNewTest,
    startHomeSession,
    startFlowFromHome,

    trackPageVisit,
    trackClick,
    trackError,
    trackBackClick,
    trackInteraction,
    trackHesitation,
    trackSuccess,

    getTimeOnTask,
    getAverageDecisionTime,

    resetTracking,

    setFlowBranch,
  ]);

  // ====================================================
  // PROVIDER
  // ====================================================

  return (
    <TrackingContext.Provider
      value={contextValue}
    >
      {children}
    </TrackingContext.Provider>
  );
}