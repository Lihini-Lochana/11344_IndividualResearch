import { useNavigate, useLocation } from "react-router-dom";
import { useContext, useEffect, useRef } from "react";

import Header from "../components/Header";
import ProgressTracker from "../components/ProgressTracker";
import SymptomCard from "../components/SymptomCard";

import symptoms from "../data/symptoms";

import {
  FaArrowLeft,
  FaMapMarkerAlt,
  FaInfoCircle
} from "react-icons/fa";

import useIsMobile from "../hooks/useIsMobile";
import { TrackingContext } from "../context/TrackingContext";

export default function NearestSymptomSelectionPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const isMobile = useIsMobile();

  const {
  trackPageVisit,
  trackClick,
  trackInteraction,
  trackHesitation,
  trackBackClick
} = useContext(TrackingContext);

  const guidedSteps = [
    "Location",
    "Health Problem",
    "Doctor Preference",
    "Doctors",
    "Appointment",
    "Confirmation"
  ];

  const selectedLocation =
    location.state?.location || "Colombo, Sri Lanka";

  const pageStartTime =
  useRef(Date.now());

const decisionTracked =
  useRef(false);

// ======================================================
// PAGE VISIT TRACKING
// ======================================================

// ======================================================
// PAGE VISIT TRACKING
// ======================================================

useEffect(() => {

  // ====================================================
  // TRACK PAGE VISIT
  // ====================================================

  trackPageVisit(
    "NearestSymptomSelectionPage"
  );


  // ====================================================
  // TRACK PAGE OPEN
  // ====================================================

  trackInteraction(
    "page_opened",
    {
      page:
        "NearestSymptomSelectionPage",

      flow:
        "nearest_doctor",

      location:
        selectedLocation
    }
  );


  // ====================================================
  // START HESITATION TIMER
  // ====================================================

  pageStartTime.current =
    Date.now();


  decisionTracked.current =
    false;


  // eslint-disable-next-line react-hooks/exhaustive-deps
}, []);
  /*
   * When a symptom card is clicked,
   * immediately move to the doctors page.
   */
 // ======================================================
// USER SELECTS HEALTH PROBLEM
// ======================================================

const handleSymptomSelect = (symptom) => {

  if (!symptom) {
    return;
  }


  // ====================================================
  // CALCULATE DECISION TIME
  // ====================================================

  const now = Date.now();

  const decisionTime =
    (now - pageStartTime.current) / 1000;

  const decisionTimeRounded =
    Number(
      decisionTime.toFixed(2)
    );


  // ====================================================
  // HESITATION
  // ====================================================

  if (!decisionTracked.current) {

    if (decisionTime > 5) {

      trackHesitation(
        decisionTimeRounded
      );

      trackInteraction(
        "hesitation",
        {
          page:
            "NearestSymptomSelectionPage",

          seconds:
            decisionTimeRounded
        }
      );
    }


    // IMPORTANT
    // Only process hesitation once
    // on this page visit.

    decisionTracked.current =
      true;
  }


  // ====================================================
  // TRACK HEALTH PROBLEM CLICK
  // ====================================================

  trackClick(
    `health_problem_${symptom.title
      .toLowerCase()
      .replace(/\s+/g, "_")}`,
    "NearestSymptomSelectionPage"
  );


  // ====================================================
  // TRACK HEALTH PROBLEM SELECTION
  // ====================================================

  trackInteraction(
    "health_problem_selected",
    {
      symptomId:
        symptom.id,

      symptomName:
        symptom.title,

      location:
        selectedLocation,

      decisionTimeSeconds:
        decisionTimeRounded
    }
  );


  // ====================================================
  // GO TO DOCTOR PREFERENCE
  // ====================================================

  navigate(
    "/nearest-dr-preference",
    {
      state: {
        location:
          selectedLocation,

        symptomId:
          symptom.id
      }
    }
  );
};

  /*
   * Back to location selection.
   */
// ======================================================
// BACK BUTTON
// ======================================================

const handleBack = () => {

  // ====================================================
  // TRACK BACK CLICK
  // ====================================================

  trackBackClick(
    "NearestSymptomSelectionPage_back"
  );


  // ====================================================
  // TRACK NAVIGATION
  // ====================================================

  trackInteraction(
    "back_navigation",
    {
      from:
        "NearestSymptomSelectionPage",

      to:
        "FindNearestLocationPage"
    }
  );


  // ====================================================
  // RETURN TO LOCATION PAGE
  //
  // returnFromBack = true tells the location page:
  // "Do NOT start a new tracking flow."
  //
  // ====================================================

  navigate(
    "/nearest-location",
    {
      state: {
        location:
          selectedLocation,

        returnFromBack:
          true
      }
    }
  );
};

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#F8FAFC",
        paddingBottom: isMobile ? "75px" : "80px",
        boxSizing: "border-box"
      }}
    >
      <Header />

      {/* STEP */}
      <h4
        style={{
          textAlign: "center",
          color: "#6B7280",
          margin: isMobile
            ? "20px 0 15px"
            : "25px 0 20px",
          fontSize: isMobile ? "14px" : "15px"
        }}
      >
        Step 2 of 6
      </h4>

      {/* PROGRESS */}
      <ProgressTracker
        currentStep={1}
        steps={guidedSteps}
      />

      {/* TITLE */}
      <div
        style={{
          textAlign: "center",
          margin: isMobile
            ? "25px auto 22px"
            : "35px auto 30px",
          padding: isMobile
            ? "0 15px"
            : "0 20px",
          boxSizing: "border-box"
        }}
      >
        <h1
          style={{
            fontSize: isMobile
              ? "28px"
              : "clamp(28px, 5vw, 40px)",
            lineHeight: "1.2",
            color: "#0F172A",
            margin: "0 0 12px"
          }}
        >
          What health problem are you facing?
        </h1>
      </div>

      {/* LOCATION INFO */}
      <div
        style={{
          maxWidth: "1200px",
          margin: isMobile
            ? "0 auto 20px"
            : "0 auto 25px",
          padding: isMobile
            ? "0 12px"
            : "0 20px",
          boxSizing: "border-box"
        }}
      >
        <div
          style={{
            background: "#FFFFFF",
            border: "1px solid #E2E8F0",
            borderRadius: isMobile
              ? "12px"
              : "14px",
            padding: isMobile
              ? "11px 12px"
              : "12px 16px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
            color: "#475569",
            fontSize: isMobile ? "14px" : "15px",
            textAlign: "center",
            boxSizing: "border-box"
          }}
        >
          <FaMapMarkerAlt
            color="#2563EB"
            size={isMobile ? 14 : 16}
          />

          <span>
            Your location:{" "}
            <strong style={{ color: "#2563EB" }}>
              {selectedLocation}
            </strong>
          </span>
        </div>
      </div>

      {/* SYMPTOM GRID */}
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: isMobile
            ? "0 12px"
            : "0 20px",
          boxSizing: "border-box",

          display: "grid",

          /*
           * Desktop → 3 columns
           * Tablet → 2 columns
           * Mobile → 1 column
           */
          gridTemplateColumns: isMobile
            ? "1fr"
            : "repeat(auto-fit, minmax(260px, 1fr))",

          gap: isMobile ? "12px" : "20px"
        }}
      >
        {symptoms.map((symptom) => (
          <div
            key={symptom.id}
            
            style={{
              cursor: "pointer",
              transition: "transform 0.2s ease",
              width: "100%"
            }}
            onMouseEnter={(e) => {
              if (!isMobile) {
                e.currentTarget.style.transform =
                  "translateY(-3px)";
              }
            }}
            onMouseLeave={(e) => {
              if (!isMobile) {
                e.currentTarget.style.transform =
                  "translateY(0)";
              }
            }}
          >
            <SymptomCard
              symptom={symptom}
              selected={false}
              onClick={() =>
                handleSymptomSelect(symptom)
              }
            />
          </div>
        ))}
      </div>

      {/* SUPPORT CARD */}

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
                       Select a health problem to find the nearest available doctors.
                     </span>
                   </div>

      {/* BACK BUTTON */}
      <button
        onClick={handleBack}
        style={{
          position: "fixed",
          left: isMobile ? "12px" : "20px",
          bottom: isMobile ? "12px" : "20px",
          zIndex: 1000,

          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: isMobile ? "6px" : "8px",

          padding: isMobile
            ? "10px 15px"
            : "12px 18px",

          borderRadius: isMobile
            ? "10px"
            : "12px",

          border: "1px solid #CBD5E1",

          background: "#FFFFFF",
          color: "#2563EB",

          fontSize: isMobile ? "13px" : "14px",
          fontWeight: "600",
          cursor: "pointer",

          boxShadow:
            "0 4px 15px rgba(15,23,42,0.10)"
        }}
      >
        <FaArrowLeft
          size={isMobile ? 13 : 14}
        />
        Back
      </button>
    </div>
  );
}