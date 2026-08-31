import useIsMobile from "../hooks/useIsMobile";

function Footer() {
  const isMobile = useIsMobile();

  return (
    <footer
      style={{
        backgroundColor: "#0f172a",

        color: "white",

        padding: isMobile ? "35px 20px 18px" : "50px 60px 20px",

        marginTop: isMobile ? "30px" : "50px",

        boxSizing: "border-box",

        width: "100%",
      }}
    >
      <div
        style={{
          display: "flex",

          justifyContent: isMobile ? "flex-start" : "space-between",

          flexDirection: isMobile ? "column" : "row",

          flexWrap: "wrap",

          gap: isMobile ? "25px" : "40px",

          marginBottom: isMobile ? "30px" : "40px",
        }}
      >
        <div
          style={{
            maxWidth: isMobile ? "100%" : "300px",

            width: isMobile ? "100%" : "auto",
          }}
        >
          <h2
            style={{
              marginBottom: "15px",

              color: "#38bdf8",

              fontSize: isMobile ? "22px" : "28px",
            }}
          >
            eMediCare
          </h2>

          <p
            style={{
              lineHeight: isMobile ? "1.7" : "1.8",

              color: "#cbd5e1",

              fontSize: isMobile ? "14px" : "16px",

              margin: 0,
            }}
          >
            eMediCare is a modern online doctor appointment and channeling
            platform helping patients easily search doctors, hospitals, and book
            appointments conveniently from anywhere.
          </p>
        </div>

        <div
          style={{
            width: isMobile ? "100%" : "auto",
          }}
        >
          <h3
            style={{
              marginBottom: "15px",

              fontSize: isMobile ? "17px" : "20px",
            }}
          >
            Quick Links
          </h3>

          <p style={linkStyle}>Home</p>

          <p style={linkStyle}>Doctors</p>

          <p style={linkStyle}>Hospitals</p>

          <p style={linkStyle}>Channeling</p>

          <p style={linkStyle}>Contact Us</p>
        </div>

        <div
          style={{
            width: isMobile ? "100%" : "auto",
          }}
        >
          <h3
            style={{
              marginBottom: "15px",

              fontSize: isMobile ? "17px" : "20px",
            }}
          >
            Support
          </h3>

          <p style={linkStyle}>Terms & Conditions</p>

          <p style={linkStyle}>Privacy Policy</p>

          <p style={linkStyle}>FAQ</p>

          <p style={linkStyle}>Help Center</p>

          <p style={linkStyle}>Feedback</p>
        </div>

        <div
          style={{
            width: isMobile ? "100%" : "auto",
          }}
        >
          <h3
            style={{
              marginBottom: "15px",

              fontSize: isMobile ? "17px" : "20px",
            }}
          >
            Contact
          </h3>

          <p style={contactStyle}>No. 25, Main Street, Colombo 03, Sri Lanka</p>

          <p style={contactStyle}>+94 11 234 5678</p>

          <p style={contactStyle}>support@emedicare.lk</p>

          <p style={contactStyle}>Open: 24/7 Service</p>
        </div>
      </div>

      <div
        style={{
          borderTop: "1px solid #334155",

          paddingTop: isMobile ? "15px" : "20px",

          textAlign: "center",

          color: "#94a3b8",

          fontSize: isMobile ? "12px" : "14px",

          lineHeight: 1.5,
        }}
      >
        © 2026 eMediCare. All Rights Reserved.
      </div>
    </footer>
  );
}

const linkStyle = {
  color: "#cbd5e1",
  marginBottom: "10px",
  cursor: "pointer",
  fontSize: "14px",
  lineHeight: "1.5",
};

const contactStyle = {
  color: "#cbd5e1",
  marginBottom: "10px",
  lineHeight: "1.6",
  fontSize: "14px",
};

export default Footer;
