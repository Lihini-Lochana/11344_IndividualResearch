import { FaCheckCircle } from "react-icons/fa";
import useIsMobile from "../hooks/useIsMobile";

function SymptomCard({
  symptom,
  selected,
  onClick
}) {
  const Icon = symptom.icon;
  const isMobile = useIsMobile();

  return (
    <div
      onClick={onClick}
      style={{
        background: selected
          ? "#EFF6FF"
          : "#FFFFFF",

        border: selected
          ? "2px solid #2563EB"
          : "1px solid #E5E7EB",

        borderRadius: isMobile
          ? "16px"
          : "20px",

        padding: isMobile
          ? "18px"
          : "24px",

        minHeight: isMobile
          ? "130px"
          : "160px",

        boxSizing: "border-box",

        cursor: "pointer",

        position: "relative",

        transition:
          "all 0.25s ease",

        boxShadow:
          "0 4px 12px rgba(0,0,0,0.06)"
      }}
    >

      {/* SELECTED ICON */}

      {selected && (
        <FaCheckCircle
          style={{
            position: "absolute",

            top: isMobile
              ? "12px"
              : "16px",

            right: isMobile
              ? "12px"
              : "16px",

            color: "#2563EB",

            fontSize: isMobile
              ? "18px"
              : "20px"
          }}
        />
      )}

      {/* SYMPTOM ICON */}

      <Icon
        style={{
          fontSize: isMobile
            ? "30px"
            : "34px",

          color: selected
            ? "#2563EB"
            : symptom.color,

          marginBottom: isMobile
            ? "12px"
            : "18px"
        }}
      />

      {/* TITLE */}

      <h3
        style={{
          margin: 0,
          marginBottom: "8px",

          fontSize: isMobile
            ? "16px"
            : "18px",

          color: "#0F172A"
        }}
      >
        {symptom.title}
      </h3>

      {/* DESCRIPTION */}

      <p
        style={{
          margin: 0,

          color: "#6B7280",

          fontSize: isMobile
            ? "13px"
            : "14px",

          lineHeight: "20px"
        }}
      >
        {symptom.description}
      </p>

    </div>
  );
}

export default SymptomCard;