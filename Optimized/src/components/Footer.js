import useIsMobile from "../hooks/useIsMobile";

function Footer() {
const isMobile = useIsMobile();

return (
<footer
style={{
backgroundColor: "#0f172a",
color: "white",
padding: isMobile
? "40px 20px 20px"
: "50px 60px 20px",
marginTop: isMobile ? "35px" : "50px",
}}
>
{/* TOP SECTION */}

  <div
    style={{
      display: "flex",
      justifyContent: isMobile
        ? "flex-start"
        : "space-between",
      flexDirection: isMobile
        ? "column"
        : "row",
      flexWrap: "wrap",
      gap: isMobile ? "30px" : "40px",
      marginBottom: isMobile ? "30px" : "40px",
    }}
  >
    {/* COMPANY INFO */}

    <div
      style={{
        maxWidth: isMobile
          ? "100%"
          : "300px",
      }}
    >
      <h2
        style={{
          margin: "0 0 15px 0",
          color: "#38bdf8",
          fontSize: isMobile
            ? "22px"
            : "24px",
        }}
      >
        eMediCare
      </h2>

      <p
        style={{
          lineHeight: "1.8",
          color: "#cbd5e1",
          fontSize: isMobile
            ? "14px"
            : "15px",
          margin: 0,
        }}
      >
        eMediCare is a modern online doctor
        appointment and channeling platform
        helping patients easily search doctors,
        hospitals, and book appointments
        conveniently from anywhere.
      </p>
    </div>

    {/* QUICK LINKS */}

    <div>
      <h3
        style={{
          margin: "0 0 15px 0",
          fontSize: isMobile
            ? "17px"
            : "18px",
        }}
      >
        Quick Links
      </h3>

      <p style={linkStyle(isMobile)}>Home</p>
      <p style={linkStyle(isMobile)}>Doctors</p>
      <p style={linkStyle(isMobile)}>Hospitals</p>
      <p style={linkStyle(isMobile)}>Channeling</p>
      <p style={linkStyle(isMobile)}>Contact Us</p>
    </div>

    {/* SUPPORT */}

    <div>
      <h3
        style={{
          margin: "0 0 15px 0",
          fontSize: isMobile
            ? "17px"
            : "18px",
        }}
      >
        Support
      </h3>

      <p style={linkStyle(isMobile)}>
        Terms & Conditions
      </p>

      <p style={linkStyle(isMobile)}>
        Privacy Policy
      </p>

      <p style={linkStyle(isMobile)}>
        FAQ
      </p>

      <p style={linkStyle(isMobile)}>
        Help Center
      </p>

      <p style={linkStyle(isMobile)}>
        Feedback
      </p>
    </div>

    {/* CONTACT */}

    <div>
      <h3
        style={{
          margin: "0 0 15px 0",
          fontSize: isMobile
            ? "17px"
            : "18px",
        }}
      >
        Contact
      </h3>

      <p style={contactStyle(isMobile)}>
        No. 25, Main Street,
        <br />
        Colombo 03,
        <br />
        Sri Lanka
      </p>

      <p style={contactStyle(isMobile)}>
        +94 11 234 5678
      </p>

      <p style={contactStyle(isMobile)}>
        support@emedicare.lk
      </p>

      <p style={contactStyle(isMobile)}>
        Open: 24/7 Service
      </p>
    </div>
  </div>

  {/* BOTTOM SECTION */}

  <div
    style={{
      borderTop:
        "1px solid #334155",
      paddingTop: isMobile
        ? "16px"
        : "20px",
      textAlign: "center",
      color: "#94a3b8",
      fontSize: isMobile
        ? "12px"
        : "14px",
      lineHeight: "1.5",
    }}
  >
    © 2026 eMediCare. All Rights Reserved.
  </div>
</footer>


);
}

/* ---------------- STYLES ---------------- */

const linkStyle = (isMobile) => ({
color: "#cbd5e1",
margin: "0 0 10px 0",
cursor: "pointer",
fontSize: isMobile ? "14px" : "15px",
});

const contactStyle = (isMobile) => ({
color: "#cbd5e1",
margin: "0 0 10px 0",
lineHeight: "1.6",
fontSize: isMobile ? "14px" : "15px",
});

export default Footer;
