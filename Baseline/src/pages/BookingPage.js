import { useState, useEffect, useContext, useRef } from "react";

import { useParams, useNavigate } from "react-router-dom";

import doctors from "../data/doctors";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import BasicSearchForm from "../components/BasicSearchForm";

import { TrackingContext } from "../context/TrackingContext";

import useIsMobile from "../hooks/useIsMobile";

function BookingPage() {
  const { doctorId, hospitalName } = useParams();

  const navigate = useNavigate();

  const isMobile = useIsMobile();

  const {
    trackClick,
    trackInteraction,
    trackPageVisit,
    trackHesitation,
    trackBackClick,
  } = useContext(TrackingContext);

  const interactionStartTime = useRef(Date.now());

  const calculateHesitation = (eventName) => {
    const timeSpent = (Date.now() - interactionStartTime.current) / 1000;

    if (timeSpent > 5) {
      trackHesitation(Number(timeSpent.toFixed(2)));
    }

    trackInteraction(`${eventName}_hesitation_time`, {
      seconds: Number(timeSpent.toFixed(2)),
    });

    interactionStartTime.current = Date.now();
  };

  useEffect(() => {
    trackPageVisit("BookingPage");

    trackInteraction("booking_page_view", {
      doctorId,
      hospitalName,
    });

    interactionStartTime.current = Date.now();
  }, []);

  const doctor = doctors.find((d) => d.id === Number(doctorId));

  const decodedHospital = decodeURIComponent(hospitalName || "");

  const hospital = doctor?.hospitals?.find(
    (h) => h.name.toLowerCase().trim() === decodedHospital.toLowerCase().trim(),
  );

  if (!doctor || !hospital) {
    return (
      <div
        style={{
          padding: isMobile ? 15 : 20,
        }}
      >
        <h2>Not Found</h2>

        <button onClick={() => navigate(-1)}>Go Back</button>
      </div>
    );
  }

  const handleBack = () => {
    calculateHesitation("back_click");

    trackBackClick();

    trackClick("back_button");

    trackInteraction("booking_back_clicked", {
      from: "BookingPage",
    });

    navigate(-1);
  };

  return (
    <div
      style={{
        background: "#ffffff",
        minHeight: "100vh",
        width: "100%",
        overflowX: "hidden",
      }}
    >
      <Navbar />

      <div
        style={{
          height: isMobile ? 10 : 20,
        }}
      />

      <BasicSearchForm />

      <div
        style={{
          display: "flex",

          flexDirection: isMobile ? "column" : "row",

          padding: isMobile ? "15px" : "20px",

          gap: isMobile ? 20 : 20,

          width: "100%",

          boxSizing: "border-box",

          alignItems: "stretch",
        }}
      >
        <div
          style={{
            width: isMobile ? "100%" : "30%",

            flexShrink: 0,

            boxSizing: "border-box",
          }}
        >
          <div
            onClick={() => {
              calculateHesitation("doctor_card");

              trackClick("doctor_card");

              trackInteraction("doctor_card_view", {
                doctor: doctor.name,
              });
            }}
            style={{
              background: "linear-gradient(135deg, #e0f2fe, #f8fafc)",

              padding: isMobile ? 16 : 20,

              borderRadius: 12,

              textAlign: "center",

              marginBottom: 20,

              boxShadow: "0 2px 8px rgba(0,0,0,0.05)",

              cursor: "pointer",

              width: "100%",

              boxSizing: "border-box",
            }}
          >
            <img
              src={doctor.image}
              alt={doctor.name}
              style={{
                width: isMobile ? 90 : 100,

                height: isMobile ? 90 : 100,

                borderRadius: "50%",

                objectFit: "cover",
              }}
            />

            <h3
              style={{
                margin: "12px 0 8px",

                fontSize: isMobile ? 20 : 22,
              }}
            >
              Dr. {doctor.name}
            </h3>

            <p
              style={{
                margin: "5px 0",
              }}
            >
              {doctor.gender}
            </p>

            <p
              style={{
                margin: "5px 0",
              }}
            >
              {doctor.specialization}
            </p>
          </div>

          <div
            style={{
              background: "linear-gradient(135deg, #e0f2fe, #f8fafc)",

              padding: isMobile ? 15 : 20,

              borderRadius: 12,

              boxShadow: "0 2px 8px rgba(0,0,0,0.05)",

              width: "100%",

              boxSizing: "border-box",
            }}
          >
            <h4
              style={{
                marginTop: 0,

                marginBottom: 15,

                fontSize: isMobile ? 18 : 20,
              }}
            >
              Available Hospitals
            </h4>

            {doctor.hospitals.map((h, i) => (
              <div
                key={i}
                onClick={() => {
                  calculateHesitation("hospital_switch");

                  trackClick("hospital_select");

                  trackInteraction("hospital_switch", {
                    from: hospital.name,

                    to: h.name,
                  });

                  navigate(
                    `/booking/${doctor.id}/${encodeURIComponent(h.name)}`,
                  );
                }}
                style={{
                  padding: isMobile ? 12 : 12,

                  borderRadius: 8,

                  marginBottom: 10,

                  cursor: "pointer",

                  background: h.name === hospital.name ? "#007bff" : "#f1f1f1",

                  color: h.name === hospital.name ? "white" : "black",

                  wordBreak: "break-word",

                  boxSizing: "border-box",
                }}
              >
                {h.name}
              </div>
            ))}
          </div>
        </div>

        <div
          style={{
            flex: 1,

            width: isMobile ? "100%" : "auto",

            minWidth: 0,

            boxSizing: "border-box",
          }}
        >
          <div
            style={{
              background: "#007bff",

              color: "white",

              padding: isMobile ? 12 : 14,

              borderRadius: 10,

              marginBottom: 20,

              width: "100%",

              boxSizing: "border-box",

              lineHeight: "1.5",
            }}
          >
            <b>{doctor.specialization}</b> — Sessions:{" "}
            {hospital.sessions.length}
          </div>

          <h3
            style={{
              fontSize: isMobile ? 20 : 22,

              marginBottom: 10,
            }}
          >
            Available Sessions
          </h3>

          {hospital.sessions.map((s, i) => (
            <div key={i}>
              <h4
                style={{
                  marginTop: 25,

                  marginBottom: 12,

                  fontSize: isMobile ? 17 : 18,
                }}
              >
                {new Date(s.date).toDateString()}
              </h4>

              <div
                style={{
                  display: "grid",

                  gridTemplateColumns: isMobile
                    ? "1fr"
                    : "1.5fr 1fr 1fr 1fr auto",

                  gap: isMobile ? 12 : 15,

                  alignItems: isMobile ? "stretch" : "center",

                  background: "linear-gradient(135deg, #e0f2fe, #f8fafc)",

                  padding: isMobile ? 15 : 18,

                  borderRadius: 12,

                  marginBottom: 10,

                  boxShadow: "0 2px 8px rgba(0,0,0,0.05)",

                  width: "100%",

                  boxSizing: "border-box",
                }}
              >
                <div>
                  <b>{hospital.name}</b>

                  <p
                    style={{
                      margin: 0,

                      fontSize: 13,

                      color: "#666",

                      marginTop: 4,

                      wordBreak: "break-word",
                    }}
                  >
                    {hospital.location}
                  </p>
                </div>

                <div>
                  <b>{s.time}</b>

                  <p
                    style={{
                      margin: 0,

                      fontSize: 12,

                      marginTop: 3,
                    }}
                  >
                    Session
                  </p>
                </div>

                <div>
                  <b>{s.patients}</b>

                  <p
                    style={{
                      margin: 0,

                      fontSize: 12,

                      marginTop: 3,
                    }}
                  >
                    Patients
                  </p>
                </div>

                <div>
                  <b>Rs {s.price.toLocaleString()}</b>

                  <p
                    style={{
                      margin: 0,

                      fontSize: 12,

                      marginTop: 3,
                    }}
                  >
                    + Booking Fee
                  </p>
                </div>

                <button
                  onClick={() => {
                    calculateHesitation("session_select");

                    trackClick("session_select");

                    trackInteraction("booking_started", {
                      doctorId: doctor.id,

                      hospital: hospital.name,

                      sessionIndex: i,
                    });

                    navigate(
                      `/booking-form/${doctor.id}/${encodeURIComponent(hospital.name)}/${i}`,
                    );
                  }}
                  style={{
                    background: "#28a745",

                    color: "white",

                    border: "none",

                    padding: "10px 16px",

                    borderRadius: 8,

                    cursor: "pointer",

                    width: isMobile ? "100%" : "auto",

                    boxSizing: "border-box",

                    fontWeight: "bold",
                  }}
                >
                  Available
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div
        style={{
          padding: isMobile ? "0 15px 20px" : "0 20px 25px",

          display: "flex",
          justifyContent: "flex-start",
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
  );
}

export default BookingPage;
