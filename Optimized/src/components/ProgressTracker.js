function ProgressTracker({
currentStep,
steps,
}) {
return (
<div
style={{
width: "100%",
maxWidth: "900px",
margin: "0 auto 40px auto",
padding: "0 5px",
boxSizing: "border-box",
}}
>
{/* PROGRESS AREA */}

  <div
    style={{
      position: "relative",
      width: "100%",
    }}
  >
    {/* CONNECTOR LINES */}

    <div
      style={{
        position: "absolute",
        top: "15px",
        left: "10%",
        width: "80%",
        height: "2px",
        background: "#D1D5DB",
        zIndex: 0,
      }}
    />

    {/* COMPLETED CONNECTOR LINES */}

    {steps.slice(0, -1).map((step, index) => {
      if (index >= currentStep) {
        return null;
      }

      return (
        <div
          key={`completed-${index}`}
          style={{
            position: "absolute",
            top: "15px",
            left: `${10 + index * 20}%`,
            width: "20%",
            height: "2px",
            background: "#2563EB",
            zIndex: 1,
          }}
        />
      );
    })}

    {/* STEPS */}

    <div
      style={{
        display: "flex",
        width: "100%",
      }}
    >
      {steps.map((step, index) => (
        <div
          key={step}
          style={{
            width: "20%",
            textAlign: "center",
            position: "relative",
            zIndex: 2,
            minWidth: 0,
          }}
        >
          {/* NUMBER */}

          <div
            style={{
              width: "30px",
              height: "30px",
              borderRadius: "50%",

              background:
                index <= currentStep
                  ? "#2563EB"
                  : "#E5E7EB",

              color:
                index <= currentStep
                  ? "#FFFFFF"
                  : "#6B7280",

              display: "flex",
              alignItems: "center",
              justifyContent: "center",

              margin: "0 auto",

              fontSize: "13px",
              fontWeight: "600",

              boxSizing: "border-box",
            }}
          >
            {index + 1}
          </div>

          {/* LABEL */}

          <div
            style={{
              fontSize: "10px",
              marginTop: "7px",

              color:
                index <= currentStep
                  ? "#2563EB"
                  : "#6B7280",

              lineHeight: "13px",

              padding: "0 2px",

              wordBreak: "break-word",
            }}
          >
            {step}
          </div>
        </div>
      ))}
    </div>
  </div>
</div>


);
}

export default ProgressTracker;
