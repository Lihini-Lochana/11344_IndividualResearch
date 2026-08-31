import BookingCard from "./BookingCard";

import {
  FaCheckCircle
} from "react-icons/fa";

import useIsMobile from "../hooks/useIsMobile";

function HeroSection() {

  const isMobile = useIsMobile();

  return (

    <section
      style={{
        padding: isMobile
          ? "35px 20px"
          : "60px",

        display: "grid",

        gridTemplateColumns: isMobile
          ? "1fr"
          : "40% 60%",

        gap: isMobile
          ? "35px"
          : "50px",

        alignItems: "center",

        maxWidth: "1400px",

        margin: "0 auto",

        boxSizing: "border-box",

        width: "100%"
      }}
    >

      {/* ========================= */}
      {/* LEFT SIDE */}
      {/* ========================= */}

      <div
        style={{
          width: "100%",
          minWidth: 0
        }}
      >

        {/* MAIN HEADING */}

        <h1
          style={{
            fontSize: isMobile
              ? "36px"
              : "56px",

            lineHeight: isMobile
              ? "44px"
              : "64px",

            fontWeight: "800",

            marginTop: 0,

            marginBottom: "20px",

            color: "#0F172A"
          }}
        >

          Find the Right Doctor{" "}

          <span
            style={{
              color: "#2563EB"
            }}
          >
            Without the Confusion
          </span>

        </h1>


        {/* DESCRIPTION */}

        <p
          style={{
            fontSize: isMobile
              ? "14px"
              : "16px",

            lineHeight: isMobile
              ? "22px"
              : "26px",

            color: "#64748B",

            margin: 0
          }}
        >
          We help you find and book medical
        </p>

        <p
          style={{
            fontSize: isMobile
              ? "14px"
              : "16px",

            lineHeight: isMobile
              ? "22px"
              : "26px",

            color: "#64748B",

            margin: 0
          }}
        >
          appointments through a simple guided
          process.
        </p>


        {/* ========================= */}
        {/* TRUST CARDS */}
        {/* ========================= */}

        <div
          style={{
            marginTop: "40px",

            display: "flex",

            flexDirection: "column",

            gap: "14px",

            width: "100%"
          }}
        >

          {/* ========================= */}
          {/* TRUST CARD 1 */}
          {/* ========================= */}

          <div
            style={{
              display: "flex",

              alignItems: "center",

              gap: "12px",

              background: "#FFFFFF",

              border: "1px solid #E2E8F0",

              borderRadius: "12px",

              padding: isMobile
                ? "12px 14px"
                : "12px 16px",

              boxShadow:
                "0 4px 12px rgba(15,23,42,0.04)",

              width: "100%",

              boxSizing: "border-box"
            }}
          >

            <div
              style={{
                width: "32px",

                height: "32px",

                minWidth: "32px",

                borderRadius: "10px",

                background: "#DBEAFE",

                display: "flex",

                justifyContent: "center",

                alignItems: "center"
              }}
            >

              <FaCheckCircle
                color="#2563EB"
                size={16}
              />

            </div>


            {/* TEXT */}

            <div
              style={{
                display: "flex",

                flexDirection: "column",

                minWidth: 0
              }}
            >

              {/* TEXT */}

            <span
                style={{
                  fontWeight: "600",

                  color: "#0F172A",

                  fontSize: isMobile
                    ? "13px"
                    : "14px"
                }}
              >
                Trusted Hospitals
              </span>

            <span
              style={{
                fontSize: "12px",

                color: "#94A3B8",

                marginTop: "4px"
              }}
            >
              500+ accredited partner hospitals
            </span>

            </div>

          </div>


          {/* ========================= */}
          {/* TRUST CARD 2 */}
          {/* ========================= */}

          <div
            style={{
              display: "flex",

              alignItems: "center",

              gap: "12px",

              background: "#FFFFFF",

              border: "1px solid #E2E8F0",

              borderRadius: "12px",

              padding: isMobile
                ? "12px 14px"
                : "12px 16px",

              boxShadow:
                "0 4px 12px rgba(15,23,42,0.04)",

              width: "100%",

              boxSizing: "border-box"
            }}
          >

            {/* ICON */}

            <div
              style={{
                width: "32px",

                height: "32px",

                minWidth: "32px",

                borderRadius: "10px",

                background: "#DBEAFE",

                display: "flex",

                justifyContent: "center",

                alignItems: "center"
              }}
            >

              <FaCheckCircle
                color="#2563EB"
                size={16}
              />

            </div>


            {/* TEXT */}

            <div
              style={{
                display: "flex",

                flexDirection: "column",

                minWidth: 0
              }}
            >

              {/* TEXT */}

            <span
                style={{
                  fontWeight: "600",

                  color: "#0F172A",

                  fontSize: isMobile
                    ? "13px"
                    : "14px"
                }}
              >
                Verified Doctors
              </span>

            <span
              style={{
                fontSize: "12px",

                color: "#94A3B8",

                marginTop: "4px"
              }}
            >
              10,000+ licensed specialists
            </span>

            </div>

          </div>


          {/* ========================= */}
          {/* TRUST CARD 3 */}
          {/* ========================= */}

          <div
            style={{
              display: "flex",

              alignItems: "center",

              gap: "12px",

              background: "#FFFFFF",

              border: "1px solid #E2E8F0",

              borderRadius: "12px",

              padding: isMobile
                ? "12px 14px"
                : "12px 16px",

              boxShadow:
                "0 4px 12px rgba(15,23,42,0.04)",

              width: "100%",

              boxSizing: "border-box"
            }}
          >

            {/* ICON */}

            <div
              style={{
                width: "32px",

                height: "32px",

                minWidth: "32px",

                borderRadius: "10px",

                background: "#DBEAFE",

                display: "flex",

                justifyContent: "center",

                alignItems: "center"
              }}
            >

              <FaCheckCircle
                color="#2563EB"
                size={16}
              />

            </div>


            {/* TEXT */}

            <div
              style={{
                display: "flex",

                flexDirection: "column",

                minWidth: 0
              }}
            >

              <span
                style={{
                  fontWeight: "600",

                  color: "#0F172A",

                  fontSize: isMobile
                    ? "13px"
                    : "14px"
                }}
              >
                Easy Appointment Booking
              </span>


              <span
                style={{
                  fontSize: "12px",

                  color: "#94A3B8",

                  marginTop: "4px"
                }}
              >
                Book in under 3 minutes
              </span>

            </div>

          </div>

        </div>

      </div>


      {/* ========================= */}
      {/* RIGHT SIDE */}
      {/* ========================= */}

      <div
        style={{
          width: "100%",

          minWidth: 0,

          boxSizing: "border-box"
        }}
      >

        <BookingCard />

      </div>

    </section>

  );
}

export default HeroSection;