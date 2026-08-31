
import { FaHeartbeat } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

import useIsMobile from "../hooks/useIsMobile";

function Header() {
  const isMobile = useIsMobile();
  const navigate = useNavigate();

  const handleSignIn = () => {
    navigate("/tracking");
  };

  return (
    <header
      style={{
        height: isMobile ? "65px" : "72px",
        background: "#FFFFFF",
        borderBottom: "1px solid #E2E8F0",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: isMobile ? "0 20px" : "0 50px",
        gap: isMobile ? "15px" : "30px",
      }}
    >
      {/* Logo */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: isMobile ? "6px" : "10px",
          flexShrink: 0,
        }}
      >
        <FaHeartbeat
          style={{
            color: "#38bdf8",
            fontSize: isMobile ? "22px" : "26px",
          }}
        />

        <h2
          style={{
            margin: 0,
            color: "#38bdf8",
            fontSize: isMobile ? "19px" : "24px",
            whiteSpace: "nowrap",
          }}
        >
          eMediCare
        </h2>
      </div>

      {/* Navigation */}
      <nav
        style={{
          display: "flex",
          alignItems: "center",
          gap: isMobile ? "12px" : "30px",
          flex: 1,
          justifyContent: "flex-end",
        }}
      >
        <a
          href="/"
          style={{
            color: "black",
            textDecoration: "none",
            fontWeight: "400",
            fontSize: isMobile ? "13px" : "15px",
            whiteSpace: "nowrap",
          }}
        >
          Home
        </a>

        <a
          href="/about"
          style={{
            color: "black",
            textDecoration: "none",
            fontWeight: "400",
            fontSize: isMobile ? "13px" : "15px",
            whiteSpace: "nowrap",
          }}
        >
          About Us
        </a>

        <a
          href="/help"
          style={{
            color: "black",
            textDecoration: "none",
            fontWeight: "400",
            fontSize: isMobile ? "13px" : "15px",
            whiteSpace: "nowrap",
          }}
        >
          Help?
        </a>

        <button
          onClick={handleSignIn}
          style={{
            backgroundColor: "#2563EB",
            color: "#ffffff",
            border: "none",
            padding: isMobile ? "7px 12px" : "8px 18px",
            borderRadius: "6px",
            cursor: "pointer",
            fontWeight: "700",
            fontSize: isMobile ? "12px" : "14px",
            whiteSpace: "nowrap",
          }}
        >
          Sign In
        </button>
      </nav>
    </header>
  );
}

export default Header;

