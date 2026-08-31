function ServiceCard({
  icon,
  title,
  isMobile,
}) {
  return (
    <div
      style={{
        background: "white",
        padding: isMobile ? "20px 10px" : "25px",
        borderRadius: isMobile ? "14px" : "18px",
        textAlign: "center",
        boxShadow:
        "0 5px 15px rgba(0,0,0,0.05)",
        minHeight: isMobile ? "105px" : "120px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          fontSize: isMobile ? "28px" : "35px",
          marginBottom: isMobile ? "7px" : "10px",
          
        }}
      >
        {icon}
      </div>

      <h4 style={{ margin: 0, fontSize: isMobile ? "14px" : "16px", }}>{title}</h4>
    </div>
  );
}

export default ServiceCard;