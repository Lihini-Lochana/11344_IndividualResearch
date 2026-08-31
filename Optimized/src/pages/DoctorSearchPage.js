
import { useState, useContext, useEffect, useRef, } from "react";
import { useNavigate } from "react-router-dom";

import Header from "../components/Header";
import ProgressTracker from "../components/ProgressTracker";
import doctors from "../data/doctors";

import {
  FaSearch,
  FaUserMd,
  FaCheckCircle,
  FaArrowLeft,
} from "react-icons/fa";

import useIsMobile from "../hooks/useIsMobile";
import { TrackingContext } from "../context/TrackingContext";

export default function DoctorSearchPage() {
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  const {
  trackingData,
  startNewTest,
  trackPageVisit,
  trackClick,
  trackBackClick,
  trackInteraction,
  trackHesitation,
} = useContext(TrackingContext);

  const [search, setSearch] = useState("");

  const pageStartTime = useRef(Date.now());

const decisionTracked = useRef(false);
const searchTracked = useRef(false);
// --------------------------------------------------
// START FLOW 2 + PAGE VISIT
// --------------------------------------------------

useEffect(() => {

  // Start a NEW test only if there is no active flow
  if (!trackingData.flow) {
    console.log(
      "========== STARTING NEW TEST =========="
    );

    startNewTest("doctor_name");
  } else {
    console.log(
      "========== EXISTING TEST CONTINUES =========="
    );

    console.log(
      "Existing session:",
      trackingData.sessionId
    );

    console.log(
      "Existing back clicks:",
      trackingData.backClicks
    );

    console.log(
      "Existing total clicks:",
      trackingData.totalClicks
    );
  }

  trackPageVisit("DoctorSearchPage");

  trackInteraction(
    "page_opened",
    {
      page: "DoctorSearchPage",
    }
  );

}, [
  trackingData.flow,
  trackingData.sessionId,
  trackingData.backClicks,
  trackingData.totalClicks,
  startNewTest,
  trackPageVisit,
  trackInteraction,
]);

  const doctorSearchSteps = [
    "Doctor Search",
    "Hospital",
    "Appointment",
    "Date & Time Selection",
    "Confirmation",
  ];

  // -----------------------------------------
  // FILTER DOCTORS
  // -----------------------------------------

  const filteredDoctors = doctors.filter(
    (doctor) =>
      doctor.name
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      doctor.specialty
        .toLowerCase()
        .includes(search.toLowerCase())
  );


  useEffect(() => {

  if (
    search.trim() &&
    filteredDoctors.length === 0
  ) {

    trackInteraction(
      "no_doctors_found",
      {
        searchTerm: search,
      }
    );

  }

}, [
  filteredDoctors.length,
  search,
  trackInteraction,
]);

  // -----------------------------------------
  // SELECT DOCTOR AND GO TO NEXT PAGE
  // -----------------------------------------

  const handleDoctorSelect = (doctor) => {
    
    if (!doctor) {
    return;
  }

  // --------------------------------------------------
  // DECISION TIME
  // --------------------------------------------------

  const decisionTime =
    (Date.now() - pageStartTime.current) /
    1000;

  const decisionTimeRounded =
    Number(
      decisionTime.toFixed(2)
    );

  // --------------------------------------------------
  // HESITATION
  // --------------------------------------------------

  if (!decisionTracked.current) {

    if (decisionTime > 5) {

      trackHesitation(
        decisionTimeRounded
      );

    }

    decisionTracked.current = true;
  }

  // --------------------------------------------------
  // TRACK DOCTOR CLICK
  // --------------------------------------------------

  trackClick(
    `doctor_${doctor.id}`,
    "DoctorSearchPage"
  );

  // --------------------------------------------------
  // TRACK DOCTOR SELECTION
  // --------------------------------------------------

  trackInteraction(
    "doctor_selected",
    {
      doctorId: doctor.id,
      doctorName: doctor.name,
      specialty: doctor.specialty,
      decisionTimeSeconds:
        decisionTimeRounded,
    }
  );

  

    navigate("/doctor-hospitals", {
      state: {
        doctor: doctor,
      },
    });
  };

  // -----------------------------------------
  // BACK BUTTON
  // -----------------------------------------

  const handleBack = () => {
    trackBackClick(
    "DoctorSearchPage_back"
  );

  navigate(-1);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#F8FAFC",
        paddingBottom: isMobile
          ? "30px"
          : "50px",
      }}
    >
      {/* =====================================
          HEADER
      ===================================== */}

      <Header />

      {/* =====================================
          STEP NUMBER
      ===================================== */}

      <h4
        style={{
          textAlign: "center",
          color: "#6B7280",
          marginTop: "20px",
          marginBottom: "15px",
          fontSize: isMobile
            ? "13px"
            : "15px",
        }}
      >
        Step 1 of 5
      </h4>

      {/* =====================================
          PROGRESS TRACKER
      ===================================== */}

      <ProgressTracker
        currentStep={0}
        steps={doctorSearchSteps}
      />

      {/* =====================================
          PAGE CONTAINER
      ===================================== */}

      <div
        style={{
          maxWidth: "900px",
          margin: isMobile
            ? "30px auto"
            : "60px auto",
          padding: isMobile
            ? "0 15px"
            : "0 20px",
          boxSizing: "border-box",
        }}
      >
        {/* =====================================
            MAIN CARD
        ===================================== */}

        <div
          style={{
            background: "#FFFFFF",
            borderRadius: isMobile
              ? "18px"
              : "24px",
            padding: isMobile
              ? "25px 18px"
              : "50px",
            boxShadow:
              "0 10px 30px rgba(0,0,0,.06)",
            boxSizing: "border-box",
          }}
        >
          {/* =====================================
              TITLE
          ===================================== */}

          <div
            style={{
              textAlign: "center",
              marginBottom: isMobile
                ? "25px"
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
                margin:
                  "0 0 10px 0",
                fontWeight: "700",
              }}
            >
              Search Your Doctor
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
              Find your doctor to view
              available hospitals and
              appointments.
            </p>
          </div>

          {/* =====================================
              SEARCH BAR
          ===================================== */}

          <div
            style={{
              position: "relative",
              marginBottom: "10px",
            }}
          >
            <FaSearch
              size={isMobile ? 15 : 17}
              style={{
                position: "absolute",
                left: isMobile
                  ? "14px"
                  : "18px",
                top: "50%",
                transform:
                  "translateY(-50%)",
                color: "#94A3B8",
                pointerEvents: "none",
              }}
            />

            <input
              type="text"
              value={search}
              onChange={(e) => {
               const value = e.target.value;

              setSearch(value);

              if (
                value.trim() &&
                !searchTracked.current
              ) {

                trackInteraction(
                  "doctor_search_started",
                  {
                    page: "DoctorSearchPage",
                  }
                );

                searchTracked.current = true;
              }
            }}
              placeholder={
                isMobile
                  ? "Search doctor name..."
                  : "Type doctor name (e.g. Dr. Silva, Dr. Perera)"
              }
              style={{
                width: "100%",
                padding: isMobile
                  ? "13px 14px 13px 40px"
                  : "16px 18px 16px 50px",
                borderRadius: "14px",
                border:
                  "1px solid #CBD5E1",
                fontSize: isMobile
                  ? "13px"
                  : "16px",
                outline: "none",
                boxSizing: "border-box",
              }}
            />
          </div>

          {/* =====================================
              HELPER TEXT
          ===================================== */}

          <div
            style={{
              color: "#64748B",
              fontSize: isMobile
                ? "12px"
                : "14px",
              lineHeight: "1.5",
              marginBottom: isMobile
                ? "20px"
                : "25px",
            }}
          >
            You don't need to know the
            exact spelling. We will
            guide you.
          </div>

          {/* =====================================
              AVAILABLE DOCTORS
          ===================================== */}

          {search.length > 0 && (
            <div
              style={{
                border:
                  "1px solid #E2E8F0",
                borderRadius: "14px",
                overflow: "hidden",
              }}
            >
              {filteredDoctors.length > 0 ? (
                filteredDoctors.map(
                  (doctor, index) => (
                    <div
                      key={doctor.id}
                      onClick={() =>
                        handleDoctorSelect(
                          doctor
                        )
                      }
                      style={{
                        padding: isMobile
                          ? "14px"
                          : "16px",
                        cursor: "pointer",
                        borderBottom:
                          index !==
                          filteredDoctors.length -
                            1
                            ? "1px solid #F1F5F9"
                            : "none",
                        background:
                          "#FFFFFF",
                        display: "flex",
                        justifyContent:
                          "space-between",
                        alignItems:
                          "center",
                        gap: "10px",
                        transition:
                          "background 0.2s ease",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background =
                          "#EFF6FF";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background =
                          "#FFFFFF";
                      }}
                    >
                      {/* DOCTOR INFORMATION */}

                      <div
                        style={{
                          display: "flex",
                          gap: isMobile
                            ? "10px"
                            : "12px",
                          alignItems:
                            "center",
                          minWidth: 0,
                        }}
                      >
                        {/* DOCTOR ICON */}

                        <div
                          style={{
                            width: isMobile
                              ? "36px"
                              : "42px",
                            height: isMobile
                              ? "36px"
                              : "42px",
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
                          <FaUserMd
                            color="#2563EB"
                            size={
                              isMobile
                                ? 16
                                : 19
                            }
                          />
                        </div>

                        {/* DOCTOR DETAILS */}

                        <div
                          style={{
                            minWidth: 0,
                          }}
                        >
                          <div
                            style={{
                              fontWeight:
                                "600",
                              color:
                                "#0F172A",
                              fontSize:
                                isMobile
                                  ? "13px"
                                  : "15px",
                              wordBreak:
                                "break-word",
                            }}
                          >
                            {doctor.name}
                          </div>

                          <div
                            style={{
                              fontSize:
                                isMobile
                                  ? "11px"
                                  : "13px",
                              color:
                                "#64748B",
                              marginTop:
                                "3px",
                            }}
                          >
                            {
                              doctor.specialty
                            }
                          </div>
                        </div>
                      </div>

                      {/* CLICK INDICATOR */}

                      <FaCheckCircle
                        color="#CBD5E1"
                        size={
                          isMobile
                            ? 16
                            : 18
                        }
                        style={{
                          flexShrink: 0,
                        }}
                      />
                    </div>
                  )
                )
              ) : (
                /* NO RESULTS */

                <div
                  style={{
                    padding: isMobile
                      ? "20px 15px"
                      : "25px",
                    textAlign: "center",
                    color: "#64748B",
                    fontSize: isMobile
                      ? "13px"
                      : "14px",
                  }}
                >
                  No doctors found.
                  <br />
                  Try another doctor
                  name or specialty.
                </div>
              )}
            </div>
          )}

          {/* =====================================
              BACK BUTTON
          ===================================== */}

          <div
            style={{
              display: "flex",
              justifyContent:
                "flex-start",
              marginTop: isMobile
                ? "30px"
                : "40px",
            }}
          >
            <button
              onClick={handleBack}
              style={{
                display: "inline-flex",
                alignItems:
                  "center",
                justifyContent:
                  "center",
                gap: "7px",
                padding: isMobile
                  ? "10px 15px"
                  : "11px 18px",
                borderRadius: "10px",
                border:
                  "1px solid #CBD5E1",
                background: "#FFFFFF",
                color: "#334155",
                fontSize: isMobile
                  ? "13px"
                  : "14px",
                fontWeight: "600",
                cursor: "pointer",
              }}
            >
              <FaArrowLeft
                size={
                  isMobile ? 12 : 13
                }
              />

              Back
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

