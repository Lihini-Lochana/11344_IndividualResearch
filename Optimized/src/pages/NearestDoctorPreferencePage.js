import { useNavigate, useLocation } from "react-router-dom";
import {
  useContext,
  useEffect,
  useRef
} from "react";

import { TrackingContext } from "../context/TrackingContext";
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
  FaInfoCircle,
} from "react-icons/fa";

import symptoms from "../data/symptoms";

function NearestDoctorPreferencePage() {
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

const pageStartTime = useRef(Date.now());
  const decisionTracked = useRef(false);

  const guidedSteps = [
    "Location",
    "Health Problem",
    "Doctor Preference",
    "Doctors",
    "Appointment",
    "Confirmation"
  ];

  /*
   * Data received from previous page.
   */
  const selectedLocation =
    location.state?.location || "Colombo, Sri Lanka";

  const symptomId =
    location.state?.symptomId;

  const selectedSymptom = symptoms.find(
    (symptom) => symptom.id === symptomId
  );

  useEffect(() => {
    trackPageVisit(
      "NearestDoctorPreferencePage"
    );

    trackInteraction(
      "page_opened",
      {
        page:
          "NearestDoctorPreferencePage",
        location:
          selectedLocation,
        symptomId,
        symptom:
          selectedSymptom?.title || null
      }
    );

    // We intentionally do NOT start
    // a 10-second hesitation timer here.

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);




  /*
   * When doctor preference is selected,
   * keep BOTH location and symptom.
   */
  const handlePreferenceSelect = (
    preference
  ) => {


   if (!preference) {
      return;
    }

    /* ---------------------------------------
       CALCULATE DECISION TIME
    --------------------------------------- */

    const now = Date.now();

    const decisionTime =
      (now - pageStartTime.current) /
      1000;

    const decisionTimeRounded =
      Number(
        decisionTime.toFixed(2)
      );

    /* ---------------------------------------
       HESITATION

       Only count hesitation if the user
       actually takes longer than the
       threshold to make the decision.

       This is NOT based on a fixed timer.
    --------------------------------------- */

    if (!decisionTracked.current) {

      if (decisionTime > 5) {

        trackHesitation(
          decisionTimeRounded
        );
      }

      decisionTracked.current = true;
    }

    /* ---------------------------------------
       CLICK TRACKING

       This is what makes the action appear
       under "Clicks Per Page".
    --------------------------------------- */

    trackClick(
      `nearest_doctor_preference_${preference
        .toLowerCase()
        .replace(/\s+/g, "_")}`,
      "NearestDoctorPreferencePage"
    );

    /* ---------------------------------------
       INTERACTION TRACKING
    --------------------------------------- */

    trackInteraction(
      "doctor_preference_selected",
      {
        page:
          "NearestDoctorPreferencePage",

        preference,

        location:
          selectedLocation,

        symptomId,

        symptom:
          selectedSymptom?.title ||
          null,

        decisionTimeSeconds:
          decisionTimeRounded
      }
    );

    navigate("/fastest-doctors", {
      state: {
        location: selectedLocation,
        symptomId: symptomId,
        doctorPreference: preference,
      },
    });
  };

  /*
   * Change health problem.
   */
  const handleSymptomChange = () => {

    trackClick(
      "change_health_problem",
      "NearestDoctorPreferencePage"
    );

    /* Interaction tracking */
    trackInteraction(
      "health_problem_change_requested",
      {
        page:
          "NearestDoctorPreferencePage",

        currentSymptom:
          selectedSymptom?.title ||
          null,

        location:
          selectedLocation,

        symptomId
      }
    );
  
    navigate("/nearest-health-problem", {
      state: {
        location: selectedLocation,
        symptomId: symptomId,
      },
    });
  };

  const handleBack = () => {

  trackBackClick(
      "NearestDoctorPreferencePage_back"
    );

    trackInteraction(
      "back_navigation",
      {
        from:
          "NearestDoctorPreferencePage",

        to:
          "NearestSymptomSelectionPage",

        location:
          selectedLocation,

        symptomId
      }
    );

  navigate(-1);
};

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#F8FAFC",
        fontFamily: "Inter, sans-serif",
        paddingBottom: isMobile
          ? "30px"
          : "50px",
      }}
    >
      <Header />

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
            fontSize: isMobile
              ? "13px"
              : "15px",
            margin: "0 0 15px 0",
          }}
        >
          Step 3 of 6
        </h4>

        {/* PROGRESS */}

        <ProgressTracker
          currentStep={2}
          steps={guidedSteps}
        />

        {/* SUMMARY */}

        <SummaryBar
          selectedSymptom={selectedSymptom}
          onChangeSymptom={
            handleSymptomChange
          }
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

          {/* LOCATION INFORMATION */}

          <div
            style={{
              background: "#EFF6FF",
              border:
                "1px solid #BFDBFE",
              borderRadius: "12px",
              padding: "10px 14px",
              margin:
                "0 auto 25px",
              maxWidth: "650px",
              color: "#1E40AF",
              fontSize: isMobile
                ? "13px"
                : "14px",
            }}
          >
            Doctors will be matched with
            hospitals near{" "}
            <strong>
              {selectedLocation}
            </strong>
          </div>

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

            {/* MALE */}

            <PreferenceCard
              icon={<FaMale />}
              title="Male Doctor"
              description="Show appointments with male doctors."
              selected={false}
              onClick={() =>
                handlePreferenceSelect(
                  "Male Doctor"
                )
              }
            />

            {/* FEMALE */}

            <PreferenceCard
              icon={<FaFemale />}
              title="Female Doctor"
              description="Show appointments with female doctors."
              selected={false}
              onClick={() =>
                handlePreferenceSelect(
                  "Female Doctor"
                )
              }
            />

            {/* NO PREFERENCE */}

            <PreferenceCard
              icon={<FaHandshake />}
              title="No Preference"
              description="Show all available doctors."
              selected={false}
              onClick={() =>
                handlePreferenceSelect(
                  "No Preference"
                )
              }
            />

          </div>

          {/* GUIDANCE */}

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
                If you do not have a preference, choosing "No Preference" may provide more appointment options.
              </span>
            </div>

          {/* BACK */}

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
                border:
                  "1px solid #CBD5E1",
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

export default NearestDoctorPreferencePage;