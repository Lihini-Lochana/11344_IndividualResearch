import useIsMobile from "../hooks/useIsMobile";

function ActionCard({
  icon,
  title,
  description,
  badge,
  badgeColor,
  hoverColor,
  hoverBorderColor,
  actionTextColor,
  actionBorderColor,
  onClick
}) {

  const isMobile = useIsMobile();

  return (
    <div
      onClick={onClick}
      style={{
        background: "#FFFFFF",
        border: "1px solid #E2E8F0",
        borderRadius: isMobile ? "16px" : "18px",

        padding: isMobile ? "18px" : "24px",

        transition: "all 0.3s ease",
        cursor: "pointer",
        overflow: "hidden",

        /*
          Desktop:
          180px card

          Mobile:
          Let content determine the height so text
          does not get squeezed.
        */
        minHeight: isMobile ? "165px" : "180px",

        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",

        boxSizing: "border-box",

        width: "100%"
      }}

      onMouseEnter={(e) => {

        // Hover effects are mainly useful on desktop.
        if (!isMobile) {

          e.currentTarget.style.transform =
            "translateY(-4px)";

          e.currentTarget.style.background =
            hoverColor;

          e.currentTarget.style.borderColor =
            hoverBorderColor;

          e.currentTarget.style.boxShadow =
            "0 12px 25px rgba(0,0,0,0.08)";
        }
      }}

      onMouseLeave={(e) => {

        if (!isMobile) {

          e.currentTarget.style.transform =
            "translateY(0)";

          e.currentTarget.style.background =
            "#FFFFFF";

          e.currentTarget.style.borderColor =
            "#E2E8F0";

          e.currentTarget.style.boxShadow =
            "none";
        }
      }}
    >

      {/* BADGE */}

      {badge && (

        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",

            marginBottom: isMobile
              ? "5px"
              : "0px"
          }}
        >

          <span
            style={{
              background: badgeColor,
              color: "#FFFFFF",

              fontSize: isMobile
                ? "10px"
                : "11px",

              fontWeight: "600",

              padding: isMobile
                ? "4px 8px"
                : "5px 10px",

              borderRadius: "999px",

              whiteSpace: "nowrap"
            }}
          >
            {badge}
          </span>

        </div>

      )}


      {/* ICON + TEXT */}

      <div
        style={{
          /*
            Previously you used marginTop:-50px
            for cards with badges.

            This can cause problems on mobile,
            so we use a smaller adjustment.
          */

          marginTop: badge
            ? (isMobile ? "-2px" : "-42px")
            : "0px"
        }}
      >

        {/* ICON */}

        <div
          style={{
            fontSize: isMobile
              ? "30px"
              : "35px",

            marginBottom: isMobile
              ? "8px"
              : "10px"
          }}
        >
          {icon}
        </div>


        {/* TITLE */}

        <h3
          style={{
            margin: "0 0 5px",

            fontSize: isMobile
              ? "16px"
              : "18px",

            lineHeight: isMobile
              ? "22px"
              : "24px",

            color: "#0F172A",

            fontWeight: "700"
          }}
        >
          {title}
        </h3>


        {/* DESCRIPTION */}

        {description && (

          <p
            style={{
              color: "#64748B",

              fontSize: isMobile
                ? "13px"
                : "14px",

              lineHeight: "20px",

              margin: 0
            }}
          >
            {description}
          </p>

        )}

      </div>


      {/* BUTTON */}

      <div
        style={{
          marginTop: "12px"
        }}
      >

        <button
          onClick={(e) => {

            /*
              Prevent the button click from
              triggering the card click twice.
            */
            e.stopPropagation();

            onClick();
          }}

          style={{
            color: actionTextColor,

            border:
              `1px solid ${actionBorderColor}`,

            background: "transparent",

            padding: isMobile
              ? "7px 12px"
              : "8px 14px",

            borderRadius: "10px",

            fontWeight: "600",

            fontSize: isMobile
              ? "12px"
              : "13px",

            cursor: "pointer",

            transition: "all 0.2s ease"
          }}

          onMouseEnter={(e) => {

            if (!isMobile) {

              e.currentTarget.style.background =
                actionBorderColor;
            }
          }}

          onMouseLeave={(e) => {

            if (!isMobile) {

              e.currentTarget.style.background =
                "transparent";
            }
          }}
        >
          Start →
        </button>

      </div>

    </div>
  );
}

export default ActionCard;