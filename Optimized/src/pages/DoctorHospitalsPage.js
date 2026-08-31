import { useLocation, useNavigate } from "react-router-dom";
import { useContext, useEffect, useRef } from "react";
import Header from "../components/Header";
import ProgressTracker from "../components/ProgressTracker";
import hospitals from "../data/hospitals";
import availability from "../data/doctorHospitalAvailability";

import {
  FaUserMd,
  FaHospital,
  FaMapMarkerAlt,
  FaCheckCircle,
  FaStar,
  FaStethoscope,
  FaAward,
  FaArrowLeft,
} from "react-icons/fa";

import useIsMobile from "../hooks/useIsMobile";
import { TrackingContext } from "../context/TrackingContext";


export default function DoctorHospitalsPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useIsMobile();

  const {
  trackPageVisit,
  trackClick,
  trackBackClick,
  trackInteraction,
  trackHesitation,
} = useContext(TrackingContext);

const pageStartTime = useRef(Date.now());

  const doctorSearchSteps = [
    "Doctor Search",
    "Hospital",
    "Appointment",
    "Date & Time Selection",
    "Confirmation",
  ];

  // --------------------------------------------------
  // SELECTED DOCTOR
  // --------------------------------------------------

  const doctor = location.state?.doctor;

  useEffect(() => {

  pageStartTime.current = Date.now();

  trackPageVisit("DoctorHospitalsPage");

  trackInteraction(
    "page_opened",
    {
      page: "DoctorHospitalsPage",
      doctorId: doctor?.id,
      doctorName: doctor?.name,
    }
  );

}, [
  trackPageVisit,
  trackInteraction,
  doctor?.id,
  doctor?.name,
]);

  // --------------------------------------------------
  // SAFETY CHECK
  // --------------------------------------------------

  if (!doctor) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "#F8FAFC",
        }}
      >
        <Header />

        <div
          style={{
            padding: isMobile ? "30px 20px" : "50px",
            textAlign: "center",
            color: "#64748B",
          }}
        >
          No doctor selected.
        </div>
      </div>
    );
  }

  // --------------------------------------------------
  // GET HOSPITALS FOR SELECTED DOCTOR
  // --------------------------------------------------

  const doctorHospitals = availability
    .filter((a) => a.doctorId === doctor.id)
    .map((a) => {
      const hospital = hospitals.find(
        (h) => h.id === a.hospitalId
      );

      if (!hospital) return null;

      return {
        ...hospital,
        nextSlot: a.nextSlot,
        fee: a.fee,

        // Recommended if earliest slot is today
        recommended: a.nextSlot.includes("Today"),
      };
    })
    .filter(Boolean);

  // --------------------------------------------------
  // SELECT HOSPITAL
  // Immediately move to appointment page
  // --------------------------------------------------

  const handleSelectHospital = (hospital) => {

     if (!hospital) {
    return;
  }

  // -----------------------------------------------
  // HESITATION TRACKING
  // -----------------------------------------------

  const hesitationSeconds =
    Math.floor(
      (Date.now() - pageStartTime.current) / 1000
    );

  if (hesitationSeconds > 5) {

    trackHesitation(
      hesitationSeconds
    );

    trackInteraction(
      "hospital_selection_hesitation",
      {
        seconds: hesitationSeconds,
        doctorId: doctor.id,
        doctorName: doctor.name,
        selectedHospitalId: hospital.id,
        selectedHospitalName: hospital.name,
      }
    );
  }

  // Track hospital click
   trackClick(
    `hospital_${hospital.id}`,
    "DoctorHospitalsPage"
  );

  // -----------------------------------------------
  // HOSPITAL SELECTION
  // -----------------------------------------------

  trackInteraction(
    "hospital_selected",
    {
      doctorId: doctor.id,
      doctorName: doctor.name,
      hospitalId: hospital.id,
      hospitalName: hospital.name,
      nextSlot: hospital.nextSlot,
      fee: hospital.fee,
    }
  );

    navigate("/appointment-date-time", {
      state: {
        doctor,
        hospital,
      },
    });
  };

  // --------------------------------------------------
  // BACK BUTTON
  // --------------------------------------------------

  const handleBack = () => {

    trackBackClick(
    "DoctorHospitalsPage_back"
  );

  trackInteraction(
    "returned_to_doctor_search",
    {
      doctorId: doctor?.id,
      doctorName: doctor?.name,
    }
  );

    navigate("/doctor-search", {
      state: {
        doctor,
      },
    });
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#F8FAFC",
        paddingBottom: isMobile ? "90px" : "100px",
        boxSizing: "border-box",
      }}
    >
      {/* HEADER */}

      <Header />

      {/* STEP NUMBER */}

      <h4
        style={{
          textAlign: "center",
          color: "#6B7280",
          marginTop: "20px",
          marginBottom: "15px",
          fontSize: isMobile ? "13px" : "15px",
        }}
      >
        Step 2 of 5
      </h4>

      {/* PROGRESS TRACKER */}

      <ProgressTracker
        currentStep={1}
        steps={doctorSearchSteps}
      />

      {/* PAGE CONTAINER */}

      <div
        style={{
          maxWidth: "1100px",
          margin: "0 auto",
          padding: isMobile ? "0 15px" : "0 20px",
          boxSizing: "border-box",
        }}
      >
        {/* PAGE TITLE */}

        <div
          style={{
            textAlign: "center",
            marginTop: isMobile ? "30px" : "45px",
            marginBottom: isMobile ? "25px" : "35px",
          }}
        >
          <h1
            style={{
              fontSize: isMobile ? "28px" : "42px",
              lineHeight: "1.3",
              color: "#0F172A",
              margin: "0 0 10px 0",
              fontWeight: "700",
            }}
          >
            Where would you like to visit?
          </h1>

          <p
            style={{
              color: "#64748B",
              fontSize: isMobile ? "14px" : "18px",
              lineHeight: "1.6",
              margin: 0,
            }}
          >
            Showing hospitals where this doctor
            is available.
          </p>
        </div>

        {/* DOCTOR CARD */}

        <div
          style={{
            background: "#FFFFFF",
            borderRadius: "20px",
            padding: isMobile ? "18px" : "24px",
            marginBottom: isMobile ? "25px" : "30px",
            boxShadow:
              "0 8px 25px rgba(0,0,0,.05)",
            boxSizing: "border-box",
          }}
        >
          <div
            style={{
              display: "flex",
              gap: isMobile ? "12px" : "18px",
              alignItems: "center",
            }}
          >
            {/* DOCTOR ICON */}

            <div
              style={{
                width: isMobile ? "55px" : "70px",
                height: isMobile ? "55px" : "70px",
                minWidth: isMobile ? "55px" : "70px",
                borderRadius: "16px",
                background: "#EFF6FF",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <FaUserMd
                size={isMobile ? 24 : 30}
                color="#2563EB"
              />
            </div>

            {/* DOCTOR DETAILS */}

            <div
              style={{
                minWidth: 0,
              }}
            >
              <h2
                style={{
                  margin: 0,
                  color: "#0F172A",
                  fontSize: isMobile ? "19px" : "26px",
                }}
              >
                {doctor.name}
              </h2>

              <div
                style={{
                  display: "flex",
                  gap: "8px",
                  marginTop: "9px",
                  flexWrap: "wrap",
                }}
              >
                {/* SPECIALTY */}

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    background: "#EFF6FF",
                    color: "#2563EB",
                    padding: "5px 10px",
                    borderRadius: "999px",
                    fontSize: isMobile ? "11px" : "13px",
                    fontWeight: "600",
                  }}
                >
                  <FaStethoscope />

                  {doctor.specialty}
                </div>

                {/* EXPERIENCE */}

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    background: "#F8FAFC",
                    color: "#475569",
                    padding: "5px 10px",
                    borderRadius: "999px",
                    fontSize: isMobile ? "11px" : "13px",
                    fontWeight: "600",
                  }}
                >
                  <FaAward />

                  {doctor.experience}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* HOSPITAL LIST */}

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: isMobile ? "16px" : "20px",
          }}
        >
          {doctorHospitals.map((hospital) => (
            <div
              key={hospital.id}
              style={{
                background: "#FFFFFF",
                borderRadius: "20px",
                padding: isMobile ? "18px" : "24px",
                boxShadow:
                  "0 8px 25px rgba(0,0,0,.05)",
                border: "1px solid #E2E8F0",
                boxSizing: "border-box",
              }}
            >
              {/* RECOMMENDED BADGE */}

              {hospital.recommended && (
                <div
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                    background: "#FEF3C7",
                    color: "#92400E",
                    padding: "6px 12px",
                    borderRadius: "999px",
                    fontSize: isMobile ? "11px" : "13px",
                    fontWeight: "600",
                    marginBottom: "16px",
                  }}
                >
                  <FaStar />

                  Recommended Option
                </div>
              )}

              {/* HOSPITAL CONTENT */}

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: isMobile
                    ? "stretch"
                    : "center",
                  gap: isMobile ? "20px" : "25px",
                  flexDirection: isMobile
                    ? "column"
                    : "row",
                }}
              >
                {/* LEFT SIDE */}

                <div
                  style={{
                    flex: 1,
                    minWidth: 0,
                  }}
                >
                  {/* HOSPITAL NAME */}

                  <h3
                    style={{
                      margin: 0,
                      color: "#0F172A",
                      display: "flex",
                      alignItems: "center",
                      gap: "9px",
                      fontSize: isMobile
                        ? "18px"
                        : "20px",
                      lineHeight: "1.4",
                    }}
                  >
                    <FaHospital
                      color="#2563EB"
                      style={{
                        flexShrink: 0,
                      }}
                    />

                    <span>{hospital.name}</span>
                  </h3>

                  {/* DISTANCE */}

                  <div
                    style={{
                      marginTop: "5px",
                      color: "#64748B",
                      fontSize: isMobile
                        ? "12px"
                        : "13px",
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                    }}
                  >
                    <FaMapMarkerAlt />

                    {hospital.distance} km away
                  </div>

                  {/* INFO CARDS */}

                  <div
                    style={{
                      display: "flex",
                      gap: isMobile ? "10px" : "15px",
                      marginTop: "18px",
                      flexDirection: isMobile
                        ? "column"
                        : "row",
                    }}
                  >
                    {/* EARLIEST SLOT */}

                    <div
                      style={{
                        flex: 1,
                        border:
                          "1px solid #E2E8F0",
                        borderRadius: "14px",
                        padding: isMobile
                          ? "12px"
                          : "14px",
                        boxSizing: "border-box",
                      }}
                    >
                      <div
                        style={{
                          color: "#64748B",
                          fontSize: isMobile
                            ? "10px"
                            : "12px",
                          marginBottom: "7px",
                        }}
                      >
                        EARLIEST SLOT
                      </div>

                      <div
                        style={{
                          fontWeight: "700",
                          fontSize: isMobile
                            ? "14px"
                            : "16px",
                          color: "#0F172A",
                        }}
                      >
                        {hospital.nextSlot}
                      </div>
                    </div>

                    {/* CONSULTATION FEE */}

                    <div
                      style={{
                        flex: 1,
                        border:
                          "1px solid #E2E8F0",
                        borderRadius: "14px",
                        padding: isMobile
                          ? "12px"
                          : "14px",
                        boxSizing: "border-box",
                      }}
                    >
                      <div
                        style={{
                          color: "#64748B",
                          fontSize: isMobile
                            ? "10px"
                            : "12px",
                          marginBottom: "7px",
                        }}
                      >
                        CONSULTATION FEE
                      </div>

                      <div
                        style={{
                          fontWeight: "700",
                          fontSize: isMobile
                            ? "14px"
                            : "16px",
                          color: "#0F172A",
                        }}
                      >
                        {hospital.fee}
                      </div>
                    </div>
                  </div>
                </div>

                {/* SELECT BUTTON */}

                <button
                  onClick={() =>
                    handleSelectHospital(
                      hospital
                    )
                  }
                  style={{
                    background: "#FFFFFF",
                    color: "#2563EB",
                    border:
                      "1px solid #2563EB",
                    padding: isMobile
                      ? "13px 20px"
                      : "14px 24px",
                    borderRadius: "12px",
                    fontWeight: "600",
                    cursor: "pointer",
                    minWidth: isMobile
                      ? "100%"
                      : "120px",
                    fontSize: isMobile
                      ? "14px"
                      : "15px",
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "7px",
                    flexShrink: 0,
                  }}
                >
                  Select
                  <FaCheckCircle />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* COGNITIVE SUPPORT */}

        <div
          style={{
            marginTop: isMobile ? "20px" : "30px",
            background: "#EFF6FF",
            border: "1px solid #BFDBFE",
            borderRadius: "16px",
            padding: isMobile
              ? "14px"
              : "18px",
            color: "#1E40AF",
            textAlign: "center",
            fontSize: isMobile ? "12px" : "14px",
            lineHeight: "1.6",
          }}
        >
          You are shown only hospitals
          where this doctor is available.
        </div>
      </div>

      {/* BACK BUTTON */}

      <div
        style={{
          position: "fixed",
          bottom: isMobile ? "15px" : "20px",
          left: isMobile ? "15px" : "25px",
          zIndex: 1000,
        }}
      >
        <button
          onClick={handleBack}
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "7px",
            background: "#FFFFFF",
            color: "#475569",
            border: "1px solid #CBD5E1",
            padding: isMobile
              ? "10px 16px"
              : "12px 20px",
            borderRadius: "12px",
            fontSize: isMobile ? "13px" : "14px",
            fontWeight: "600",
            cursor: "pointer",
            boxShadow:
              "0 4px 15px rgba(0,0,0,.08)",
          }}
        >
          <FaArrowLeft />

          Back
        </button>
      </div>
    </div>
  );
}