import { useNavigate, useLocation } from "react-router-dom";
import { useContext, useEffect, useRef } from "react";

import Header from "../components/Header";
import ProgressTracker from "../components/ProgressTracker";
import SummaryBar from "../components/SummaryBar";
import PreferenceCard from "../components/PreferenceCard";
import GuidancePanel from "../components/GuidancePanel";
import useIsMobile from "../hooks/useIsMobile";

import {
  FaMale,
  FaFemale,
  FaHandshake,
} from "react-icons/fa";

import symptoms from "../data/symptoms";

import { TrackingContext } from "../context/TrackingContext";


function HelpDoctorPreferencePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useIsMobile();

  const {
    trackPageVisit,
    trackClick,
    trackInteraction,
    trackHesitation,
    trackBackClick,
  } = useContext(TrackingContext);

  const pageStartTime = useRef(Date.now());

  const decisionTracked = useRef(false);

  const guidedSteps = [
    "Health Problem",
    "Location",
    "Doctor Preference",
    "Urgency",
    "Doctors",
    "Appointment"
  ];

  const symptomId = location.state?.symptomId;

  const selectedSymptom = symptoms.find(
    (symptom) => symptom.id === symptomId
  );

  useEffect(() => {
    trackPageVisit("HelpDoctorPreferencePage");

    trackInteraction(
      "page_opened",
      {
        page: "HelpDoctorPreferencePage",
      }
    );

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /*
    When the user selects a doctor preference,
    immediately go to the next page.
  */
  const handlePreferenceSelect = (preference) => {

    if (!preference) {
      return;
    }

    // ---------------------------------------------
    // Calculate decision time
    // ---------------------------------------------

    const now = Date.now();

    const decisionTime =
      (now - pageStartTime.current) / 1000;

    const decisionTimeRounded =
      Number(decisionTime.toFixed(2));

    // ---------------------------------------------
    // Track hesitation only once
    // ---------------------------------------------

    if (!decisionTracked.current) {
      if (decisionTime > 5) {
        trackHesitation(
          decisionTimeRounded
        );
      }

      decisionTracked.current = true;
    }

    // ---------------------------------------------
    // Track doctor preference card click
    // ---------------------------------------------

    trackClick(
      `help_doctor_preference_${preference
        .toLowerCase()
        .replace(/\s+/g, "_")}`,
      "HelpDoctorPreferencePage"
    );

    // ---------------------------------------------
    // Track selected doctor preference
    // ---------------------------------------------

    trackInteraction(
      "help_doctor_preference_selected",
      {
        preference,
        symptomId,
        symptomName:
          selectedSymptom?.name || null,
        decisionTimeSeconds:
          decisionTimeRounded,
      }
    );


    navigate("/help-urgency", {
      state: {
        symptomId,
        doctorPreference: preference,
      },
    });
  };

  /*
    Clicking the symptom in SummaryBar
    takes the user back to Step 1.
  */
  const handleSymptomChange = () => {

    trackClick(
      "change_symptom",
      "HelpDoctorPreferencePage"
    );

    // Track symptom change interaction
    trackInteraction(
      "symptom_change_requested",
      {
        from: "HelpDoctorPreferencePage",
        symptomId,
      }
    );


    navigate("/help-me", {
      state: {
        symptomId,
      },
    });
  };

  const handleBack = () => {
    // Track back button
    trackBackClick(
      "HelpDoctorPreferencePage_back"
    );

    // Track navigation event
    trackInteraction(
      "back_navigation",
      {
        from: "HelpDoctorPreferencePage",
        to: "HelpMePage",
      }
    );

    // Navigate back
    navigate(-1);
  };


  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#F8FAFC",
        fontFamily: "Inter, sans-serif",
        paddingBottom: isMobile ? "30px" : "50px",
      }}
    >
      <Header />

      {/* MAIN CONTAINER */}

      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: isMobile
            ? "25px 20px 40px"
            : "40px",
          boxSizing: "border-box",
        }}
      >

        {/* STEP NUMBER */}

        <h4
          style={{
            textAlign: "center",
            color: "#6B7280",
            fontSize: isMobile ? "13px" : "15px",
            margin: "0 0 15px 0",
          }}
        >
          Step 3 of 6
        </h4>

        {/* PROGRESS TRACKER */}

        <ProgressTracker
          currentStep={2}
          steps={guidedSteps}
        />

        

        {/* MAIN CONTENT */}

        <div
          style={{
            maxWidth: "1000px",
            margin: isMobile
              ? "35px auto 0"
              : "50px auto 0",
            textAlign: "center",
          }}
        >

          {/* HEADING */}

          <h1
            style={{
              fontSize: isMobile
                ? "28px"
                : "42px",
              lineHeight: isMobile
                ? "1.3"
                : "1.2",
              fontWeight: "700",
              color: "#0F172A",
              margin: "0 0 16px 0",
            }}
          >
            Do you have any doctor
            <br />
            preference?
          </h1>

          {/* DESCRIPTION */}

          <p
            style={{
              color: "#64748B",
              fontSize: isMobile
                ? "14px"
                : "18px",
              lineHeight: "1.6",
              maxWidth: "650px",
              margin: isMobile
                ? "0 auto 30px auto"
                : "0 auto 50px auto",
            }}
          >
            Some patients feel more comfortable
            with a specific type of doctor.
            Choose an option below.
          </p>

          {/* PREFERENCE CARDS */}

          <div
            style={{
              display: "grid",
              gridTemplateColumns: isMobile
                ? "1fr"
                : "repeat(3, 1fr)",
              gap: isMobile
                ? "16px"
                : "32px",
              maxWidth: isMobile
                ? "400px"
                : "none",
              margin: "0 auto",
            }}
          >

            <PreferenceCard
  icon={<FaMale />}
  title="Male Doctor"
  description="Show appointments with male doctors."
  selected={false}
  onClick={() =>
    handlePreferenceSelect("Male")
  }
/>

<PreferenceCard
  icon={<FaFemale />}
  title="Female Doctor"
  description="Show appointments with female doctors."
  selected={false}
  onClick={() =>
    handlePreferenceSelect("Female")
  }
/>

<PreferenceCard
  icon={<FaHandshake />}
  title="No Preference"
  description="Show all available doctors."
  selected={false}
  onClick={() =>
    handlePreferenceSelect("No Preference")
  }
/>

          </div>

          {/* GUIDANCE */}

          <div
            style={{
              marginTop: isMobile
                ? "25px"
                : "40px",
            }}
          >
            <GuidancePanel />
          </div>

          {/* BACK BUTTON */}

          <div
            style={{
              marginTop: isMobile
                ? "30px"
                : "40px",
              display: "flex",
              justifyContent: "flex-start",
            }}
          >
            <button
              onClick={handleBack}
              style={{
                padding: isMobile
                  ? "10px 16px"
                  : "12px 20px",
                borderRadius: "12px",
                border: "1px solid #CBD5E1",
                background: "#FFFFFF",
                color: "#334155",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                fontWeight: "600",
                fontSize: isMobile
                  ? "13px"
                  : "14px",
              }}
            >
              ← Back
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}

export default HelpDoctorPreferencePage;