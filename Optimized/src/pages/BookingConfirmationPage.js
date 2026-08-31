
import { useState, useContext, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import Header from "../components/Header";
import ProgressTracker from "../components/ProgressTracker";
import doctorHospitalAvailability from "../data/doctorHospitalAvailability";
import {
  FaCheckCircle,
  FaWallet,
  FaEdit,
  FaWhatsapp,
  FaDownload,
  FaCalendarPlus,
  FaShieldAlt,
  FaArrowLeft
} from "react-icons/fa";

import useIsMobile from "../hooks/useIsMobile";
import { TrackingContext } from "../context/TrackingContext";

export default function BookingConfirmationPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useIsMobile();

  const {
    trackPageVisit,
    trackClick,
    trackError,
    trackBackClick,
    trackInteraction,
    trackHesitation,
    trackSuccess
  } = useContext(TrackingContext);

  const pageStartTime = useRef(Date.now());
  const lastInteractionTime = useRef(Date.now());
  const confirmationAttempted = useRef(false);
  const successTracked = useRef(false);
  const trackedValidationErrors = useRef(new Set());

  const doctor = location.state?.doctor;
  const hospital = location.state?.hospital;
  const date = location.state?.date;
  const time = location.state?.time;

  const feeData = doctorHospitalAvailability.find(
  (item) =>
    item.doctorId === doctor?.id &&
    item.hospitalId === hospital?.id
  );

  const fee = feeData?.fee || "Fee not available";


  const [confirmed, setConfirmed] = useState(false);

  

  useEffect(() => {
  trackPageVisit("BookingConfirmationPage");

  trackInteraction(
    "page_opened",
    {
      page: "BookingConfirmationPage",
      doctor: doctor?.name || null,
      hospital: hospital?.name || null,
      date: date || null,
      time: time || null
    }
  );

  // eslint-disable-next-line react-hooks/exhaustive-deps
}, []);

  const [formData, setFormData] = useState({
  title: "Mr",
  name: "",
  email: "",
  mobile: "",
  area: "",
  nic: ""
});

const [errors, setErrors] = useState({});

const handleChange = (e) => {
  const { name, value } = e.target;

  setFormData((prev) => ({
    ...prev,
    [name]: value
  }));

  // Reset hesitation timer because
  // the user is actively interacting
  lastInteractionTime.current = Date.now();

  // Remove error while user is correcting the field
  if (errors[name]) {
    setErrors((prev) => ({
      ...prev,
      [name]: ""
    }));
  }

  // Once the user corrects a field,
// allow a future mistake in that field
// to be counted as a new error.
trackedValidationErrors.current.delete(name);


  trackInteraction(
    "patient_field_changed",
    {
      field: name
    }
  );
};

const validateForm = () => {
  const newErrors = {};

  // =============================================
  // NAME
  // =============================================

  if (!formData.name.trim()) {

    newErrors.name = "Patient name is required";

    if (!trackedValidationErrors.current.has("name")) {

      trackError(
        "patient_name_required",
        "BookingConfirmationPage"
      );

      trackedValidationErrors.current.add("name");
    }
  }

  // =============================================
  // MOBILE
  // =============================================

  if (!formData.mobile.trim()) {

    newErrors.mobile =
      "Mobile number is required";

    if (!trackedValidationErrors.current.has("mobile")) {

      trackError(
        "mobile_number_required",
        "BookingConfirmationPage"
      );

      trackedValidationErrors.current.add("mobile");
    }

  } else if (
    !/^[0-9]{10}$/.test(formData.mobile)
  ) {

    newErrors.mobile =
      "Enter a valid 10-digit mobile number";

    if (!trackedValidationErrors.current.has("mobile")) {

      trackError(
        "invalid_mobile_number",
        "BookingConfirmationPage"
      );

      trackedValidationErrors.current.add("mobile");
    }
  }

  // =============================================
  // NIC
  // =============================================

  if (!formData.nic.trim()) {

    newErrors.nic =
      "NIC number is required";

    if (!trackedValidationErrors.current.has("nic")) {

      trackError(
        "nic_required",
        "BookingConfirmationPage"
      );

      trackedValidationErrors.current.add("nic");
    }
  }

  // =============================================
  // SAVE UI ERRORS
  // =============================================

  setErrors(newErrors);

  // =============================================
  // TRACK VALIDATION RESULT
  // =============================================

  trackInteraction(
    "form_validation",
    {
      page: "BookingConfirmationPage",

      valid:
        Object.keys(newErrors).length === 0,

      errorCount:
        Object.keys(newErrors).length,

      errorFields:
        Object.keys(newErrors)
    }
  );

  return Object.keys(newErrors).length === 0;
};

const handleConfirm = () => {

   const now = Date.now();

  const hesitationSeconds =
    (now - lastInteractionTime.current) / 1000;

  // Track hesitation only when user waits
  // more than 5 seconds before confirming
  if (hesitationSeconds > 5) {

    trackHesitation(
      Number(hesitationSeconds.toFixed(2))
    );

    trackInteraction(
      "hesitation_detected",
      {
        page: "BookingConfirmationPage",
        action: "confirm_appointment",
        hesitationSeconds:
          Number(hesitationSeconds.toFixed(2))
      }
    );
  }

  // Update interaction time
  lastInteractionTime.current = now;

  // ---------------------------------------------
  // Track confirmation click
  // ---------------------------------------------

  trackClick(
    "confirm_appointment",
    "BookingConfirmationPage"
  );

  // ---------------------------------------------
  // Track confirmation attempt
  // ---------------------------------------------

  confirmationAttempted.current = true;

  trackInteraction(
    "confirmation_attempted",
    {
      page: "BookingConfirmationPage"
    }
  );

  // ---------------------------------------------
  // Validate patient information
  // ---------------------------------------------

  const isValid = validateForm();

  // ---------------------------------------------
  // Validation failed
  // ---------------------------------------------

  if (!isValid) {

    trackInteraction(
      "confirmation_failed_validation",
      {
        page: "BookingConfirmationPage"
      }
    );

    return;
  }

  // ---------------------------------------------
  // Validation successful
  // ---------------------------------------------

  trackInteraction(
    "confirmation_validation_success",
    {
      page: "BookingConfirmationPage"
    }
  );

  // ---------------------------------------------
  // Track successful task completion
  // ---------------------------------------------

  if (!successTracked.current) {

    successTracked.current = true;

    trackSuccess();

    trackInteraction(
      "appointment_confirmed",
      {
        page: "BookingConfirmationPage",
        doctor: doctor?.name || null,
        hospital: hospital?.name || null,
        date: date || null,
        time: time || null
      }
    );
  }

  setConfirmed(true);
};

  // --------------------------------------------------
  // BACK BUTTON
  // --------------------------------------------------

  const handleBack = () => {

  trackBackClick(
    "BookingConfirmationPage_back"
  );

  trackInteraction(
    "back_navigation",
    {
      from: "BookingConfirmationPage",
      to: "AppointmentDateTimePage"
    }
  );

  navigate(
    "/appointment-date-time",
    {
      state: {
        doctor,
        hospital,
        location:
          location.state?.location
      }
    }
  );
};

  // --------------------------------------------------
  // CONFIRMED SCREEN
  // --------------------------------------------------

  if (confirmed) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "#F8FAFC",
          padding: isMobile ? "30px 15px" : "80px 20px",
          boxSizing: "border-box"
        }}
      >
        <div
          style={{
            maxWidth: "800px",
            margin: "0 auto"
          }}
        >
          <div
            style={{
              background: "#FFFFFF",
              borderRadius: isMobile ? "20px" : "24px",
              padding: isMobile ? "35px 20px" : "50px",
              textAlign: "center",
              boxShadow:
                "0 10px 30px rgba(0,0,0,.08)"
            }}
          >
            <FaCheckCircle
              size={isMobile ? 55 : 70}
              color="#16A34A"
            />

            <h1
              style={{
                marginTop: "20px",
                marginBottom: "10px",
                color: "#0F172A",
                fontSize: isMobile ? "26px" : "34px"
              }}
            >
              Appointment Confirmed
            </h1>

            <p
              style={{
                color: "#64748B",
                fontSize: isMobile ? "14px" : "16px",
                lineHeight: "1.6",
                margin: 0
              }}
            >
              Your appointment has been successfully booked.
            </p>

            <div
              style={{
                marginTop: "30px",
                display: "flex",
                gap: "12px",
                justifyContent: "center",
                flexWrap: "wrap"
              }}
            >
              <button style={btnGreen}
                 onClick={() => {

                  trackClick(
                    "confirmation_whatsapp",
                    "BookingConfirmationPage"
                  );

                  trackInteraction(
                    "confirmation_whatsapp_clicked",
                    {}
                  );
                }}
              >
                <FaWhatsapp />
                WhatsApp
              </button>

              <button style={btnOutline}
              onClick={() => {

                trackClick(
                  "confirmation_receipt",
                  "BookingConfirmationPage"
                );

                trackInteraction(
                  "confirmation_receipt_clicked",
                  {}
                );
              }}
              >
                <FaDownload />
                Receipt
              </button>

              <button style={btnOutline}
              onClick={() => {

                trackClick(
                  "confirmation_calendar",
                  "BookingConfirmationPage"
                );

                trackInteraction(
                  "confirmation_calendar_clicked",
                  {}
                );
              }}
              >
                <FaCalendarPlus />
                Calendar
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // --------------------------------------------------
  // MAIN PAGE
  // --------------------------------------------------

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#F8FAFC",
        paddingBottom: isMobile ? "115px" : "110px",
        boxSizing: "border-box"
      }}
    >
      <Header />

     

      {/* PAGE CONTAINER */}

      <div
        style={{
          maxWidth: "900px",
          margin: isMobile
            ? "30px auto"
            : "40px auto",
          padding: isMobile
            ? "0 15px"
            : "0 20px",
          boxSizing: "border-box"
        }}
      >

        {/* =========================================
            TITLE
        ========================================= */}

        <div
          style={{
            textAlign: "center",
            marginBottom: isMobile
              ? "25px"
              : "30px"
          }}
        >
          <h1
            style={{
              fontSize: isMobile
                ? "28px"
                : "40px",
              lineHeight: "1.3",
              color: "#0F172A",
              margin:
                "0 0 10px 0"
            }}
          >
            Confirm Your Appointment
          </h1>

          <p
            style={{
              color: "#64748B",
              fontSize: isMobile
                ? "14px"
                : "16px",
              lineHeight: "1.6",
              margin: 0
            }}
          >
            Please review your appointment details
            before confirming
          </p>
        </div>

        {/* =========================================
            MAIN CARD
        ========================================= */}

        <div
          style={{
            background: "#FFFFFF",
            borderRadius: isMobile
              ? "18px"
              : "22px",
            padding: isMobile
              ? "20px"
              : "30px",
            boxShadow:
              "0 10px 30px rgba(0,0,0,.06)",
            boxSizing: "border-box"
          }}
        >

          {/* =====================================
              APPOINTMENT ID
          ===================================== */}
 


          <div
            style={{
              display: "flex",
              background: "#F8FAFC",
              justifyContent: "space-between",
              alignItems: "center",
              gap: "10px",
              flexWrap: "wrap"
            }}
          >
            <div
              style={{
                fontSize: "11px",
                color: "#64748B",
                fontWeight: "600",
              }}
            >
              APPOINTMENT ID
            </div>

            <div
              style={{
                fontSize: "11px",
                background: "#E0F2FE",
                padding: "5px 10px",
                borderRadius: "20px",
                color: "#0369A1",
                fontWeight: "600"
              }}
            >
              #APT-2026-004582
            </div>
          </div>

          {/* =====================================
              APPOINTMENT DETAILS
          ===================================== */}

          <div
            style={{
              display: "grid",
              gridTemplateColumns: isMobile
                ? "1fr"
                : "1fr 1fr",
              gap: isMobile
                ? "18px"
                : "20px",
              marginTop: "25px"
            }}
          >

            {/* DOCTOR */}

            <div style={miniCard}>
              <div style={miniTitle}>
                DOCTOR
              </div>

              <div style={title}>
                {doctor?.name || "Doctor"}
              </div>
            </div>

            {/* HOSPITAL */}

            <div style={miniCard}>
              <div style={miniTitle}>
                HOSPITAL
              </div>

              <div style={title}>
                {hospital?.name || "Hospital"}
              </div>
            </div>

            {/* DATE */}

            <div style={miniCard}>
              <div style={miniTitle}>
                DATE
              </div>

              <div style={title}>
                {date || "Not selected"}
              </div>
            </div>

            {/* TIME */}

            <div style={miniCard}>
              <div style={miniTitle}>
                TIME
              </div>

              <div style={title}>
                {time || "Not selected"}
              </div>
            </div>

          </div>


     
     {/* =====================================
    PATIENT DETAILS
===================================== */}



<div
  style={{
    marginTop: "50px",
    paddingTop: "28px",
    borderTop: "1px solid #E5E7EB"
  }}
>
  {/* SECTION HEADER */}

  <div
    style={{
      marginBottom: "24px"
    }}
  >
    <h2
      style={{
        margin: 0,
        fontSize: isMobile ? "21px" : "24px",
        color: "#0F172A",
        fontWeight: "700",
        lineHeight: "1.3"
      }}
    >
      Who is this appointment for?
    </h2>

    <p
      style={{
        margin: "7px 0 0",
        color: "#64748B",
        fontSize: isMobile ? "13px" : "14px",
        lineHeight: "1.6"
      }}
    >
      Enter the patient's details so we can prepare the appointment.
    </p>
  </div>


  {/* =====================================
      ABOUT THE PATIENT
  ===================================== */}

  <div
    style={{
      background: "#F8FAFC",
      border: "1px solid #E2E8F0",
      borderRadius: "16px",
      padding: isMobile ? "16px" : "20px",
      marginBottom: "18px"
    }}
  >

    <div
      style={{
        marginBottom: "18px"
      }}
    >
      <h3
        style={{
          margin: 0,
          fontSize: isMobile ? "15px" : "16px",
          color: "#0F172A",
          fontWeight: "700"
        }}
      >
        About the patient
      </h3>

      <p
        style={{
          margin: "4px 0 0",
          color: "#64748B",
          fontSize: "12px"
        }}
      >
        Basic information about the person attending the appointment.
      </p>
    </div>


    {/* NAME + TITLE */}

    <div
      style={{
        display: "grid",
        gridTemplateColumns: isMobile
          ? "1fr"
          : "120px 1fr",
        gap: "16px"
      }}
    >

      {/* TITLE */}

      <div>
  <label style={labelStyle}>
    Title
    <span style={optionalStyle}>Optional</span>
  </label>

  <div
    style={{
      display: "flex",
      gap: "8px",
      flexWrap: "wrap"
    }}
  >
    {["Mr", "Mrs", "Ms"].map((option) => {
      const selected = formData.title === option;

      return (
        <label
          key={option}
          style={{
            flex: isMobile ? "1 1 30%" : "0 0 auto",
            minWidth: "70px",
            cursor: "pointer"
          }}
        >
          <input
            type="radio"
            name="title"
            value={option}
            checked={selected}
            onChange={handleChange}
            style={{
              position: "absolute",
              opacity: 0,
              pointerEvents: "none"
            }}
          />

          <div
            style={{
              height: "46px",
              padding: "0 16px",
              borderRadius: "10px",

              border: selected
                ? "2px solid #2563EB"
                : "1px solid #CBD5E1",

              background: selected
                ? "#EFF6FF"
                : "#FFFFFF",

              color: selected
                ? "#1D4ED8"
                : "#475569",

              display: "flex",
              alignItems: "center",
              justifyContent: "center",

              fontSize: "14px",
              fontWeight: selected
                ? "700"
                : "500",

              boxSizing: "border-box",

              transition:
                "all 0.15s ease"
            }}
          >
            {option}
          </div>
        </label>
      );
    })}
  </div>
</div>


      {/* FULL NAME */}

      <div>

        <label style={labelStyle}>
          Full name
          <span style={requiredStyle}>
            Required
          </span>
        </label>

        <input
          type="text"
          name="name"
          placeholder="Enter patient's full name"
          value={formData.name}
          onChange={handleChange}
          style={{
            ...inputStyle,
            borderColor: errors.name
              ? "#EF4444"
              : "#CBD5E1"
          }}
        />

        {errors.name && (
          <p style={errorStyle}>
            {errors.name}
          </p>
        )}

      </div>

    </div>

  </div>


  {/* =====================================
      CONTACT INFORMATION
  ===================================== */}

  <div
    style={{
      background: "#FFFFFF",
      border: "1px solid #E2E8F0",
      borderRadius: "16px",
      padding: isMobile ? "16px" : "20px",
      marginBottom: "18px"
    }}
  >

    <div
      style={{
        marginBottom: "18px"
      }}
    >

      <h3
        style={{
          margin: 0,
          fontSize: isMobile ? "15px" : "16px",
          color: "#0F172A",
          fontWeight: "700"
        }}
      >
        How can we contact you?
      </h3>

      <p
        style={{
          margin: "4px 0 0",
          color: "#64748B",
          fontSize: "12px",
          lineHeight: "1.5"
        }}
      >
        We'll use these details for appointment updates
      </p>

    </div>


    <div
      style={{
        display: "grid",
        gridTemplateColumns: isMobile
          ? "1fr"
          : "1fr 1fr",
        gap: "16px"
      }}
    >

      {/* MOBILE */}

      <div>

        <label style={labelStyle}>
          Mobile number
          <span style={requiredStyle}>
            Required
          </span>
        </label>

        <input
          type="tel"
          name="mobile"
          placeholder="07XXXXXXXX"
          value={formData.mobile}
          onChange={handleChange}
          style={{
            ...inputStyle,
            borderColor: errors.mobile
              ? "#EF4444"
              : "#CBD5E1"
          }}
        />

        <p style={helperStyle}>
          We'll use this number for appointment updates
        </p>

        {errors.mobile && (
          <p style={errorStyle}>
            {errors.mobile}
          </p>
        )}

      </div>


      {/* EMAIL */}

      <div>

        <label style={labelStyle}>
          Email address
          <span style={optionalStyle}>
            Optional
          </span>
        </label>

        <input
          type="email"
          name="email"
          placeholder="abc@gmail.com"
          value={formData.email}
          onChange={handleChange}
          style={inputStyle}
        />

      </div>

    </div>

  </div>


  {/* =====================================
      ADDITIONAL INFORMATION
  ===================================== */}

  <div
    style={{
      background: "#FFFFFF",
      border: "1px solid #E2E8F0",
      borderRadius: "16px",
      padding: isMobile ? "16px" : "20px"
    }}
  >

    <div
      style={{
        marginBottom: "18px"
      }}
    >

      <h3
        style={{
          margin: 0,
          fontSize: isMobile ? "15px" : "16px",
          color: "#0F172A",
          fontWeight: "700"
        }}
      >
        Additional information
      </h3>

      <p
        style={{
          margin: "4px 0 0",
          color: "#64748B",
          fontSize: "12px"
        }}
      >
        This information helps us identify the patient
      </p>

    </div>


    <div
      style={{
        display: "grid",
        gridTemplateColumns: isMobile
          ? "1fr"
          : "1fr 1fr",
        gap: "16px"
      }}
    >

      {/* AREA */}

      <div>

        <label style={labelStyle}>
          Area
          <span style={optionalStyle}>
            Optional
          </span>
        </label>

        <input
          type="text"
          name="area"
          placeholder="e.g. Colombo"
          value={formData.area}
          onChange={handleChange}
          style={inputStyle}
        />

      </div>


      {/* NIC */}

      <div>

        <label style={labelStyle}>
          NIC number
          <span style={requiredStyle}>
            Required
          </span>
        </label>

        <input
          type="text"
          name="nic"
          placeholder="Enter NIC number"
          value={formData.nic}
          onChange={handleChange}
          style={{
            ...inputStyle,
            borderColor: errors.nic
              ? "#EF4444"
              : "#CBD5E1"
          }}
        />

        <p style={helperStyle}>
          Used to identify the patient.
        </p>

        {errors.nic && (
          <p style={errorStyle}>
            {errors.nic}
          </p>
        )}

      </div>

    </div>

  </div>

</div>

          {/* =====================================
              CONSULTATION FEE
          ===================================== */}

          <div
            style={{
              marginTop: "25px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: "15px",
              borderTop:
                "1px solid #E5E7EB",
              paddingTop: "20px",
              flexWrap: "wrap"
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                color: "#0F172A",
                fontSize: isMobile
                  ? "14px"
                  : "16px"
              }}
            >
              

              <strong>
                Consultation Fee
              </strong>
            </div>

            <div
              style={{
                fontSize: isMobile
                  ? "18px"
                  : "20px",
                fontWeight: "700",
                color: "#0F172A"
              }}
            >
              {fee}
            </div>
          </div>

        </div>

        {/* =========================================
            EDIT OPTIONS
        ========================================= */}

        

        {/* =========================================
            SAFETY MESSAGE
        ========================================= */}

        <div
          style={{
            marginTop: "25px",
            background: "#ECFDF5",
            border:
              "1px solid #A7F3D0",
            padding: isMobile
              ? "12px"
              : "14px",
            borderRadius: "12px",
            display: "flex",
            alignItems: "center",
            gap: "10px",
            color: "#065F46",
            justifyContent: "center",
            fontSize: isMobile
              ? "11px"
              : "12px",
            textAlign: "center",
            lineHeight: "1.5"
          }}
        >
          <FaShieldAlt
            style={{
              flexShrink: 0
            }}
          />

          <span>
            Your appointment will be reserved
            immediately after confirmation
          </span>
        </div>

      </div>

      {/* =========================================
          STICKY FOOTER
      ========================================= */}

      <div
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          background: "#FFFFFF",
          padding: isMobile
            ? "12px 15px"
            : "15px 30px",
          borderTop:
            "1px solid #E5E7EB",
          boxShadow:
            "0 -4px 20px rgba(0,0,0,.05)",
          zIndex: 100,
          boxSizing: "border-box"
        }}
      >

        <div
          style={{
            maxWidth: "900px",
            margin: "0 auto",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "12px"
          }}
        >

          {/* BACK BUTTON */}

          <button
            onClick={handleBack}
            style={{
              background: "#FFFFFF",
              border:
                "1px solid #CBD5E1",
              color: "#475569",
              padding: isMobile
                ? "11px 15px"
                : "13px 20px",
              borderRadius: "12px",
              fontWeight: "600",
              fontSize: isMobile
                ? "13px"
                : "14px",
              cursor: "pointer",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "7px",
              flexShrink: 0
            }}
          >
            <FaArrowLeft />
            Back
          </button>

          {/* CONFIRM BUTTON */}

          <button
            onClick={handleConfirm}
            style={{
              flex: 1,
              maxWidth: isMobile
                ? "none"
                : "350px",
              padding: isMobile
                ? "12px 15px"
                : "14px 20px",
              background: "#2563EB",
              color: "#FFFFFF",
              border: "none",
              borderRadius: "12px",
              fontSize: isMobile
                ? "13px"
                : "15px",
              fontWeight: "700",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px"
            }}
          >
            <FaCheckCircle />
            Confirm Appointment
          </button>

        </div>

      </div>

    </div>
  );
}

/* ==================================================
   STYLES
================================================== */

const title = {
  fontWeight: 700,
  color: "#0F172A",
  fontSize: "16px",
  lineHeight: "1.4"
};

const miniTitle = {
  fontSize: "11px",
  fontWeight: "700",
  letterSpacing: "0.8px",
  color: "#64748B",
  marginBottom: "7px"
};

const miniCard = {
  border: "1px solid #E5E7EB",
  borderRadius: "14px",
  padding: "15px",
  boxSizing: "border-box"
};

const btnGreen = {
  background: "#25D366",
  border: "none",
  padding: "12px 16px",
  borderRadius: "10px",
  color: "#FFFFFF",
  fontWeight: 600,
  cursor: "pointer",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "7px"
};

const btnOutline = {
  background: "#FFFFFF",
  border: "1px solid #2563EB",
  padding: "12px 16px",
  borderRadius: "10px",
  color: "#2563EB",
  fontWeight: 600,
  cursor: "pointer",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "7px"
};

const linkBtn = {
  border: "none",
  background: "none",
  color: "#2563EB",
  fontWeight: 600,
  cursor: "pointer",
  display: "inline-flex",
  alignItems: "center",
  gap: "6px",
  fontSize: "13px",
  padding: "6px"
};

const labelStyle = {
  display: "block",
  fontSize: "13px",
  fontWeight: "600",
  color: "#334155",
  marginBottom: "7px"
};

const inputStyle = {
  width: "100%",
  height: "46px",
  padding: "0 13px",
  border: "1px solid #CBD5E1",
  borderRadius: "10px",
  background: "#FFFFFF",
  color: "#0F172A",
  fontSize: "14px",
  outline: "none",
  boxSizing: "border-box"
};

const errorStyle = {
  margin: "5px 0 0",
  color: "#DC2626",
  fontSize: "11px",
  lineHeight: "1.4"
};

const requiredStyle = {
  marginLeft: "6px",
  color: "#64748B",
  fontSize: "10px",
  fontWeight: "500"
};

const optionalStyle = {
  marginLeft: "6px",
  color: "#94A3B8",
  fontSize: "10px",
  fontWeight: "500"
};

const helperStyle = {
  margin: "6px 0 0",
  color: "#64748B",
  fontSize: "11px",
  lineHeight: "1.4"
};



