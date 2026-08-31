import { useState, useEffect, useContext, useRef } from "react";

import { useParams, useNavigate } from "react-router-dom";

import { TrackingContext } from "../context/TrackingContext";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

import doctors from "../data/doctors";

import useIsMobile from "../hooks/useIsMobile";

function BookingFormPage() {
  const { doctorId, hospitalName, sessionIndex } = useParams();

  const navigate = useNavigate();

  const {
    trackClick,
    trackInteraction,
    trackPageVisit,
    trackHesitation,
    trackSuccess,
    trackError,
    trackBackClick,
  } = useContext(TrackingContext);

  const isMobile = useIsMobile();

  const interactionStartTime = useRef(Date.now());

  const calculateHesitation = () => {
    const hesitationTime = (Date.now() - interactionStartTime.current) / 1000;

    if (hesitationTime > 5) {
      trackHesitation(Number(hesitationTime.toFixed(2)));
    }

    interactionStartTime.current = Date.now();
  };

  const doctor = doctors.find((d) => d.id === Number(doctorId));

  const hospital = doctor?.hospitals?.find(
    (h) => h.name === decodeURIComponent(hospitalName),
  );

  const session = hospital?.sessions?.[sessionIndex];

  const [formData, setFormData] = useState({
    title: "Mr",
    name: "",
    email: "",
    mobile: "",
    area: "",
    nic: "",
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    trackPageVisit("BookingFormPage");

    trackInteraction("booking_form_view", {
      doctorId,
      hospitalName,
      sessionIndex,
    });
  }, []);

  if (!doctor || !hospital || !session) {
    return (
      <h2
        style={{
          padding: isMobile ? 15 : 20,
        }}
      >
        Not Found
      </h2>
    );
  }

  const appointmentNo = session.patients + 1;

  function calculateEstimatedTime() {
    const [time, modifier] = session.startTime.split(" ");

    let [hours, minutes] = time.split(":").map(Number);

    if (modifier === "PM" && hours !== 12) {
      hours += 12;
    }

    if (modifier === "AM" && hours === 12) {
      hours = 0;
    }

    const totalMinutes = hours * 60 + minutes + session.patients * 15;

    const estimatedHour = Math.floor(totalMinutes / 60);

    const estimatedMinute = totalMinutes % 60;

    const finalHour = estimatedHour % 12 || 12;

    const finalModifier = estimatedHour >= 12 ? "PM" : "AM";

    return `${finalHour}:${estimatedMinute
      .toString()
      .padStart(2, "0")} ${finalModifier}`;
  }

  const estimatedTime = calculateEstimatedTime();

  const handlePay = () => {
    trackClick("BookingFormPage");

    let newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.mobile.trim()) {
      newErrors.mobile = "Mobile number is required";
    }

    if (!formData.nic.trim()) {
      newErrors.nic = "NIC number is required";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      trackInteraction("booking_success", {
        doctorId: doctor.id,

        hospital: hospital.name,

        sessionIndex,

        appointmentNo,
      });

      trackSuccess();

      trackPageVisit("Success");

      alert("Appointment booked successfully!");
    } else {
      trackError("booking_form_validation");

      trackInteraction("booking_validation_error", {
        errors: newErrors,
      });
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,

      [e.target.name]: e.target.value,
    });
  };

  const handleBack = () => {
    calculateHesitation();

    trackBackClick();

    trackClick("back_button");

    trackInteraction("booking_form_back_clicked", {
      from: "BookingFormPage",
    });

    navigate(-1);
  };

  return (
    <div
      style={{
        background: "linear-gradient(135deg, #e0f2fe, #f8fafc)",

        minHeight: "100vh",

        width: "100%",

        overflowX: "hidden",
      }}
    >
      <Navbar />

      <div
        style={{
          padding: isMobile ? "15px" : "20px",

          width: "100%",

          boxSizing: "border-box",
        }}
      >
        <h2
          style={{
            marginTop: isMobile ? 5 : 10,

            marginBottom: isMobile ? 18 : 20,

            fontSize: isMobile ? 24 : 28,
          }}
        >
          Place Appointment
        </h2>

        <div
          style={{
            display: "flex",

            flexDirection: isMobile ? "column" : "row",

            gap: isMobile ? 15 : 20,

            alignItems: "flex-start",

            width: "100%",
          }}
        >
          <div
            style={{
              width: isMobile ? "100%" : "30%",

              flexShrink: 0,

              boxSizing: "border-box",
            }}
          >
            <Card isMobile={isMobile}>
              <div
                style={{
                  textAlign: "center",
                }}
              >
                <img
                  src={doctor.image}
                  alt={doctor.name}
                  style={{
                    width: isMobile ? 90 : 110,

                    height: isMobile ? 90 : 110,

                    borderRadius: "50%",

                    objectFit: "cover",
                  }}
                />

                <h3
                  style={{
                    fontSize: isMobile ? 20 : 22,

                    margin: "12px 0 8px",
                  }}
                >
                  Dr. {doctor.name}
                </h3>

                <p>{doctor.gender}</p>

                <p>{doctor.specialization}</p>
              </div>
            </Card>

            <Card isMobile={isMobile}>
              <h3
                style={{
                  fontSize: isMobile ? 19 : 21,
                }}
              >
                Session Details
              </h3>

              <DetailItem label="Hospital" value={hospital.name} />

              <DetailItem label="Location" value={hospital.location} />

              <DetailItem label="Session date" value={session.date} />

              <DetailItem label="Session time" value={session.time} />

              <DetailItem label="Appointment no" value={appointmentNo} />

              <div
                style={{
                  marginTop: 20,

                  background: "#f8f9fa",

                  padding: isMobile ? 12 : 15,

                  borderRadius: 8,

                  lineHeight: "1.6",

                  fontSize: isMobile ? 13 : 14,

                  wordBreak: "break-word",
                }}
              >
                Your estimated appointment time is <b>{estimatedTime}</b>. This
                time is depending on the time spend with patients / applicants
                ahead of you.
              </div>
            </Card>
          </div>

          <div
            style={{
              flex: 1,

              width: isMobile ? "100%" : "auto",

              minWidth: 0,

              boxSizing: "border-box",
            }}
          >
            <Card isMobile={isMobile}>
              <h3
                style={{
                  fontSize: isMobile ? 19 : 21,
                }}
              >
                Continue as Guest
              </h3>

              <div
                style={{
                  display: "grid",

                  gap: isMobile ? 12 : 15,

                  width: "100%",
                }}
              >
                <select
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  style={{
                    ...inputStyle,

                    width: "100%",
                  }}
                >
                  <option>Mr</option>

                  <option>Mrs</option>

                  <option>Ms</option>
                </select>

                <div>
                  <input
                    type="text"
                    name="name"
                    placeholder="Patient Name *"
                    value={formData.name}
                    onChange={handleChange}
                    style={inputStyle}
                  />

                  {errors.name && <p style={errorStyle}>{errors.name}</p>}
                </div>

                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleChange}
                  style={inputStyle}
                />

                <div>
                  <input
                    type="text"
                    name="mobile"
                    placeholder="Mobile Number *"
                    value={formData.mobile}
                    onChange={handleChange}
                    style={inputStyle}
                  />

                  {errors.mobile && <p style={errorStyle}>{errors.mobile}</p>}
                </div>

                <input
                  type="text"
                  name="area"
                  placeholder="Area"
                  value={formData.area}
                  onChange={handleChange}
                  style={inputStyle}
                />

                <div>
                  <input
                    type="text"
                    name="nic"
                    placeholder="NIC Number *"
                    value={formData.nic}
                    onChange={handleChange}
                    style={inputStyle}
                  />

                  {errors.nic && <p style={errorStyle}>{errors.nic}</p>}
                </div>
              </div>
            </Card>

            <Card isMobile={isMobile}>
              <h3
                style={{
                  fontSize: isMobile ? 19 : 21,
                }}
              >
                Patient Details
              </h3>

              <SummaryRow
                label="Name"
                value={formData.name || "-"}
                isMobile={isMobile}
              />

              <SummaryRow
                label="NIC"
                value={formData.nic || "-"}
                isMobile={isMobile}
              />

              <SummaryRow
                label="Mobile"
                value={formData.mobile || "-"}
                isMobile={isMobile}
              />

              <SummaryRow
                label="Email"
                value={formData.email || "-"}
                isMobile={isMobile}
              />
            </Card>

            <Card isMobile={isMobile}>
              <h3
                style={{
                  fontSize: isMobile ? 19 : 21,
                }}
              >
                Payment Details
              </h3>

              <PaymentRow
                label="Doctor fee"
                value={`Rs ${session.price}`}
                isMobile={isMobile}
              />

              <PaymentRow
                label="Hospital fee"
                value="Rs 1,750"
                isMobile={isMobile}
              />

              <PaymentRow
                label="eChannelling fee"
                value="Rs 399"
                isMobile={isMobile}
              />

              <hr />

              <PaymentRow
                label="Total fee"
                value={`Rs ${session.price + 1750 + 399}`}
                bold
                isMobile={isMobile}
              />

              <button
                onClick={handlePay}
                style={{
                  width: "100%",

                  height: 45,

                  marginTop: 20,

                  background: "#28a745",

                  color: "white",

                  border: "none",

                  borderRadius: 8,

                  cursor: "pointer",

                  fontWeight: "bold",

                  fontSize: isMobile ? 15 : 14,
                }}
              >
                Pay
              </button>
            </Card>
          </div>
        </div>

        <div
          style={{
            padding: isMobile ? "0 15px 20px" : "0 20px 25px",

            display: "flex",

            justifyContent: "flex-start",

            width: "100%",

            boxSizing: "border-box",
          }}
        >
          <button
            onClick={handleBack}
            style={{
              height: 42,

              padding: isMobile ? "0 18px" : "0 22px",

              background: "#64748b",

              color: "white",

              border: "none",

              borderRadius: 8,

              cursor: "pointer",

              fontWeight: "600",

              fontSize: isMobile ? 14 : 15,

              width: isMobile ? "100%" : "auto",

              boxSizing: "border-box",
            }}
          >
            ← Back
          </button>
        </div>

        <Footer />
      </div>
    </div>
  );
}

function Card({ children, isMobile }) {
  return (
    <div
      style={{
        background: "white",

        padding: isMobile ? 15 : 20,

        borderRadius: 12,

        marginBottom: 20,

        boxShadow: "0 2px 8px rgba(0,0,0,0.05)",

        width: "100%",

        boxSizing: "border-box",
      }}
    >
      {children}
    </div>
  );
}

function DetailItem({ label, value }) {
  return (
    <div
      style={{
        marginBottom: 15,

        wordBreak: "break-word",
      }}
    >
      <p
        style={{
          color: "#777",

          margin: "0 0 5px",
        }}
      >
        {label}
      </p>

      <b>{value}</b>
    </div>
  );
}

function SummaryRow({ label, value, isMobile }) {
  return (
    <div
      style={{
        display: "flex",

        justifyContent: "space-between",

        alignItems: "flex-start",

        gap: 15,

        marginBottom: 12,

        flexWrap: isMobile ? "wrap" : "nowrap",
      }}
    >
      <span
        style={{
          fontWeight: 500,

          flexShrink: 0,
        }}
      >
        {label}
      </span>

      <span
        style={{
          textAlign: isMobile ? "left" : "right",

          wordBreak: "break-word",

          minWidth: 0,
        }}
      >
        {value}
      </span>
    </div>
  );
}

function PaymentRow({ label, value, bold, isMobile }) {
  return (
    <div
      style={{
        display: "flex",

        justifyContent: "space-between",

        alignItems: "center",

        gap: 15,

        marginBottom: 12,

        fontWeight: bold ? "bold" : "normal",

        flexWrap: isMobile ? "wrap" : "nowrap",
      }}
    >
      <span>{label}</span>

      <span
        style={{
          whiteSpace: "nowrap",
        }}
      >
        {value}
      </span>
    </div>
  );
}

const inputStyle = {
  width: "100%",

  height: 42,

  borderRadius: 8,

  border: "1px solid #ccc",

  padding: "0 12px",

  fontSize: 14,

  boxSizing: "border-box",

  outline: "none",
};

const errorStyle = {
  color: "red",

  fontSize: 12,

  marginTop: 5,

  marginBottom: 0,
};

export default BookingFormPage;
