import { useLocation, useNavigate } from "react-router-dom";
import { useContext, useEffect, useRef } from "react";

import useIsMobile from "../hooks/useIsMobile";

import Header from "../components/Header";
import ProgressTracker from "../components/ProgressTracker";

import symptoms from "../data/symptoms";
import doctors from "../data/doctors";
import availability from "../data/doctorHospitalAvailability";
import hospitals from "../data/hospitals";

import {
  FaHospital,
  FaCalendarAlt,
  FaUserMd,
  FaArrowLeft,
  FaArrowRight,
  FaInfoCircle,
  FaStar,
  FaCheckCircle,
  FaMapMarkerAlt
} from "react-icons/fa";

import { TrackingContext } from "../context/TrackingContext";


export default function ConfirmedTownRecommendedDoctorsPage() {

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


  // ==========================================================
  // TRACKING
  // ==========================================================

  const pageStartTimeRef = useRef(Date.now());

  const hesitationTrackedRef = useRef(false);


  // ==========================================================
  // DATA FROM PREVIOUS PAGE
  // ==========================================================

  const town =
    location.state?.town ||
    location.state?.selectedTown;

  const symptomId =
    location.state?.symptomId;

  const doctorPreference =
    location.state?.doctorPreference;


  const symptom = symptoms.find(
    (s) => s.id === symptomId
  );


  // ==========================================================
  // PAGE VISIT
  // ==========================================================

  useEffect(() => {

    trackPageVisit(
      "ConfirmedTownRecommendedDoctorsPage"
    );

    trackInteraction(
      "PAGE_VISIT",
      {
        page:
          "ConfirmedTownRecommendedDoctorsPage",

        town,

        symptomId,

        doctorPreference
      }
    );

    pageStartTimeRef.current =
      Date.now();

    hesitationTrackedRef.current =
      false;

  }, []);


  // ==========================================================
  // HESITATION
  // ==========================================================

  const recordHesitation = () => {

    if (
      hesitationTrackedRef.current
    ) {
      return;
    }

    const hesitationSeconds =
      (
        Date.now() -
        pageStartTimeRef.current
      ) / 1000;


    if (hesitationSeconds > 5) {

      const seconds =
        Number(
          hesitationSeconds.toFixed(2)
        );


      trackHesitation(seconds);


      trackInteraction(
        "HESITATION",
        {
          page:
            "ConfirmedTownRecommendedDoctorsPage",

          seconds
        }
      );


      hesitationTrackedRef.current =
        true;
    }
  };


  // ==========================================================
  // GET HOSPITAL TOWN
  // ==========================================================
  /*
   * Adjust this function if your hospital
   * data uses a different town property.
   *
   * Supported examples:
   *
   * hospital.town
   * hospital.city
   * hospital.location.town
   * hospital.location.city
   */

  const getHospitalTown = (hospital) => {
  if (!hospital) {
    return "";
  }

  // If location is directly a string
  if (typeof hospital.location === "string") {
    return hospital.location;
  }

  // If location is an object
  if (hospital.location && typeof hospital.location === "object") {
    return (
      hospital.location.town ||
      hospital.location.city ||
      ""
    );
  }

  // Other possible structures
  return (
    hospital.town ||
    hospital.city ||
    ""
  );
};


  // ==========================================================
  // GET HOSPITALS IN SELECTED TOWN
  // ==========================================================

  const townHospitals =
    hospitals.filter(
      (hospital) => {

        const hospitalTown =
          getHospitalTown(hospital);

        return (
          hospitalTown &&
          hospitalTown.toLowerCase() ===
            String(town || "")
              .toLowerCase()
        );
      }
    );

    console.log("=================================");
console.log("Selected town:", town);
console.log("Hospitals:", hospitals);

hospitals.forEach((hospital) => {
  console.log(
    "Hospital:",
    hospital.name,
    "town:",
    hospital.town,
    "city:",
    hospital.city,
    "location:",
    hospital.location
  );
});
console.log("Town hospitals:", townHospitals);
console.log("=================================");


  // ==========================================================
  // MATCH DOCTORS
  // ==========================================================

  const matchingDoctors = doctors.filter((doctor) => {

  const doctorSpecialty =
    String(doctor.specialty || "")
      .trim()
      .toLowerCase();

  const symptomSpecialty =
    String(symptom?.specialty || "")
      .trim()
      .toLowerCase();

  const specialtyMatches =
    doctorSpecialty === symptomSpecialty;

  const doctorGender =
    String(doctor.gender || "")
      .trim()
      .toLowerCase();

  const preference =
    String(doctorPreference || "")
      .trim()
      .toLowerCase();

  const genderMatches =
    preference === "no preference" ||

    (
      preference === "male doctor" &&
      doctorGender === "male"
    ) ||

    (
      preference === "female doctor" &&
      doctorGender === "female"
    );

  return (
    specialtyMatches &&
    genderMatches
  );
});

    console.log("Symptom:", symptom);
console.log("Symptom specialty:", symptom?.specialty);
console.log("Doctor preference:", doctorPreference);
console.log("Matching doctors:", matchingDoctors);


  // ==========================================================
  // CREATE DOCTOR + TOWN HOSPITAL AVAILABILITY
  // ==========================================================

  const availableDoctors =
    matchingDoctors
      .map((doctor) => {

        /*
         * Find every hospital in the
         * selected town where this doctor
         * has availability.
         */

        const doctorHospitalRecords =
          availability
            .filter(
              (item) => {

                if (
                  item.doctorId !==
                  doctor.id
                ) {
                  return false;
                }


                return townHospitals.some(
                  (hospital) =>
                    hospital.id ===
                    item.hospitalId
                );
              }
            )
            .map((item) => {

              const hospital =
                townHospitals.find(
                  (h) =>
                    h.id ===
                    item.hospitalId
                );


              if (!hospital) {
                return null;
              }


              return {
                ...item,
                hospital
              };
            })
            .filter(Boolean);


        /*
         * Doctor does not have
         * availability in this town.
         */

       if (
        doctorHospitalRecords.length === 0
        ) {
        return null;
        }

        // ----------------------------------------
        // Find earliest hospital appointment
        // ----------------------------------------

        const sortedHospitalRecords =
          [...doctorHospitalRecords]
            .sort(
              (a, b) => {

                const dayA =
                  getDayRank(
                    a.nextSlot
                  );

                const dayB =
                  getDayRank(
                    b.nextSlot
                  );


                if (
                  dayA !== dayB
                ) {
                  return (
                    dayA - dayB
                  );
                }


                return (
                  getTimeInMinutes(
                    a.nextSlot
                  ) -
                  getTimeInMinutes(
                    b.nextSlot
                  )
                );
              }
            );


        const earliestRecord =
          sortedHospitalRecords[0];


        return {

          ...doctor,

          hospital:
            earliestRecord.hospital,

          hospitalId:
            earliestRecord.hospitalId,

          fee:
            earliestRecord.fee,

          nextSlot:
            earliestRecord.nextSlot,

          availableDates:
            earliestRecord.availableDates,

          slots:
            earliestRecord.slots
        };

      })
      .filter(Boolean);

      console.log(
  "Available doctors:",
  availableDoctors
);


  // ==========================================================
  // TIME HELPERS
  // ==========================================================

  function getTimeInMinutes(slot) {

    if (!slot) {
      return Infinity;
    }


    const match =
      slot.match(
        /(\d{1,2}):(\d{2})\s*(AM|PM)/i
      );


    if (!match) {
      return Infinity;
    }


    let hours =
      parseInt(
        match[1],
        10
      );


    const minutes =
      parseInt(
        match[2],
        10
      );


    const period =
      match[3].toUpperCase();


    if (
      period === "PM" &&
      hours !== 12
    ) {
      hours += 12;
    }


    if (
      period === "AM" &&
      hours === 12
    ) {
      hours = 0;
    }


    return (
      hours * 60 +
      minutes
    );
  }


  function getDayRank(slot) {

    if (!slot) {
      return 99;
    }


    const value =
      slot.toLowerCase();


    if (
      value.includes("today")
    ) {
      return 1;
    }


    if (
      value.includes("tomorrow")
    ) {
      return 2;
    }


    return 3;
  }


  // ==========================================================
  // SORT ALL DOCTORS
  // ==========================================================

  const sortedDoctors =
    [...availableDoctors].sort(
      (a, b) => {

        const dayA =
          getDayRank(
            a.nextSlot
          );

        const dayB =
          getDayRank(
            b.nextSlot
          );


        if (
          dayA !== dayB
        ) {
          return (
            dayA - dayB
          );
        }


        return (
          getTimeInMinutes(
            a.nextSlot
          ) -
          getTimeInMinutes(
            b.nextSlot
          )
        );
      }
    );


  const recommendedDoctor =
    sortedDoctors[0];


  const otherDoctors =
    sortedDoctors.slice(1);


  // ==========================================================
  // PROGRESS STEPS
  // ==========================================================

  const steps = [
    "Health Problem",
    "Doctor Preference",
    "Location",
    "Doctors",
    "Appointment"
  ];


  // ==========================================================
  // DOCTOR SELECT
  // ==========================================================

  const handleDoctorSelect =
    (doctor) => {

      recordHesitation();


      // Tracking click
      trackClick(
        "Book/View Availability",
        "ConfirmedTownRecommendedDoctorsPage"
      );


      // Detailed tracking
      trackInteraction(
        "CLICK",
        {
          page:
            "ConfirmedTownRecommendedDoctorsPage",

          action:
            "SELECT_DOCTOR",

          doctorId:
            doctor?.id,

          doctorName:
            doctor?.name,

          doctorSpecialty:
            doctor?.specialty,

          doctorPreference,

          town,

          hospitalId:
            doctor?.hospital?.id,

          hospitalName:
            doctor?.hospital?.name
        }
      );


      /*
       * IMPORTANT:
       * Pass the selected hospital along
       * with the doctor.
       *
       * This allows the existing
       * appointment page to know
       * where the appointment happens.
       */

      navigate(
        "/appointment-date-time",
        {
          state: {

            doctor,

            hospital:
              doctor?.hospital,

            symptomId,

            doctorPreference,

            town
          }
        }
      );
    };


  // ==========================================================
  // BACK
  // ==========================================================

  const handleBack = () => {

    recordHesitation();


    trackBackClick(
      "ConfirmedTownRecommendedDoctorsPage"
    );


    trackInteraction(
      "BACK_CLICK",
      {
        page:
          "ConfirmedTownRecommendedDoctorsPage",

        destination:
          "ConfirmTownSelectionPage"
      }
    );


    /*
     * Change this route if your
     * actual confirmation page
     * has a different route.
     */

    navigate(
      "/confirm-town-selection",
      {
        state: {
          town,
          symptomId,
          doctorPreference
        }
      }
    );
  };


  // ==========================================================
  // SAFETY CHECK
  // ==========================================================

  if (
    !town ||
    !symptom
  ) {

    return (
      <div
        style={{
          minHeight: "100vh",
          background: "#F8FAFC",
          display: "flex",
          justifyContent:
            "center",
          alignItems:
            "center",
          padding: "20px",
          textAlign:
            "center",
          boxSizing:
            "border-box"
        }}
      >

        <div>

          <h2>
            Unable to load doctors
          </h2>

          <p
            style={{
              color:
                "#64748B",
              lineHeight:
                "1.6"
            }}
          >
            Town or health problem
            information is missing.
          </p>


          <button
            onClick={handleBack}
            style={{
              background:
                "#2563EB",
              color:
                "#FFFFFF",
              border:
                "none",
              padding:
                "12px 20px",
              borderRadius:
                "10px",
              cursor:
                "pointer",
              fontWeight:
                "600"
            }}
          >
            <FaArrowLeft />
            {" "}
            Go Back
          </button>

        </div>

      </div>
    );
  }


  // ==========================================================
  // NO DOCTORS
  // ==========================================================

  if (
    availableDoctors.length === 0
  ) {

    return (
      <div
        style={{
          minHeight:
            "100vh",
          background:
            "#F8FAFC"
        }}
      >

        <Header />


        <div
          style={{
            maxWidth:
              "700px",

            margin:
              isMobile
                ? "40px auto"
                : "80px auto",

            padding:
              isMobile
                ? "15px"
                : "20px",

            textAlign:
              "center",

            boxSizing:
              "border-box"
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
                  ? "30px 20px"
                  : "40px 25px",

              boxShadow:
                "0 8px 25px rgba(0,0,0,.06)"
            }}
          >

            <FaUserMd
              size={50}
              color="#94A3B8"
            />


            <h2
              style={{
                color:
                  "#0F172A"
              }}
            >
              No doctors available
            </h2>


            <p
              style={{
                color:
                  "#64748B",
                lineHeight:
                  "1.6"
              }}
            >
              No doctors matching{" "}
              <strong>
                {symptom.title}
              </strong>{" "}
              and your doctor preference
              are currently available
              in{" "}
              <strong>
                {town}
              </strong>.
            </p>


            <button
              onClick={handleBack}
              style={{
                marginTop:
                  "15px",

                background:
                  "#2563EB",

                color:
                  "#FFFFFF",

                border:
                  "none",

                padding:
                  "13px 22px",

                borderRadius:
                  "12px",

                cursor:
                  "pointer",

                fontWeight:
                  "600",

                width:
                  isMobile
                    ? "100%"
                    : "auto"
              }}
            >
              <FaArrowLeft />
              {" "}
              Choose Another Town
            </button>

          </div>

        </div>

      </div>
    );
  }


  // ==========================================================
  // MAIN PAGE
  // ==========================================================

  return (

    <div
      style={{
        minHeight:
          "100vh",

        background:
          "linear-gradient(to bottom,#F8FAFC,#EFF6FF)",

        paddingBottom:
          isMobile
            ? "90px"
            : "100px",

        boxSizing:
          "border-box"
      }}
    >

 <Header />

<div
  style={{
    width: "100%",
    maxWidth: "1200px",
    margin: "0 auto",

    /* IMPORTANT:
       Keep the whole progress section below the navbar */
    paddingTop: isMobile
      ? "105px"
      : "125px",

    paddingLeft: isMobile
      ? "14px"
      : "20px",

    paddingRight: isMobile
      ? "14px"
      : "20px",

    paddingBottom: isMobile
      ? "110px"
      : "120px",

    boxSizing: "border-box"
  }}
>

{/* =====================================================
    STEP INDICATOR
===================================================== */}

<div
  style={{
    width: "100%",
    textAlign: "center",

    marginBottom: isMobile
      ? "14px"
      : "18px",

    position: "relative",
    zIndex: 5
  }}
>
  <div
    style={{
      display: "inline-block",

      color: "#64748B",

      fontSize: isMobile
        ? "13px"
        : "14px",

      fontWeight: "600",

      lineHeight: "1.4",

      background: "#F8FAFC",

      padding: "3px 10px",

      borderRadius: "8px"
    }}
  >
    Step 3 of 5
  </div>
</div>


{/* =====================================================
    PROGRESS
===================================================== */}

<div
  style={{
    width: "100%",

    position: "relative",

    zIndex: 5,

    marginBottom: isMobile
      ? "28px"
      : "35px"
  }}
>
  <ProgressTracker
    currentStep={2}
    steps={steps}
  />
</div>


        {/* =====================================================
            TITLE
        ====================================================== */}

        <div
          style={{
            textAlign:
              "center",

            margin:
              isMobile
                ? "28px auto 22px"
                : "40px auto 30px",

            padding:
              isMobile
                ? "0 5px"
                : "0"
          }}
        >

          <h1
            style={{
              fontSize:
                isMobile
                  ? "30px"
                  : "clamp(28px,5vw,46px)",

              lineHeight:
                "1.2",

              color:
                "#0F172A",

              margin:
                "0 0 12px"
            }}
          >
            Doctors available
            for you
          </h1>


          <p
            style={{
              color:
                "#64748B",

              maxWidth:
                "720px",

              margin:
                "0 auto",

              lineHeight:
                "1.6",

              fontSize:
                isMobile
                  ? "14px"
                  : "clamp(14px,2vw,17px)"
            }}
          >
            We found doctors who match
            your selected health problem
            and doctor preference,
            and are available at hospitals
            in your selected town.
          </p>

        </div>


        {/* =====================================================
            CONTEXT
        ====================================================== */}

        <div
          style={{
            background:
              "#FFFFFF",

            borderRadius:
              "18px",

            padding:
              isMobile
                ? "14px"
                : "18px",

            marginBottom:
              isMobile
                ? "22px"
                : "30px",

            border:
              "1px solid #E2E8F0",

            display:
              "flex",

            justifyContent:
              "center",

            gap:
              "8px",

            flexWrap:
              "wrap"
          }}
        >

          <Tag>
            <FaMapMarkerAlt />
            {town}
          </Tag>


          <Tag>
            <FaUserMd />
            {symptom.title}
          </Tag>


          <Tag>
            <FaUserMd />
            {doctorPreference}
          </Tag>


          <Tag>
            <FaUserMd />
            {symptom.specialty}
          </Tag>


          <Tag>
            <FaHospital />
            {townHospitals.length}{" "}
            Hospitals
          </Tag>


          <Tag>
            <FaCalendarAlt />
            Available Doctors
          </Tag>

        </div>


        {/* =====================================================
            RECOMMENDED DOCTOR
        ====================================================== */}

        <div
          style={{
            background:
              "#FFFFFF",

            borderRadius:
              isMobile
                ? "20px"
                : "24px",

            padding:
              isMobile
                ? "20px 16px"
                : "clamp(20px,4vw,30px)",

            marginBottom:
              isMobile
                ? "25px"
                : "30px",

            border:
              "2px solid #2563EB",

            boxShadow:
              "0 10px 30px rgba(37,99,235,.10)",

            boxSizing:
              "border-box"
          }}
        >

          {/* BADGE */}

          <div
            style={{
              display:
                "inline-flex",

              alignItems:
                "center",

              gap:
                "7px",

              background:
                "#DCFCE7",

              color:
                "#15803D",

              padding:
                "7px 12px",

              borderRadius:
                "999px",

              fontSize:
                "12px",

              fontWeight:
                "700",

              marginBottom:
                isMobile
                  ? "18px"
                  : "20px"
            }}
          >

            <FaCheckCircle />

            Recommended —
            Earliest Available

          </div>


          {/* DOCTOR HEADER */}

          <div
            style={{
              display:
                "flex",

              alignItems:
                "center",

              gap:
                "14px",

              width:
                "100%",

              minWidth:
                0
            }}
          >

            <div
              style={{
                width:
                  isMobile
                    ? "58px"
                    : "70px",

                height:
                  isMobile
                    ? "58px"
                    : "70px",

                borderRadius:
                  "50%",

                background:
                  "#EFF6FF",

                display:
                  "flex",

                alignItems:
                  "center",

                justifyContent:
                  "center",

                flexShrink:
                  0
              }}
            >

              <FaUserMd
                size={
                  isMobile
                    ? 27
                    : 32
                }
                color="#2563EB"
              />

            </div>


            <div
              style={{
                minWidth:
                  0
              }}
            >

              <h2
                style={{
                  margin:
                    0,

                  color:
                    "#0F172A",

                  fontSize:
                    isMobile
                      ? "20px"
                      : "clamp(20px,3vw,26px)"
                }}
              >
                {recommendedDoctor.name}
              </h2>


              <div
                style={{
                  color:
                    "#64748B",

                  marginTop:
                    "5px",

                  fontSize:
                    isMobile
                      ? "13px"
                      : "14px"
                }}
              >
                {recommendedDoctor.specialty}
              </div>


              <div
                style={{
                  display:
                    "flex",

                  alignItems:
                    "center",

                  gap:
                    "5px",

                  marginTop:
                    "7px",

                  color:
                    "#F59E0B"
                }}
              >

                <FaStar />

                {recommendedDoctor.rating}

              </div>

            </div>

          </div>


          {/* HOSPITAL */}

          <div
            style={{
              marginTop:
                "18px",

              background:
                "#EFF6FF",

              border:
                "1px solid #BFDBFE",

              borderRadius:
                "12px",

              padding:
                "12px",

              display:
                "flex",

              alignItems:
                "center",

              gap:
                "9px",

              color:
                "#1E40AF",

              fontSize:
                "14px"
            }}
          >

            <FaHospital />

            <span>

              Appointment at{" "}

              <strong>
                {recommendedDoctor.hospital?.name}
              </strong>

            </span>

          </div>


          {/* INFORMATION */}

          <div
            style={{
              display:
                "grid",

              gridTemplateColumns:
                "1fr 1fr",

              gap:
                "10px",

              marginTop:
                "18px"
            }}
          >

            <InfoSmall
              label="Earliest Available"
              value={
                recommendedDoctor.nextSlot
              }
            />


            <InfoSmall
              label="Consultation Fee"
              value={
                recommendedDoctor.fee
              }
            />

          </div>


          {/* BOOK BUTTON */}

          <div
            style={{
              display:
                "flex",

              justifyContent:
                "center",

              marginTop:
                "20px"
            }}
          >

            <button
              onClick={() =>
                handleDoctorSelect(
                  recommendedDoctor
                )
              }
              style={{
                background:
                  "#2563EB",

                color:
                  "#FFFFFF",

                border:
                  "none",

                padding:
                  isMobile
                    ? "13px 20px"
                    : "14px 30px",

                borderRadius:
                  "12px",

                fontWeight:
                  "700",

                cursor:
                  "pointer",

                width:
                  isMobile
                    ? "100%"
                    : "auto",

                display:
                  "flex",

                alignItems:
                  "center",

                justifyContent:
                  "center",

                gap:
                  "8px"
              }}
            >

              Book Appointment

              <FaArrowRight />

            </button>

          </div>


          {/* DESCRIPTION */}

          <p
            style={{
              color:
                "#64748B",

              margin:
                "18px 0 0",

              lineHeight:
                "1.6",

              fontSize:
                "14px"
            }}
          >

            This doctor is recommended because
            they are the earliest available match
            for your selected health problem and
            doctor preference in{" "}
            <strong>
              {town}
            </strong>.

          </p>

        </div>


        {/* =====================================================
            OTHER DOCTORS
        ====================================================== */}

        {otherDoctors.length > 0 && (

          <div>

            <div
              style={{
                marginBottom:
                  "18px"
              }}
            >

              <h2
                style={{
                  margin:
                    0,

                  color:
                    "#0F172A",

                  fontSize:
                    isMobile
                      ? "22px"
                      : "24px"
                }}
              >
                Other Available Doctors
              </h2>


              <p
                style={{
                  color:
                    "#64748B",

                  marginTop:
                    "6px",

                  lineHeight:
                    "1.5",

                  fontSize:
                    isMobile
                      ? "13px"
                      : "14px"
                }}
              >
                Other matching doctors available
                at hospitals in{" "}
                <strong>
                  {town}
                </strong>.
              </p>

            </div>


            {/* DOCTOR GRID */}

            <div
              style={{
                display:
                  "grid",

                gridTemplateColumns:
                  isMobile
                    ? "1fr"
                    : "repeat(auto-fit,minmax(300px,1fr))",

                gap:
                  isMobile
                    ? "14px"
                    : "18px"
              }}
            >

              {otherDoctors.map(
                (doctor) => (

                  <div
                    key={doctor.id}
                    style={{
                      background:
                        "#FFFFFF",

                      borderRadius:
                        "20px",

                      padding:
                        isMobile
                          ? "18px"
                          : "22px",

                      border:
                        "1px solid #E2E8F0",

                      boxShadow:
                        "0 6px 20px rgba(0,0,0,.04)",

                      minWidth:
                        0,

                      boxSizing:
                        "border-box"
                    }}
                  >

                    {/* HEADER */}

                    <div
                      style={{
                        display:
                          "flex",

                        gap:
                          "14px",

                        alignItems:
                          "center"
                      }}
                    >

                      <div
                        style={{
                          width:
                            isMobile
                              ? "50px"
                              : "55px",

                          height:
                            isMobile
                              ? "50px"
                              : "55px",

                          borderRadius:
                            "50%",

                          background:
                            "#EFF6FF",

                          display:
                            "flex",

                          alignItems:
                            "center",

                          justifyContent:
                            "center",

                          flexShrink:
                            0
                        }}
                      >

                        <FaUserMd
                          size={
                            isMobile
                              ? 23
                              : 25
                          }
                          color="#2563EB"
                        />

                      </div>


                      <div
                        style={{
                          minWidth:
                            0
                        }}
                      >

                        <h3
                          style={{
                            margin:
                              0,

                            color:
                              "#0F172A",

                            fontSize:
                              isMobile
                                ? "17px"
                                : "18px"
                          }}
                        >
                          {doctor.name}
                        </h3>


                        <div
                          style={{
                            color:
                              "#64748B",

                            fontSize:
                              "13px",

                            marginTop:
                              "4px"
                          }}
                        >
                          {doctor.specialty}
                        </div>


                        <div
                          style={{
                            marginTop:
                              "8px",

                            color:
                              "#F59E0B",

                            display:
                              "flex",

                            gap:
                              "5px",

                            alignItems:
                              "center"
                          }}
                        >

                          <FaStar />

                          {doctor.rating}

                        </div>

                      </div>

                    </div>


                    {/* HOSPITAL */}

                    <div
                      style={{
                        marginTop:
                          "16px",

                        background:
                          "#F8FAFC",

                        border:
                          "1px solid #E2E8F0",

                        borderRadius:
                          "10px",

                        padding:
                          "10px",

                        display:
                          "flex",

                        alignItems:
                          "center",

                        gap:
                          "7px",

                        color:
                          "#475569",

                        fontSize:
                          "12px",

                        lineHeight:
                          "1.4"
                      }}
                    >

                      <FaHospital
                        color="#2563EB"
                      />

                      <span>
                        {doctor.hospital?.name}
                      </span>

                    </div>


                    {/* DETAILS */}

                    <div
                      style={{
                        display:
                          "grid",

                        gridTemplateColumns:
                          "1fr 1fr",

                        gap:
                          "10px",

                        marginTop:
                          "12px"
                      }}
                    >

                      <InfoSmall
                        label="Next Slot"
                        value={
                          doctor.nextSlot
                        }
                      />


                      <InfoSmall
                        label="Fee"
                        value={
                          doctor.fee
                        }
                      />

                    </div>


                    {/* BUTTON */}

                    <button
                      onClick={() =>
                        handleDoctorSelect(
                          doctor
                        )
                      }
                      style={{
                        width:
                          "100%",

                        marginTop:
                          "20px",

                        background:
                          "#FFFFFF",

                        color:
                          "#2563EB",

                        border:
                          "1px solid #2563EB",

                        padding:
                          "12px",

                        borderRadius:
                          "12px",

                        fontWeight:
                          "600",

                        cursor:
                          "pointer",

                        display:
                          "flex",

                        alignItems:
                          "center",

                        justifyContent:
                          "center",

                        gap:
                          "7px"
                      }}
                    >

                      View Availability

                      <FaArrowRight />

                    </button>

                  </div>

                )
              )}

            </div>

          </div>

        )}


        {/* =====================================================
            INFORMATION CARD
        ====================================================== */}

        <div
          style={{
            marginTop:
              isMobile
                ? "22px"
                : "30px",

            background:
              "#EFF6FF",

            border:
              "1px solid #BFDBFE",

            borderRadius:
              "16px",

            padding:
              isMobile
                ? "14px"
                : "17px",

            color:
              "#1E40AF",

            display:
              "flex",

            alignItems:
              "flex-start",

            gap:
              "10px",

            fontSize:
              isMobile
                ? "13px"
                : "14px",

            lineHeight:
              "1.6"
          }}
        >

          <FaInfoCircle
            style={{
              marginTop:
                "3px",

              flexShrink:
                0
            }}
          />


          <span>

            We only show doctors who match
            your selected health problem and
            doctor preference and are available
            at hospitals in{" "}

            <strong>
              {town}
            </strong>.

            {" "}The recommended doctor is the
            earliest available option.

          </span>

        </div>

      </div>


      {/* =====================================================
          FIXED BACK BUTTON
      ====================================================== */}

      <button
        onClick={handleBack}
        style={{
          position:
            "fixed",

          bottom:
            isMobile
              ? "15px"
              : "20px",

          left:
            isMobile
              ? "15px"
              : "20px",

          zIndex:
            1000,

          display:
            "flex",

          alignItems:
            "center",

          justifyContent:
            "center",

          gap:
            "8px",

          background:
            "#FFFFFF",

          color:
            "#2563EB",

          border:
            "1px solid #CBD5E1",

          borderRadius:
            "12px",

          padding:
            isMobile
              ? "11px 16px"
              : "12px 18px",

          fontWeight:
            "600",

          cursor:
            "pointer",

          boxShadow:
            "0 4px 15px rgba(0,0,0,.08)"
        }}
      >

        <FaArrowLeft />

        Back

      </button>

    </div>
  );
}


// ==========================================================
// TAG
// ==========================================================

function Tag({ children }) {

  return (

    <div
      style={{
        background:
          "#F8FAFC",

        border:
          "1px solid #E2E8F0",

        borderRadius:
          "999px",

        padding:
          "8px 12px",

        display:
          "flex",

        alignItems:
          "center",

        gap:
          "7px",

        fontSize:
          "13px",

        color:
          "#334155",

        maxWidth:
          "100%",

        boxSizing:
          "border-box",

        wordBreak:
          "break-word"
      }}
    >
      {children}
    </div>
  );
}


// ==========================================================
// SMALL INFORMATION
// ==========================================================

function InfoSmall({
  icon,
  label,
  value
}) {

  return (

    <div
      style={{
        background:
          "#F8FAFC",

        borderRadius:
          "12px",

        padding:
          "12px",

        textAlign:
          "center",

        minWidth:
          0,

        boxSizing:
          "border-box"
      }}
    >

      {icon && (

        <div
          style={{
            color:
              "#2563EB",

            marginBottom:
              "5px"
          }}
        >
          {icon}
        </div>

      )}


      <div
        style={{
          color:
            "#64748B",

          fontSize:
            "11px",

          marginBottom:
            "4px"
        }}
      >
        {label}
      </div>


      <div
        style={{
          fontWeight:
            "700",

          color:
            "#0F172A",

          fontSize:
            "13px",

          wordBreak:
            "break-word"
        }}
      >
        {value}
      </div>

    </div>
  );
}