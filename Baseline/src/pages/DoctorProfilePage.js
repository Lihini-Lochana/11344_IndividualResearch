import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useContext, useRef } from "react";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import BasicSearchForm from "../components/BasicSearchForm";

import doctors from "../data/doctors";
import { TrackingContext } from "../context/TrackingContext";

import useIsMobile from "../hooks/useIsMobile";

function DoctorProfilePage() {
  const { id } = useParams();

  const isMobile = useIsMobile();

  const navigate = useNavigate();

  const {
    trackPageVisit,
    trackClick,
    trackInteraction,
    trackHesitation,
    trackBackClick,
  } = useContext(TrackingContext);

  const doctor = doctors.find((d) => d.id === Number(id));

  const interactionStartTime = useRef(Date.now());

  const calculateHesitation = (action = "unknown") => {
    const hesitationTime = (Date.now() - interactionStartTime.current) / 1000;

    if (hesitationTime > 5) {
      trackHesitation(Number(hesitationTime.toFixed(2)));
    }

    interactionStartTime.current = Date.now();

    trackInteraction("doctor_profile_hesitation_checkpoint", {
      action,
      hesitationTime: Number(hesitationTime.toFixed(2)),
    });
  };

  useEffect(() => {
    trackPageVisit("DoctorProfilePage");

    trackInteraction("doctor_profile_view", {
      doctorId: id,
    });

    interactionStartTime.current = Date.now();
  }, [id, trackPageVisit, trackInteraction]);

  if (!doctor) {
    return (
      <p
        style={{
          padding: 20,
        }}
      >
        Doctor not found
      </p>
    );
  }

  const handleImageClick = () => {
    calculateHesitation("doctor_image_click");

    trackClick("doctor_profile_image", "DoctorProfilePage");

    trackInteraction("doctor_image_clicked", {
      doctorId: doctor.id,
      doctorName: doctor.name,
    });
  };

  const handleInfoClick = (field) => {
    calculateHesitation(`info_${field}`);

    trackClick("doctor_info_section");

    trackInteraction("doctor_info_clicked", {
      field,
    });
  };

  const handleBookIntent = () => {
    calculateHesitation("book_button");

    trackClick("doctor_profile_book_intent");

    trackInteraction("doctor_book_intent", {
      doctorId: doctor.id,
    });
  };

  const handleBack = () => {
    calculateHesitation("back_click");

    trackBackClick();

    trackClick("back_button");

    trackInteraction("doctor_profile_back_clicked", {
      from: "DoctorProfilePage",
    });

    navigate(-1);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        background: "white",
      }}
    >
      <Navbar />

      <br />

      <div
        style={{
          padding: isMobile ? "0 10px" : "0 20px",
        }}
      >
        <BasicSearchForm />
      </div>

      <div
        style={{
          flex: 1,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",

          padding: isMobile ? "20px 12px 40px" : "30px 20px 50px",

          boxSizing: "border-box",
        }}
      >
        <div
          style={{
            width: "100%",

            maxWidth: isMobile ? 380 : 420,

            background: "white",

            borderRadius: isMobile ? 16 : 20,

            padding: isMobile ? 20 : 30,

            textAlign: "center",

            boxShadow: "0 20px 50px rgba(0,0,0,0.15)",

            boxSizing: "border-box",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginBottom: isMobile ? 15 : 20,
            }}
          >
            <img
              src={doctor.image}
              alt={doctor.name}
              onClick={handleImageClick}
              style={{
                width: isMobile ? 110 : 140,

                height: isMobile ? 110 : 140,

                borderRadius: "50%",

                objectFit: "cover",

                cursor: "pointer",

                border: isMobile ? "3px solid #2563eb" : "4px solid #2563eb",
              }}
            />
          </div>

          <h2
            onClick={() => handleInfoClick("name")}
            style={{
              margin: isMobile ? "8px 0" : "10px 0",

              cursor: "pointer",

              fontSize: isMobile ? 22 : 28,

              lineHeight: 1.3,

              wordBreak: "break-word",
            }}
          >
            Dr. {doctor.name}
          </h2>

          <div
            style={{
              display: "inline-block",

              padding: isMobile ? "5px 10px" : "6px 12px",

              background: "#e0f2fe",

              color: "#0369a1",

              borderRadius: 20,

              fontSize: isMobile ? 12 : 13,

              marginBottom: 8,

              maxWidth: "100%",

              boxSizing: "border-box",
            }}
            onClick={() => handleInfoClick("specialization")}
          >
            {doctor.specialization}
          </div>

          <p
            onClick={() => handleInfoClick("gender")}
            style={{
              color: "#64748b",
              cursor: "pointer",

              marginTop: 8,
              marginBottom: 0,

              fontSize: isMobile ? 14 : 16,
            }}
          >
            {doctor.gender}
          </p>

          <div
            style={{
              marginTop: isMobile ? 16 : 20,

              padding: isMobile ? 12 : 15,

              background: "linear-gradient(135deg, #e0f2fe, #f8fafc)",

              borderRadius: 12,

              fontSize: isMobile ? 13 : 14,

              lineHeight: 1.6,

              color: "#475569",

              cursor: "pointer",

              boxSizing: "border-box",
            }}
            onClick={() => {
              calculateHesitation("info_box");

              trackInteraction("doctor_profile_info_box");
            }}
          >
            Experienced consultant with years of practice in high-quality
            patient care.
          </div>
        </div>
      </div>

      <div
        style={{
          padding: isMobile ? "0 12px 20px" : "0 20px 25px",

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
  );
}

export default DoctorProfilePage;
