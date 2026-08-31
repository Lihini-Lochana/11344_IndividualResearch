import {
  useNavigate,
  useLocation
} from "react-router-dom";
import { useContext, useEffect, useRef, } from "react";

import symptoms from "../data/symptoms";
import SymptomCard from "../components/SymptomCard";
import ProgressTracker from "../components/ProgressTracker";
import Footer from "../components/Footer";
import Header from "../components/Header";

import useIsMobile from "../hooks/useIsMobile";
import { TrackingContext } from "../context/TrackingContext";

import {
  FaHospital,
  FaArrowLeft
} from "react-icons/fa";

function HospitalSymptomPage() {

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


  const hospital =
    location.state?.hospital;

  const hospitalSteps = [
    "Hospital Search",
    "Symptoms",
    "Doctor Preference",
    "Doctors",
    "Appointment",
    "Confirmation"
  ];

  useEffect(() => {

  pageStartTime.current = Date.now();

  trackPageVisit("HospitalSymptomsPage");

  trackInteraction(
    "page_opened",
    {
      page: "HospitalSymptomsPage",
      flow: "hospital_name",
      hospitalId: hospital?.id,
      hospitalName: hospital?.name
    }
  );

}, [
  trackPageVisit,
  trackInteraction,
  hospital?.id,
  hospital?.name
]);

  /*
   * When a symptom is clicked,
   * immediately go to the doctors page.
   */
  const handleSymptomClick = (symptom) => {

    if (!symptom) {

    return;
  }

  // -----------------------------------------------
  // CALCULATE DECISION TIME
  // -----------------------------------------------

  const decisionTime =
    Math.floor(
      (Date.now() - pageStartTime.current) / 1000
    );

  // -----------------------------------------------
  // HESITATION
  // -----------------------------------------------

  if (decisionTime > 5) {

    trackHesitation(
      decisionTime
    );

    trackInteraction(
      "symptom_selection_hesitation",
      {
        seconds: decisionTime,

        hospitalId: hospital?.id,

        hospitalName: hospital?.name,

        symptomId: symptom.id,

        symptomName: symptom.name
      }
    );
  }

  trackClick(
    `symptom_${symptom.id}`,
    "HospitalSymptomsPage"
  );

  // -----------------------------------------------
  // SYMPTOM SELECTED
  // -----------------------------------------------

  trackInteraction(
    "symptom_selected",
    {
      symptomId: symptom.id,

      symptomName: symptom.name,

      hospitalId: hospital?.id,

      hospitalName: hospital?.name,

      decisionTime
    }
  );

    navigate(
      "/hospital-dr-preference",
      {
        state: {
          hospital,
          symptomId: symptom.id
        }
      }
    );

  };

  /*
   * Go back to hospital selection.
   */
  const handleBack = () => {

    trackBackClick(
    "HospitalSymptomsPage_back"
  );

  trackInteraction(
    "returned_to_hospital_selection",
    {
      hospitalId: hospital?.id,
      hospitalName: hospital?.name
    }
  );

    navigate("/hospital-selection");

  };

  return (

    <div
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(to bottom,#F8FAFC,#EFF6FF)",
        fontFamily:
          "Inter, sans-serif",
        paddingBottom:
          isMobile ? "90px" : "100px",
        boxSizing: "border-box"
      }}
    >

      <Header />

      {/* MAIN CONTENT */}

      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",

          padding: isMobile
            ? "20px 15px 50px"
            : "30px 20px 70px",

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
              : "10px 0 20px",

            fontSize: isMobile
              ? "12px"
              : "14px",

            fontWeight: "600"
          }}
        >
          Step 2 of 6
        </h4>

        {/* PROGRESS */}

        <ProgressTracker
          currentStep={1}
          steps={hospitalSteps}
        />

        {/* TITLE */}

        <div
          style={{
            textAlign: "center",

            marginTop: isMobile
              ? "28px"
              : "40px",

            marginBottom: isMobile
              ? "25px"
              : "35px",

            padding:
              isMobile
                ? "0 5px"
                : "0 15px"
          }}
        >

          <h1
            style={{
              margin: 0,

              fontSize: isMobile
                ? "28px"
                : "clamp(30px, 5vw, 40px)",

              lineHeight: "1.25",

              color: "#0F172A"
            }}
          >
            What problem do you
            need help with?
          </h1>

          <p
            style={{
              maxWidth: "700px",

              margin: isMobile
                ? "12px auto 0"
                : "15px auto 0",

              color: "#64748B",

              fontSize: isMobile
                ? "14px"
                : "clamp(14px, 2vw, 17px)",

              lineHeight: "1.6"
            }}
          >
            We'll use your selected
            health problem to find the
            most suitable doctors
            available at{" "}

            <strong
              style={{
                color: "#2563EB"
              }}
            >
              {hospital?.name}
            </strong>.
          </p>

        </div>

        {/* SELECTED HOSPITAL */}

        <div
          style={{
            background: "#FFFFFF",
            borderRadius: isMobile
              ? "14px"
              : "18px",

            padding: isMobile
              ? "14px 16px"
              : "18px 22px",

            marginBottom: isMobile
              ? "22px"
              : "30px",

            border:
              "1px solid #E2E8F0",

            display: "flex",

            alignItems: "center",

            gap: "12px",

            boxSizing: "border-box",

            boxShadow:
              "0 4px 15px rgba(15,23,42,.04)"
          }}
        >

          <div
            style={{
              width: isMobile
                ? "36px"
                : "40px",

              height: isMobile
                ? "36px"
                : "40px",

              borderRadius: "10px",

              background: "#EFF6FF",

              display: "flex",

              alignItems: "center",

              justifyContent: "center",

              flexShrink: 0
            }}
          >

            <FaHospital
              color="#2563EB"
              size={
                isMobile ? 17 : 20
              }
            />

          </div>

          <div
            style={{
              minWidth: 0
            }}
          >

            <div
              style={{
                color: "#64748B",
                fontSize: "11px",
                marginBottom: "3px"
              }}
            >
              Selected Hospital
            </div>

            <div
              style={{
                fontWeight: "600",
                color: "#0F172A",

                fontSize: isMobile
                  ? "14px"
                  : "15px",

                overflowWrap:
                  "break-word"
              }}
            >
              {hospital?.name}
            </div>

          </div>

        </div>

        {/* SECTION LABEL */}

        <div
          style={{
            marginBottom: isMobile
              ? "14px"
              : "18px"
          }}
        >

          <h2
            style={{
              margin: 0,
              color: "#0F172A",

              fontSize: isMobile
                ? "19px"
                : "22px"
            }}
          >
            Select your health problem
          </h2>

          <p
            style={{
              margin: "5px 0 0",
              color: "#64748B",

              fontSize: isMobile
                ? "13px"
                : "14px"
            }}
          >
            Tap an option to continue.
          </p>

        </div>

        {/* SYMPTOM GRID */}

        <div
          style={{
            display: "grid",

            gridTemplateColumns:
              isMobile
                ? "1fr"
                : "repeat(3, minmax(0, 1fr))",

            gap: isMobile
              ? "14px"
              : "20px"
          }}
        >

          {symptoms.map(
            (symptom) => (

              <SymptomCard
                key={symptom.id}
                symptom={symptom}

                /*
                 * No selected option.
                 */
                selected={false}

                /*
                 * Clicking immediately
                 * moves to next page.
                 */
                onClick={() =>
                  handleSymptomClick(
                    symptom
                  )
                }
              />

            )
          )}

        </div>

        {/* GUIDANCE */}

        <div
          style={{
            background: "#EFF6FF",

            border:
              "1px solid #BFDBFE",

            borderRadius: isMobile
              ? "14px"
              : "16px",

            padding: isMobile
              ? "14px"
              : "16px",

            marginTop: isMobile
              ? "22px"
              : "30px",

            color: "#1E40AF",

            textAlign: isMobile
              ? "left"
              : "center",

            fontSize: isMobile
              ? "13px"
              : "14px",

            lineHeight: "1.6",

            boxSizing: "border-box"
          }}
        >
          We will only show doctors
          available at{" "}

          <strong>
            {hospital?.name}
          </strong>{" "}

          for the health problem you
          select. This reduces
          unnecessary searching and
          simplifies decision making.
        </div>

      </div>

      {/* BACK BUTTON */}

      <button
        onClick={handleBack}
        style={{
          position: "fixed",

          left: isMobile
            ? "15px"
            : "20px",

          bottom: isMobile
            ? "15px"
            : "20px",

          zIndex: 1000,

          display: "flex",

          alignItems: "center",

          justifyContent: "center",

          gap: "8px",

          background: "#FFFFFF",

          color: "#2563EB",

          border:
            "1px solid #CBD5E1",

          borderRadius: "12px",

          padding: isMobile
            ? "10px 15px"
            : "12px 20px",

          fontSize: isMobile
            ? "13px"
            : "14px",

          fontWeight: "600",

          cursor: "pointer",

          boxShadow:
            "0 4px 15px rgba(0,0,0,0.08)"
        }}
      >

        <FaArrowLeft />

        Back

      </button>

      <Footer />

    </div>
  );
}

export default HospitalSymptomPage;