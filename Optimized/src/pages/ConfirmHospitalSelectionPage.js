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
import hospitals from "../data/hospitals";

import { TrackingContext } from "../context/TrackingContext";

import {
  FaHospital,
  FaSearch,
  FaArrowLeft,
  FaArrowRight,
  FaMapMarkerAlt,
  FaCheckCircle,
  FaLock,
} from "react-icons/fa";


export default function ConfirmHospitalSelectionPage() {

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
  // PROGRESS
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

  const symptomId =
    location.state?.symptomId;

  const doctorPreference =
    location.state?.preference ||
    location.state?.doctorPreference ||
    "";

  const locationMethod =
    location.state?.locationMethod ||
    "Hospital";


  const selectedSymptom =
    symptoms.find(
      (symptom) =>
        symptom.id === symptomId
    );


  // --------------------------------------------------
  // PAGE TRACKING
  // --------------------------------------------------

  useEffect(() => {

    pageStartTime.current =
      Date.now();

    decisionTracked.current =
      false;

    trackPageVisit(
      "ConfirmHospitalSelectionPage"
    );

    trackInteraction(
      "page_opened",
      {
        page:
          "ConfirmHospitalSelectionPage",

        symptomId,

        symptomName:
          selectedSymptom?.name ||
          null,

        doctorPreference,

        locationMethod,
      }
    );

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  // --------------------------------------------------
  // SEARCH STATE
  // --------------------------------------------------

  const [search, setSearch] =
    useState("");

  const [selectedHospital, setSelectedHospital] =
    useState(null);


  // --------------------------------------------------
  // FILTER HOSPITALS
  // --------------------------------------------------

  const filteredHospitals =
    hospitals.filter((hospital) =>
      hospital.name
        .toLowerCase()
        .includes(
          search.toLowerCase()
        )
    );


  // --------------------------------------------------
  // SEARCH TRACKING
  // --------------------------------------------------

  const handleSearchChange = (e) => {

    const value =
      e.target.value;

    setSearch(value);

    if (value.trim()) {

      trackInteraction(
        "hospital_search_typed",
        {
          searchTerm: value,
        }
      );

    }
  };


  // --------------------------------------------------
  // HOSPITAL SELECTION
  // --------------------------------------------------

  const handleSelectHospital =
    (hospital) => {

      const now = Date.now();

      const decisionTime =
        (now -
          pageStartTime.current) /
        1000;

      const roundedTime =
        Number(
          decisionTime.toFixed(2)
        );


      // --------------------------------------------
      // HESITATION
      // --------------------------------------------

      if (
        !decisionTracked.current
      ) {

        if (
          decisionTime > 5
        ) {

          trackHesitation(
            roundedTime
          );

        }

        decisionTracked.current =
          true;
      }


      // --------------------------------------------
      // CLICK
      // --------------------------------------------

      trackClick(
        "hospital_selected",
        "ConfirmHospitalSelectionPage"
      );


      // --------------------------------------------
      // INTERACTION
      // --------------------------------------------

      trackInteraction(
        "hospital_confirmed",
        {
          hospitalId:
            hospital.id,

          hospitalName:
            hospital.name,

          symptomId,

          symptomName:
            selectedSymptom?.name ||
            null,

          doctorPreference,

          locationMethod,

          decisionTimeSeconds:
            roundedTime,
        }
      );


      setSelectedHospital(
        hospital
      );


      // --------------------------------------------
      // NEXT PAGE
      // --------------------------------------------

      navigate(
        "/confirmed-hospital-doctors",
        {
          state: {
            symptomId,

            doctorPreference,

            locationMethod,

            hospital,
          },
        }
      );
    };


  // --------------------------------------------------
  // CHANGE SYMPTOM
  // --------------------------------------------------

  const handleSymptomChange =
    () => {

      trackClick(
        "change_symptom",
        "ConfirmHospitalSelectionPage"
      );

      trackInteraction(
        "symptom_change_requested",
        {
          from:
            "ConfirmHospitalSelectionPage",

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
        "ConfirmHospitalSelectionPage"
      );

      trackInteraction(
        "doctor_preference_change_requested",
        {
          from:
            "ConfirmHospitalSelectionPage",

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
        "ConfirmHospitalSelectionPage"
      );

      trackInteraction(
        "location_method_change_requested",
        {
          from:
            "ConfirmHospitalSelectionPage",

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
      "ConfirmHospitalSelectionPage_back"
    );

    trackInteraction(
      "back_navigation",
      {
        from:
          "ConfirmHospitalSelectionPage",
      }
    );

    navigate(-1);
  };


  return (

    <div
      style={{
        minHeight: "100vh",
        background: "#F8FAFC",
      }}
    >

      {/* =================================================
          HEADER
      ================================================= */}

      <Header />


      {/* =================================================
          MAIN CONTAINER
      ================================================= */}

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


        {/* =================================================
            PROGRESS TRACKER
        ================================================= */}

        <ProgressTracker
          steps={guidedSteps}
          currentStep={2}
        />


        {/* =================================================
            SUMMARY BAR
        ================================================= */}

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


        {/* =================================================
            MAIN CONTENT
        ================================================= */}

        <div
          style={{
            maxWidth: "850px",
            margin: "30px auto 0",
          }}
        >


          {/* =================================================
              TITLE
          ================================================= */}

          <div
            style={{
              textAlign: "center",

              marginBottom: isMobile
                ? "25px"
                : "30px",
            }}
          >

            <div
              style={{
                width: isMobile
                  ? "58px"
                  : "68px",

                height: isMobile
                  ? "58px"
                  : "68px",

                margin:
                  "0 auto 18px",

                borderRadius: "18px",

                background:
                  "#DBEAFE",

                display: "flex",

                alignItems:
                  "center",

                justifyContent:
                  "center",
              }}
            >

              <FaHospital
                size={
                  isMobile
                    ? 26
                    : 30
                }
                color="#2563EB"
              />

            </div>


            <h1
              style={{
                fontSize: isMobile
                  ? "28px"
                  : "42px",

                lineHeight: "1.3",

                color: "#0F172A",

                margin:
                  "0 0 10px",

                fontWeight: "700",
              }}
            >
              Select your hospital
            </h1>


            <p
              style={{
                color: "#64748B",

                fontSize: isMobile
                  ? "14px"
                  : "17px",

                lineHeight: "1.6",

                margin: 0,
              }}
            >
              Search for the hospital
              where you want to book
              your appointment.
            </p>


            {/* PRIVACY */}

            <div
              style={{
                marginTop: "12px",

                color: "#94A3B8",

                fontSize: isMobile
                  ? "11px"
                  : "13px",

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
                Your hospital selection
                is only used for booking
                purposes.
              </span>

            </div>

          </div>


          {/* =================================================
              SEARCH CARD
          ================================================= */}

          <div
            style={{
              background: "#FFFFFF",

              borderRadius: "20px",

              padding: isMobile
                ? "18px"
                : "25px",

              boxShadow:
                "0 5px 15px rgba(0,0,0,.05)",

              border:
                "1px solid #E2E8F0",

              boxSizing: "border-box",
            }}
          >

            <div
              style={{
                marginBottom: "12px",

                display: "flex",

                alignItems: "center",

                gap: "8px",
              }}
            >

              <FaHospital
                color="#2563EB"
                size={
                  isMobile
                    ? 17
                    : 19
                }
              />

              <span
                style={{
                  fontWeight: "600",

                  color: "#0F172A",

                  fontSize: isMobile
                    ? "14px"
                    : "16px",
                }}
              >
                Search hospital
              </span>

            </div>


            {/* SEARCH INPUT */}

            <div
              style={{
                position: "relative",
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

                  color: "#94A3B8",

                  pointerEvents:
                    "none",
                }}
              />


              <input
                type="text"

                value={search}

                onChange={
                  handleSearchChange
                }

                placeholder="Search hospital name"

                autoComplete="off"

                style={{
                  width: "100%",

                  padding: isMobile
                    ? "14px 14px 14px 43px"
                    : "15px 16px 15px 45px",

                  borderRadius: "12px",

                  border:
                    search
                      ? "2px solid #2563EB"
                      : "1px solid #CBD5E1",

                  outline: "none",

                  boxSizing:
                    "border-box",

                  fontSize: isMobile
                    ? "14px"
                    : "15px",

                  color: "#0F172A",

                  background:
                    "#FFFFFF",
                }}
              />

            </div>


            {/* =================================================
                SEARCH RESULTS
            ================================================= */}

            {search.trim() && (

              <div
                style={{
                  marginTop: "15px",

                  display: "flex",

                  flexDirection:
                    "column",

                  gap: "10px",
                }}
              >

                {filteredHospitals.length >
                0 ? (

                  filteredHospitals.map(
                    (hospital) => (

                      <button
                        key={
                          hospital.id
                        }

                        onClick={() =>
                          handleSelectHospital(
                            hospital
                          )
                        }

                        style={{
                          width: "100%",

                          textAlign: "left",

                          background:
                            selectedHospital?.id ===
                            hospital.id
                              ? "#EFF6FF"
                              : "#F8FAFC",

                          border:
                            selectedHospital?.id ===
                            hospital.id
                              ? "2px solid #2563EB"
                              : "1px solid #E2E8F0",

                          borderRadius:
                            "14px",

                          padding:
                            isMobile
                              ? "13px"
                              : "15px",

                          cursor:
                            "pointer",

                          display: "flex",

                          alignItems:
                            "center",

                          justifyContent:
                            "space-between",

                          gap: "12px",

                          boxSizing:
                            "border-box",
                        }}
                      >

                        {/* HOSPITAL INFO */}

                        <div
                          style={{
                            display:
                              "flex",

                            alignItems:
                              "center",

                            gap: isMobile
                              ? "10px"
                              : "13px",

                            minWidth: 0,
                          }}
                        >

                          <div
                            style={{
                              width:
                                isMobile
                                  ? "40px"
                                  : "45px",

                              height:
                                isMobile
                                  ? "40px"
                                  : "45px",

                              borderRadius:
                                "11px",

                              background:
                                "#DBEAFE",

                              display:
                                "flex",

                              alignItems:
                                "center",

                              justifyContent:
                                "center",

                              flexShrink: 0,
                            }}
                          >

                            <FaHospital
                              size={
                                isMobile
                                  ? 18
                                  : 20
                              }
                              color="#2563EB"
                            />

                          </div>


                          <div
                            style={{
                              minWidth: 0,
                            }}
                          >

                            <div
                              style={{
                                color:
                                  "#0F172A",

                                fontWeight:
                                  "600",

                                fontSize:
                                  isMobile
                                    ? "14px"
                                    : "16px",

                                wordBreak:
                                  "break-word",
                              }}
                            >
                              {
                                hospital.name
                              }
                            </div>


                            {hospital.location && (

                              <div
                                style={{
                                  display:
                                    "flex",

                                  alignItems:
                                    "center",

                                  gap: "5px",

                                  marginTop:
                                    "4px",

                                  color:
                                    "#64748B",

                                  fontSize:
                                    isMobile
                                      ? "11px"
                                      : "12px",
                                }}
                              >

                                <FaMapMarkerAlt
                                  size={
                                    10
                                  }
                                />

                                {
                                  hospital.location
                                }

                              </div>

                            )}

                          </div>

                        </div>


                        {/* ARROW */}

                        <FaArrowRight
                          color="#2563EB"
                          size={
                            isMobile
                              ? 15
                              : 17
                          }
                          style={{
                            flexShrink: 0,
                          }}
                        />

                      </button>

                    )
                  )

                ) : (

                  /* NO RESULTS */

                  <div
                    style={{
                      padding:
                        isMobile
                          ? "25px 15px"
                          : "30px",

                      textAlign:
                        "center",

                      borderRadius:
                        "14px",

                      background:
                        "#F8FAFC",

                      border:
                        "1px solid #E2E8F0",
                    }}
                  >

                    <FaHospital
                      size={
                        isMobile
                          ? 28
                          : 35
                      }
                      color="#94A3B8"
                    />

                    <h3
                      style={{
                        margin:
                          "10px 0 5px",

                        color:
                          "#0F172A",

                        fontSize:
                          isMobile
                            ? "15px"
                            : "17px",
                      }}
                    >
                      No hospitals found
                    </h3>

                    <p
                      style={{
                        margin: 0,

                        color:
                          "#64748B",

                        fontSize:
                          isMobile
                            ? "12px"
                            : "13px",
                      }}
                    >
                      Try searching with
                      a different hospital
                      name.
                    </p>

                  </div>

                )}

              </div>

            )}


            {/* INITIAL MESSAGE */}

            {!search.trim() && (

              <div
                style={{
                  marginTop: "15px",

                  padding:
                    isMobile
                      ? "13px"
                      : "15px",

                  borderRadius: "12px",

                  background:
                    "#EFF6FF",

                  border:
                    "1px solid #BFDBFE",

                  color:
                    "#1E40AF",

                  fontSize:
                    isMobile
                      ? "12px"
                      : "13px",

                  lineHeight: "1.6",

                  textAlign: "center",
                }}
              >
                Start typing the hospital
                name to search.
              </div>

            )}

          </div>


          {/* =================================================
              SUPPORT / GUIDANCE
          ================================================= */}

          <div
            style={{
              marginTop: "20px",

              background: "#FFFFFF",

              borderRadius: "16px",

              padding: isMobile
                ? "15px"
                : "18px",

              border:
                "1px solid #E2E8F0",

              display: "flex",

              alignItems:
                "flex-start",

              gap: "10px",

              boxSizing: "border-box",
            }}
          >

            <FaCheckCircle
              color="#10B981"
              size={
                isMobile
                  ? 16
                  : 18
              }
              style={{
                marginTop: "2px",
                flexShrink: 0,
              }}
            />

            <div>

              <div
                style={{
                  color:
                    "#0F172A",

                  fontWeight:
                    "600",

                  fontSize:
                    isMobile
                      ? "13px"
                      : "14px",
                }}
              >
                Hospital-based booking
              </div>

              <div
                style={{
                  color:
                    "#64748B",

                  fontSize:
                    isMobile
                      ? "11px"
                      : "13px",

                  lineHeight: "1.6",

                  marginTop: "3px",
                }}
              >
                After selecting a hospital,
                you will see doctors
                available at that hospital.
              </div>

            </div>

          </div>


          {/* =================================================
              BACK BUTTON
          ================================================= */}

          <button
            onClick={handleBack}

            style={{
              marginTop: "25px",

              padding: isMobile
                ? "10px 16px"
                : "11px 18px",

              borderRadius: "10px",

              border:
                "1px solid #CBD5E1",

              background:
                "#FFFFFF",

              color:
                "#334155",

              cursor:
                "pointer",

              display: "flex",

              alignItems:
                "center",

              gap: "7px",

              fontSize:
                isMobile
                  ? "13px"
                  : "14px",

              fontWeight: "600",
            }}
          >

            <FaArrowLeft />

            Back

          </button>

        </div>

      </div>

    </div>
  );
}