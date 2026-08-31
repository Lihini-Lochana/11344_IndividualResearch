
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import Header from "../components/Header";
import ProgressTracker from "../components/ProgressTracker";

import {
  FaMapMarkerAlt,
  FaHospital,
  FaUserMd,
  FaCheckCircle,
  FaSpinner,
  FaArrowRight,
  FaBrain,
} from "react-icons/fa";

import useIsMobile from "../hooks/useIsMobile";

export default function FindingDoctorsPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useIsMobile();

  const guidedSteps = [
    "Health Problem",
    "Doctor Preference",
    "Location",
    "Doctors",
    "Appointment",
  ];

  // --------------------------------------------------
  // PREVIOUS SELECTIONS
  // --------------------------------------------------

  const symptomId = location.state?.symptomId;

  const doctorPreference =
    location.state?.doctorPreference ||
    location.state?.preference ||
    "";

  const locationMethod =
    location.state?.locationMethod ||
    "Near Me";

  const selectedLocation =
    location.state?.location ||
    "Colombo, Sri Lanka";

  // --------------------------------------------------
  // FINDING DOCTORS PROCESS
  // --------------------------------------------------

  const [step, setStep] = useState(1);

  const [showButton, setShowButton] =
    useState(false);

  useEffect(() => {
    const timer1 = setTimeout(() => {
      setStep(2);
    }, 1000);

    const timer2 = setTimeout(() => {
      setStep(3);
    }, 2000);

    const timer3 = setTimeout(() => {
      setShowButton(true);
    }, 3000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, []);

  // --------------------------------------------------
  // VIEW RECOMMENDED DOCTORS
  // --------------------------------------------------

  const handleViewDoctors = () => {
    navigate("/recommended-doctors", {
      state: {
        symptomId,
        doctorPreference,
        location: selectedLocation,
        locationMethod,
      },
    });
  };

  // --------------------------------------------------
  // CHANGE LOCATION
  // --------------------------------------------------

  const handleChangeLocation = () => {
    navigate("/confirm-location", {
      state: {
        symptomId,
        doctorPreference,
        locationMethod,
        location: selectedLocation,
      },
    });
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(180deg,#F8FAFC,#EFF6FF)",
        paddingBottom: "50px",
        boxSizing: "border-box",
      }}
    >
      {/* =========================================
          HEADER
      ========================================= */}

      <Header />

      {/* =========================================
          STEP NUMBER
      ========================================= */}

      <h4
        style={{
          textAlign: "center",
          color: "#6B7280",
          marginTop: isMobile
            ? "15px"
            : "20px",
          marginBottom: "15px",
          fontSize: isMobile
            ? "13px"
            : "15px",
        }}
      >
        Step 4 of 5
      </h4>

      {/* =========================================
          PROGRESS TRACKER
      ========================================= */}

      <ProgressTracker
        currentStep={3}
        steps={guidedSteps}
      />

      {/* =========================================
          PAGE CONTAINER
      ========================================= */}

      <div
        style={{
          width: "100%",
          maxWidth: "1000px",
          margin: "0 auto",
          padding: isMobile
            ? "0 15px"
            : "0 20px",
          boxSizing: "border-box",
        }}
      >
        {/* =========================================
            TITLE
        ========================================= */}

        <div
          style={{
            textAlign: "center",
            marginTop: isMobile
              ? "30px"
              : "40px",
            marginBottom: isMobile
              ? "30px"
              : "40px",
          }}
        >
          <h1
            style={{
              fontSize: isMobile
                ? "28px"
                : "42px",
              lineHeight: "1.3",
              color: "#0F172A",
              margin: "0 0 12px 0",
              fontWeight: "700",
            }}
          >
            Finding the best doctors
            <br />
            near you
          </h1>

          <p
            style={{
              fontSize: isMobile
                ? "14px"
                : "18px",
              lineHeight: "1.6",
              color: "#64748B",
              margin: 0,
            }}
          >
            We are analyzing available
            doctors based on your
            location and preferences.
          </p>
        </div>

        {/* =========================================
            LOCATION CARD
        ========================================= */}

        <div
          style={{
            background: "#FFFFFF",
            borderRadius: "20px",
            padding: isMobile
              ? "18px"
              : "24px",
            marginBottom: "30px",
            boxShadow:
              "0 10px 30px rgba(0,0,0,.05)",
            border: "1px solid #DBEAFE",
            boxSizing: "border-box",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent:
                "space-between",
              alignItems: "center",
              gap: isMobile
                ? "10px"
                : "15px",
            }}
          >
            {/* LOCATION INFORMATION */}

            <div
              style={{
                display: "flex",
                gap: isMobile
                  ? "10px"
                  : "12px",
                alignItems: "center",
                minWidth: 0,
              }}
            >
              <FaMapMarkerAlt
                color="#2563EB"
                size={
                  isMobile ? 18 : 20
                }
                style={{
                  flexShrink: 0,
                }}
              />

              <div
                style={{
                  minWidth: 0,
                }}
              >
                <div
                  style={{
                    fontSize: isMobile
                      ? "12px"
                      : "13px",
                    color: "#94A3B8",
                    marginBottom: "3px",
                  }}
                >
                  Your Location
                </div>

                <div
                  style={{
                    fontWeight: "600",
                    color: "#0F172A",
                    fontSize: isMobile
                      ? "13px"
                      : "15px",
                    wordBreak:
                      "break-word",
                  }}
                >
                  {selectedLocation}
                </div>
              </div>
            </div>

            {/* CHANGE BUTTON */}

            <button
              onClick={
                handleChangeLocation
              }
              style={{
                border: "none",
                background: "#EFF6FF",
                color: "#2563EB",
                padding: isMobile
                  ? "7px 11px"
                  : "8px 14px",
                borderRadius: "10px",
                cursor: "pointer",
                fontSize: isMobile
                  ? "12px"
                  : "13px",
                fontWeight: "600",
                flexShrink: 0,
              }}
            >
              Change
            </button>
          </div>
        </div>

        {/* =========================================
            PROCESS CARD
        ========================================= */}

        <div
          style={{
            background: "#FFFFFF",
            borderRadius: isMobile
              ? "20px"
              : "24px",
            padding: isMobile
              ? "25px 20px"
              : "40px",
            boxShadow:
              "0 15px 40px rgba(0,0,0,.06)",
            boxSizing: "border-box",
          }}
        >
          {/* =====================================
              PROCESS TITLE
          ===================================== */}

          <div
            style={{
              textAlign: "center",
            }}
          >
            <FaBrain
              size={
                isMobile ? 45 : 60
              }
              color="#2563EB"
            />

            <h2
              style={{
                marginTop: "20px",
                marginBottom: 0,
                color: "#0F172A",
                fontSize: isMobile
                  ? "20px"
                  : "26px",
                lineHeight: "1.4",
              }}
            >
              Matching you with
              suitable doctors...
            </h2>

            <FaSpinner
              size={
                isMobile ? 25 : 30
              }
              color="#2563EB"
              style={{
                marginTop: "20px",
              }}
            />
          </div>

          {/* =====================================
              PROCESS STEPS
          ===================================== */}

          <div
            style={{
              marginTop: isMobile
                ? "30px"
                : "40px",
            }}
          >
            {/* STEP 1 */}

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                marginBottom: "20px",
                color: "#334155",
                fontSize: isMobile
                  ? "13px"
                  : "15px",
              }}
            >
              <FaCheckCircle
                color="#10B981"
                style={{
                  flexShrink: 0,
                }}
              />

              <span>
                Searching hospitals
                nearby
              </span>
            </div>

            {/* STEP 2 */}

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                marginBottom: "20px",
                color: "#334155",
                fontSize: isMobile
                  ? "13px"
                  : "15px",
              }}
            >
              {step >= 2 ? (
                <FaCheckCircle
                  color="#10B981"
                  style={{
                    flexShrink: 0,
                  }}
                />
              ) : (
                <FaHospital
                  color="#2563EB"
                  style={{
                    flexShrink: 0,
                  }}
                />
              )}

              <span>
                Checking doctor
                availability
              </span>
            </div>

            {/* STEP 3 */}

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                color: "#334155",
                fontSize: isMobile
                  ? "13px"
                  : "15px",
              }}
            >
              {step >= 3 ? (
                <FaCheckCircle
                  color="#10B981"
                  style={{
                    flexShrink: 0,
                  }}
                />
              ) : (
                <FaUserMd
                  color="#2563EB"
                  style={{
                    flexShrink: 0,
                  }}
                />
              )}

              <span>
                Ranking best options
              </span>
            </div>
          </div>

          {/* =====================================
              GUIDANCE BOX
          ===================================== */}

          <div
            style={{
              marginTop: isMobile
                ? "30px"
                : "40px",
              background: "#EFF6FF",
              border:
                "1px solid #BFDBFE",
              borderRadius: "16px",
              padding: isMobile
                ? "15px"
                : "20px",
              boxSizing: "border-box",
            }}
          >
            <p
              style={{
                margin: 0,
                color: "#1E40AF",
                textAlign: "center",
                lineHeight: "1.7",
                fontSize: isMobile
                  ? "13px"
                  : "15px",
              }}
            >
              We will show only the
              most relevant doctors to
              reduce your effort in
              choosing.
            </p>
          </div>

          {/* =====================================
              VIEW DOCTORS BUTTON
          ===================================== */}

          {showButton && (
            <div
              style={{
                textAlign: "center",
                marginTop: isMobile
                  ? "30px"
                  : "40px",
              }}
            >
              <button
                onClick={
                  handleViewDoctors
                }
                style={{
                  background:
                    "#2563EB",
                  color: "#FFFFFF",
                  border: "none",
                  padding: isMobile
                    ? "13px 18px"
                    : "16px 30px",
                  borderRadius: "14px",
                  fontSize: isMobile
                    ? "14px"
                    : "16px",
                  fontWeight: "600",
                  cursor: "pointer",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent:
                    "center",
                  gap: "8px",
                  maxWidth: "100%",
                  boxSizing: "border-box",
                }}
              >
                View Recommended
                Doctors

                <FaArrowRight />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

