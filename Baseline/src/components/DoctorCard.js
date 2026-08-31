import { useNavigate } from "react-router-dom";
import useIsMobile from "../hooks/useIsMobile";

function DoctorCard({ doctor, onSelectDoctor, isSelected }) {
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  return (
    <div
      onClick={() => {
        if (onSelectDoctor) {
          onSelectDoctor(doctor);
        }
      }}
      style={{
        background: "white",

        borderRadius: isMobile ? 10 : 12,

        padding: isMobile ? 12 : 15,

        textAlign: "center",

        cursor: "pointer",

        border: isSelected ? "2px solid #c3dcf7" : "1px solid #ddd",

        transition: "0.2s",

        width: "100%",

        boxSizing: "border-box",

        minWidth: 0,
      }}
    >
      <img
        src={doctor.image}
        alt={doctor.name}
        style={{
          width: isMobile ? 60 : 70,

          height: isMobile ? 60 : 70,

          borderRadius: "50%",

          marginBottom: isMobile ? 6 : 8,

          objectFit: "cover",
        }}
      />

      <p
        style={{
          margin: 0,

          color: "#777",

          fontSize: isMobile ? 11 : 12,

          lineHeight: 1.4,
        }}
      >
        {doctor.gender}
      </p>

      <h4
        style={{
          margin: "5px 0",

          fontSize: isMobile ? 14 : 16,

          lineHeight: 1.3,

          wordBreak: "break-word",
        }}
      >
        Dr. {doctor.name}
      </h4>

      <p
        style={{
          fontSize: isMobile ? 11 : 12,

          color: "#555",

          marginBottom: isMobile ? 8 : 10,

          lineHeight: 1.4,

          wordBreak: "break-word",
        }}
      >
        {doctor.specialization}
      </p>

      <button
        onClick={(e) => {
          e.stopPropagation();

          navigate(`/doctor/${doctor.id}`);
        }}
        style={{
          marginTop: isMobile ? 6 : 8,

          width: "100%",

          height: isMobile ? 34 : 32,

          background: "linear-gradient(135deg, #9bd5fb, #f8fafc)",

          color: "#333",

          border: "none",

          borderRadius: 6,

          fontSize: isMobile ? 11 : 12,

          cursor: "pointer",

          padding: "0 6px",

          boxSizing: "border-box",
        }}
      >
        View Profile
      </button>
    </div>
  );
}

export default DoctorCard;
