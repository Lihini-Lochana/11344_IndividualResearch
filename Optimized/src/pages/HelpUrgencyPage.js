
import {
  useNavigate,
  useLocation
} from "react-router-dom";

import {
  useContext,
  useEffect,
  useRef
} from "react";

import Header from "../components/Header";
import ProgressTracker from "../components/ProgressTracker";
import SummaryBar from "../components/SummaryBar";

import useIsMobile from "../hooks/useIsMobile";

import symptoms from "../data/symptoms";

import {
  FaBolt,
  FaCalendarDay,
  FaCalendarAlt,
  FaClock,
  FaInfoCircle,
  FaArrowLeft
} from "react-icons/fa";

import { TrackingContext } from "../context/TrackingContext";


export default function HelpUrgencyPage() {

  const navigate = useNavigate();
  const location = useLocation();

  const isMobile = useIsMobile();


  // ==================================================
  // TRACKING CONTEXT
  // ==================================================

  const {
    trackPageVisit,
    trackClick,
    trackInteraction,
    trackHesitation,
    trackBackClick
  } = useContext(TrackingContext);


  // ==================================================
  // PAGE START TIME
  // Used to measure how long the user takes
  // before selecting an urgency option.
  // ==================================================

  const pageStartTime =
    useRef(Date.now());


  // ==================================================
  // PREVENT DUPLICATE HESITATION
  //
  // Only the first urgency decision is measured.
  // ==================================================

  const decisionTracked =
    useRef(false);


  // ==================================================
  // DATA RECEIVED FROM PREVIOUS PAGES
  // ==================================================

  const symptomId =
    location.state?.symptomId;

  const doctorPreference =
    location.state?.doctorPreference;

  const selectedLocation =
    location.state?.location ||
    "Colombo, Sri Lanka";


  const selectedSymptom =
    symptoms.find(
      (symptom) =>
        symptom.id === symptomId
    );


  // ==================================================
  // PAGE OPEN TRACKING
  // ==================================================

  useEffect(() => {

    // ------------------------------------------------
    // Track page visit
    // ------------------------------------------------

    trackPageVisit(
      "HelpUrgencyPage"
    );


    // ------------------------------------------------
    // Track page opened
    // ------------------------------------------------

    trackInteraction(
      "page_opened",
      {
        page:
          "HelpUrgencyPage",

        flow:
          "help_choose",

        symptomId,

        symptomName:
          selectedSymptom?.name ||
          selectedSymptom?.title ||
          null,

        doctorPreference,

        location:
          selectedLocation
      }
    );


    // ------------------------------------------------
    // Start timing from page load
    // ------------------------------------------------

    pageStartTime.current =
      Date.now();


    // ------------------------------------------------
    // Allow hesitation to be measured
    // again when this page opens.
    // ------------------------------------------------

    decisionTracked.current =
      false;


    // We intentionally want this effect
    // to run only when the page opens.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  // ==================================================
  // PROGRESS STEPS
  // ==================================================

  const guidedSteps = [
    "Health Problem",
    "Location",
    "Doctor Preference",
    "Urgency",
    "Doctors",
    "Appointment"
  ];


  // ==================================================
  // URGENCY OPTIONS
  // ==================================================

  const urgencyOptions = [
    {
      id: "today",

      title: "Today",

      description:
        "I would like to see a doctor today.",

      icon: <FaBolt />,

      color: "#DC2626"
    },

    {
      id: "within-2-3-days",

      title: "Within 2–3 Days",

      description:
        "I can wait a few days for an appointment.",

      icon: <FaCalendarDay />,

      color: "#EA580C"
    },

    {
      id: "this-week",

      title: "This Week",

      description:
        "Any appointment this week is fine.",

      icon: <FaCalendarAlt />,

      color: "#2563EB"
    },

    {
      id: "flexible",

      title: "Flexible",

      description:
        "I am flexible with the appointment date.",

      icon: <FaClock />,

      color: "#16A34A"
    }
  ];


  // ==================================================
  // URGENCY SELECTION
  // ==================================================

  const handleUrgencySelect = (
    urgency
  ) => {

    if (!urgency) {
      return;
    }


    // ==================================================
    // CALCULATE DECISION TIME
    // ==================================================

    const now =
      Date.now();


    const decisionTime =
      (now -
        pageStartTime.current) /
      1000;


    const decisionTimeRounded =
      Number(
        decisionTime.toFixed(2)
      );


    // ==================================================
    // HESITATION TRACKING
    //
    // More than 5 seconds = hesitation.
    // Only the first decision is measured.
    // ==================================================

    if (
      !decisionTracked.current
    ) {

      if (
        decisionTime > 5
      ) {

        trackHesitation(
          decisionTimeRounded,
          "HelpUrgencyPage"
        );

      }


      decisionTracked.current =
        true;
    }


    // ==================================================
    // TRACK URGENCY CARD CLICK
    // ==================================================

    trackClick(
      `help_urgency_${urgency.id}`,
      "HelpUrgencyPage"
    );


    // ==================================================
    // TRACK URGENCY SELECTION
    // ==================================================

    trackInteraction(
      "urgency_selected",
      {
        urgencyId:
          urgency.id,

        urgency:
          urgency.title,

        symptomId,

        symptomName:
          selectedSymptom?.name ||
          selectedSymptom?.title ||
          null,

        doctorPreference,

        location:
          selectedLocation,

        decisionTimeSeconds:
          decisionTimeRounded,

        flow:
          "help_choose"
      }
    );


    // ==================================================
    // EXISTING NAVIGATION
    // ==================================================

    navigate(
      "/help-recommended-doctors",
      {
        state: {
          symptomId,

          location:
            selectedLocation,

          doctorPreference:
            doctorPreference,

          urgency:
            urgency.title
        }
      }
    );
  };


  // ==================================================
  // BACK BUTTON
  // ==================================================

  const handleBack = () => {

    // ------------------------------------------------
    // Track Back Click
    // ------------------------------------------------

    trackBackClick(
      "HelpUrgencyPage_back"
    );


    // ------------------------------------------------
    // Track Back Navigation
    // ------------------------------------------------

    trackInteraction(
      "back_navigation",
      {
        from:
          "HelpUrgencyPage",

        to:
          "previous_page",

        symptomId,

        symptomName:
          selectedSymptom?.name ||
          selectedSymptom?.title ||
          null,

        doctorPreference,

        location:
          selectedLocation,

        flow:
          "help_choose"
      }
    );


    // ------------------------------------------------
    // Existing navigation
    // ------------------------------------------------

    navigate(-1);
  };


  // ==================================================
  // RENDER
  // ==================================================

  return (
    <div
      style={{
        minHeight: "100vh",

        background:
          "#F8FAFC",

        paddingBottom:
          isMobile
            ? "90px"
            : "100px",

        boxSizing:
          "border-box"
      }}
    >

      <Header />


      {/* STEP */}

      <h4
        style={{
          textAlign:
            "center",

          color:
            "#6B7280",

          margin:
            isMobile
              ? "15px 0 12px"
              : "20px 0 15px",

          fontSize:
            "14px"
        }}
      >
        Step 4 of 6
      </h4>


      {/* PROGRESS */}

      <ProgressTracker
        currentStep={3}
        steps={guidedSteps}
      />




      {/* MAIN CONTENT */}

      <div
        style={{
          maxWidth:
            "1000px",

          margin:
            isMobile
              ? "25px auto"
              : "40px auto",

          padding:
            isMobile
              ? "0 15px"
              : "0 20px",

          boxSizing:
            "border-box"
        }}
      >

        {/* TITLE */}

        <div
          style={{
            textAlign:
              "center",

            marginBottom:
              isMobile
                ? "30px"
                : "40px"
          }}
        >

          <h1
            style={{
              fontSize:
                isMobile
                  ? "28px"
                  : "42px",

              lineHeight:
                isMobile
                  ? "1.3"
                  : "1.2",

              fontWeight:
                "700",

              color:
                "#0F172A",

              margin:
                "0 0 16px 0"
            }}
          >
            How soon would you <br />
            like to see a doctor?
          </h1>


          <p
            style={{
              color:
                "#64748B",

              fontSize:
                isMobile
                  ? "14px"
                  : "16px",

              lineHeight:
                "1.6",

              margin:
                0
            }}
          >
            Choose the option that best
            matches your situation.
          </p>

        </div>


        {/* URGENCY CARDS */}

        <div
          style={{
            display:
              "grid",

            gridTemplateColumns:
              isMobile
                ? "1fr"
                : "repeat(2, minmax(0, 1fr))",

            gap:
              isMobile
                ? "14px"
                : "18px"
          }}
        >

          {urgencyOptions.map(
            (option) => (

              <div
                key={
                  option.id
                }

                onClick={() =>
                  handleUrgencySelect(
                    option
                  )
                }

                style={{
                  background:
                    "#FFFFFF",

                  border:
                    "1px solid #E2E8F0",

                  borderRadius:
                    "20px",

                  padding:
                    isMobile
                      ? "20px"
                      : "24px",

                  cursor:
                    "pointer",

                  display:
                    "flex",

                  alignItems:
                    "center",

                  gap:
                    "16px",

                  boxShadow:
                    "0 5px 15px rgba(15,23,42,.05)",

                  transition:
                    "transform 0.2s ease, box-shadow 0.2s ease",

                  minHeight:
                    isMobile
                      ? "95px"
                      : "110px",

                  boxSizing:
                    "border-box"
                }}

                onMouseEnter={(e) => {

                  e.currentTarget.style.transform =
                    "translateY(-3px)";

                  e.currentTarget.style.boxShadow =
                    "0 10px 25px rgba(15,23,42,.10)";
                }}

                onMouseLeave={(e) => {

                  e.currentTarget.style.transform =
                    "translateY(0)";

                  e.currentTarget.style.boxShadow =
                    "0 5px 15px rgba(15,23,42,.05)";
                }}
              >

                {/* ICON */}

                <div
                  style={{
                    width:
                      isMobile
                        ? "48px"
                        : "55px",

                    height:
                      isMobile
                        ? "48px"
                        : "55px",

                    borderRadius:
                      "14px",

                    background:
                      "#EFF6FF",

                    display:
                      "flex",

                    alignItems:
                      "center",

                    justifyContent:
                      "center",

                    color:
                      option.color,

                    fontSize:
                      isMobile
                        ? "20px"
                        : "23px",

                    flexShrink:
                      0
                  }}
                >
                  {option.icon}
                </div>


                {/* TEXT */}

                <div
                  style={{
                    minWidth:
                      0
                  }}
                >

                  <h3
                    style={{
                      margin:
                        0,

                      color:
                        "#0F172A",

                      fontSize:
                        isMobile
                          ? "17px"
                          : "19px",

                      fontWeight:
                        "700"
                    }}
                  >
                    {
                      option.title
                    }
                  </h3>


                  <p
                    style={{
                      margin:
                        "6px 0 0",

                      color:
                        "#64748B",

                      fontSize:
                        isMobile
                          ? "13px"
                          : "14px",

                      lineHeight:
                        "1.5"
                    }}
                  >
                    {
                      option.description
                    }
                  </p>

                </div>

              </div>
            )
          )}

        </div>


        {/* HELPER TEXT */}

        {/* INFORMATION */}

            <div
              style={{
                marginTop: "30px",
                background: "#EFF6FF",
                border:
                  "1px solid #BFDBFE",
                borderRadius: "16px",
                padding: isMobile
                  ? "14px"
                  : "16px",
                color: "#1E40AF",
                display: "flex",
                alignItems:
                  "flex-start",
                gap: "10px",
                fontSize: isMobile
                  ? "12px"
                  : "13px",
                lineHeight: "1.6"
              }}
            >
              <FaInfoCircle
                style={{
                  marginTop: "3px",
                  flexShrink: 0
                }}
              />

              <span>
                Select an option to continue.
              </span>
            </div>

      </div>


      {/* BACK BUTTON */}

      <button
        onClick={
          handleBack
        }

        style={{
          position:
            "fixed",

          left:
            isMobile
              ? "15px"
              : "20px",

          bottom:
            isMobile
              ? "15px"
              : "20px",

          zIndex:
            1000,

          display:
            "flex",

          alignItems:
            "center",

          gap:
            "8px",

          padding:
            isMobile
              ? "11px 16px"
              : "12px 18px",

          borderRadius:
            "12px",

          border:
            "1px solid #CBD5E1",

          background:
            "#FFFFFF",

          color:
            "#2563EB",

          fontWeight:
            "600",

          cursor:
            "pointer",

          boxShadow:
            "0 4px 15px rgba(15,23,42,.10)"
        }}
      >

        <FaArrowLeft />

        Back

      </button>

    </div>
  );
}

