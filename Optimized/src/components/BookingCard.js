import {
  useContext,
  useRef
} from "react";

import {
  useNavigate
} from "react-router-dom";

import ActionCard from "./ActionCard";
import useIsMobile from "../hooks/useIsMobile";

import {
  TrackingContext
} from "../context/TrackingContext";

import {
  FaNotesMedical,
  FaUserMd,
  FaHospital,
  FaMapMarkerAlt,
  FaQuestionCircle
} from "react-icons/fa";


function BookingCard() {

  const navigate = useNavigate();

  const isMobile = useIsMobile();


  // ====================================================
  // TRACKING
  // ====================================================

  const {
    startNewTest,
    trackClick,
    trackInteraction,
    trackHesitation,
    trackPageVisit,
  } = useContext(TrackingContext);


  // ====================================================
  // HOME PAGE START TIME
  // ====================================================

  const homePageStartTime =
    useRef(Date.now());


  // ====================================================
  // PREVENT DUPLICATE HESITATION
  // ====================================================

  const homeDecisionTracked =
    useRef(false);


  // ====================================================
  // HANDLE HOME PAGE ACTION
  // ====================================================

  const handleActionClick = (
  target,
  flowName,
  route
) => {

  const now = Date.now();

  // --------------------------------------------------
  // Calculate Home Page decision time
  // --------------------------------------------------

  const decisionTime =
    (
      now -
      homePageStartTime.current
    ) / 1000;

  const decisionTimeRounded =
    Number(
      decisionTime.toFixed(2)
    );


  // ==================================================
  // START NEW TEST
  // ==================================================

  startNewTest(flowName);


  // ==================================================
  // IMPORTANT:
  // startNewTest() resets tracking data.
  // Therefore record HomePage AGAIN after reset.
  // ==================================================

  trackPageVisit(
    "HomePage"
  );


  trackInteraction(
    "page_opened",
    {
      page: "HomePage"
    }
  );


  // ==================================================
  // HOME PAGE HESITATION
  // ==================================================

  if (
    decisionTime > 5
  ) {

    trackHesitation(
      decisionTimeRounded,
      "HomePage"
    );

  }


  // ==================================================
  // HOME PAGE CLICK
  // ==================================================

  trackClick(
    target,
    "HomePage"
  );


  // ==================================================
  // HOME OPTION SELECTED
  // ==================================================

  trackInteraction(
    "home_option_selected",
    {
      option: target,
      flow: flowName,
      decisionTimeSeconds:
        decisionTimeRounded
    }
  );


  // ==================================================
  // NAVIGATE
  // ==================================================

  navigate(route);
};


  return (

    <div
      style={{
        background: "#F8FAFC",

        borderRadius: isMobile
          ? "18px"
          : "24px",

        padding: isMobile
          ? "20px"
          : "32px",

        border: "1px solid #E2E8F0",

        boxShadow:
          "0 20px 60px rgba(15,23,42,0.08)",

        width: "100%",

        boxSizing: "border-box"
      }}
    >

      {/* LABEL */}

      <div
        style={{
          fontSize: isMobile
            ? "12px"
            : "14px",

          color: "#2563EB",

          fontWeight: "bold",

          marginBottom: "10px"
        }}
      >
        BOOK AN APPOINTMENT
      </div>


      {/* TITLE */}

      <h2
        style={{
          fontSize: isMobile
            ? "24px"
            : "30px",

          lineHeight: isMobile
            ? "32px"
            : "38px",

          color: "#0F172A",

          margin: "0 0 10px"
        }}
      >
        How would you like to find a doctor today?
      </h2>


      {/* DESCRIPTION */}

      <p
        style={{
          color: "#64748B",

          fontSize: isMobile
            ? "13px"
            : "15px",

          lineHeight: "22px",

          marginBottom: isMobile
            ? "20px"
            : "25px"
        }}
      >
        Choose the option that feels easiest for you.
      </p>


      {/* ACTION CARDS */}

      <div
        style={{
          display: "grid",

          /*
            Desktop = 2 columns
            Mobile = 1 column
          */

          gridTemplateColumns:
            isMobile
              ? "1fr"
              : "repeat(2, 1fr)",

          gap: isMobile
            ? "14px"
            : "30px",

          marginTop: "20px"
        }}
      >


        {/* ==================================================
            1. KNOW HEALTH PROBLEM
        ================================================== */}

        <ActionCard

          icon={
            <FaNotesMedical color="#2563EB" />
          }

          title="I Know My Health Problem"

          description="Fever, Skin Issue, Eye Problem"

          badge="Most Popular"

          badgeColor="#2563EB"

          hoverColor="#DBEAFE"

          hoverBorderColor="#2563EB"

          actionTextColor="#2563EB"

          actionBorderColor="#BFDBFE"

          onClick={() =>
            handleActionClick(
              "know_health_problem",
              "health_problem",
              "/symptoms"
            )
          }

        />


        {/* ==================================================
            2. KNOW DOCTOR
        ================================================== */}

        <ActionCard

          icon={
            <FaUserMd color="#81D2FD" />
          }

          title="I Know The Doctor Name"

          description="Search directly for a doctor"

          hoverColor="#E0F2FE"

          hoverBorderColor="#0284C7"

          actionTextColor="#0284C7"

          actionBorderColor="#BAE6FD"

          onClick={() =>
            handleActionClick(
              "know_doctor_name",
              "doctor_name",
              "/doctor-search"
            )
          }

        />


        {/* ==================================================
            3. KNOW HOSPITAL
        ================================================== */}

        <ActionCard

          icon={
            <FaHospital color="#8B5CF6" />
          }

          title="I Know The Hospital"

          description="Find doctors at a specific hospital"

          hoverColor="#F3E8FF"

          hoverBorderColor="#8B5CF6"

          actionTextColor="#8B5CF6"

          actionBorderColor="#E9D5FF"

          onClick={() =>
            handleActionClick(
              "know_hospital",
              "hospital_name",
              "/hospital-based"
            )
          }

        />


        {/* ==================================================
            4. NEAREST AVAILABLE DOCTOR
        ================================================== */}

        <ActionCard

          icon={
            <FaMapMarkerAlt color="#14B8A6" />
          }

          title="Find Nearest Available Doctor"

          description="Find an available doctor near you"

          hoverColor="#CCFBF1"

          hoverBorderColor="#14B8A6"

          actionTextColor="#14B8A6"

          actionBorderColor="#99F6E4"

          onClick={() =>
            handleActionClick(
              "nearest_available_doctor",
              "nearest_doctor",
              "/nearest-location"
            )
          }

        />


        {/* ==================================================
            5. HELP ME CHOOSE
        ================================================== */}

        <div
          style={{
            /*
              Desktop:
              full width across 2 columns

              Mobile:
              normal single card
            */

            gridColumn:
              isMobile
                ? "auto"
                : "1 / span 2"
          }}
        >

          <ActionCard

            icon={
              <FaQuestionCircle color="#F59E0B" />
            }

            title="Help Me Choose"

            description="Not sure which doctor you need?"

            badge="Guided"

            badgeColor="#F59E0B"

            hoverColor="#FEF3C7"

            hoverBorderColor="#F59E0B"

            actionTextColor="#F59E0B"

            actionBorderColor="#FDE68A"

            onClick={() =>
              handleActionClick(
                "help_me_choose",
                "help_choose",
                "/help-me"
              )
            }

          />

        </div>

      </div>


      {/* BENEFITS */}

      <div
        style={{
          marginTop: "25px",

          display: "flex",

          flexDirection:
            isMobile
              ? "column"
              : "row",

          gap: isMobile
            ? "8px"
            : "25px",

          flexWrap: "wrap",

          color: "#16A34A",

          fontWeight: "500",

          fontSize: isMobile
            ? "12px"
            : "13px"
        }}
      >

        <span>
          ✓ Only a few simple steps
        </span>

        <span>
          ✓ Guided booking process
        </span>

        <span>
          ✓ No payment required yet
        </span>

      </div>

    </div>
  );
}

export default BookingCard;