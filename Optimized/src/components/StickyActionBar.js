import { useNavigate } from "react-router-dom";

import useIsMobile from "../hooks/useIsMobile";

function StickyActionBar({
  selected
}) {

  const navigate = useNavigate();

  const isMobile = useIsMobile();

  if (!selected) return null;

  return (

    <div
      style={{
        position: "fixed",

        bottom: 0,

        left: 0,

        right: 0,

        background: "#FFFFFF",

        padding: isMobile
          ? "12px 16px"
          : "16px 40px",

        boxShadow:
          "0 -4px 15px rgba(0,0,0,0.08)",

        display: "flex",

        flexDirection: isMobile
          ? "column"
          : "row",

        justifyContent:
          "space-between",

        alignItems: isMobile
          ? "stretch"
          : "center",

        gap: isMobile
          ? "10px"
          : "20px",

        zIndex: 1000
      }}
    >

      {/* SELECTED */}

      <div
        style={{
          color: "#6B7280",

          fontSize: isMobile
            ? "12px"
            : "13px",

          display: "flex",

          alignItems: isMobile
            ? "flex-start"
            : "center",

          gap: "6px",

          flexDirection: isMobile
            ? "column"
            : "row"
        }}
      >

        <span>
          Selected
        </span>

        <strong
          style={{
            color: "#0F172A",

            fontSize: isMobile
              ? "14px"
              : "15px"
          }}
        >
          {selected.title || selected}
        </strong>

      </div>


      {/* CONTINUE BUTTON */}

      <button
        onClick={() =>
          navigate(
            "/dr-preference",
            {
              state: {
                symptomId:
                  selected.id
              }
            }
          )
        }
        style={{
          background: "#2563EB",

          color: "#FFFFFF",

          border: "none",

          padding: isMobile
            ? "12px 20px"
            : "14px 28px",

          borderRadius: "12px",

          fontWeight: 600,

          fontSize: isMobile
            ? "14px"
            : "15px",

          cursor: "pointer",

          width: isMobile
            ? "100%"
            : "auto"
        }}
      >
        Continue →
      </button>

    </div>

  );
}

export default StickyActionBar;