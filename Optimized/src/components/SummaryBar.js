
function SummaryBar({
  selectedSymptom,
  doctorPreference,
  locationMethod,
  location,
  onChangeSymptom,
  onChangeDoctorPreference,
  onChangeLocationMethod,
  onChangeLocation,
}) {
  const changeButtonStyle = {
    border: "none",
    background: "transparent",
    color: "#2563EB",
    fontSize: "12px",
    fontWeight: "600",
    cursor: "pointer",
    padding: "2px 4px",
  };

  return (
    <div
      style={{
        background: "#FFFFFF",
        border: "1px solid #E2E8F0",
        borderRadius: "16px",
        padding: "14px 20px",
        marginTop: "25px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "35px",
        flexWrap: "wrap",
      }}
    >

      {/* HEALTH PROBLEM */}
      {selectedSymptom && (
        <div>
          <div
            style={{
              fontSize: "11px",
              color: "#64748B",
              marginBottom: "4px",
            }}
          >
            Health Problem
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <span
              style={{
                fontWeight: "600",
                color: "#0F172A",
                fontSize: "14px",
              }}
            >
              {selectedSymptom.title ||
                selectedSymptom.name}
            </span>

            <button
              onClick={onChangeSymptom}
              style={changeButtonStyle}
            >
              Change
            </button>
          </div>
        </div>
      )}

      {/* DOCTOR PREFERENCE */}
      {doctorPreference && (
        <div>
          <div
            style={{
              fontSize: "11px",
              color: "#64748B",
              marginBottom: "4px",
            }}
          >
            Doctor Preference
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <span
              style={{
                fontWeight: "600",
                color: "#0F172A",
                fontSize: "14px",
              }}
            >
              {doctorPreference}
            </span>

            <button
              onClick={onChangeDoctorPreference}
              style={changeButtonStyle}
            >
              Change
            </button>
          </div>
        </div>
      )}

      {/* LOCATION METHOD */}
      {locationMethod && (
        <div>
          <div
            style={{
              fontSize: "11px",
              color: "#64748B",
              marginBottom: "4px",
            }}
          >
            Location Method
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <span
              style={{
                fontWeight: "600",
                color: "#0F172A",
                fontSize: "14px",
              }}
            >
              {locationMethod}
            </span>

            <button
              onClick={onChangeLocationMethod}
              style={changeButtonStyle}
            >
              Change
            </button>
          </div>
        </div>
      )}

      {/* CONFIRMED LOCATION */}
      {location && (
        <div>
          <div
            style={{
              fontSize: "11px",
              color: "#64748B",
              marginBottom: "4px",
            }}
          >
            Location
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <span
              style={{
                fontWeight: "600",
                color: "#2563EB",
                fontSize: "14px",
              }}
            >
              {location}
            </span>

            <button
              onClick={onChangeLocation}
              style={changeButtonStyle}
            >
              Change
            </button>
          </div>
        </div>
      )}

    </div>
  );
}

export default SummaryBar;

