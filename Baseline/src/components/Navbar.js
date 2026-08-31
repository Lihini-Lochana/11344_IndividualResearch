import useIsMobile from "../hooks/useIsMobile";
import { useNavigate } from "react-router-dom";

function Navbar() {
  const isMobile = useIsMobile();
  const navigate = useNavigate();

  const handleSignIn = () => {
    navigate("/tracking");
  };

  return (
    <nav
      style={{
        backgroundColor: "#0f172a",

        padding: isMobile ? "12px 15px" : "15px 40px",

        display: "flex",

        justifyContent: "space-between",

        alignItems: "center",

        gap: isMobile ? 10 : 20,

        boxSizing: "border-box",

        width: "100%",
      }}
    >
      <div
        style={{
          color: "#38bdf8",

          fontSize: isMobile ? 18 : 24,

          fontWeight: "bold",

          whiteSpace: "nowrap",

          flexShrink: 0,
        }}
      >
        eMediCare
      </div>

      <div
        style={{
          display: "flex",

          alignItems: "center",

          gap: isMobile ? 10 : 25,

          flexWrap: "nowrap",

          minWidth: 0,
        }}
      >
        <a
          href="/"
          style={{
            color: "white",

            textDecoration: "none",

            fontWeight: "500",

            fontSize: isMobile ? 12 : 16,

            whiteSpace: "nowrap",
          }}
        >
          Home
        </a>

        <a
          href="/about"
          style={{
            color: "white",

            textDecoration: "none",

            fontWeight: "500",

            fontSize: isMobile ? 12 : 16,

            whiteSpace: "nowrap",
          }}
        >
          About Us
        </a>

        <a
          href="/contact"
          style={{
            color: "white",

            textDecoration: "none",

            fontWeight: "500",

            fontSize: isMobile ? 12 : 16,

            whiteSpace: "nowrap",
          }}
        >
          Contact Us
        </a>

        <button
          onClick={handleSignIn}
          style={{
            backgroundColor: "white",

            color: "#0077b6",

            border: "none",

            padding: isMobile ? "6px 10px" : "8px 18px",

            borderRadius: 6,

            cursor: "pointer",

            fontWeight: "600",

            fontSize: isMobile ? 11 : 14,

            whiteSpace: "nowrap",

            flexShrink: 0,
          }}
        >
          Sign In
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
