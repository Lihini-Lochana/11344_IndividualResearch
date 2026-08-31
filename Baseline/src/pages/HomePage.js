import { useContext, useEffect } from "react";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

import heroImage from "../assets/img.jpg";

import BasicSearchForm from "../components/BasicSearchForm";
import AdvancedSearchForm from "../components/AdvancedSearchForm";

import { TrackingContext } from "../context/TrackingContext";

import useIsMobile from "../hooks/useIsMobile";

function HomePage() {
  const isMobile = useIsMobile();

  const { trackPageVisit, trackClick } = useContext(TrackingContext);

  useEffect(() => {
    trackPageVisit("HomePage");
  }, []);

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
          height: isMobile ? "15px" : "30px",
        }}
      />

      <div
        onClick={() => trackClick("hero_section_clicked")}
        style={{
          position: "relative",
          width: "100%",

          height: isMobile ? "300px" : "420px",

          overflow: "hidden",
          cursor: "pointer",
        }}
      >
        <img
          src={heroImage}
          alt="Hospital"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />

        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "rgba(30, 41, 59, 0.30)",
          }}
        />

        <div
          style={{
            position: "absolute",

            top: "50%",

            left: isMobile ? "25px" : "80px",

            right: isMobile ? "25px" : "auto",

            transform: "translateY(-50%)",

            textAlign: "left",

            color: "white",

            maxWidth: isMobile ? "100%" : "600px",
          }}
        >
          <h1
            style={{
              fontSize: isMobile ? "30px" : "48px",

              lineHeight: isMobile ? "1.2" : "1.15",

              marginBottom: isMobile ? "12px" : "15px",

              fontWeight: "700",
            }}
          >
            Find and Book Doctors Easily
          </h1>

          <p
            style={{
              fontSize: isMobile ? "16px" : "20px",

              lineHeight: isMobile ? "1.5" : "1.6",

              margin: 0,

              maxWidth: isMobile ? "100%" : "550px",
            }}
          >
            Search doctors, hospitals, specialties, and channel appointments
            online quickly and conveniently.
          </p>
        </div>
      </div>

      <div
        style={{
          padding: isMobile ? "20px 15px" : "30px",

          width: "100%",
          boxSizing: "border-box",
        }}
      >
        <BasicSearchForm />

        <h2
          style={{
            marginTop: isMobile ? "30px" : "40px",

            marginBottom: isMobile ? "20px" : "25px",

            textAlign: "center",

            fontSize: isMobile ? "24px" : "28px",

            lineHeight: "1.3",

            color: "#1e293b",
          }}
        >
          Advanced Search
        </h2>

        <AdvancedSearchForm />
      </div>

      <Footer />
    </div>
  );
}

export default HomePage;
