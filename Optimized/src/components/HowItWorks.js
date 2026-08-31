import useIsMobile from "../hooks/useIsMobile";

function HowItWorks() {
const isMobile = useIsMobile();

const steps = [
{
number: 1,
title: "Choose How To Search",
description:
"Select the approach that feels most natural to you — by symptom, doctor name, hospital, or simply by location.",
borderColor: "#3B82F6",
},
{
number: 2,
title: "Review Recommended Options",
description:
"We show the best matching doctors with their availability, ratings, distance from you, and hospital information.",
borderColor: "#8B5CF6",
},
{
number: 3,
title: "Confirm Appointment",
description:
"Pick your preferred time slot and confirm your booking in a few simple steps. No payment required now.",
borderColor: "#22C55E",
},
];

return (
<section
style={{
padding: isMobile ? "50px 20px" : "90px 60px",
textAlign: "center",
background: "#F8FAFC",
}}
>
{/* Badge */}
<div
style={{
display: "inline-block",
padding: isMobile ? "7px 14px" : "8px 16px",
borderRadius: "999px",
background: "#EFF6FF",
border: "1px solid #BFDBFE",
color: "#2563EB",
fontSize: isMobile ? "13px" : "14px",
fontWeight: "600",
marginBottom: "16px",
}}
>
Simple process </div>


  {/* Heading */}
  <h2
    style={{
      fontSize: isMobile ? "30px" : "42px",
      fontWeight: "800",
      color: "#0F172A",
      margin: "0 0 12px 0",
    }}
  >
    How It Works
  </h2>

  <p
    style={{
      color: "#64748B",
      fontSize: isMobile ? "15px" : "18px",
      maxWidth: "600px",
      margin: isMobile ? "0 auto 45px auto" : "0 auto 70px auto",
      lineHeight: "1.6",
    }}
  >
    From zero to confirmed appointment in three
    straightforward steps.
  </p>

  {/* Steps */}
  <div
    style={{
      display: "flex",
      flexDirection: isMobile ? "column" : "row",
      justifyContent: "center",
      alignItems: isMobile ? "center" : "flex-start",
      maxWidth: "1200px",
      margin: "0 auto",
      width: "100%",
    }}
  >
    {steps.map((step, index) => (
      <div
        key={step.number}
        style={{
          display: "flex",
          flexDirection: isMobile ? "column" : "row",
          alignItems: "center",
          width: isMobile ? "100%" : "auto",
        }}
      >
        {/* Step */}
        <div
          style={{
            width: isMobile ? "100%" : "260px",
            maxWidth: isMobile ? "400px" : "260px",
            textAlign: "center",
          }}
        >
          {/* Circle */}
          <div
            style={{
              width: isMobile ? "70px" : "90px",
              height: isMobile ? "70px" : "90px",
              borderRadius: "50%",
              background: "#FFFFFF",
              border: `3px solid ${step.borderColor}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: isMobile ? "23px" : "28px",
              fontWeight: "700",
              margin: "auto",
              boxShadow: "0 8px 25px rgba(0,0,0,0.06)",
              color: step.borderColor,
            }}
          >
            {step.number}
          </div>

          {/* Step Title */}
          <h3
            style={{
              marginTop: isMobile ? "18px" : "24px",
              marginBottom: "0",
              fontSize: isMobile ? "18px" : "20px",
              fontWeight: "700",
              color: "#0F172A",
            }}
          >
            {step.title}
          </h3>

          {/* Step Description */}
          <p
            style={{
              marginTop: "12px",
              marginBottom: "0",
              color: "#64748B",
              fontSize: isMobile ? "14px" : "15px",
              lineHeight: "1.7",
            }}
          >
            {step.description}
          </p>
        </div>

        {/* Connection Line */}
        {index !== steps.length - 1 && (
          <div
            style={{
              height: isMobile ? "45px" : "2px",
              width: isMobile ? "2px" : "120px",
              background: "#CBD5E1",
              marginTop: isMobile ? "15px" : "45px",
              marginLeft: isMobile ? "0" : "10px",
              marginRight: isMobile ? "0" : "10px",
              marginBottom: isMobile ? "15px" : "0",
            }}
          />
        )}
      </div>
    ))}
  </div>

  {/* CTA Button */}
  <div
    style={{
      marginTop: isMobile ? "45px" : "70px",
    }}
  >
    <button
      style={{
        background:
          "linear-gradient(135deg,#2563EB,#3B82F6)",
        color: "#fff",
        border: "none",
        borderRadius: "12px",
        padding: isMobile
          ? "13px 24px"
          : "16px 40px",
        fontWeight: "700",
        fontSize: isMobile ? "14px" : "16px",
        cursor: "pointer",
        boxShadow:
          "0 12px 30px rgba(37,99,235,.25)",
        transition: "0.3s",
        width: isMobile ? "100%" : "auto",
        maxWidth: isMobile ? "320px" : "none",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform =
          "translateY(-2px)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform =
          "translateY(0)";
      }}
    >
      Book Appointment — It's Free
    </button>

    <p
      style={{
        marginTop: "14px",
        marginBottom: "0",
        fontSize: isMobile ? "12px" : "14px",
        color: "#94A3B8",
        lineHeight: "1.5",
      }}
    >
      No signup required to browse doctors. Book
      only when you're ready.
    </p>
  </div>
</section>


);
}

export default HowItWorks;
