
import { useState, useContext, useEffect, useRef, } from "react";
import {
  useLocation,
  useNavigate,
} from "react-router-dom";

import Header from "../components/Header";
import ProgressTracker from "../components/ProgressTracker";
import availability from "../data/doctorHospitalAvailability";

import {
  FaUserMd,
  FaHospital,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaSun,
  FaCloudSun,
  FaMoon,
  FaArrowRight,
  FaArrowLeft,
  FaInfoCircle,
} from "react-icons/fa";

import useIsMobile from "../hooks/useIsMobile";
import { TrackingContext } from "../context/TrackingContext";

export default function AppointmentDateTimePage() {
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

  // --------------------------------------------------
  // STATE
  // --------------------------------------------------

  const [selectedDate, setSelectedDate] =
    useState("");

  const [selectedCategory, setSelectedCategory] =
    useState("");

  const [selectedTime, setSelectedTime] =
    useState("");

  const pageStartTime = useRef(Date.now());
  const hesitationTracked = useRef(false);


  // --------------------------------------------------
  // DATA FROM PREVIOUS PAGE
  // --------------------------------------------------

  const doctor = location.state?.doctor;
  const hospital = location.state?.hospital;

  useEffect(() => {
  trackPageVisit("AppointmentDateTimePage");

  trackInteraction(
    "page_opened",
    {
      page: "AppointmentDateTimePage",
      doctorId: doctor?.id,
      doctorName: doctor?.name,
      hospitalId: hospital?.id,
      hospitalName: hospital?.name,
    }
  );
}, [
  trackPageVisit,
  trackInteraction,
  doctor?.id,
  doctor?.name,
  hospital?.id,
  hospital?.name,
]);

  // --------------------------------------------------
  // FIND DOCTOR AVAILABILITY
  // --------------------------------------------------

  const doctorAvailability = availability.find(
    (a) =>
      a.doctorId === doctor?.id &&
      a.hospitalId === hospital?.id
  );

  const trackPageHesitation = () => {
  if (hesitationTracked.current) {
    return;
  }

  const hesitationTime =
    (Date.now() - pageStartTime.current) / 1000;

  // Count as hesitation if user takes more than 5 seconds
  if (hesitationTime > 5) {
    trackHesitation(
      Number(hesitationTime.toFixed(2)),
      "AppointmentDateTimePage"
    );
  }

  hesitationTracked.current = true;
};


  // --------------------------------------------------
  // SAFETY CHECK
  // --------------------------------------------------

  if (!doctorAvailability) {
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
            padding: isMobile
              ? "30px 20px"
              : "50px",
            textAlign: "center",
            color: "#64748B",
          }}
        >
          No availability found for this doctor
          at this hospital.
        </div>
      </div>
    );
  }

  // --------------------------------------------------
  // USER LOCATION
  // --------------------------------------------------

  const userLocation =
    location.state?.location ||
    "Colombo";

  // --------------------------------------------------
  // AVAILABLE DATES
  // --------------------------------------------------

  const availableDates =
    doctorAvailability.availableDates || [];

  const formatDisplayDate = (dateString) => {
    const date = new Date(dateString);

    return date.toLocaleDateString(
      "en-GB",
      {
        weekday: "short",
        day: "numeric",
        month: "short",
      }
    );
  };

  const dateOptions = availableDates.map(
  (item) => ({
    value: item.date,
    label: formatDisplayDate(item.date),
  })
);

  // --------------------------------------------------
  // TIME SLOTS
  // --------------------------------------------------
// --------------------------------------------------
// SELECTED DATE AVAILABILITY
// --------------------------------------------------

const selectedDateAvailability =
  doctorAvailability?.availableDates?.find(
    (item) => item.date === selectedDate
  );

const morningSlots =
  selectedDateAvailability?.slots?.Morning || [];

const afternoonSlots =
  selectedDateAvailability?.slots?.Afternoon || [];

const eveningSlots =
  selectedDateAvailability?.slots?.Evening || [];

  let slots = [];

  if (selectedCategory === "Morning") {
    slots = morningSlots;
  }

  if (selectedCategory === "Afternoon") {
    slots = afternoonSlots;
  }

  if (selectedCategory === "Evening") {
    slots = eveningSlots;
  }

  // --------------------------------------------------
  // CONTINUE
  // --------------------------------------------------

  const handleContinue = () => {
    
    if (!selectedDate || !selectedTime) {
    return;
  }

  const decisionTime =
    (Date.now() -
      pageStartTime.current) /
    1000;

  trackClick(
    "appointment_continue",
    "AppointmentDateTimePage"
  );

  trackInteraction(
    "appointment_selection_completed",
    {
      doctorId: doctor?.id,
      doctorName: doctor?.name,
      hospitalId: hospital?.id,
      hospitalName: hospital?.name,
      selectedDate,
      selectedTime,
      decisionTimeSeconds:
        Number(
          decisionTime.toFixed(2)
        ),
    }
  );

    navigate("/booking-confirmation", {
      state: {
        doctor,
        hospital,
        date: selectedDate,
        time: selectedTime,
      },
    });
  };

  // --------------------------------------------------
  // BACK
  // --------------------------------------------------

  const handleBack = () => {

    trackBackClick(
    "AppointmentDateTimePage_back"
  );

  trackInteraction(
    "returned_to_hospital_selection",
    {
      doctorId: doctor?.id,
      doctorName: doctor?.name,
      hospitalId: hospital?.id,
      hospitalName: hospital?.name,
      selectedDate,
      selectedTime,
    }
  );

    navigate("/doctor-hospitals", {
      state: {
        doctor,
      },
    });
  };

  // --------------------------------------------------
  // RETURN
  // --------------------------------------------------

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#F8FAFC",

        // Space for fixed footer
        paddingBottom: isMobile
          ? "95px"
          : "90px",

        boxSizing: "border-box",
      }}
    >
      {/* HEADER */}

      <Header />

      

      {/* PAGE CONTAINER */}

      <div
        style={{
          maxWidth: "1100px",
          margin: "0 auto",
          padding: isMobile
            ? "0 15px"
            : "0 20px",
          boxSizing: "border-box",
        }}
      >
        {/* TITLE */}

        <div
          style={{
            textAlign: "center",
            marginTop: isMobile
              ? "30px"
              : "45px",
            marginBottom: isMobile
              ? "25px"
              : "35px",
          }}
        >
          <h1
            style={{
              fontSize: isMobile
                ? "28px"
                : "42px",
              lineHeight: "1.3",
              margin: "0 0 10px 0",
              color: "#0F172A",
              fontWeight: "700",
            }}
          >
            Choose your appointment time
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
            Based on availability at this hospital
          </p>
        </div>

        {/* CONTEXT BAR */}

        <div
          style={{
            background: "#FFFFFF",
            borderRadius: "20px",
            padding: isMobile
              ? "18px"
              : "22px",
            marginBottom: isMobile
              ? "20px"
              : "30px",
            boxShadow:
              "0 8px 25px rgba(0,0,0,.05)",
            boxSizing: "border-box",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: isMobile
                ? "14px"
                : "20px",
            }}
          >
            {/* DOCTOR */}

            <div
              style={{
                display: "flex",
                gap: "10px",
                alignItems: "center",
                fontSize: isMobile
                  ? "13px"
                  : "15px",
                minWidth: 0,
              }}
            >
              <FaUserMd
                color="#2563EB"
                style={{
                  flexShrink: 0,
                }}
              />

              <strong>
                {doctor?.name}
              </strong>
            </div>

            {/* HOSPITAL */}

            <div
              style={{
                display: "flex",
                gap: "10px",
                alignItems: "center",
                fontSize: isMobile
                  ? "13px"
                  : "15px",
                minWidth: 0,
              }}
            >
              <FaHospital
                color="#2563EB"
                style={{
                  flexShrink: 0,
                }}
              />

              <strong>
                {hospital?.name}
              </strong>
            </div>

            {/* LOCATION */}

            <div
              style={{
                display: "flex",
                gap: "10px",
                alignItems: "center",
                fontSize: isMobile
                  ? "13px"
                  : "15px",
                minWidth: 0,
              }}
            >
              <FaMapMarkerAlt
                color="#2563EB"
                style={{
                  flexShrink: 0,
                }}
              />

              <strong>
                {userLocation}
              </strong>
            </div>
          </div>
        </div>

        {/* =========================================
            DATE CARD
        ========================================= */}

        <div
          style={{
            background: "#FFFFFF",
            borderRadius: "20px",
            padding: isMobile
              ? "20px"
              : "30px",
            marginBottom: "20px",
            boxShadow:
              "0 8px 25px rgba(0,0,0,.05)",
            boxSizing: "border-box",
          }}
        >
          <h3
            style={{
              marginTop: 0,
              marginBottom: "20px",
              color: "#0F172A",
              fontSize: isMobile
                ? "18px"
                : "20px",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <FaCalendarAlt color="#2563EB" />

            Select a date
          </h3>

          <div
            style={{
              display: "flex",
              gap: "10px",
              flexWrap: "wrap",
            }}
          >
            {dateOptions.map((date) => (
              <button
                key={date.value}
                onClick={() => {
                   trackPageHesitation();

                  const decisionTime =
                    (Date.now() - pageStartTime.current) / 1000;

                  trackClick(
                    `date_${date.value}`,
                    "AppointmentDateTimePage"
                  );

                  trackInteraction(
                    "appointment_date_selected",
                    {
                      doctorId: doctor?.id,
                      hospitalId: hospital?.id,
                      selectedDate: date.value,
                      decisionTimeSeconds:
                        Number(decisionTime.toFixed(2)),
                    }
                  );

                  setSelectedDate(date.value);

                  // Reset time when date changes
                  setSelectedTime("");
                  setSelectedCategory("");
                }}
                style={{
                  padding: isMobile
                    ? "11px 15px"
                    : "14px 20px",
                  borderRadius: "999px",

                  border:
                    selectedDate ===
                    date.value
                      ? "2px solid #2563EB"
                      : "1px solid #CBD5E1",

                  background:
                    selectedDate ===
                    date.value
                      ? "#EFF6FF"
                      : "#FFFFFF",

                  color: "#0F172A",
                  fontSize: isMobile
                    ? "13px"
                    : "14px",
                  fontWeight:
                    selectedDate ===
                    date.value
                      ? "600"
                      : "400",

                  cursor: "pointer",
                }}
              >
                {date.label}
              </button>
            ))}
          </div>
        </div>

        {/* =========================================
            TIME CATEGORY
        ========================================= */}

        <div
          style={{
            background: "#FFFFFF",
            borderRadius: "20px",
            padding: isMobile
              ? "20px"
              : "30px",
            marginBottom: "20px",
            boxShadow:
              "0 8px 25px rgba(0,0,0,.05)",
            boxSizing: "border-box",
          }}
        >
          <h3
            style={{
              marginTop: 0,
              marginBottom: "20px",
              color: "#0F172A",
              fontSize: isMobile
                ? "18px"
                : "20px",
            }}
          >
            Select a time period
          </h3>

          <div
            style={{
              display: "flex",
              gap: "12px",
              flexWrap: "wrap",
            }}
          >
            {/* MORNING */}

            {morningSlots.length > 0 && (
              <button
                onClick={() => {
                     trackClick(
                  "time_period_morning",
                  "AppointmentDateTimePage"
                );

                trackInteraction(
                  "appointment_time_period_selected",
                  {
                    period: "Morning",
                    selectedDate,
                    doctorId: doctor?.id,
                    hospitalId: hospital?.id,
                  }
                );

                setSelectedCategory("Morning");
                setSelectedTime("");
                }}
                style={{
                  padding: isMobile
                    ? "12px 17px"
                    : "16px 22px",
                  borderRadius: "16px",

                  border:
                    selectedCategory ===
                    "Morning"
                      ? "2px solid #2563EB"
                      : "1px solid #CBD5E1",

                  background:
                    selectedCategory ===
                    "Morning"
                      ? "#EFF6FF"
                      : "#FFFFFF",

                  color: "#0F172A",
                  fontSize: isMobile
                    ? "13px"
                    : "14px",
                  fontWeight:
                    selectedCategory ===
                    "Morning"
                      ? "600"
                      : "400",

                  cursor: "pointer",

                  display: "flex",
                  alignItems: "center",
                  gap: "7px",
                }}
              >
                <FaSun color="#f5d562" />

                Morning
              </button>
            )}

            {/* AFTERNOON */}

            {afternoonSlots.length > 0 && (
              <button
                onClick={() => {
                   trackClick(
                    "time_period_afternoon",
                    "AppointmentDateTimePage"
                  );

                  trackInteraction(
                    "appointment_time_period_selected",
                    {
                      period: "Afternoon",
                      selectedDate,
                      doctorId: doctor?.id,
                      hospitalId: hospital?.id,
                    }
                  );

                  setSelectedCategory("Afternoon");
                  setSelectedTime("");
                }}
                style={{
                  padding: isMobile
                    ? "12px 17px"
                    : "16px 22px",
                  borderRadius: "16px",

                  border:
                    selectedCategory ===
                    "Afternoon"
                      ? "2px solid #2563EB"
                      : "1px solid #CBD5E1",

                  background:
                    selectedCategory ===
                    "Afternoon"
                      ? "#EFF6FF"
                      : "#FFFFFF",

                  color: "#0F172A",
                  fontSize: isMobile
                    ? "13px"
                    : "14px",
                  fontWeight:
                    selectedCategory ===
                    "Afternoon"
                      ? "600"
                      : "400",

                  cursor: "pointer",

                  display: "flex",
                  alignItems: "center",
                  gap: "7px",
                }}
              >
                <FaCloudSun color="#F59E0B" />

                Afternoon
              </button>
            )}

            {/* EVENING */}

            {eveningSlots.length > 0 && (
              <button
                onClick={() => {
                  

                trackClick(
                  "time_period_evening",
                  "AppointmentDateTimePage"
                );

                trackInteraction(
                  "appointment_time_period_selected",
                  {
                    period: "Evening",
                    selectedDate,
                    doctorId: doctor?.id,
                    hospitalId: hospital?.id,
                  }
                );

                setSelectedCategory("Evening");
                setSelectedTime("");

                }}
                style={{
                  padding: isMobile
                    ? "12px 17px"
                    : "16px 22px",
                  borderRadius: "16px",

                  border:
                    selectedCategory ===
                    "Evening"
                      ? "2px solid #2563EB"
                      : "1px solid #CBD5E1",

                  background:
                    selectedCategory ===
                    "Evening"
                      ? "#EFF6FF"
                      : "#FFFFFF",

                  color: "#0F172A",
                  fontSize: isMobile
                    ? "13px"
                    : "14px",
                  fontWeight:
                    selectedCategory ===
                    "Evening"
                      ? "600"
                      : "400",

                  cursor: "pointer",

                  display: "flex",
                  alignItems: "center",
                  gap: "7px",
                }}
              >
                <FaMoon color="#6366F1" />

                Evening
              </button>
            )}
          </div>
        </div>

        {/* =========================================
            TIME SLOTS
        ========================================= */}

        {selectedCategory && (
          <div
            style={{
              background: "#FFFFFF",
              borderRadius: "20px",
              padding: isMobile
                ? "20px"
                : "30px",
              boxShadow:
                "0 8px 25px rgba(0,0,0,.05)",
              boxSizing: "border-box",
            }}
          >
            <h3
              style={{
                marginTop: 0,
                color: "#0F172A",
                fontSize: isMobile
                  ? "18px"
                  : "20px",
              }}
            >
              Available Time Slots
            </h3>

            <div
              style={{
                display: "flex",
                gap: "10px",
                flexWrap: "wrap",
                marginTop: "20px",
              }}
            >
              {slots.map((slot) => (
                <button
                  key={slot}
                  onClick={() => {

                    trackClick(
                      `time_slot_${slot}`,
                      "AppointmentDateTimePage"
                    );

                    trackInteraction(
                      "appointment_time_selected",
                      {
                        selectedDate,
                        timePeriod: selectedCategory,
                        selectedTime: slot,
                        doctorId: doctor?.id,
                        hospitalId: hospital?.id,
                      }
                    );

                    setSelectedTime(slot);
                  }
                  }
                  style={{
                    padding: isMobile
                      ? "11px 15px"
                      : "14px 20px",
                    borderRadius: "999px",

                    border:
                      selectedTime ===
                      slot
                        ? "2px solid #2563EB"
                        : "1px solid #CBD5E1",

                    background:
                      selectedTime ===
                      slot
                        ? "#2563EB"
                        : "#FFFFFF",

                    color:
                      selectedTime ===
                      slot
                        ? "#FFFFFF"
                        : "#0F172A",

                    fontSize: isMobile
                      ? "13px"
                      : "14px",

                    fontWeight: "600",

                    cursor: "pointer",
                  }}
                >
                  {slot}
                </button>
              ))}
            </div>
          </div>
        )}

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
                You are shown only available time slots.
              </span>
            </div>
      </div>

      {/* =========================================
          FIXED FOOTER
      ========================================= */}

      <div
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          background: "#FFFFFF",
          borderTop:
            "1px solid #E5E7EB",
          padding: isMobile
            ? "12px 15px"
            : "14px 25px",
          display: "flex",
          justifyContent:
            "space-between",
          alignItems: "center",
          gap: "12px",
          boxShadow:
            "0 -4px 20px rgba(0,0,0,.05)",
          zIndex: 1000,
          boxSizing: "border-box",
        }}
      >
        {/* BACK BUTTON */}

        <button
          onClick={handleBack}
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "7px",

            background: "#FFFFFF",
            color: "#475569",

            border:
              "1px solid #CBD5E1",

            padding: isMobile
              ? "10px 15px"
              : "12px 20px",

            borderRadius: "12px",

            fontSize: isMobile
              ? "13px"
              : "14px",

            fontWeight: "600",

            cursor: "pointer",

            flexShrink: 0,
          }}
        >
          <FaArrowLeft />

          Back
        </button>

        {/* CONTINUE BUTTON */}

        <button
          disabled={
            !selectedDate ||
            !selectedTime
          }
          onClick={handleContinue}
          style={{
            background:
              selectedDate &&
              selectedTime
                ? "#2563EB"
                : "#CBD5E1",

            color: "#FFFFFF",

            border: "none",

            padding: isMobile
              ? "10px 17px"
              : "12px 24px",

            borderRadius: "12px",

            fontWeight: "600",

            fontSize: isMobile
              ? "13px"
              : "14px",

            cursor:
              selectedDate &&
              selectedTime
                ? "pointer"
                : "not-allowed",

            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "7px",

            flexShrink: 0,
          }}
        >
          Continue

          <FaArrowRight />
        </button>
      </div>
    </div>
  );
}

