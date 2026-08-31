import useIsMobile from "../hooks/useIsMobile";

function BlueDivider() {

  const isMobile = useIsMobile();

  return (
    <div
      style={{
        width: "100%",
        display: "flex",
        justifyContent: "center",

        margin: isMobile
          ? "25px 0"
          : "40px 0"
      }}
    >

      <div
        style={{
          width: isMobile
            ? "90%"
            : "85%",

          height: "2px",

          background:
            "linear-gradient(90deg, rgba(37,99,235,0) 0%, rgba(37,99,235,0.8) 50%, rgba(37,99,235,0) 100%)",

          borderRadius: "999px"
        }}
      />

    </div>
  );
}

export default BlueDivider;