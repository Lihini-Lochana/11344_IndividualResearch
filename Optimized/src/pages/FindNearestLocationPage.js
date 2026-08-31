import { useState, useContext, useEffect, useRef, } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import Header from "../components/Header";
import ProgressTracker from "../components/ProgressTracker";
import SummaryBar from "../components/SummaryBar";
import useIsMobile from "../hooks/useIsMobile";
import { TrackingContext } from "../context/TrackingContext";

import {
  FaMapMarkerAlt,
  FaCheckCircle,
  FaArrowLeft,
  FaSearch,
  FaUserMd,
  FaCalendarAlt
} from "react-icons/fa";

export default function FindNearestLocationPage() {

  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useIsMobile();

  const {
  startNewTest,
  trackPageVisit,
  trackClick,
  trackInteraction,
  trackHesitation,
  trackBackClick
} = useContext(TrackingContext);

  // ======================================================
  // HESITATION TRACKING
  // ======================================================

 

  const guidedSteps = [
    "Location",
    "Health Problem",
    "Doctor Preference",
    "Doctors",
    "Appointment",
    "Confirmation"
  ];

  
  // Coming from previous flow
  const symptomId = location.state?.symptomId;
  const doctorPreference = location.state?.doctorPreference;

   const pageStartTime = useRef(Date.now());

const decisionTracked = useRef(false);
    // ======================================================
  // START FLOW + PAGE VISIT
  // ======================================================
const isReturningFromBack =
  location.state?.returnFromBack === true;


 // ======================================================
// START FLOW + PAGE VISIT
// ======================================================

useEffect(() => {

  // ====================================================
  // START NEW FLOW ONLY ON FIRST ENTRY
  // ====================================================

  if (!isReturningFromBack) {

    startNewTest(
      "nearest_doctor"
    );
  }


  // ====================================================
  // PAGE VISIT
  // ====================================================

  trackPageVisit(
    "FindNearestLocationPage"
  );


  // ====================================================
  // PAGE OPENED
  // ====================================================

  trackInteraction(
    "page_opened",
    {
      page:
        "FindNearestLocationPage",

      flow:
        "nearest_doctor",

      isReturningFromBack
    }
  );


  // ====================================================
  // RESET HESITATION TIMER
  // ====================================================

  pageStartTime.current =
    Date.now();


  // ====================================================
  // IMPORTANT
  //
  // If user came back from the symptom page,
  // do NOT count hesitation on this return visit.
  //
  // This prevents:
  //
  // Back
  // ↓
  // Location page
  // ↓
  // wait 6 seconds
  // ↓
  // location hesitation
  //
  // ====================================================

  decisionTracked.current =
    isReturningFromBack;


  // eslint-disable-next-line react-hooks/exhaustive-deps
}, []);

  const detectedLocation = "Colombo, Sri Lanka";

  const [area, setArea] = useState("");

  const towns = [
    "Colombo",
    "Negombo",
    "Galle",
    "Kandy",
    "Kurunegala",
    "Matara",
    "Jaffna",
    "Batticaloa",
    "Trincomalee"
  ];

  /*
   * Navigate to the next page
   */
const goToNextPage = (
  selectedLocation,
  selectionMethod = "UNKNOWN"
) => {

  if (!selectedLocation) {
    return;
  }


  // ====================================================
  // CALCULATE DECISION TIME
  // ====================================================

  const now = Date.now();

  const decisionTime =
    (now - pageStartTime.current) / 1000;

  const decisionTimeRounded =
    Number(
      decisionTime.toFixed(2)
    );


  // ====================================================
  // HESITATION TRACKING
  // ====================================================

  if (!decisionTracked.current) {

    if (decisionTime > 5) {

      trackHesitation(
        decisionTimeRounded
      );

      trackInteraction(
        "hesitation",
        {
          page:
            "FindNearestLocationPage",

          seconds:
            decisionTimeRounded,

          selectionMethod
        }
      );
    }

    // IMPORTANT:
    // Mark decision as processed even when
    // hesitation was less than 5 seconds.

    decisionTracked.current = true;
  }


  // ====================================================
  // TRACK LOCATION CLICK
  // ====================================================

  trackClick(
    `location_${selectionMethod
      .toLowerCase()}`,
    "FindNearestLocationPage"
  );


  // ====================================================
  // TRACK LOCATION SELECTION
  // ====================================================

  trackInteraction(
    "location_selected",
    {
      location:
        selectedLocation,

      selectionMethod,

      decisionTimeSeconds:
        decisionTimeRounded
    }
  );


  // ====================================================
  // MOVE TO HEALTH PROBLEM PAGE
  // ====================================================

  navigate(
    "/nearest-health-problem",
    {
      state: {
        location:
          selectedLocation,

        symptomId,

        doctorPreference
      }
    }
  );
};

  /*
   * Current location click
   */
  const handleCurrentLocation = () => {
     goToNextPage(
    detectedLocation,
    "CURRENT_LOCATION"
  );
  };

  /*
   * Town click
   */
  const handleTownSelect = (town) => {
    goToNextPage(
    `${town}, Sri Lanka`,
    "CITY_TOWN"
  );
  };

  /*
   * Area input
   */
  const handleAreaKeyDown = (e) => {

        if (
        e.key === "Enter" &&
        area.trim() !== ""
      ) {

        goToNextPage(
          `${area.trim()}, Sri Lanka`,
          "AREA_SEARCH"
        );

      }
  };

  /*
   * Back button
   */
  const handleBack = () => {

  // ====================================================
  // TRACK BACK BUTTON
  // ====================================================

  trackBackClick(
    "FindNearestLocationPage_back"
  );


  // ====================================================
  // TRACK BACK NAVIGATION
  // ====================================================

  trackInteraction(
    "back_navigation",
    {
      from:
        "FindNearestLocationPage",

      to:
        "previous_page"
    }
  );


  // ====================================================
  // GO BACK
  // ====================================================

  navigate(-1);
};


  return (

    <div
      style={{
        minHeight: "100vh",
        background: "#F8FAFC",
        paddingBottom: "40px",
        boxSizing: "border-box"
      }}
    >

      <Header />

      

      {/* STEP */}

      <h4
        style={{
          textAlign: "center",
          color: "#6B7280",
          marginTop: "20px",
          marginBottom: "15px"
        }}
      >
        Step 1 of 6
      </h4>

      {/* PROGRESS */}

      <ProgressTracker
        currentStep={0}
        steps={guidedSteps}
      />

      {/* SUMMARY */}

      <SummaryBar
        selectedSymptom={symptomId}
        doctorPreference={doctorPreference}
      />

      {/* MAIN CONTAINER */}

      <div
        style={{
          maxWidth: "1250px",
          margin: isMobile
            ? "25px auto"
            : "40px auto",
          padding: isMobile
            ? "0 16px"
            : "0 20px",
          display: "flex",
          flexDirection: isMobile
            ? "column"
            : "row",
          gap: "24px",
          alignItems: "stretch",
          boxSizing: "border-box"
        }}
      >

        {/* LEFT SIDE */}

        <div
          style={{
            flex: 1,
            minWidth: 0
          }}
        >

          {/* TITLE */}

          <div
            style={{
              textAlign: "center",
              marginBottom: "30px"
            }}
          >

            <h1
              style={{
                fontSize:
                  isMobile
                    ? "30px"
                    : "42px",
                lineHeight: "1.2",
                color: "#0F172A",
                margin: "0 0 12px"
              }}
            >
              Find nearest available doctor
            </h1>

            <p
              style={{
                color: "#64748B",
                fontSize:
                  isMobile
                    ? "14px"
                    : "16px",
                lineHeight: "1.6",
                margin: 0
              }}
            >
              We will recommend the closest
              doctor with the earliest
              appointment
            </p>

          </div>

          {/* CURRENT LOCATION CARD */}

          <div
            onClick={handleCurrentLocation}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (
                e.key === "Enter" ||
                e.key === " "
              ) {
                handleCurrentLocation();
              }
            }}
            style={{
              background: "#ECFDF5",
              borderRadius: "20px",
              border: "2px solid #2563EB",
              padding: isMobile
                ? "16px"
                : "20px",
              marginBottom: "20px",
              boxShadow:
                "0 10px 25px rgba(37,99,235,.10)",
              cursor: "pointer",
              boxSizing: "border-box"
            }}
          >

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: "12px"
              }}
            >

              <div
                style={{
                  display: "flex",
                  gap: "12px",
                  alignItems: "center",
                  minWidth: 0
                }}
              >

                <div
                  style={{
                    width: isMobile
                      ? "42px"
                      : "45px",
                    height: isMobile
                      ? "42px"
                      : "45px",
                    borderRadius: "12px",
                    background: "#E1F1F3",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    flexShrink: 0
                  }}
                >
                  <FaMapMarkerAlt
                    color="#2563EB"
                  />
                </div>

                <div>

                  <h3
                    style={{
                      margin: 0,
                      fontSize:
                        isMobile
                          ? "16px"
                          : "18px",
                      color: "#0F172A"
                    }}
                  >
                    Use my current location
                  </h3>

                  <p
                    style={{
                      margin:
                        "5px 0 0",
                      color: "#64748B",
                      fontSize: "13px"
                    }}
                  >
                    Recommended — faster
                    and easier
                  </p>

                </div>

              </div>

              <FaCheckCircle
                size={22}
                color="#2563EB"
                style={{
                  flexShrink: 0
                }}
              />

            </div>

            {/* DETECTED LOCATION */}

            <div
              style={{
                background: "#ECFDF5",
                border:
                  "1px solid #A7F3D0",
                borderRadius: "12px",
                marginTop: "18px",
                padding: "12px 14px"
              }}
            >

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  color: "#047857",
                  fontWeight: "600",
                  fontSize: "14px"
                }}
              >

                <FaCheckCircle
                  size={16}
                  color="#10B981"
                />

                <span>
                  {detectedLocation}
                  {" "}
                  (Detected)
                </span>

              </div>

              <div
                style={{
                  color: "#10B981",
                  fontWeight: "500",
                  fontSize: "11px",
                  marginTop: "4px",
                  marginLeft: "24px"
                }}
              >
                Location successfully detected
              </div>

            </div>

          </div>

          {/* OR */}

          <div
            style={{
              textAlign: "center",
              color: "#94A3B8",
              fontWeight: "600",
              marginBottom: "20px"
            }}
          >
            ───── OR ─────
          </div>

          {/* CITY CARD */}

          <div
            style={{
              background: "#FFFFFF",
              borderRadius: "20px",
              padding: isMobile
                ? "18px"
                : "25px",
              marginBottom: "20px",
              boxShadow:
                "0 5px 15px rgba(0,0,0,.05)",
              boxSizing: "border-box"
            }}
          >

            <h3
              style={{
                marginTop: 0,
                color: "#0F172A"
              }}
            >
              🏙 Choose city or town
            </h3>

            <p
              style={{
                color: "#64748B",
                marginBottom: "20px"
              }}
            >
              Select a location to continue
            </p>

            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  isMobile
                    ? "repeat(2, 1fr)"
                    : "repeat(3, 1fr)",
                gap: "10px"
              }}
            >

              {towns.map((town) => (

                <button
                  key={town}
                  onClick={() =>
                    handleTownSelect(town)
                  }
                  style={{
                    padding:
                      isMobile
                        ? "11px 8px"
                        : "12px",
                    borderRadius: "10px",
                    cursor: "pointer",
                    border:
                      "1px solid #E2E8F0",
                    background: "#F8FAFC",
                    color: "#0F172A",
                    fontWeight: "500",
                    fontSize:
                      isMobile
                        ? "13px"
                        : "14px"
                  }}
                >
                  {town}
                </button>

              ))}

            </div>

          </div>

          {/* AREA CARD */}

          <div
            style={{
              background: "#FFFFFF",
              borderRadius: "20px",
              padding: isMobile
                ? "18px"
                : "25px",
              boxShadow:
                "0 5px 15px rgba(0,0,0,.05)",
              boxSizing: "border-box"
            }}
          >

            <h3
              style={{
                marginTop: 0,
                color: "#0F172A"
              }}
            >
              ✏ Type area or suburb
            </h3>

            <p
              style={{
                color: "#64748B"
              }}
            >
              Press Enter to continue
            </p>

            <div
              style={{
                position: "relative"
              }}
            >

              <FaSearch
                style={{
                  position: "absolute",
                  left: "15px",
                  top: "50%",
                  transform:
                    "translateY(-50%)",
                  color: "#94A3B8"
                }}
              />

              <input
                value={area}
                 onFocus={() => {

                  trackInteraction(
                    "INPUT_FOCUS",
                    {
                      page:
                        "FindNearestLocationPage",

                      field:
                        "area_location"
                    }
                  );

                }}
                onChange={(e) =>
                  setArea(e.target.value)
                }
                onKeyDown={handleAreaKeyDown}
                placeholder="e.g. Wattala, Moratuwa"
                style={{
                  width: "100%",
                  padding:
                    "14px 14px 14px 40px",
                  borderRadius: "12px",
                  border:
                    "1px solid #CBD5E1",
                  outline: "none",
                  boxSizing: "border-box",
                  fontSize: "14px"
                }}
              />

            </div>

            <p
              style={{
                margin:
                  "8px 0 0",
                fontSize: "12px",
                color: "#94A3B8"
              }}
            >
              Example: Type "Wattala" and
              press Enter
            </p>

          </div>

        </div>

        {/* RIGHT PANEL */}

        <div
          style={{
            width: isMobile
              ? "100%"
              : "300px",
            background: "#FFFFFF",
            borderRadius: "24px",
            padding: "24px",
            boxShadow:
              "0 12px 30px rgba(15,23,42,0.08)",
            border:
              "1px solid #E2E8F0",
            height: "fit-content",
            boxSizing: "border-box"
          }}
        >

          <h3
            style={{
              marginTop: 0,
              color: "#0F172A"
            }}
          >
            How it works
          </h3>

          <div
            style={{
              display: "flex",
              gap: "10px",
              marginTop: "15px"
            }}
          >

            <FaMapMarkerAlt
              color="#2563EB"
              style={{
                marginTop: "3px",
                flexShrink: 0
              }}
            />

            <div>

              <b>Select location</b>

              <div
                style={{
                  fontSize: "12px",
                  color: "#64748B",
                  marginTop: "3px"
                }}
              >
                Choose where you want care
              </div>

            </div>

          </div>

          <div
            style={{
              marginTop: "15px",
              display: "flex",
              gap: "10px"
            }}
          >

            <FaUserMd
              color="#2563EB"
              style={{
                marginTop: "3px",
                flexShrink: 0
              }}
            />

            <div>

              <b>Find doctors</b>

              <div
                style={{
                  fontSize: "12px",
                  color: "#64748B",
                  marginTop: "3px"
                }}
              >
                Nearby available specialists
              </div>

            </div>

          </div>

          <div
            style={{
              marginTop: "15px",
              display: "flex",
              gap: "10px"
            }}
          >

            <FaCalendarAlt
              color="#2563EB"
              style={{
                marginTop: "3px",
                flexShrink: 0
              }}
            />

            <div>

              <b>Book instantly</b>

              <div
                style={{
                  fontSize: "12px",
                  color: "#64748B",
                  marginTop: "3px"
                }}
              >
                Choose earliest available slot
              </div>

            </div>

          </div>

        </div>

        {/* BACK BUTTON */}

      <button
        onClick={handleBack}
        style={{
          position: "fixed",
          bottom: "20px",
          left: "20px",
          zIndex: 1000,

          display: "flex",
          alignItems: "center",
          gap: "8px",

          background: "#FFFFFF",
          color: "#2563EB",

          border:
            "1px solid #CBD5E1",

          borderRadius: "12px",

          padding: "12px 18px",

          fontWeight: "600",

          cursor: "pointer",

          boxShadow:
            "0 4px 15px rgba(0,0,0,.08)"
        }}
      >

        <FaArrowLeft />

        Back

      </button>

      </div>

    </div>
  );
}