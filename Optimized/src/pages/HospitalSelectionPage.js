
import { useState, useContext, useEffect, useRef, } from "react";
import { useNavigate } from "react-router-dom";

import Header from "../components/Header";
import ProgressTracker from "../components/ProgressTracker";
import hospitals from "../data/hospitals";
import doctorHospitalAvailability from "../data/doctorHospitalAvailability";
import useIsMobile from "../hooks/useIsMobile";

import { TrackingContext } from "../context/TrackingContext";

import {
  FaHospital,
  FaMapMarkerAlt,
  FaStar,
  FaSearch,
  FaUserMd,
  FaClock,
  FaArrowLeft,
  FaArrowRight,
  FaSortAmountDown
} from "react-icons/fa";

export default function HospitalSelectionPage() {

  const navigate = useNavigate();
  const isMobile = useIsMobile();

  const {
  startNewTest,
  trackPageVisit,
  trackClick,
  trackInteraction,
  trackHesitation,
  trackBackClick
} = useContext(TrackingContext);

useEffect(() => {

  startNewTest("hospital_name");

  trackPageVisit("HospitalSelectionPage");

  pageStartTimeRef.current = Date.now();

}, [
  startNewTest,
  trackPageVisit
]);

  const [search, setSearch] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState("availability");

  const pageStartTimeRef = useRef(null);

  const hospitalSearchSteps = [
    "Hospital Search",
    "Symptoms",
    "Doctor Preference",
    "Doctors",
    "Appointment",
    "Confirmation"
  ];

  // --------------------------------------------------
  // HOSPITAL DATA
  // --------------------------------------------------

  const hospitalData = hospitals.map((hospital) => {

    const hospitalDoctors =
      doctorHospitalAvailability.filter(
        (item) =>
          item.hospitalId === hospital.id
      );

    const doctorCount =
      hospitalDoctors.length;

    const hasTodaySlot =
      hospitalDoctors.some(
        (doctor) =>
          doctor.nextSlot.includes("Today")
      );

    const hasTomorrowSlot =
      hospitalDoctors.some(
        (doctor) =>
          doctor.nextSlot.includes("Tomorrow")
      );

    let earliestSlot = "No slots";
    let availabilityRank = 99;

    if (hasTodaySlot) {
      earliestSlot = "Today";
      availabilityRank = 1;
    } else if (hasTomorrowSlot) {
      earliestSlot = "Tomorrow";
      availabilityRank = 2;
    }

    return {
      ...hospital,
      doctors: doctorCount,
      earliestSlot,
      availabilityRank,
      recommended: hasTodaySlot
    };
  });

  // --------------------------------------------------
  // SEARCH
  // --------------------------------------------------

  const filteredHospitals =
    hospitalData.filter((hospital) =>
      hospital.name
        .toLowerCase()
        .includes(search.toLowerCase())
    );

  // --------------------------------------------------
  // SORT
  // --------------------------------------------------

  const sortedHospitals =
    [...filteredHospitals].sort((a, b) => {

      if (sortBy === "rating") {
        return b.rating - a.rating;
      }

      if (sortBy === "distance") {
        return a.distance - b.distance;
      }

      return (
        a.availabilityRank -
        b.availabilityRank
      );
    });

  // --------------------------------------------------
  // SELECT HOSPITAL
  // --------------------------------------------------

  const handleSelectHospital = (hospital) => {

    if (pageStartTimeRef.current) {

    const hesitationSeconds =
      (Date.now() - pageStartTimeRef.current) / 1000;

    // Only record meaningful hesitation
    if (hesitationSeconds > 5) {

      trackHesitation(
        Number(hesitationSeconds.toFixed(2))
      );

    }
  }

  // --------------------------------------------
  // CLICK
  // --------------------------------------------

  
     trackClick(
    "Select Hospital",
    "HospitalSelectionPage"
  );

  trackInteraction(
    "HOSPITAL_SELECTED",
    {
      hospitalId: hospital.id,
      hospitalName: hospital.name
    }
  );

    navigate("/hospital-symptoms", {
      state: {
        hospital
      }
    });

  };

  // --------------------------------------------------
  // BACK
  // --------------------------------------------------

  const handleBack = () => {
     trackBackClick(
    "HospitalSelectionPage"
  );

    navigate(-1);
  };

  return (

    <div
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(to bottom,#F8FAFC,#EFF6FF)",
        paddingBottom: isMobile
          ? "90px"
          : "70px",
        boxSizing: "border-box"
      }}
    >

      <Header />

      {/* STEP */}

      <h4
        style={{
          textAlign: "center",
          color: "#6B7280",
          marginTop: isMobile
            ? "15px"
            : "20px",
          marginBottom: "10px",
          fontSize: isMobile
            ? "13px"
            : "15px"
        }}
      >
        Step 1 of 6
      </h4>

      {/* PROGRESS */}

      <ProgressTracker
        currentStep={0}
        steps={hospitalSearchSteps}
      />

      {/* MAIN CONTAINER */}

      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: isMobile
            ? "20px 15px 30px"
            : "30px 20px 40px",
          boxSizing: "border-box"
        }}
      >

        {/* TITLE */}

        <div
          style={{
            textAlign: "center",
            marginBottom: isMobile
              ? "22px"
              : "25px"
          }}
        >

          <h1
            style={{
              fontSize: isMobile
                ? "28px"
                : "42px",
              lineHeight: "1.3",
              color: "#0F172A",
              margin:
                "0 0 10px 0"
            }}
          >
            Select your hospital
          </h1>

          <p
            style={{
              color: "#64748B",
              fontSize: isMobile
                ? "14px"
                : "18px",
              lineHeight: "1.6",
              margin: 0
            }}
          >
            Showing hospitals where
            doctors are available
          </p>

        </div>

        

        {/* GUIDANCE */}

        <div
          style={{
            background: "#EFF6FF",
            border:
              "1px solid #BFDBFE",
            borderRadius: "14px",
            padding: isMobile
              ? "13px"
              : "15px",
            marginBottom: "20px",
            color: "#1E40AF",
            textAlign: "center",
            fontSize: isMobile
              ? "12px"
              : "14px",
            lineHeight: "1.6",
            boxSizing: "border-box"
          }}
        >
          You are shown hospitals where
          relevant doctors are available.
          
        </div>

        {/* SEARCH */}

        <div
          style={{
            background: "#FFFFFF",
            borderRadius: "18px",
            padding: isMobile
              ? "15px"
              : "20px",
            marginBottom: "15px",
            border:
              "1px solid #E2E8F0",
            boxSizing: "border-box"
          }}
        >

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
              type="text"
              value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            onBlur={() => {

              if (search.trim()) {

                trackInteraction(
                  "HOSPITAL_SEARCH",
                  {
                    searchTerm: search
                  }
                );

              }

            }}
              placeholder="Search hospital name"
              style={{
                width: "100%",
                padding: isMobile
                  ? "13px 14px 13px 42px"
                  : "14px 16px 14px 45px",
                borderRadius: "12px",
                border:
                  "1px solid #CBD5E1",
                fontSize: isMobile
                  ? "14px"
                  : "15px",
                outline: "none",
                boxSizing: "border-box"
              }}
            />

          </div>

        </div>

        {/* SORT */}

        <div
          style={{
            marginBottom: "20px"
          }}
        >

          <button
            onClick={() =>
              setShowFilters(
                !showFilters
              )
            }
            style={{
              background: "#FFFFFF",
              border:
                "1px solid #E2E8F0",
              borderRadius: "12px",
              padding: isMobile
                ? "10px 14px"
                : "12px 18px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              fontWeight: "600",
              fontSize: isMobile
                ? "13px"
                : "14px"
            }}
          >

            <FaSortAmountDown />

            Sort Hospitals

          </button>

          {showFilters && (

            <div
              style={{
                background: "#FFFFFF",
                borderRadius: "16px",
                padding: isMobile
                  ? "15px"
                  : "18px",
                marginTop: "10px",
                border:
                  "1px solid #E2E8F0"
              }}
            >

              <div
                style={{
                  marginBottom: "8px",
                  color: "#64748B",
                  fontSize: "13px"
                }}
              >
                Sort by
              </div>

              <select
                value={sortBy}
                onChange={(e) => {

                const value = e.target.value;

                setSortBy(value);

                trackInteraction(
                  "HOSPITAL_SORT",
                  {
                    sortBy: value
                  }
                );

              }}
                style={{
                  padding: "11px",
                  borderRadius: "12px",
                  border:
                    "1px solid #CBD5E1",
                  width: isMobile
                    ? "100%"
                    : "250px",
                  boxSizing: "border-box"
                }}
              >

                <option value="availability">
                  Earliest Availability
                </option>

                <option value="distance">
                  Distance
                </option>

                <option value="rating">
                  Rating
                </option>

              </select>

            </div>

          )}

        </div>

        {/* HOSPITAL LIST */}

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "18px"
          }}
        >

          {sortedHospitals.map(
            (hospital) => (

            <div
              key={hospital.id}
              style={{
                background: "#FFFFFF",
                borderRadius: "22px",
                padding: isMobile
                  ? "18px"
                  : "22px",
                border:
                  "1px solid #E5E7EB",
                boxShadow:
                  "0 4px 16px rgba(15,23,42,0.05)",
                boxSizing: "border-box"
              }}
            >

              {/* RECOMMENDED */}

              {hospital.recommended && (

                <div
                  style={{
                    display:
                      "inline-flex",
                    alignItems:
                      "center",
                    gap: "6px",
                    background:
                      "#DCFCE7",
                    color:
                      "#15803D",
                    padding:
                      "5px 10px",
                    borderRadius:
                      "999px",
                    fontSize: "12px",
                    fontWeight: "600",
                    marginBottom:
                      "14px"
                  }}
                >

                  <FaStar size={11} />

                  Recommended

                </div>

              )}

              {/* CARD CONTENT */}

              <div
                style={{
                  display: "flex",
                  justifyContent:
                    "space-between",
                  alignItems: isMobile
                    ? "stretch"
                    : "center",
                  flexDirection: isMobile
                    ? "column"
                    : "row",
                  gap: isMobile
                    ? "18px"
                    : "24px"
                }}
              >

                {/* LEFT */}

                <div
                  style={{
                    display: "flex",
                    gap: isMobile
                      ? "12px"
                      : "16px",
                    flex: 1,
                    minWidth: 0
                  }}
                >

                  {/* ICON */}

                  <div
                    style={{
                      width: isMobile
                        ? "48px"
                        : "56px",
                      height: isMobile
                        ? "48px"
                        : "56px",
                      borderRadius:
                        "14px",
                      background:
                        "#EEF4FF",
                      display: "flex",
                      alignItems:
                        "center",
                      justifyContent:
                        "center",
                      flexShrink: 0
                    }}
                  >

                    <FaHospital
                      size={isMobile
                        ? 21
                        : 24}
                      color="#2F6FED"
                    />

                  </div>

                  {/* CONTENT */}

                  <div
                    style={{
                      flex: 1,
                      minWidth: 0
                    }}
                  >

                    {/* TITLE */}

                    <div
                      style={{
                        display: "flex",
                        alignItems:
                          "center",
                        gap: "8px",
                        flexWrap:
                          "wrap"
                      }}
                    >

                      <h3
                        style={{
                          margin: 0,
                          color:
                            "#0F172A",
                          fontSize:
                            isMobile
                              ? "17px"
                              : "20px",
                          lineHeight:
                            "1.4",
                          wordBreak:
                            "break-word"
                        }}
                      >
                        {hospital.name}
                      </h3>

                      <span
                        style={{
                          background:
                            "#EFF6FF",
                          color:
                            "#2563EB",
                          padding:
                            "3px 8px",
                          borderRadius:
                            "999px",
                          fontSize:
                            "10px",
                          fontWeight:
                            "600"
                        }}
                      >
                        Multi Specialty
                      </span>

                    </div>

                    {/* LOCATION */}

                    <div
                      style={{
                        marginTop: "6px",
                        display:
                          "flex",
                        alignItems:
                          "center",
                        gap: "6px",
                        color:
                          "#64748B",
                        fontSize:
                          isMobile
                            ? "12px"
                            : "14px"
                      }}
                    >

                      <FaMapMarkerAlt
                        size={11}
                      />

                      {hospital.location}

                    </div>

                    {/* STATS */}

                    <div
                      style={{
                        display:
                          "flex",
                        gap: "10px",
                        flexWrap:
                          "wrap",
                        marginTop:
                          "10px",
                        fontSize:
                          isMobile
                            ? "12px"
                            : "14px"
                      }}
                    >

                      <span
                        style={{
                          display:
                            "flex",
                          alignItems:
                            "center",
                          gap: "4px",
                          color:
                            "#F59E0B"
                        }}
                      >

                        <FaStar />

                        {hospital.rating}

                      </span>

                      <span
                        style={{
                          color:
                            "#CBD5E1"
                        }}
                      >
                        •
                      </span>

                      <span
                        style={{
                          display:
                            "flex",
                          alignItems:
                            "center",
                          gap: "5px",
                          color:
                            "#334155"
                        }}
                      >

                        <FaUserMd />

                        {hospital.doctors}
                        {" "}
                        Available Doctors

                      </span>

                    </div>

                    {/* FEE / SLOT / DISTANCE */}

                    <div
                      style={{
                        display:
                          "flex",
                        gap: "15px",
                        marginTop:
                          "12px",
                        flexWrap:
                          "wrap",
                        fontSize:
                          isMobile
                            ? "12px"
                            : "14px"
                      }}
                    >

                      <span
                        style={{
                          color:
                            "#10B981",
                          fontWeight:
                            "600"
                        }}
                      >
                        {hospital.fee}
                      </span>

                      <span
                        style={{
                          color:
                            "#2563EB",
                          fontWeight:
                            "600",
                          display:
                            "flex",
                          alignItems:
                            "center",
                          gap: "4px"
                        }}
                      >

                        <FaClock />

                        {hospital.earliestSlot}

                      </span>

                      <span
                        style={{
                          color:
                            "#F04410",
                          display:
                            "flex",
                          alignItems:
                            "center",
                          gap: "4px"
                        }}
                      >

                        <FaMapMarkerAlt />

                        {hospital.distance}
                        {" "}km

                      </span>

                    </div>

                  </div>

                </div>

                {/* SELECT HOSPITAL */}

                <button
                  onClick={() =>
                    handleSelectHospital(
                      hospital
                    )
                  }
                  style={{
                    alignSelf:
                      isMobile
                        ? "stretch"
                        : "center",
                    width: isMobile
                      ? "100%"
                      : "auto",
                    background:
                      "#2563EB",
                    color:
                      "#FFFFFF",
                    border:
                      "none",
                    borderRadius:
                      "12px",
                    padding:
                      isMobile
                        ? "13px 18px"
                        : "12px 18px",
                    fontWeight:
                      "600",
                    fontSize:
                      isMobile
                        ? "13px"
                        : "14px",
                    cursor:
                      "pointer",
                    minWidth:
                      isMobile
                        ? "0"
                        : "150px",
                    display:
                      "flex",
                    alignItems:
                      "center",
                    justifyContent:
                      "center",
                    gap: "7px",
                    flexShrink: 0
                  }}
                >

                  Select Hospital

                  <FaArrowRight />

                </button>

              </div>

              {/* DIVIDER */}

              <div
                style={{
                  marginTop: "18px",
                  borderTop:
                    "1px solid #F1F5F9",
                  paddingTop: "14px"
                }}
              >

                <div
                  style={{
                    color: "#64748B",
                    fontSize:
                      isMobile
                        ? "12px"
                        : "13px",
                    lineHeight: "1.7"
                  }}
                >

                  {hospital.recommended
                    ? "Recommended based on specialist availability and earliest appointment slots."
                    : "Available specialists and appointment slots are updated in real time."}

                </div>

              </div>

            </div>

          ))}

        </div>

        {/* NO RESULTS */}

        {sortedHospitals.length === 0 && (

          <div
            style={{
              background: "#FFFFFF",
              borderRadius: "18px",
              padding: isMobile
                ? "30px 20px"
                : "40px",
              textAlign: "center",
              border:
                "1px solid #E2E8F0"
            }}
          >

            <FaHospital
              size={40}
              color="#94A3B8"
            />

            <h3
              style={{
                color: "#0F172A"
              }}
            >
              No hospitals found
            </h3>

            <p
              style={{
                color: "#64748B",
                fontSize:
                  isMobile
                    ? "13px"
                    : "15px"
              }}
            >
              Try searching with a
              different hospital name.
            </p>

          </div>

        )}

        {/* SUPPORT */}

        <div
          style={{
            marginTop: "25px",
            background: "#EFF6FF",
            border:
              "1px solid #BFDBFE",
            borderRadius: "16px",
            padding: isMobile
              ? "14px"
              : "18px",
            color: "#1E40AF",
            textAlign: "center",
            fontSize: isMobile
              ? "12px"
              : "14px",
            lineHeight: "1.6"
          }}
        >
          You are shown hospitals where
          relevant doctors are available.
          This helps reduce unnecessary
          searching.
        </div>

        {/* BACK BUTTON */}

        <div
          style={{
            marginTop: "30px",
            display: "flex",
            justifyContent: "flex-start"
          }}
        >

          <button
            onClick={handleBack}
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              background: "#FFFFFF",
              color: "#2563EB",
              border:
                "1px solid #BFDBFE",
              borderRadius: "12px",
              padding: isMobile
                ? "11px 18px"
                : "12px 20px",
              fontSize: isMobile
                ? "13px"
                : "14px",
              fontWeight: "600",
              cursor: "pointer"
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

