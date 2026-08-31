import {
  useState,
  useContext,
  useEffect,
  useRef
} from "react";
import { useLocation, useNavigate } from "react-router-dom";

import Header from "../components/Header";
import ProgressTracker from "../components/ProgressTracker";
import SummaryBar from "../components/SummaryBar";

import useIsMobile from "../hooks/useIsMobile";

import symptoms from "../data/symptoms";

import {
  FaMapMarkerAlt,
  FaCheckCircle,
  FaArrowLeft,
  FaLock
} from "react-icons/fa";

import { TrackingContext } from "../context/TrackingContext";


export default function HelpConfirmLocationPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const isMobile = useIsMobile();

  const {
    trackPageVisit,
    trackClick,
    trackInteraction,
    trackHesitation,
    trackBackClick
  } = useContext(TrackingContext);

  const pageStartTime = useRef(Date.now());
  const decisionTracked = useRef(false);


  const guidedSteps = [
    "Health Problem",
    "Location",
    "Doctor Preference",
    "Urgency",
    "Doctors",
    "Appointment"
  ];

  const symptomId = location.state?.symptomId;

  const doctorPreference =
    location.state?.preference;

  const selectedSymptom =
    symptoms.find(
      (symptom) => symptom.id === symptomId
    );

 useEffect(() => {
    trackPageVisit(
      "HelpConfirmLocationPage"
    );

    trackInteraction(
      "page_opened",
      {
        page: "HelpConfirmLocationPage",

        symptomId,

        symptomName:
          selectedSymptom?.name ||
          selectedSymptom?.title ||
          null,

        doctorPreference,
      }
    );

    // We intentionally want this
    // to run only when the page opens.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  const [detectedLocation] =
    useState("Colombo, Sri Lanka");

  const [selectedTown, setSelectedTown] =
  useState("");

  const [area, setArea] = useState("");

  const towns = [
    "Colombo",
    "Negombo",
    "Galle",
    "Kandy",
    "Kurunegala",
    "Matara",
    "Jaffna",
    "Trincomalee",
    "Batticaloa"
  ];


  const trackLocationConfirmation = (
  method,
  confirmedLocation
) => {

  const now = Date.now();

  const decisionTime =
    (now - pageStartTime.current) /
    1000;

  const decisionTimeRounded =
    Number(
      decisionTime.toFixed(2)
    );

  trackClick(
    `help_location_confirmation_${method}`,
    "HelpConfirmLocationPage"
  );

  trackInteraction(
    "help_location_confirmed",
    {
      method,

      location:
        confirmedLocation,

      symptomId,

      symptomName:
        selectedSymptom?.name ||
        selectedSymptom?.title ||
        null,

      doctorPreference,

      decisionTimeSeconds:
        decisionTimeRounded
    }
  );
};

 /*New function
   */

 const trackLocationDecisionHesitation = () => {
  const now = Date.now();

  const decisionTime =
    (now - pageStartTime.current) /
    1000;

  const decisionTimeRounded =
    Number(
      decisionTime.toFixed(2)
    );

  if (
    !decisionTracked.current &&
    decisionTime > 5
  ) {
    trackHesitation(
      decisionTimeRounded
    );

    decisionTracked.current = true;
  }
};
  
  /*
   * Navigate to the next page
   */
  const handleLocationSelect = (selectedLocation,
    method = "location_selection"
  ) => {
    // Track this location decision
    trackLocationConfirmation(
      method,
      selectedLocation
    );


    navigate(
      "/help-me-choose-preference",
      {
        state: {
          symptomId,
          doctorPreference,
          location: selectedLocation
        }
      }
    );
  };

  // ==================================================
  // CURRENT LOCATION
  // ==================================================

  const handleDetectedLocation = () => {

  trackLocationDecisionHesitation();

  handleLocationSelect(
    detectedLocation,
    "detected_location"
  );
};

  // ==================================================
  // TOWN SELECTION
  // ==================================================

  const handleTownSelect = (town) => {

  trackLocationDecisionHesitation();

  handleLocationSelect(
    `${town}, Sri Lanka`,
    "town"
  );
};

  // ==================================================
  // AREA INPUT
  // ==================================================

 const handleAreaKeyDown = (e) => {
  if (
    e.key === "Enter" &&
    area.trim() !== ""
  ) {
    handleLocationSelect(
      area.trim(),
      "area"
    );
  }
};

  /*
   * Back button
   */
  const handleBack = () => {
    trackBackClick(
      "HelpConfirmLocationPage_back"
    );

    // Track navigation interaction
    trackInteraction(
      "back_navigation",
      {
        from:
          "HelpConfirmLocationPage",

        symptomId,

        symptomName:
          selectedSymptom?.name ||
          selectedSymptom?.title ||
          null,

        doctorPreference,
      }
    );


    navigate(-1);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#F8FAFC",
        paddingBottom: isMobile
          ? "90px"
          : "100px",
        boxSizing: "border-box"
      }}
    >
      <Header />

      {/* STEP */}
      <h4
        style={{
          textAlign: "center",
          color: "#6B7280",
          margin: isMobile
            ? "15px 0 12px"
            : "20px 0 15px",
          fontSize: "14px"
        }}
      >
        Step 2 of 6
      </h4>

      {/* PROGRESS */}
      <ProgressTracker
        currentStep={1}
        steps={guidedSteps}
      />

      

      {/* MAIN CONTENT */}
      <div
        style={{
          maxWidth: "1250px",
          margin: isMobile
            ? "25px auto"
            : "40px auto",
          padding: isMobile
            ? "0 15px"
            : "0 20px",
          display: "flex",
          flexDirection: isMobile
            ? "column"
            : "row",
          gap: isMobile
            ? "25px"
            : "24px",
          alignItems: "flex-start",
          boxSizing: "border-box"
        }}
      >
        {/* LEFT CONTENT */}
        <div
          style={{
            flex: 1,
            width: "100%",
            minWidth: 0
          }}
        >
          {/* TITLE */}
          <div
            style={{
              textAlign: "center",
              marginBottom: isMobile
                ? "25px"
                : "30px"
            }}
          >
            <h1
              style={{
                fontSize: isMobile
                  ? "28px"
                  : "clamp(30px, 4vw, 40px)",
                lineHeight: "1.2",
                color: "#0F172A",
                margin: "0 0 12px"
              }}
            >
              Where are you located?
            </h1>

            <p
              style={{
                color: "#64748B",
                fontSize: isMobile
                  ? "14px"
                  : "16px",
                lineHeight: "1.6",
                margin: 0
              }}
            >
              We will recommend doctors and
              hospitals near your location.
            </p>

            {/* PRIVACY */}
            <div
              style={{
                marginTop: "12px",
                color: "#94A3B8",
                fontSize: "13px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: "8px",
                lineHeight: "1.5"
              }}
            >
              <FaLock />

              <span>
                Your location is only used for
                booking purposes
              </span>
            </div>
          </div>

          {/* CURRENT LOCATION CARD */}
          <div
            onClick={handleDetectedLocation}
            style={{
              background: "#ECFDF5",
              borderRadius: "20px",
              border: "2px solid #2563EB",
              padding: isMobile
                ? "16px"
                : "18px 20px",
              marginBottom: "20px",
              boxShadow:
                "0 10px 25px rgba(37,99,235,.10)",
              cursor: "pointer",
              boxSizing: "border-box"
            }}
          >
            {/* HEADER */}
            <div
              style={{
                display: "flex",
                justifyContent:
                  "space-between",
                alignItems: "center",
                gap: "12px"
              }}
            >
              <div
                style={{
                  display: "flex",
                  gap: isMobile
                    ? "10px"
                    : "15px",
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
                    justifyContent:
                      "center",
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
                      fontSize: isMobile
                        ? "15px"
                        : "18px",
                      color: "#0F172A"
                    }}
                  >
                    Use my current location
                  </h3>

                  <p
                    style={{
                      margin: "5px 0 0",
                      color: "#64748B",
                      fontSize: "13px"
                    }}
                  >
                    Recommended (faster and easier)
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
                border: "1px solid #A7F3D0",
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
                  {detectedLocation} (Detected)
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
                "0 5px 15px rgba(0,0,0,.05)"
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
                fontSize: "14px",
                marginBottom: 0
              }}
            >
              Select a city or town to continue
            </p>

            {/* CITY GRID */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: isMobile
                  ? "repeat(2, minmax(0, 1fr))"
                  : "repeat(3, minmax(0, 1fr))",
                gap: "10px",
                marginTop: "20px"
              }}
            >
              {towns.map((town) => (
                <button
                  key={town}
                  onClick={() => handleTownSelect(town)}

                  style={{
                    padding: isMobile
                      ? "11px 8px"
                      : "12px",
                    borderRadius: "10px",
                    cursor: "pointer",
                    border:
                      "1px solid #E2E8F0",
                    background: "#F8FAFC",
                    color: "#334155",
                    fontWeight: "500",
                    fontSize: "14px"
                  }}
                >
                  {town}
                </button>
              ))}
            </div>
          </div>

          {/* AREA INPUT CARD */}
          <div
            style={{
              background: "#FFFFFF",
              borderRadius: "20px",
              padding: isMobile
                ? "18px"
                : "25px",
              marginBottom: "20px",
              boxShadow:
                "0 5px 15px rgba(0,0,0,.05)"
            }}
          >
            <h3
              style={{
                marginTop: 0,
                color: "#0F172A"
              }}
            >
              📍 Enter your area
            </h3>

            <p
              style={{
                color: "#64748B",
                fontSize: "14px"
              }}
            >
              Type your area and press Enter
              to continue.
            </p>

            <input
              type="text"
              value={area}
              onChange={(e) =>
                setArea(e.target.value)
              }
              onKeyDown={handleAreaKeyDown}
              placeholder="e.g. Dehiwala, Mount Lavinia"
              style={{
                width: "100%",
                boxSizing: "border-box",
                padding: "13px 14px",
                border:
                  "1px solid #CBD5E1",
                borderRadius: "10px",
                outline: "none",
                fontSize: "14px",
                color: "#0F172A",
                background: "#F8FAFC"
              }}
            />

            <p
              style={{
                margin: "8px 0 0",
                fontSize: "12px",
                color: "#94A3B8"
              }}
            >
              Press Enter after typing your
              area.
            </p>
          </div>
        </div>

        {/* RIGHT BOOKING SUMMARY */}
        <div
          style={{
            width: isMobile
              ? "100%"
              : "275px",
            boxSizing: "border-box",
            background: "#FFFFFF",
            borderRadius: "24px",
            padding: isMobile
              ? "20px"
              : "24px",
            boxShadow:
              "0 12px 30px rgba(15,23,42,0.08)",
            border:
              "1px solid #E2E8F0",
            minHeight: isMobile
              ? "auto"
              : "300px"
          }}
        >
          {/* BOOKING SUMMARY */}
          <h3
            style={{
              marginTop: 0,
              marginBottom: "18px",
              color: "#0F172A",
              fontSize: "18px",
              fontWeight: "700"
            }}
          >
            Your booking so far
          </h3>

          {/* PROBLEM */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              marginBottom: "14px"
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                flexWrap: "wrap"
              }}
            >
              <span
                style={{
                  fontSize: "11px",
                  color: "#94A3B8"
                }}
              >
                Problem:
              </span>

              <span
                style={{
                  fontWeight: "600",
                  color: "#0F172A",
                  fontSize: "12px"
                }}
              >
                {selectedSymptom?.title || selectedSymptom?.name || "Not selected"}
              </span>
            </div>
          </div>

          {/* LOCATION */}
          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: "6px",
              flexWrap: "wrap"
            }}
          >
            <span
              style={{
                fontSize: "11px",
                color: "#94A3B8"
              }}
            >
              Location:
            </span>

            <span
              style={{
                fontWeight: "600",
                color: "#2563EB",
                fontSize: "12px",
                wordBreak: "break-word"
              }}
            >
              {area.trim()
                ? area
                : detectedLocation}
            </span>
          </div>
        </div>
      </div>

      {/* BACK BUTTON */}
      <button
        onClick={handleBack}
        style={{
          position: "fixed",
          left: isMobile
            ? "15px"
            : "20px",
          bottom: isMobile
            ? "15px"
            : "20px",
          zIndex: 1000,

          display: "flex",
          alignItems: "center",
          gap: "8px",

          padding: isMobile
            ? "11px 16px"
            : "12px 18px",

          borderRadius: "12px",
          border:
            "1px solid #CBD5E1",

          background: "#FFFFFF",
          color: "#2563EB",

          fontWeight: "600",
          cursor: "pointer",

          boxShadow:
            "0 4px 15px rgba(15,23,42,0.10)"
        }}
      >
        <FaArrowLeft />
        Back
      </button>
    </div>
  );
}