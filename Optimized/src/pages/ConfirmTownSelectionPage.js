import {
  useState,
  useContext,
  useEffect,
  useRef,
} from "react";

import {
  useLocation,
  useNavigate,
} from "react-router-dom";

import Header from "../components/Header";
import ProgressTracker from "../components/ProgressTracker";
import SummaryBar from "../components/SummaryBar";

import useIsMobile from "../hooks/useIsMobile";

import symptoms from "../data/symptoms";

import { TrackingContext } from "../context/TrackingContext";

import {
  FaMapMarkerAlt,
  FaCheckCircle,
  FaSearch,
  FaArrowLeft,
  FaCalendarAlt,
  FaUserMd,
  FaLock,
} from "react-icons/fa";


export default function ConfirmTownSelectionPage() {

  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useIsMobile();

  const {
    trackPageVisit,
    trackClick,
    trackInteraction,
    trackHesitation,
    trackBackClick,
  } = useContext(TrackingContext);


  // --------------------------------------------------
  // TRACKING
  // --------------------------------------------------

  const pageStartTime = useRef(Date.now());
  const decisionTracked = useRef(false);


  // --------------------------------------------------
  // GUIDED STEPS
  // --------------------------------------------------

  const guidedSteps = [
    "Health Problem",
    "Doctor Preference",
    "Location",
    "Doctors",
    "Appointment",
  ];


  // --------------------------------------------------
  // PREVIOUS SELECTIONS
  // --------------------------------------------------

  const symptomId = location.state?.symptomId;

  const doctorPreference =
    location.state?.preference ||
    location.state?.doctorPreference ||
    "";

  const locationMethod =
    location.state?.locationMethod ||
    "Select Town";


  const selectedSymptom = symptoms.find(
    (symptom) => symptom.id === symptomId
  );


  // --------------------------------------------------
  // PAGE TRACKING
  // --------------------------------------------------

  useEffect(() => {

    trackPageVisit(
      "ConfirmTownSelectionPage"
    );

    trackInteraction(
      "page_opened",
      {
        page: "ConfirmTownSelectionPage",
        symptomId,
        symptomName:
          selectedSymptom?.name || null,
        doctorPreference,
        locationMethod,
      }
    );

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  // --------------------------------------------------
  // TOWNS
  // --------------------------------------------------

  const towns = [
    "Colombo",
    "Negombo",
    "Galle",
    "Kandy",
    "Kurunegala",
    "Matara",
    "Jaffna",
    "Trincomalee",
    "Batticaloa",
  ];


  // --------------------------------------------------
  // LOCATION STATE
  // --------------------------------------------------

  const [selectedTown, setSelectedTown] =
    useState(
      location.state?.selectedTown || ""
    );

  const [area, setArea] = useState(
    location.state?.area || ""
  );


  // --------------------------------------------------
  // SELECTED LOCATION
  // --------------------------------------------------

  const finalLocation =
    area.trim() ||
    selectedTown ||
    "";


  // --------------------------------------------------
  // TRACK LOCATION DECISION
  // --------------------------------------------------

  const trackTownDecision = (
    method,
    selectedLocation
  ) => {

    const now = Date.now();

    const decisionTime =
      (now - pageStartTime.current) /
      1000;

    const decisionTimeRounded =
      Number(
        decisionTime.toFixed(2)
      );


    // ---------------------------------------------
    // Track hesitation only once
    // ---------------------------------------------

    if (!decisionTracked.current) {

      if (decisionTime > 5) {

        trackHesitation(
          decisionTimeRounded
        );

      }

      decisionTracked.current = true;
    }


    // ---------------------------------------------
    // Track click
    // ---------------------------------------------

    trackClick(
      `town_selection_${method}`,
      "ConfirmTownSelectionPage"
    );


    // ---------------------------------------------
    // Track interaction
    // ---------------------------------------------

    trackInteraction(
      "town_selection_confirmed",
      {
        method,
        location: selectedLocation,

        symptomId,

        symptomName:
          selectedSymptom?.name ||
          null,

        doctorPreference,

        locationMethod,

        decisionTimeSeconds:
          decisionTimeRounded,
      }
    );
  };


  // --------------------------------------------------
  // TOWN SELECT
  // --------------------------------------------------

  const handleTownSelect = (town) => {

    setSelectedTown(town);

    // Clear typed area when selecting a town
    setArea("");

    trackClick(
      `select_town_${town}`,
      "ConfirmTownSelectionPage"
    );

    trackInteraction(
      "town_selected",
      {
        town,
        symptomId,
        doctorPreference,
      }
    );
  };


  // --------------------------------------------------
  // AREA CHANGE
  // --------------------------------------------------

  const handleAreaChange = (e) => {

    const value = e.target.value;

    setArea(value);

    // Clear town when typing an area
    if (value.trim()) {
      setSelectedTown("");
    }
  };


  // --------------------------------------------------
  // CONTINUE
  // --------------------------------------------------

  const handleContinue = () => {

    if (!finalLocation) {

      trackClick(
        "town_selection_continue_error",
        "ConfirmTownSelectionPage"
      );

      trackInteraction(
        "town_selection_validation_error",
        {
          reason:
            "No town or area selected",
          symptomId,
          doctorPreference,
        }
      );

      return;
    }


    const selectionMethod =
      area.trim()
        ? "area"
        : "town";


    trackTownDecision(
      selectionMethod,
      finalLocation
    );


    navigate(
      "/confirmed-town-doctors",
      {
        state: {

          symptomId,

          doctorPreference,

          locationMethod,

          locationType: "town",

          town:
            selectionMethod === "town"
              ? selectedTown
              : "",

          area:
            selectionMethod === "area"
              ? area.trim()
              : "",

          location:
            finalLocation,
        },
      }
    );
  };


  // --------------------------------------------------
  // CHANGE SYMPTOM
  // --------------------------------------------------

  const handleSymptomChange = () => {

    trackClick(
      "change_symptom",
      "ConfirmTownSelectionPage"
    );

    trackInteraction(
      "symptom_change_requested",
      {
        from:
          "ConfirmTownSelectionPage",

        symptomId,

        symptomName:
          selectedSymptom?.name ||
          null,
      }
    );


    navigate(
      "/symptoms",
      {
        state: {
          symptomId,
          doctorPreference,
          locationMethod,
        },
      }
    );
  };


  // --------------------------------------------------
  // CHANGE DOCTOR PREFERENCE
  // --------------------------------------------------

  const handleDoctorPreferenceChange =
    () => {

      trackClick(
        "change_doctor_preference",
        "ConfirmTownSelectionPage"
      );

      trackInteraction(
        "doctor_preference_change_requested",
        {
          from:
            "ConfirmTownSelectionPage",

          symptomId,

          symptomName:
            selectedSymptom?.name ||
            null,

          currentPreference:
            doctorPreference,
        }
      );


      navigate(
        "/dr-preference",
        {
          state: {
            symptomId,
            doctorPreference,
            locationMethod,
          },
        }
      );
    };


  // --------------------------------------------------
  // CHANGE LOCATION METHOD
  // --------------------------------------------------

  const handleLocationMethodChange =
    () => {

      trackClick(
        "change_location_method",
        "ConfirmTownSelectionPage"
      );

      trackInteraction(
        "location_method_change_requested",
        {
          from:
            "ConfirmTownSelectionPage",

          symptomId,

          symptomName:
            selectedSymptom?.name ||
            null,

          currentLocationMethod:
            locationMethod,
        }
      );


      navigate(
        "/location",
        {
          state: {
            symptomId,
            doctorPreference,
            locationMethod,
          },
        }
      );
    };


  // --------------------------------------------------
  // BACK
  // --------------------------------------------------

  const handleBack = () => {

    trackBackClick(
      "ConfirmTownSelectionPage_back"
    );

    trackInteraction(
      "back_navigation",
      {
        from:
          "ConfirmTownSelectionPage",
      }
    );

    navigate(-1);
  };


  // --------------------------------------------------
  // RENDER
  // --------------------------------------------------

  return (

    <div
      style={{
        minHeight: "100vh",
        background: "#F8FAFC",
      }}
    >

      {/* =========================================
          HEADER
      ========================================= */}

      <Header />


      {/* =========================================
          PAGE CONTAINER
      ========================================= */}

      <div
        style={{
          width: "100%",
          maxWidth: "1250px",
          margin: "0 auto",

          padding: isMobile
            ? "20px 15px 40px"
            : "30px 30px 50px",

          boxSizing: "border-box",
        }}
      >


        {/* =========================================
            PROGRESS TRACKER
        ========================================= */}

        <ProgressTracker
          steps={guidedSteps}
          currentStep={2}
        />


        {/* =========================================
            SUMMARY BAR
        ========================================= */}

        <SummaryBar

          selectedSymptom={
            selectedSymptom
          }

          doctorPreference={
            doctorPreference
          }

          locationMethod={
            locationMethod
          }

          onChangeSymptom={
            handleSymptomChange
          }

          onChangeDoctorPreference={
            handleDoctorPreferenceChange
          }

          onChangeLocationMethod={
            handleLocationMethodChange
          }

        />


        {/* =========================================
            MAIN LAYOUT
        ========================================= */}

        <div
          style={{
            display: "flex",

            gap: isMobile
              ? "25px"
              : "35px",

            alignItems:
              "flex-start",

            marginTop: "25px",

            flexDirection:
              isMobile
                ? "column"
                : "row",
          }}
        >


          {/* =====================================
              LEFT CONTENT
          ===================================== */}

          <div
            style={{
              flex: 1,
              width: "100%",
              minWidth: 0,
            }}
          >


            {/* =================================
                TITLE
            ================================= */}

            <div
              style={{
                textAlign: "center",

                marginBottom:
                  isMobile
                    ? "25px"
                    : "30px",
              }}
            >

              <h1
                style={{
                  fontSize:
                    isMobile
                      ? "28px"
                      : "42px",

                  lineHeight: "1.3",

                  color: "#0F172A",

                  margin:
                    "0 0 10px 0",

                  fontWeight: "700",
                }}
              >
                Select your town
              </h1>


              <p
                style={{
                  color: "#64748B",

                  fontSize:
                    isMobile
                      ? "14px"
                      : "17px",

                  lineHeight: "1.6",

                  margin: 0,
                }}
              >
                Choose the town where you
                would like to visit a doctor.
              </p>


              {/* PRIVACY MESSAGE */}

              <div
                style={{
                  marginTop: "12px",

                  color: "#94A3B8",

                  fontSize:
                    isMobile
                      ? "11px"
                      : "14px",

                  display: "flex",

                  justifyContent:
                    "center",

                  alignItems:
                    "flex-start",

                  gap: "7px",

                  lineHeight: "1.5",
                }}
              >

                <FaLock
                  style={{
                    marginTop: "2px",
                    flexShrink: 0,
                  }}
                />

                <span>
                  Your location is only used
                  for booking purposes
                </span>

              </div>

            </div>


            {/* =================================
                TOWN SELECTION CARD
            ================================= */}

            <div
              style={{
                background:
                  "#FFFFFF",

                borderRadius:
                  "20px",

                padding:
                  isMobile
                    ? "20px"
                    : "25px",

                marginBottom:
                  "20px",

                boxShadow:
                  "0 5px 15px rgba(0,0,0,.05)",

                boxSizing:
                  "border-box",
              }}
            >

              <div
                style={{
                  display: "flex",

                  alignItems:
                    "center",

                  gap: "10px",

                  marginBottom:
                    "8px",
                }}
              >

                <div
                  style={{
                    width:
                      isMobile
                        ? "38px"
                        : "42px",

                    height:
                      isMobile
                        ? "38px"
                        : "42px",

                    borderRadius:
                      "12px",

                    background:
                      "#DBEAFE",

                    display:
                      "flex",

                    justifyContent:
                      "center",

                    alignItems:
                      "center",

                    flexShrink: 0,
                  }}
                >

                  <FaMapMarkerAlt
                    color="#2563EB"
                    size={
                      isMobile
                        ? 16
                        : 18
                    }
                  />

                </div>


                <h3
                  style={{
                    margin: 0,

                    fontSize:
                      isMobile
                        ? "17px"
                        : "20px",

                    color:
                      "#0F172A",
                  }}
                >
                  Choose a town
                </h3>

              </div>


              <p
                style={{
                  color:
                    "#64748B",

                  margin:
                    "0 0 18px 0",

                  fontSize:
                    isMobile
                      ? "13px"
                      : "15px",
                }}
              >
                Select one of the towns below.
              </p>


              {/* TOWNS */}

              <div
                style={{
                  display: "grid",

                  gridTemplateColumns:
                    isMobile
                      ? "repeat(2, 1fr)"
                      : "repeat(3, 1fr)",

                  gap:
                    isMobile
                      ? "9px"
                      : "12px",
                }}
              >

                {towns.map(
                  (town) => (

                    <button
                      key={town}

                      type="button"

                      onClick={() =>
                        handleTownSelect(
                          town
                        )
                      }

                      style={{
                        position:
                          "relative",

                        padding:
                          isMobile
                            ? "12px 7px"
                            : "14px 10px",

                        borderRadius:
                          "12px",

                        cursor:
                          "pointer",

                        border:
                          selectedTown ===
                          town

                            ? "2px solid #2563EB"

                            : "1px solid #E2E8F0",

                        background:
                          selectedTown ===
                          town

                            ? "#EFF6FF"

                            : "#F8FAFC",

                        color:
                          selectedTown ===
                          town

                            ? "#2563EB"

                            : "#334155",

                        fontWeight:
                          selectedTown ===
                          town

                            ? "600"

                            : "500",

                        fontSize:
                          isMobile
                            ? "12px"
                            : "14px",

                        transition:
                          "all .2s ease",
                      }}
                    >

                      {town}

                      {selectedTown ===
                        town && (

                        <FaCheckCircle
                          size={
                            isMobile
                              ? 13
                              : 15
                          }

                          color="#2563EB"

                          style={{
                            position:
                              "absolute",

                            top: "7px",

                            right: "7px",
                          }}
                        />

                      )}

                    </button>

                  )
                )}

              </div>

            </div>


            {/* =================================
                AREA CARD
            ================================= */}

            <div
              style={{
                background:
                  "#FFFFFF",

                borderRadius:
                  "20px",

                padding:
                  isMobile
                    ? "20px"
                    : "25px",

                marginBottom:
                  "20px",

                boxShadow:
                  "0 5px 15px rgba(0,0,0,.05)",

                boxSizing:
                  "border-box",
              }}
            >

              <div
                style={{
                  display: "flex",

                  alignItems:
                    "center",

                  gap: "10px",

                  marginBottom:
                    "8px",
                }}
              >

                <div
                  style={{
                    width:
                      isMobile
                        ? "38px"
                        : "42px",

                    height:
                      isMobile
                        ? "38px"
                        : "42px",

                    borderRadius:
                      "12px",

                    background:
                      "#EFF6FF",

                    display:
                      "flex",

                    justifyContent:
                      "center",

                    alignItems:
                      "center",

                    flexShrink: 0,
                  }}
                >

                  <FaSearch
                    color="#2563EB"
                    size={
                      isMobile
                        ? 16
                        : 18
                    }
                  />

                </div>


                <h3
                  style={{
                    margin: 0,

                    fontSize:
                      isMobile
                        ? "17px"
                        : "20px",

                    color:
                      "#0F172A",
                  }}
                >
                  Can't find your town?
                </h3>

              </div>


              <p
                style={{
                  color:
                    "#64748B",

                  margin:
                    "0 0 12px 0",

                  fontSize:
                    isMobile
                      ? "13px"
                      : "15px",

                  lineHeight:
                    "1.5",
                }}
              >
                Type your area or suburb
                instead.
              </p>


              {/* SEARCH INPUT */}

              <div
                style={{
                  position:
                    "relative",
                }}
              >

                <FaSearch
                  style={{
                    position:
                      "absolute",

                    left: "15px",

                    top: "50%",

                    transform:
                      "translateY(-50%)",

                    color:
                      "#94A3B8",

                    pointerEvents:
                      "none",
                  }}
                />


                <input
                  value={area}

                  onChange={
                    handleAreaChange
                  }

                  placeholder=
                    "e.g. Wattala, Moratuwa"

                  style={{
                    width: "100%",

                    padding:
                      isMobile
                        ? "12px 14px 12px 40px"
                        : "13px 14px 13px 42px",

                    borderRadius:
                      "12px",

                    border:
                      area.trim()
                        ? "2px solid #2563EB"
                        : "1px solid #CBD5E1",

                    outline:
                      "none",

                    boxSizing:
                      "border-box",

                    fontSize:
                      isMobile
                        ? "13px"
                        : "14px",

                    color:
                      "#0F172A",
                  }}
                />

              </div>

            </div>


            {/* =================================
                SELECTED LOCATION PREVIEW
            ================================= */}

            <div
              style={{
                background:
                  finalLocation
                    ? "#EFF6FF"
                    : "#F8FAFC",

                border:
                  finalLocation
                    ? "1px solid #BFDBFE"
                    : "1px solid #E2E8F0",

                borderRadius:
                  "15px",

                padding:
                  isMobile
                    ? "13px"
                    : "15px 18px",

                marginBottom:
                  "20px",

                display:
                  "flex",

                alignItems:
                  "center",

                gap: "10px",

                boxSizing:
                  "border-box",
              }}
            >

              <FaMapMarkerAlt
                color={
                  finalLocation
                    ? "#2563EB"
                    : "#94A3B8"
                }
              />

              <div
                style={{
                  minWidth: 0,
                }}
              >

                <div
                  style={{
                    fontSize:
                      isMobile
                        ? "11px"
                        : "12px",

                    color:
                      "#64748B",

                    marginBottom:
                      "3px",
                  }}
                >
                  Selected location
                </div>


                <div
                  style={{
                    fontSize:
                      isMobile
                        ? "13px"
                        : "14px",

                    fontWeight:
                      "600",

                    color:
                      finalLocation
                        ? "#2563EB"
                        : "#94A3B8",

                    wordBreak:
                      "break-word",
                  }}
                >
                  {finalLocation ||
                    "No location selected"}
                </div>

              </div>

            </div>


            {/* =================================
                CONTINUE BUTTON
            ================================= */}

            <button
              type="button"

              onClick={
                handleContinue
              }

              disabled={
                !finalLocation
              }

              style={{
                width: "100%",

                padding:
                  isMobile
                    ? "14px"
                    : "15px",

                borderRadius:
                  "12px",

                border: "none",

                background:
                  finalLocation
                    ? "#2563EB"
                    : "#CBD5E1",

                color:
                  "#FFFFFF",

                cursor:
                  finalLocation
                    ? "pointer"
                    : "not-allowed",

                fontSize:
                  isMobile
                    ? "14px"
                    : "15px",

                fontWeight:
                  "600",

                boxShadow:
                  finalLocation
                    ? "0 8px 18px rgba(37,99,235,.20)"
                    : "none",

                transition:
                  "all .2s ease",
              }}
            >
              Continue to find doctors
            </button>

          </div>


          {/* =====================================
              RIGHT PANEL
          ===================================== */}

          <div
            style={{
              width:
                isMobile
                  ? "100%"
                  : "350px",

              flexShrink: 0,
            }}
          >

            <div
              style={{
                background:
                  "#FFFFFF",

                borderRadius:
                  "20px",

                padding:
                  isMobile
                    ? "20px"
                    : "25px",

                boxShadow:
                  "0 5px 15px rgba(0,0,0,.05)",

                boxSizing:
                  "border-box",
              }}
            >

              <h3
                style={{
                  margin:
                    "0 0 20px 0",

                  color:
                    "#0F172A",

                  fontSize:
                    isMobile
                      ? "18px"
                      : "20px",
                }}
              >
                Your booking journey
              </h3>


              {/* STEP 1 */}

              <div
                style={{
                  display:
                    "flex",

                  alignItems:
                    "center",

                  gap: "12px",
                }}
              >

                <div
                  style={{
                    width: "42px",
                    height: "42px",

                    borderRadius:
                      "12px",

                    background:
                      "#DBEAFE",

                    display:
                      "flex",

                    justifyContent:
                      "center",

                    alignItems:
                      "center",

                    flexShrink: 0,
                  }}
                >

                  <FaMapMarkerAlt
                    color="#2563EB"
                  />

                </div>


                <div>

                  <div
                    style={{
                      fontWeight:
                        "600",

                      color:
                        "#0F172A",

                      fontSize:
                        "14px",
                    }}
                  >
                    Select town
                  </div>


                  <div
                    style={{
                      fontSize:
                        "12px",

                      color:
                        "#64748B",

                      marginTop:
                        "3px",
                    }}
                  >
                    Choose where you
                    want to visit
                  </div>

                </div>

              </div>


              {/* CONNECTOR */}

              <div
                style={{
                  width: "2px",
                  height: "25px",

                  background:
                    "#DBEAFE",

                  marginLeft:
                    "20px",
                }}
              />


              {/* STEP 2 */}

              <div
                style={{
                  display:
                    "flex",

                  alignItems:
                    "center",

                  gap: "12px",
                }}
              >

                <div
                  style={{
                    width: "42px",
                    height: "42px",

                    borderRadius:
                      "12px",

                    background:
                      "#EFF6FF",

                    display:
                      "flex",

                    justifyContent:
                      "center",

                    alignItems:
                      "center",

                    flexShrink: 0,
                  }}
                >

                  <FaUserMd
                    color="#2563EB"
                  />

                </div>


                <div>

                  <div
                    style={{
                      fontWeight:
                        "600",

                      color:
                        "#0F172A",

                      fontSize:
                        "14px",
                    }}
                  >
                    Find doctors
                  </div>


                  <div
                    style={{
                      fontSize:
                        "12px",

                      color:
                        "#64748B",

                      marginTop:
                        "3px",
                    }}
                  >
                    View available
                    specialists
                  </div>

                </div>

              </div>


              {/* CONNECTOR */}

              <div
                style={{
                  width: "2px",
                  height: "25px",

                  background:
                    "#DBEAFE",

                  marginLeft:
                    "20px",
                }}
              />


              {/* STEP 3 */}

              <div
                style={{
                  display:
                    "flex",

                  alignItems:
                    "center",

                  gap: "12px",
                }}
              >

                <div
                  style={{
                    width: "42px",
                    height: "42px",

                    borderRadius:
                      "12px",

                    background:
                      "#EFF6FF",

                    display:
                      "flex",

                    justifyContent:
                      "center",

                    alignItems:
                      "center",

                    flexShrink: 0,
                  }}
                >

                  <FaCalendarAlt
                    color="#2563EB"
                  />

                </div>


                <div>

                  <div
                    style={{
                      fontWeight:
                        "600",

                      color:
                        "#0F172A",

                      fontSize:
                        "14px",
                    }}
                  >
                    Book appointment
                  </div>


                  <div
                    style={{
                      fontSize:
                        "12px",

                      color:
                        "#64748B",

                      marginTop:
                        "3px",
                    }}
                  >
                    Choose a suitable
                    time slot
                  </div>

                </div>

              </div>


              {/* DIVIDER */}

              <div
                style={{
                  height: "1px",

                  background:
                    "#E2E8F0",

                  margin:
                    "25px 0 20px 0",
                }}
              />


              {/* BOOKING SUMMARY */}

              <h4
                style={{
                  margin:
                    "0 0 15px 0",

                  color:
                    "#64748B",

                  fontSize:
                    "13px",

                  fontWeight:
                    "600",
                }}
              >
                BOOKING SUMMARY
              </h4>


              {/* PROBLEM */}

              <div
                style={{
                  display:
                    "flex",

                  justifyContent:
                    "space-between",

                  gap: "10px",

                  marginBottom:
                    "12px",
                }}
              >

                <span
                  style={{
                    color:
                      "#64748B",

                    fontSize:
                      "12px",
                  }}
                >
                  Health Problem
                </span>


                <span
                  style={{
                    fontWeight:
                      "600",

                    color:
                      "#0F172A",

                    fontSize:
                      "12px",

                    textAlign:
                      "right",
                  }}
                >
                  {
                    selectedSymptom?.title ||
                    selectedSymptom?.name ||
                    "Not selected"
                  }
                </span>

              </div>


              {/* PREFERENCE */}

              <div
                style={{
                  display:
                    "flex",

                  justifyContent:
                    "space-between",

                  gap: "10px",

                  marginBottom:
                    "12px",
                }}
              >

                <span
                  style={{
                    color:
                      "#64748B",

                    fontSize:
                      "12px",
                  }}
                >
                  Doctor Preference
                </span>


                <span
                  style={{
                    fontWeight:
                      "600",

                    color:
                      "#0F172A",

                    fontSize:
                      "12px",

                    textAlign:
                      "right",
                  }}
                >
                  {
                    doctorPreference ||
                    "No Preference"
                  }
                </span>

              </div>


              {/* LOCATION */}

              <div
                style={{
                  display:
                    "flex",

                  justifyContent:
                    "space-between",

                  gap: "10px",
                }}
              >

                <span
                  style={{
                    color:
                      "#64748B",

                    fontSize:
                      "12px",
                  }}
                >
                  Location
                </span>


                <span
                  style={{
                    fontWeight:
                      "600",

                    color:
                      "#2563EB",

                    fontSize:
                      "12px",

                    textAlign:
                      "right",

                    wordBreak:
                      "break-word",
                  }}
                >
                  {
                    finalLocation ||
                    "Not selected"
                  }
                </span>

              </div>

            </div>

          </div>

        </div>


        {/* =========================================
            BACK BUTTON
        ========================================= */}

        <button
          type="button"

          onClick={
            handleBack
          }

          style={{
            marginTop:
              "25px",

            padding:
              isMobile
                ? "9px 14px"
                : "10px 18px",

            borderRadius:
              "10px",

            border:
              "1px solid #CBD5E1",

            background:
              "#FFFFFF",

            color:
              "#334155",

            cursor:
              "pointer",

            display:
              "flex",

            alignItems:
              "center",

            gap: "7px",

            fontSize:
              isMobile
                ? "13px"
                : "14px",

            fontWeight:
              "600",
          }}
        >

          <FaArrowLeft />

          Back

        </button>

      </div>

    </div>
  );
}