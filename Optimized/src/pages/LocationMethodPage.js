
import { useLocation, useNavigate } from "react-router-dom";
import { useContext, useEffect, useRef } from "react";
import Header from "../components/Header";
import ProgressTracker from "../components/ProgressTracker";
import SummaryBar from "../components/SummaryBar";
import useIsMobile from "../hooks/useIsMobile";
import { TrackingContext } from "../context/TrackingContext";


import {
  FaMapMarkerAlt,
  FaHospital,
  FaCity,
  FaInfoCircle,
  FaArrowLeft,
} from "react-icons/fa";

import symptoms from "../data/symptoms";

export default function LocationMethodPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useIsMobile();

  const {
  trackPageVisit,
  trackClick,
  trackInteraction,
  trackBackClick,
  trackHesitation,
  setFlowBranch
} = useContext(TrackingContext);

const pageStartTime = useRef(Date.now());

const decisionTracked = useRef(false);

  const guidedSteps = [
    "Health Problem",
    "Doctor Preference",
    "Location",
    "Doctors",
    "Appointment",
  ];

  const symptomId = location.state?.symptomId;

  const preference =
    location.state?.doctorPreference ||
    location.state?.preference ||
    "";

  const selectedSymptom = symptoms.find(
    (symptom) => symptom.id === symptomId
  );


  useEffect(() => {
  trackPageVisit("LocationMethodPage");

  trackInteraction(
    "page_opened",
    {
      page: "LocationMethodPage",
      symptomId,
      symptomName: selectedSymptom?.name || null,
      doctorPreference: preference,
    }
  );
}, [
  trackPageVisit,
  trackInteraction,
  symptomId,
  preference,
  selectedSymptom?.name,
]);

  /*
    Navigate immediately when the user clicks
    a location option.
  */

  const handleLocationSelect = (option) => {
    
    if (!option) {
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
  // Track location option click
  // ---------------------------------------------

  trackClick(
    `location_${option}`,
    "LocationMethodPage"
  );


  // ---------------------------------------------
  // Track selected location method
  // ---------------------------------------------

  trackInteraction(
    "location_method_selected",
    {
      locationMethod: option,

      symptomId,

      symptomName:
        selectedSymptom?.name || null,

      doctorPreference:
        preference,

      decisionTimeSeconds:
        decisionTimeRounded,
    }
  );


    if (option === "near-me") {

       setFlowBranch("near_me");

      navigate("/confirm-location", {
        state: {
          symptomId,
          doctorPreference: preference,
        },
      });

      return;
    }

    if (option === "hospital") {
       setFlowBranch("hospital");

      navigate("/confirm-hospital", {
        state: {
          symptomId,
          doctorPreference: preference,
        },
      });

      return;
    }

    if (option === "town") {
       setFlowBranch("town");

      navigate("/confirm-town", {
        state: {
          symptomId,
          doctorPreference: preference,
        },
      });
    }
  };

  /*
    Allow the user to change the symptom
    from the SummaryBar.
  */

  const handleSymptomChange = () => {

     trackClick(
    "change_symptom",
    "LocationMethodPage"
  );

  trackInteraction(
    "symptom_change_requested",
    {
      from: "LocationMethodPage",
      symptomId,
      symptomName: selectedSymptom?.name || null,
    }
  );

    navigate("/symptoms", {
      state: {
        symptomId,
      },
    });
  };

  const handlePreferenceChange = () => {

    trackClick(
    "change_doctor_preference",
    "LocationMethodPage"
  );

  trackInteraction(
    "doctor_preference_change_requested",
    {
      from: "LocationMethodPage",
      symptomId,
      symptomName: selectedSymptom?.name || null,
      currentPreference: preference,
    }
  );
  
  navigate("/dr-preference", {
    state: {
      symptomId,
      doctorPreference: preference,
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
          Step 3 of 5
        </h4>

        {/* PROGRESS TRACKER */}

        <ProgressTracker
          currentStep={2}
          steps={guidedSteps}
        />

        {/* SUMMARY BAR */}

        <SummaryBar
          selectedSymptom={selectedSymptom}
          doctorPreference={preference}
          onChangeSymptom={handleSymptomChange}
          onChangePreference={handlePreferenceChange}
        />

        {/* MAIN CONTENT */}

        <div
          style={{
            maxWidth: "1000px",
            margin: isMobile
              ? "35px auto 0"
              : "50px auto 0",
          }}
        >
          {/* TITLE */}

          <div
            style={{
              textAlign: "center",
              marginBottom: isMobile
                ? "30px"
                : "50px",
            }}
          >
            <h1
              style={{
                fontSize: isMobile
                  ? "28px"
                  : "42px",
                lineHeight: isMobile
                  ? "1.3"
                  : "1.2",
                color: "#0F172A",
                margin: "0 0 12px 0",
                fontWeight: "700",
              }}
            >
              Where would you like
              <br />
              to visit?
            </h1>

            <p
              style={{
                color: "#64748B",
                fontSize: isMobile
                  ? "14px"
                  : "18px",
                lineHeight: "1.6",
                margin: 0,
              }}
            >
              Choose the option that is
              most convenient for you.
            </p>
          </div>

          {/* LOCATION OPTIONS */}

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
                : "1000px",
              margin: "0 auto",
            }}
          >
            {/* NEAR ME */}

            <div
              onClick={() =>
                handleLocationSelect("near-me")
              }
              style={{
                width: "100%",
                minHeight: isMobile
                  ? "190px"
                  : "220px",
                padding: isMobile
                  ? "25px 15px"
                  : "35px",
                borderRadius: "20px",
                cursor: "pointer",
                textAlign: "center",
                border:
                  "1px solid #E5E7EB",
                background: "#FFFFFF",
                boxShadow:
                  "0 5px 15px rgba(0,0,0,.05)",
                boxSizing: "border-box",
                transition: "0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.border =
                  "2px solid #2563EB";
                e.currentTarget.style.background =
                  "#EFF6FF";
                e.currentTarget.style.boxShadow =
                  "0 10px 25px rgba(37,99,235,.15)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.border =
                  "1px solid #E5E7EB";
                e.currentTarget.style.background =
                  "#FFFFFF";
                e.currentTarget.style.boxShadow =
                  "0 5px 15px rgba(0,0,0,.05)";
              }}
            >
              <FaMapMarkerAlt
                size={isMobile ? 36 : 42}
                color="#2563EB"
              />

              <h3
                style={{
                  margin: "15px 0 10px 0",
                  fontSize: isMobile
                    ? "18px"
                    : "20px",
                  color: "#0F172A",
                }}
              >
                Near Me
              </h3>

              <p
                style={{
                  color: "#64748B",
                  lineHeight: "1.6",
                  fontSize: isMobile
                    ? "13px"
                    : "15px",
                  margin: 0,
                }}
              >
                Show nearby doctors and
                hospitals based on your
                location.
              </p>
            </div>

            {/* HOSPITAL */}

            <div
              onClick={() =>
                handleLocationSelect("hospital")
              }
              style={{
                width: "100%",
                minHeight: isMobile
                  ? "190px"
                  : "220px",
                padding: isMobile
                  ? "25px 15px"
                  : "35px",
                borderRadius: "20px",
                cursor: "pointer",
                textAlign: "center",
                border:
                  "1px solid #E5E7EB",
                background: "#FFFFFF",
                boxShadow:
                  "0 5px 15px rgba(0,0,0,.05)",
                boxSizing: "border-box",
                transition: "0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.border =
                  "2px solid #2563EB";
                e.currentTarget.style.background =
                  "#EFF6FF";
                e.currentTarget.style.boxShadow =
                  "0 10px 25px rgba(37,99,235,.15)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.border =
                  "1px solid #E5E7EB";
                e.currentTarget.style.background =
                  "#FFFFFF";
                e.currentTarget.style.boxShadow =
                  "0 5px 15px rgba(0,0,0,.05)";
              }}
            >
              <FaHospital
                size={isMobile ? 36 : 42}
                color="#2563EB"
              />

              <h3
                style={{
                  margin: "15px 0 10px 0",
                  fontSize: isMobile
                    ? "18px"
                    : "20px",
                  color: "#0F172A",
                }}
              >
                Select Hospital
              </h3>

              <p
                style={{
                  color: "#64748B",
                  lineHeight: "1.6",
                  fontSize: isMobile
                    ? "13px"
                    : "15px",
                  margin: 0,
                }}
              >
                Choose your preferred
                hospital first.
              </p>
            </div>

            {/* TOWN */}

            <div
              onClick={() =>
                handleLocationSelect("town")
              }
              style={{
                width: "100%",
                minHeight: isMobile
                  ? "190px"
                  : "220px",
                padding: isMobile
                  ? "25px 15px"
                  : "35px",
                borderRadius: "20px",
                cursor: "pointer",
                textAlign: "center",
                border:
                  "1px solid #E5E7EB",
                background: "#FFFFFF",
                boxShadow:
                  "0 5px 15px rgba(0,0,0,.05)",
                boxSizing: "border-box",
                transition: "0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.border =
                  "2px solid #2563EB";
                e.currentTarget.style.background =
                  "#EFF6FF";
                e.currentTarget.style.boxShadow =
                  "0 10px 25px rgba(37,99,235,.15)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.border =
                  "1px solid #E5E7EB";
                e.currentTarget.style.background =
                  "#FFFFFF";
                e.currentTarget.style.boxShadow =
                  "0 5px 15px rgba(0,0,0,.05)";
              }}
            >
              <FaCity
                size={isMobile ? 36 : 42}
                color="#2563EB"
              />

              <h3
                style={{
                  margin: "15px 0 10px 0",
                  fontSize: isMobile
                    ? "18px"
                    : "20px",
                  color: "#0F172A",
                }}
              >
                Select Town
              </h3>

              <p
                style={{
                  color: "#64748B",
                  lineHeight: "1.6",
                  fontSize: isMobile
                    ? "13px"
                    : "15px",
                  margin: 0,
                }}
              >
                Choose a city or town and
                view available doctors
                nearby.
              </p>
            </div>
          </div>

          {/* INFORMATION BOX */}

          <div
            style={{
              width: isMobile
                ? "100%"
                : "80%",
              margin: isMobile
                ? "25px auto 0"
                : "40px auto 0",
              background: "#EFF6FF",
              border: "1px solid #BFDBFE",
              borderRadius: "14px",
              padding: isMobile
                ? "13px"
                : "16px",
              display: "flex",
              alignItems: "flex-start",
              gap: "10px",
              boxSizing: "border-box",
              textAlign: "left",
            }}
          >
            <FaInfoCircle
              color="#2563EB"
              size={isMobile ? 16 : 18}
              style={{
                flexShrink: 0,
                marginTop: "2px",
              }}
            />

            <span
              style={{
                color: "#1E40AF",
                fontSize: isMobile
                  ? "12px"
                  : "14px",
                lineHeight: "1.5",
              }}
            >
              Choosing "Near Me" may help
              you find the earliest available
              appointment.
            </span>
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
    "LocationMethodPage_back"
  );

  trackInteraction(
    "back_navigation",
    {
      from: "LocationMethodPage",
    }
  );

  navigate(-1);
}}
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
              <FaArrowLeft />
              Back
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

