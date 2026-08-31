import { useState, useContext, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import Header from "../components/Header";
import ProgressTracker from "../components/ProgressTracker";
import SummaryBar from "../components/SummaryBar";
import useIsMobile from "../hooks/useIsMobile";

import symptoms from "../data/symptoms";

import { TrackingContext } from "../context/TrackingContext";

import {
  FaMapMarkerAlt,
  FaCheckCircle,
  FaArrowLeft,
  FaUserMd,
  FaCalendarAlt,
  FaLock,
} from "react-icons/fa";

export default function ConfirmLocationPage() {
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

  // --------------------------------------------------
  // GUIDED STEPS
  // --------------------------------------------------

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
    location.state?.preference ||
    location.state?.doctorPreference ||
    "";

  const locationMethod =
    location.state?.locationMethod || "Near Me";

  const selectedSymptom = symptoms.find(
    (symptom) => symptom.id === symptomId
  );

  // --------------------------------------------------
  // DETECTED LOCATION
  // --------------------------------------------------

  const [detectedLocation] = useState(
    "Colombo, Sri Lanka"
  );

  // --------------------------------------------------
  // PAGE TRACKING
  // --------------------------------------------------

  useEffect(() => {
    trackPageVisit("ConfirmLocationPage");

    trackInteraction(
      "page_opened",
      {
        page: "ConfirmLocationPage",
        symptomId,
        symptomName:
          selectedSymptom?.name || null,
        doctorPreference,
        locationMethod,
      }
    );

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // --------------------------------------------------
  // LOCATION CONFIRMATION TRACKING
  // --------------------------------------------------

  const trackLocationConfirmation = () => {
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
    // Track click
    // ---------------------------------------------

    trackClick(
      "location_confirmation_detected_location",
      "ConfirmLocationPage"
    );

    // ---------------------------------------------
    // Track interaction
    // ---------------------------------------------

    trackInteraction(
      "location_confirmed",
      {
        method: "detected_location",
        location: detectedLocation,
        symptomId,
        symptomName:
          selectedSymptom?.name || null,
        doctorPreference,
        locationMethod,
        decisionTimeSeconds:
          decisionTimeRounded,
      }
    );
  };

  // --------------------------------------------------
  // GO TO FINDING DOCTORS
  // --------------------------------------------------

  const handleDetectedLocation = () => {
    trackLocationConfirmation();

    navigate("/detected-location-doctors", {
      state: {
        symptomId,
        doctorPreference,
        locationMethod,
        location: detectedLocation,
      },
    });
  };

  // --------------------------------------------------
  // CHANGE SYMPTOM
  // --------------------------------------------------

  const handleSymptomChange = () => {
    trackClick(
      "change_symptom",
      "ConfirmLocationPage"
    );

    trackInteraction(
      "symptom_change_requested",
      {
        from: "ConfirmLocationPage",
        symptomId,
        symptomName:
          selectedSymptom?.name || null,
      }
    );

    navigate("/symptoms", {
      state: {
        symptomId,
        doctorPreference,
        locationMethod,
      },
    });
  };

  // --------------------------------------------------
  // CHANGE DOCTOR PREFERENCE
  // --------------------------------------------------

  const handleDoctorPreferenceChange = () => {
    trackClick(
      "change_doctor_preference",
      "ConfirmLocationPage"
    );

    trackInteraction(
      "doctor_preference_change_requested",
      {
        from: "ConfirmLocationPage",
        symptomId,
        symptomName:
          selectedSymptom?.name || null,
        currentPreference:
          doctorPreference,
      }
    );

    navigate("/dr-preference", {
      state: {
        symptomId,
        doctorPreference,
        locationMethod,
      },
    });
  };

  // --------------------------------------------------
  // CHANGE LOCATION METHOD
  // --------------------------------------------------

  const handleLocationMethodChange = () => {
    trackClick(
      "change_location_method",
      "ConfirmLocationPage"
    );

    trackInteraction(
      "location_method_change_requested",
      {
        from: "ConfirmLocationPage",
        symptomId,
        symptomName:
          selectedSymptom?.name || null,
        currentLocationMethod:
          locationMethod,
      }
    );

    navigate("/location", {
      state: {
        symptomId,
        doctorPreference,
        locationMethod,
      },
    });
  };

  // --------------------------------------------------
  // BACK BUTTON
  // --------------------------------------------------

  const handleBack = () => {
    trackBackClick(
      "ConfirmLocationPage_back"
    );

    trackInteraction(
      "back_navigation",
      {
        from: "ConfirmLocationPage",
      }
    );

    navigate(-1);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#F8FAFC",
      }}
    >
      {/* =================================================
          HEADER
      ================================================= */}

      <Header />

      {/* =================================================
          PAGE CONTAINER
      ================================================= */}

      <div
        style={{
          width: "100%",
          maxWidth: "1250px",
          margin: "0 0 15px 0",
          padding: isMobile
            ? "20px 15px 40px"
            : "30px 30px 50px",
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

        
        {/* =================================================
            PROGRESS TRACKER
        ================================================= */}

        <ProgressTracker
          steps={guidedSteps}
          currentStep={2}
        />

        {/* =================================================
            SUMMARY BAR
        ================================================= */}

        <SummaryBar
          selectedSymptom={selectedSymptom}
          doctorPreference={doctorPreference}
          locationMethod={locationMethod}
          onChangeSymptom={
            handleSymptomChange
          }
          onChangeDoctorPreference={
            handleDoctorPreferenceChange
          }
          onChangeLocationMethod={
            handleLocationMethodChange
          }
        />

        {/* =================================================
            MAIN LAYOUT
        ================================================= */}

        <div
          style={{
            display: "flex",
            gap: isMobile
              ? "25px"
              : "35px",
            alignItems: "flex-start",
            marginTop: "25px",
            flexDirection: isMobile
              ? "column"
              : "row",
          }}
        >
          {/* =================================================
              LEFT CONTENT
          ================================================= */}

          <div
            style={{
              flex: 1,
              width: "100%",
              minWidth: 0,
            }}
          >
            {/* =================================================
                TITLE
            ================================================= */}

            <div
              style={{
                textAlign: "center",
                marginBottom: isMobile
                  ? "25px"
                  : "30px",
              }}
            >
              <h1
                style={{
                  fontSize: isMobile
                    ? "28px"
                    : "42px",
                  lineHeight: "1.3",
                  color: "#0F172A",
                  margin:
                    "0 0 10px 0",
                  fontWeight: "700",
                }}
              >
                Confirm your location
              </h1>

              <p
                style={{
                  color: "#64748B",
                  fontSize: isMobile
                    ? "14px"
                    : "17px",
                  lineHeight: "1.6",
                  margin: 0,
                }}
              >
                We use your location to
                find the nearest available
                doctors.
              </p>

              <div
                style={{
                  marginTop: "12px",
                  color: "#94A3B8",
                  fontSize: isMobile
                    ? "11px"
                    : "14px",
                  display: "flex",
                  justifyContent:
                    "center",
                  alignItems:
                    "flex-start",
                  gap: "7px",
                  lineHeight: "1.5",
                }}
              >
                <FaLock
                  style={{
                    marginTop: "2px",
                    flexShrink: 0,
                  }}
                />

                <span>
                  Your location is only
                  used for booking
                  purposes
                </span>
              </div>
            </div>

            {/* =================================================
                DETECTED LOCATION CARD
            ================================================= */}

            <button
              onClick={
                handleDetectedLocation
              }
              style={{
                width: "100%",
                textAlign: "left",
                background: "#ECFDF5",
                border:
                  "2px solid #2563EB",
                borderRadius: "20px",
                padding: isMobile
                  ? "16px"
                  : "22px",
                boxShadow:
                  "0 10px 25px rgba(37,99,235,.10)",
                boxSizing: "border-box",
                cursor: "pointer",
              }}
            >
              {/* TOP SECTION */}

              <div
                style={{
                  display: "flex",
                  justifyContent:
                    "space-between",
                  alignItems:
                    "center",
                  gap: "10px",
                }}
              >
                {/* LEFT */}

                <div
                  style={{
                    display: "flex",
                    gap: isMobile
                      ? "10px"
                      : "15px",
                    alignItems:
                      "center",
                    minWidth: 0,
                  }}
                >
                  {/* LOCATION ICON */}

                  <div
                    style={{
                      width: isMobile
                        ? "42px"
                        : "48px",
                      height: isMobile
                        ? "42px"
                        : "48px",
                      borderRadius:
                        "12px",
                      background:
                        "#DBEAFE",
                      display: "flex",
                      justifyContent:
                        "center",
                      alignItems:
                        "center",
                      flexShrink: 0,
                    }}
                  >
                    <FaMapMarkerAlt
                      color="#2563EB"
                      size={
                        isMobile
                          ? 18
                          : 21
                      }
                    />
                  </div>

                  {/* TEXT */}

                  <div>
                    <h3
                      style={{
                        margin: 0,
                        fontSize:
                          isMobile
                            ? "16px"
                            : "19px",
                        color:
                          "#0F172A",
                        fontWeight:
                          "700",
                      }}
                    >
                      Use my current
                      location
                    </h3>

                    <p
                      style={{
                        margin:
                          "5px 0 0 0",
                        color:
                          "#64748B",
                        fontSize:
                          isMobile
                            ? "11px"
                            : "13px",
                      }}
                    >
                      Recommended
                      (faster and easier)
                    </p>
                  </div>
                </div>

                {/* CHECK */}

                <FaCheckCircle
                  size={
                    isMobile
                      ? 20
                      : 23
                  }
                  color="#2563EB"
                  style={{
                    flexShrink: 0,
                  }}
                />
              </div>

              {/* =================================================
                  DETECTED LOCATION
              ================================================= */}

              <div
                style={{
                  background:
                    "#FFFFFF",
                  border:
                    "1px solid #A7F3D0",
                  borderRadius: "12px",
                  marginTop: "18px",
                  padding: isMobile
                    ? "11px"
                    : "14px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems:
                      "flex-start",
                    gap: "7px",
                    color: "#047857",
                    fontWeight: "600",
                    fontSize:
                      isMobile
                        ? "12px"
                        : "14px",
                  }}
                >
                  <FaCheckCircle
                    size={
                      isMobile
                        ? 14
                        : 16
                    }
                    color="#10B981"
                    style={{
                      marginTop: "2px",
                      flexShrink: 0,
                    }}
                  />

                  <span>
                    {detectedLocation}{" "}
                    (Detected)
                  </span>
                </div>

                <div
                  style={{
                    color: "#10B981",
                    fontWeight: "500",
                    fontSize:
                      isMobile
                        ? "10px"
                        : "11px",
                    marginTop: "5px",
                    marginLeft:
                      isMobile
                        ? "21px"
                        : "24px",
                  }}
                >
                  Location successfully
                  detected
                </div>
              </div>
            </button>

            {/* =================================================
                INFORMATION CARD
            ================================================= */}

            <div
              style={{
                marginTop: "20px",
                background: "#FFFFFF",
                borderRadius: "20px",
                padding: isMobile
                  ? "18px"
                  : "22px",
                boxShadow:
                  "0 5px 15px rgba(0,0,0,.05)",
                boxSizing:
                  "border-box",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems:
                    "flex-start",
                  gap: "12px",
                }}
              >
                <div
                  style={{
                    width: "40px",
                    height: "40px",
                    borderRadius:
                      "10px",
                    background:
                      "#EFF6FF",
                    display: "flex",
                    alignItems:
                      "center",
                    justifyContent:
                      "center",
                    flexShrink: 0,
                  }}
                >
                  <FaMapMarkerAlt
                    color="#2563EB"
                  />
                </div>

                <div>
                  <h3
                    style={{
                      margin:
                        "0 0 5px 0",
                      fontSize:
                        isMobile
                          ? "15px"
                          : "17px",
                      color:
                        "#0F172A",
                    }}
                  >
                    Finding nearby doctors
                  </h3>

                  <p
                    style={{
                      margin: 0,
                      color:
                        "#64748B",
                      fontSize:
                        isMobile
                          ? "12px"
                          : "14px",
                      lineHeight:
                        "1.6",
                    }}
                  >
                    We will show doctors
                    available near your
                    detected location,
                    based on your health
                    problem and doctor
                    preference.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* =================================================
              RIGHT PANEL
          ================================================= */}

          <div
            style={{
              width: isMobile
                ? "100%"
                : "350px",
              flexShrink: 0,
            }}
          >
            <div
              style={{
                background: "#FFFFFF",
                borderRadius: "20px",
                padding: isMobile
                  ? "20px"
                  : "25px",
                boxShadow:
                  "0 5px 15px rgba(0,0,0,.05)",
                boxSizing:
                  "border-box",
              }}
            >
              <h3
                style={{
                  margin:
                    "0 0 20px 0",
                  color: "#0F172A",
                  fontSize:
                    isMobile
                      ? "18px"
                      : "20px",
                }}
              >
                Your booking journey
              </h3>

              {/* STEP 1 */}

              <div
                style={{
                  display: "flex",
                  alignItems:
                    "center",
                  gap: "12px",
                }}
              >
                <div
                  style={{
                    width: "42px",
                    height: "42px",
                    borderRadius:
                      "12px",
                    background:
                      "#DBEAFE",
                    display: "flex",
                    justifyContent:
                      "center",
                    alignItems:
                      "center",
                    flexShrink: 0,
                  }}
                >
                  <FaMapMarkerAlt
                    color="#2563EB"
                  />
                </div>

                <div>
                  <div
                    style={{
                      fontWeight:
                        "600",
                      color:
                        "#0F172A",
                      fontSize:
                        "14px",
                    }}
                  >
                    Select location
                  </div>

                  <div
                    style={{
                      fontSize:
                        "12px",
                      color:
                        "#64748B",
                      marginTop:
                        "3px",
                    }}
                  >
                    Confirm where you
                    want to visit
                  </div>
                </div>
              </div>

              {/* CONNECTOR */}

              <div
                style={{
                  width: "2px",
                  height: "25px",
                  background:
                    "#DBEAFE",
                  marginLeft: "20px",
                }}
              />

              {/* STEP 2 */}

              <div
                style={{
                  display: "flex",
                  alignItems:
                    "center",
                  gap: "12px",
                }}
              >
                <div
                  style={{
                    width: "42px",
                    height: "42px",
                    borderRadius:
                      "12px",
                    background:
                      "#EFF6FF",
                    display: "flex",
                    justifyContent:
                      "center",
                    alignItems:
                      "center",
                    flexShrink: 0,
                  }}
                >
                  <FaUserMd
                    color="#2563EB"
                  />
                </div>

                <div>
                  <div
                    style={{
                      fontWeight:
                        "600",
                      color:
                        "#0F172A",
                      fontSize:
                        "14px",
                    }}
                  >
                    Find doctors
                  </div>

                  <div
                    style={{
                      fontSize:
                        "12px",
                      color:
                        "#64748B",
                      marginTop:
                        "3px",
                    }}
                  >
                    View nearby available
                    specialists
                  </div>
                </div>
              </div>

              {/* CONNECTOR */}

              <div
                style={{
                  width: "2px",
                  height: "25px",
                  background:
                    "#DBEAFE",
                  marginLeft: "20px",
                }}
              />

              {/* STEP 3 */}

              <div
                style={{
                  display: "flex",
                  alignItems:
                    "center",
                  gap: "12px",
                }}
              >
                <div
                  style={{
                    width: "42px",
                    height: "42px",
                    borderRadius:
                      "12px",
                    background:
                      "#EFF6FF",
                    display: "flex",
                    justifyContent:
                      "center",
                    alignItems:
                      "center",
                    flexShrink: 0,
                  }}
                >
                  <FaCalendarAlt
                    color="#2563EB"
                  />
                </div>

                <div>
                  <div
                    style={{
                      fontWeight:
                        "600",
                      color:
                        "#0F172A",
                      fontSize:
                        "14px",
                    }}
                  >
                    Book appointment
                  </div>

                  <div
                    style={{
                      fontSize:
                        "12px",
                      color:
                        "#64748B",
                      marginTop:
                        "3px",
                    }}
                  >
                    Choose a suitable
                    time slot
                  </div>
                </div>
              </div>

              {/* DIVIDER */}

              <div
                style={{
                  height: "1px",
                  background:
                    "#E2E8F0",
                  margin:
                    "25px 0 20px 0",
                }}
              />

              {/* BOOKING SUMMARY */}

              <h4
                style={{
                  margin:
                    "0 0 15px 0",
                  color: "#64748B",
                  fontSize: "13px",
                  fontWeight: "600",
                }}
              >
                BOOKING SUMMARY
              </h4>

              {/* HEALTH PROBLEM */}

              <div
                style={{
                  display: "flex",
                  justifyContent:
                    "space-between",
                  gap: "10px",
                  marginBottom:
                    "12px",
                }}
              >
                <span
                  style={{
                    color: "#64748B",
                    fontSize: "12px",
                  }}
                >
                  Health Problem
                </span>

                <span
                  style={{
                    fontWeight: "600",
                    color: "#0F172A",
                    fontSize: "12px",
                    textAlign: "right",
                  }}
                >
                  {selectedSymptom?.title ||
                    selectedSymptom?.name ||
                    "Not selected"}
                </span>
              </div>

              {/* DOCTOR PREFERENCE */}

              <div
                style={{
                  display: "flex",
                  justifyContent:
                    "space-between",
                  gap: "10px",
                  marginBottom:
                    "12px",
                }}
              >
                <span
                  style={{
                    color: "#64748B",
                    fontSize: "12px",
                  }}
                >
                  Doctor Preference
                </span>

                <span
                  style={{
                    fontWeight: "600",
                    color: "#0F172A",
                    fontSize: "12px",
                    textAlign: "right",
                  }}
                >
                  {doctorPreference ||
                    "No Preference"}
                </span>
              </div>

              {/* LOCATION */}

              <div
                style={{
                  display: "flex",
                  justifyContent:
                    "space-between",
                  gap: "10px",
                }}
              >
                <span
                  style={{
                    color: "#64748B",
                    fontSize: "12px",
                  }}
                >
                  Location
                </span>

                <span
                  style={{
                    fontWeight: "600",
                    color: "#2563EB",
                    fontSize: "12px",
                    textAlign: "right",
                  }}
                >
                  {detectedLocation}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* =================================================
            BACK BUTTON
        ================================================= */}

        <button
          onClick={handleBack}
          style={{
            marginTop: "25px",
            padding: isMobile
              ? "9px 14px"
              : "10px 18px",
            borderRadius: "10px",
            border:
              "1px solid #CBD5E1",
            background: "#FFFFFF",
            color: "#334155",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "7px",
            fontSize: isMobile
              ? "13px"
              : "14px",
            fontWeight: "600",
          }}
        >
          <FaArrowLeft />
          Back
        </button>
      </div>
    </div>
  );
}