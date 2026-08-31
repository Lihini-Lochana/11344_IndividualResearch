import { FaInfoCircle } from "react-icons/fa";

import useIsMobile from "../hooks/useIsMobile";

function GuidanceCard() {

  const isMobile = useIsMobile();

  return (

    <div
      style={{
        background: "#EFF6FF",

        border: "1px solid #BFDBFE",

        padding: isMobile
          ? "14px"
          : "18px",

        borderRadius: isMobile
          ? "12px"
          : "14px",

        display: "flex",

        alignItems: "flex-start",

        gap: "12px",

        marginTop: isMobile
          ? "25px"
          : "30px",

        color: "#1E40AF",

        fontSize: isMobile
          ? "13px"
          : "14px",

        lineHeight: "20px"
      }}
    >

      <FaInfoCircle
        style={{
          flexShrink: 0,
          marginTop: "2px",
          fontSize: isMobile
            ? "16px"
            : "18px"
        }}
      />

      <span>
        Don't worry if you're not sure.
        Choose the closest option and
        we'll guide you to the right
        doctor.
      </span>

    </div>

  );
}

export default GuidanceCard;