import {
  FaCheckCircle
} from "react-icons/fa";

function PreferenceCard({
  icon,
  title,
  description,
  selected,
  onClick
}) {
  return (
    <div
      onClick={onClick}
      style={{
        width:"300px",
        height:"220px",

        background:
          selected
          ? "#EFF6FF"
          : "#FFFFFF",

        border:
          selected
          ? "2px solid #2563EB"
          : "1px solid #E5E7EB",

        borderRadius:"20px",

        padding:"32px",

        cursor:"pointer",

        position:"relative",

        transition:"0.3s",

        boxShadow:
          selected
          ? "0 10px 25px rgba(37,99,235,.15)"
          : "0 4px 12px rgba(0,0,0,.05)"
      }}
    >
      {selected && (
        <FaCheckCircle
          style={{
            position:"absolute",
            top:"16px",
            right:"16px",
            color:"#2563EB"
          }}
        />
      )}

      <div
        style={{
          fontSize:"50px",
          color:"#2563EB",
          marginBottom:"20px"
        }}
      >
        {icon}
      </div>

      <h3>{title}</h3>

      <p
        style={{
          color:"#64748B",
          marginTop:"10px"
        }}
      >
        {description}
      </p>
    </div>
  );
}

export default PreferenceCard;