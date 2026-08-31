import {
  FaInfoCircle
} from "react-icons/fa";

function GuidancePanel() {
  return (
    <div
      style={{
        marginTop:"40px",

        background:"#EFF6FF",

        border:"1px solid #BFDBFE",

        borderRadius:"16px",

        padding:"20px",

        color:"#1E40AF"
      }}
    >
      <FaInfoCircle />

      {" "}

      If you do not have a preference,
      choosing "No Preference"
      may provide more appointment options.
    </div>
  );
}

export default GuidancePanel;