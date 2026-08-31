import { useNavigate } from "react-router-dom";
import {
  useContext,
  useEffect,
  useRef
} from "react";

import Header from "../components/Header";
import ProgressTracker from "../components/ProgressTracker";
import SymptomCard from "../components/SymptomCard";

import symptoms from "../data/symptoms";

import useIsMobile from "../hooks/useIsMobile";

import {
  FaInfoCircle,
  FaArrowLeft
} from "react-icons/fa";

import { TrackingContext } from "../context/TrackingContext";


export default function HelpChooseProblemPage() {
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  const {
    startNewTest,
    trackPageVisit,
    trackClick,
    trackInteraction,
    trackHesitation,
    trackBackClick
  } = useContext(TrackingContext);

  const pageStartTime = useRef(Date.now());
  const decisionTracked = useRef(false);

useEffect(() => {

    // --------------------------------------------------
    // Start a completely new Help Me Choose test
    // --------------------------------------------------

    startNewTest(
      "help_choose"
    );


    // --------------------------------------------------
    // Track page visit
    // --------------------------------------------------

    trackPageVisit(
      "HelpChooseProblemPage"
    );


    // --------------------------------------------------
    // Track page opened
    // --------------------------------------------------

    trackInteraction(
      "page_opened",
      {
        page:
          "HelpChooseProblemPage",

        flow:
          "help_choose"
      }
    );


    // --------------------------------------------------
    // Start timing from page load
    // --------------------------------------------------

    pageStartTime.current =
      Date.now();


    // --------------------------------------------------
    // Allow hesitation to be measured
    // --------------------------------------------------

    decisionTracked.current =
      false;


    // IMPORTANT:
    // We intentionally do NOT include tracking
    // functions in the dependency array.
    //
    // This effect should run only once when the
    // page initially loads.
    //
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);



  const steps = [
    "Health Problem",
    "Location",
    "Doctor Preference",
    "Urgency",
    "Doctors",
    "Appointment"
  ];

  /*
   * When the user clicks a symptom,
   * immediately move to the location page.
   */
  const handleSymptomSelect = (symptom) => {

    if (!symptom) {
      return;
    }


    // ==================================================
    // CALCULATE DECISION TIME
    // ==================================================

    const now =
      Date.now();


    const decisionTime =
      (now - pageStartTime.current) /
      1000;


    const decisionTimeRounded =
      Number(
        decisionTime.toFixed(2)
      );


    // ==================================================
    // HESITATION TRACKING
    //
    // IMPORTANT:
    // This is the ONLY place in this page where
    // trackHesitation() is called.
    // ==================================================

    if (
      !decisionTracked.current
    ) {

      // More than 5 seconds = hesitation
      if (
        decisionTime > 5
      ) {

        trackHesitation(
          decisionTimeRounded
        );

      }


      // Mark decision as handled
      // even when hesitation was not counted.
      //
      // This prevents another card click from
      // generating another hesitation.
      decisionTracked.current =
        true;
    }


    // ==================================================
    // TRACK SYMPTOM CARD CLICK
    // ==================================================

    trackClick(
      `help_choose_symptom_${symptom.id}`,
      "HelpChooseProblemPage"
    );


    // ==================================================
    // TRACK SYMPTOM SELECTION
    // ==================================================

    trackInteraction(
      "symptom_selected",
      {
        symptomId:
          symptom.id,

        symptomName:
          symptom.name ||
          symptom.title,

        decisionTimeSeconds:
          decisionTimeRounded,

        flow:
          "help_me_choose"
      }
    );


    navigate("/help-choose-location", {
      state: {
        symptomId: symptom.id
      }
    });
  };

  /*
   * Back button
   */
  const handleBack = () => {
    trackBackClick(
      "HelpChooseProblemPage_back"
    );


    // --------------------------------------------------
    // Track back navigation
    // --------------------------------------------------

    trackInteraction(
      "back_navigation",
      {
        from:
          "HelpChooseProblemPage",

        to:
          "previous_page",

        flow:
          "help_me_choose"
      }
    );


    navigate(-1);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(to bottom,#F8FAFC,#EFF6FF)",
        paddingBottom: isMobile
          ? "85px"
          : "90px",
        boxSizing: "border-box"
      }}
    >
      <Header />

      <div
        style={{
          maxWidth: "1000px",
          margin: "0 auto",

          padding: isMobile
            ? "20px 16px 40px"
            : "30px 20px 50px",

          boxSizing: "border-box"
        }}
      >
        {/* STEP */}
        <h4
          style={{
            textAlign: "center",
            color: "#64748B",

            margin: isMobile
              ? "5px 0 12px"
              : "10px 0 15px",

            fontSize: isMobile
              ? "13px"
              : "14px"
          }}
        >
          Step 1 of 6
        </h4>

        {/* PROGRESS */}
        <ProgressTracker
          currentStep={0}
          steps={steps}
        />

        {/* HERO */}
        <div
          style={{
            textAlign: "center",

            margin: isMobile
              ? "28px auto 28px"
              : "40px auto 40px",

            padding: isMobile
              ? "0 5px"
              : "0"
          }}
        >
          {/* BADGE */}
          <div
            style={{
              display: "inline-block",
              background: "#EEF2FF",
              color: "#4F46E5",

              padding: isMobile
                ? "7px 13px"
                : "8px 16px",

              borderRadius: "999px",

              fontSize: isMobile
                ? "12px"
                : "13px",

              fontWeight: "600",

              marginBottom: isMobile
                ? "14px"
                : "18px"
            }}
          >
            Help Me Choose
          </div>

          {/* TITLE */}
          <h1
            style={{
              fontSize: isMobile
                ? "30px"
                : "42px",

              lineHeight: isMobile
                ? "1.25"
                : "1.2",

              color: "#0F172A",

              margin: isMobile
                ? "0 0 12px"
                : "0 0 12px"
            }}
          >
            What problem do you
            <br />

            {!isMobile && " "}

            have today?
          </h1>

          {/* DESCRIPTION */}
          <p
            style={{
              color: "#64748B",

              maxWidth: "650px",

              margin: "0 auto",

              lineHeight: isMobile
                ? "24px"
                : "28px",

              fontSize: isMobile
                ? "14px"
                : "16px"
            }}
          >
            Choose the option that best
            matches your situation.
            Don't worry if you're not
            completely sure.
          </p>
        </div>

        {/* SYMPTOM GRID */}
        <div
          style={{
            display: "grid",

            /*
             * Desktop: 3
             * Tablet: 2
             * Mobile: 1
             */
            gridTemplateColumns:
              isMobile
                ? "1fr"
                : "repeat(3, 1fr)",

            gap: isMobile
              ? "14px"
              : "22px",

            width: "100%"
          }}
        >
          {symptoms.map((symptom) => (
            <SymptomCard
              key={symptom.id}
              symptom={symptom}

              /*
               * No selected state.
               * Every card is simply clickable.
               */
              selected={false}

              onClick={() =>
                handleSymptomSelect(
                  symptom
                )
              }
            />
          ))}
        </div>

        {/* INFO BOX */}
        <div
          style={{
            marginTop: isMobile
              ? "22px"
              : "28px",

            background: "#EEF2FF",

            border:
              "1px solid #C7D2FE",

            borderRadius: isMobile
              ? "14px"
              : "18px",

            padding: isMobile
              ? "14px"
              : "18px",

            display: "flex",

            gap: isMobile
              ? "9px"
              : "12px",

            alignItems: "flex-start",

            boxSizing: "border-box"
          }}
        >
          <FaInfoCircle
            color="#4F46E5"
            size={isMobile ? 16 : 18}
            style={{
              marginTop: "3px",
              flexShrink: 0
            }}
          />

          <span
            style={{
              color: "#4338CA",

              fontSize: isMobile
                ? "13px"
                : "14px",

              lineHeight: isMobile
                ? "21px"
                : "23px"
            }}
          >
            We'll use your answers to
            recommend the most suitable
            doctor based on specialty,
            location, availability and
            urgency.
          </span>
        </div>
      </div>

      {/* FIXED BACK BUTTON */}
      <div
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,

          background: "#FFFFFF",

          borderTop:
            "1px solid #E5E7EB",

          padding: isMobile
            ? "12px 16px"
            : "14px 30px",

          display: "flex",

          alignItems: "center",

          boxShadow:
            "0 -4px 20px rgba(0,0,0,.05)",

          zIndex: 1000,

          boxSizing: "border-box"
        }}
      >
        <button
          onClick={handleBack}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",

            gap: "8px",

            background: "#FFFFFF",

            border:
              "1px solid #CBD5E1",

            color: "#334155",

            padding: isMobile
              ? "10px 16px"
              : "11px 20px",

            borderRadius: "12px",

            cursor: "pointer",

            fontWeight: "600",

            fontSize: isMobile
              ? "13px"
              : "14px",

            boxShadow:
              "0 2px 8px rgba(15,23,42,.06)"
          }}
        >
          <FaArrowLeft />

          Back
        </button>
      </div>
    </div>
  );
}