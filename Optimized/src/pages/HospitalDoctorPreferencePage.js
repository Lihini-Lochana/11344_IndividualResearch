import { useNavigate, useLocation } from "react-router-dom";
import { useContext, useEffect, useRef } from "react";
import Header from "../components/Header";
import ProgressTracker from "../components/ProgressTracker";
import SummaryBar from "../components/SummaryBar";
import PreferenceCard from "../components/PreferenceCard";
import GuidancePanel from "../components/GuidancePanel";
import useIsMobile from "../hooks/useIsMobile";

import { TrackingContext } from "../context/TrackingContext";

import {
  FaMale,
  FaFemale,
  FaHandshake,
} from "react-icons/fa";

import symptoms from "../data/symptoms";

function HospitalDoctorPreferencePage() {
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

  const guidedSteps = [
    "Hospital Search",
    "Symptoms",
    "Doctor Preference",
    "Doctors",
    "Appointment",
    "Confirmation"
  ];

  const symptomId = location.state?.symptomId;
  const hospital = location.state?.hospital;

  const hesitationStartTime = useRef(Date.now());

  console.log("========== HOSPITAL DOCTOR PREFERENCE ==========");
console.log("Location state:", location.state);
console.log("Hospital:", hospital);
console.log("Symptom ID:", symptomId);
console.log("===============================================");

  const selectedSymptom = symptoms.find(
    (symptom) => symptom.id === symptomId
  );

  // --------------------------------------------------
// PAGE VISIT TRACKING
// --------------------------------------------------

useEffect(() => {
  trackPageVisit("HospitalDoctorPreferencePage");

  trackInteraction(
    "page_opened",
    {
      page: "HospitalDoctorPreferencePage",
      hospitalId: hospital?.id,
      hospitalName: hospital?.name,
      symptomId,
    }
  );
}, [
  trackPageVisit,
  trackInteraction,
  hospital?.id,
  hospital?.name,
  symptomId,
]);

  /*
    When the user selects a doctor preference,
    immediately go to the next page.
  */
  const handlePreferenceSelect = (preference) => {

  console.log("========== DOCTOR PREFERENCE SELECTED ==========");
  console.log("Selected preference:", preference);
  console.log("Hospital being passed:", hospital);
  console.log("Symptom ID being passed:", symptomId);
  console.log("===============================================");
  
  
  const hesitationTime =
    (Date.now() - hesitationStartTime.current) / 1000;

  // Record hesitation only if user spent
  // meaningful time considering the options.
  if (hesitationTime > 5) {
    trackHesitation(
      hesitationTime,
      "HospitalDoctorPreferencePage"
    );
  }


  trackClick(
    `doctor_preference_${preference
      .toLowerCase()
      .replace(/\s+/g, "_")}`,
    "HospitalDoctorPreferencePage"
  );

  // Track the selected preference
  trackInteraction(
    "doctor_preference_selected",
    {
      page: "HospitalDoctorPreferencePage",
      hospitalId: hospital?.id,
      hospitalName: hospital?.name,
      symptomId,
      doctorPreference: preference,
    }
  );
  
  navigate("/hospital-doctors", {
    state: {
      hospital,
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
    "HospitalDoctorPreferencePage"
  );

  trackInteraction(
    "symptom_change_requested",
    {
      page: "HospitalDoctorPreferencePage",
      hospitalId: hospital?.id,
      hospitalName: hospital?.name,
      symptomId,
    }
  );

    navigate("/hospital-symptoms", {
      state: {
        symptomId,
        hospital,
      },
    });
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

        {/* SUMMARY BAR */}

        <SummaryBar
          selectedSymptom={selectedSymptom}
          onChangeSymptom={handleSymptomChange}
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

            {/* MALE DOCTOR */}

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

            {/* FEMALE DOCTOR */}

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
              onClick={() => {

              trackBackClick(
                "HospitalDoctorPreferencePage_back"
              );

              trackInteraction(
                "returned_to_previous_page",
                {
                  page: "HospitalDoctorPreferencePage",
                  hospitalId: hospital?.id,
                  hospitalName: hospital?.name,
                  symptomId,
                }
              );

              navigate(-1);
            }}
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

export default HospitalDoctorPreferencePage;