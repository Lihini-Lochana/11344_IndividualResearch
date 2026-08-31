import { useLocation, useNavigate } from "react-router-dom";
import { useContext, useEffect, useRef } from "react";

import useIsMobile from "../hooks/useIsMobile";

import Header from "../components/Header";
import ProgressTracker from "../components/ProgressTracker";

import symptoms from "../data/symptoms";
import doctors from "../data/doctors";
import availability from "../data/doctorHospitalAvailability";

import {
  FaHospital,
  FaCalendarAlt,
  FaUserMd,
  FaArrowLeft,
  FaArrowRight,
  FaInfoCircle,
  FaStar,
  FaCheckCircle
} from "react-icons/fa";

import { TrackingContext } from "../context/TrackingContext";


export default function ConfirmedHospitalRecommendedDoctorsPage() {

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
  // DATA RECEIVED FROM CONFIRM HOSPITAL PAGE
  // ==========================================================

  const hospital = location.state?.hospital;

  const symptomId =
    location.state?.symptomId;

  const doctorPreference =
    location.state?.doctorPreference;


  const symptom = symptoms.find(
    (item) =>
      item.id === symptomId
  );


  // ==========================================================
  // PAGE VISIT TRACKING
  // ==========================================================

  useEffect(() => {

    trackPageVisit(
      "ConfirmedHospitalRecommendedDoctorsPage"
    );

    trackInteraction(
      "PAGE_VISIT",
      {
        page:
          "ConfirmedHospitalRecommendedDoctorsPage",

        hospitalId:
          hospital?.id,

        hospitalName:
          hospital?.name,

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
  // HESITATION TRACKING
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


    // Only count hesitation
    // when user spends 3+ seconds
    // on this page.

    if (
      hesitationSeconds > 5
    ) {

      trackHesitation(
        Number(
          hesitationSeconds.toFixed(2)
        )
      );

      trackInteraction(
        "HESITATION",
        {
          page:
            "ConfirmedHospitalRecommendedDoctorsPage",

          seconds:
            Number(
              hesitationSeconds.toFixed(2)
            )
        }
      );

      hesitationTrackedRef.current =
        true;
    }
  };


  // ==========================================================
  // DEBUG INFORMATION
  // ==========================================================

  console.log(
    "========== CONFIRMED HOSPITAL RECOMMENDED DOCTORS =========="
  );

  console.log(
    "Full location state:",
    location.state
  );

  console.log(
    "Selected hospital:",
    hospital
  );

  console.log(
    "Hospital ID:",
    hospital?.id
  );

  console.log(
    "Symptom ID:",
    symptomId
  );

  console.log(
    "Doctor preference:",
    doctorPreference
  );

  console.log(
    "Found symptom:",
    symptom
  );

  console.log(
    "============================================================"
  );


  // ==========================================================
  // FILTER DOCTORS
  //
  // Conditions:
  //
  // 1. Specialty must match selected symptom
  // 2. Gender must match doctor preference
  // 3. Doctor must have availability at selected hospital
  // ==========================================================

  const availableDoctors = doctors

    .filter((doctor) => {

      // ------------------------------------------
      // SPECIALTY MATCH
      // ------------------------------------------

      const specialtyMatches =
        doctor.specialty ===
        symptom?.specialty;


      // ------------------------------------------
      // GENDER MATCH
      // ------------------------------------------

      const genderMatches =
        doctorPreference ===
          "No Preference"

        ||

        (
          doctorPreference ===
            "Male Doctor" &&

          doctor.gender ===
            "Male"
        )

        ||

        (
          doctorPreference ===
            "Female Doctor" &&

          doctor.gender ===
            "Female"
        );


      return (
        specialtyMatches &&
        genderMatches
      );
    })

    .map((doctor) => {

      // ------------------------------------------
      // FIND AVAILABILITY AT SELECTED HOSPITAL
      // ------------------------------------------

      const doctorAvailability =
        availability.find(
          (item) =>
            item.doctorId ===
              doctor.id &&

            item.hospitalId ===
              hospital?.id
        );


      console.log(
        "Availability check:",
        {
          doctor:
            doctor.name,

          doctorId:
            doctor.id,

          hospitalId:
            hospital?.id,

          availability:
            doctorAvailability
        }
      );


      // Doctor is not available
      // at selected hospital.

      if (!doctorAvailability) {
        return null;
      }


      // Combine doctor information
      // with hospital availability.

      return {
        ...doctor,

        fee:
          doctorAvailability.fee,

        nextSlot:
          doctorAvailability.nextSlot,

        availableDates:
          doctorAvailability.availableDates,

        slots:
          doctorAvailability.slots
      };

    })

    .filter(Boolean);


  console.log(
    "========== FILTERED DOCTORS =========="
  );

  console.log(
    "Available doctors:",
    availableDoctors
  );

  console.log(
    "Available doctor count:",
    availableDoctors.length
  );

  console.log(
    "======================================"
  );


  // ==========================================================
  // CONVERT TIME TO MINUTES
  // ==========================================================

  const getTimeInMinutes = (
    slot
  ) => {

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
  };


  // ==========================================================
  // DAY PRIORITY
  //
  // Today → Tomorrow → Later
  // ==========================================================

  const getDayRank = (
    slot
  ) => {

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
  };


  // ==========================================================
  // SORT DOCTORS
  //
  // Earliest appointment comes first.
  // ==========================================================

  const sortedDoctors = [
    ...availableDoctors
  ].sort((a, b) => {

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
      return dayA - dayB;
    }


    return (
      getTimeInMinutes(
        a.nextSlot
      ) -

      getTimeInMinutes(
        b.nextSlot
      )
    );
  });


  // ==========================================================
  // RECOMMENDED DOCTOR
  // ==========================================================

  const recommendedDoctor =
    sortedDoctors[0];


  // ==========================================================
  // OTHER DOCTORS
  // ==========================================================

  const otherDoctors =
    sortedDoctors.slice(1);


  // ==========================================================
  // PROGRESS
  // ==========================================================

  const steps = [
    "Hospital Search",
    "Symptoms",
    "Doctor Preference",
    "Appointment",
    "Confirmation"
  ];


  // ==========================================================
  // SELECT DOCTOR
  // ==========================================================

  const handleDoctorSelect = (
    doctor
  ) => {

    recordHesitation();


    // Tracking click

    trackClick(
      "Book/View Availability",
      "ConfirmedHospitalRecommendedDoctorsPage"
    );


    // Detailed tracking

    trackInteraction(
      "CLICK",
      {
        page:
          "ConfirmedHospitalRecommendedDoctorsPage",

        action:
          "SELECT_DOCTOR",

        doctorId:
          doctor?.id,

        doctorName:
          doctor?.name,

        doctorSpecialty:
          doctor?.specialty,

        doctorPreference,

        hospitalId:
          hospital?.id,

        hospitalName:
          hospital?.name
      }
    );


    // Continue to appointment

    navigate(
      "/appointment-date-time",
      {
        state: {
          doctor,

          hospital,

          symptomId,

          doctorPreference
        }
      }
    );
  };


  // ==========================================================
  // BACK TO CONFIRM HOSPITAL
  // ==========================================================

  const handleBack = () => {

    recordHesitation();


    trackBackClick(
      "ConfirmedHospitalRecommendedDoctorsPage"
    );


    trackInteraction(
      "BACK_CLICK",
      {
        page:
          "ConfirmedHospitalRecommendedDoctorsPage",

        destination:
          "ConfirmHospitalSelectionPage"
      }
    );


    /*
     * IMPORTANT:
     *
     * Change this route only if your
     * actual Confirm Hospital Selection
     * route has a different name.
     */

    navigate(
      "/confirm-hospital-selection",
      {
        state: {
          hospital,

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
    !hospital ||
    !symptom
  ) {

    console.error(
      "❌ UNABLE TO LOAD CONFIRMED HOSPITAL DOCTORS",
      {
        hospital,
        symptomId,
        symptom,
        doctorPreference,
        locationState:
          location.state
      }
    );


    return (

      <div
        style={{
          minHeight: "100vh",

          background:
            "#F8FAFC",

          display: "flex",

          justifyContent:
            "center",

          alignItems:
            "center",

          padding: "20px",

          textAlign: "center",

          boxSizing: "border-box"
        }}
      >

        <div>

          <FaHospital
            size={50}
            color="#94A3B8"
          />

          <h2
            style={{
              color: "#0F172A"
            }}
          >
            Unable to load doctors
          </h2>


          <p
            style={{
              color: "#64748B",
              lineHeight: "1.6"
            }}
          >
            Hospital or health problem
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
              </strong>

              {" "}and{" "}

              <strong>
                {doctorPreference}
              </strong>

              {" "}are currently available
              at{" "}

              <strong>
                {hospital.name}
              </strong>.

            </p>


            <button
              onClick={
                handleBack
              }
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

              Change Hospital

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
          maxWidth:
            "1200px",

          margin:
            "0 auto",

          padding:
            isMobile
              ? "18px 14px 90px"
              : "25px 20px 100px",

          boxSizing:
            "border-box"
        }}
      >

        {/* ==================================================
            STEP
        ================================================== */}

        <h4
          style={{
            textAlign:
              "center",

            color:
              "#64748B",

            margin:
              isMobile
                ? "5px 0 12px"
                : "10px 0 18px",

            fontSize:
              "14px"
          }}
        >
          Step 3 of 5
        </h4>


        {/* ==================================================
            PROGRESS TRACKER
        ================================================== */}

        <ProgressTracker
          currentStep={3}
          steps={steps}
        />


        {/* ==================================================
            TITLE
        ================================================== */}

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
                "700px",

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
            and doctor preference at{" "}

            <strong>
              {hospital.name}
            </strong>.

          </p>

        </div>


        {/* ==================================================
            SELECTION CONTEXT
        ================================================== */}

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

            <FaHospital />

            {hospital.name}

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

            <FaCalendarAlt />

            Available Doctors

          </Tag>

        </div>


        {/* ==================================================
            RECOMMENDED DOCTOR
        ================================================== */}

        {recommendedDoctor && (

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

            {/* EARLIEST BADGE */}

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
                  "14px"
              }}
            >

              {/* ICON */}

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


              {/* DETAILS */}

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

            <button
              onClick={() =>
                handleDoctorSelect(
                  recommendedDoctor
                )
              }
              style={{
                marginTop:
                  "20px",

                width:
                  isMobile
                    ? "100%"
                    : "auto",

                minWidth:
                  isMobile
                    ? "100%"
                    : "220px",

                display:
                  "flex",

                alignItems:
                  "center",

                justifyContent:
                  "center",

                gap:
                  "8px",

                marginLeft:
                  isMobile
                    ? "0"
                    : "auto",

                marginRight:
                  isMobile
                    ? "0"
                    : "auto",

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
                  "pointer"
              }}
            >

              Book Appointment

              <FaArrowRight />

            </button>


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
              doctor preference at{" "}

              <strong>
                {hospital.name}
              </strong>.

            </p>

          </div>

        )}


        {/* ==================================================
            OTHER DOCTORS
        ================================================== */}

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

                Other doctors available for{" "}

                {symptom.title}

                {" "}at{" "}

                {hospital.name}.

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
                    key={
                      doctor.id
                    }
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

                      boxSizing:
                        "border-box"
                    }}
                  >

                    {/* DOCTOR HEADER */}

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
                                : "18px",

                            wordBreak:
                              "break-word"
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
                          "18px"
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


                    {/* VIEW BUTTON */}

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


        {/* ==================================================
            INFORMATION CARD
        ================================================== */}

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
            at{" "}

            <strong>
              {hospital.name}
            </strong>.

            {" "}The recommended doctor is the
            earliest available option.

          </span>

        </div>

      </div>


      {/* ==================================================
          FIXED BACK BUTTON
      ================================================== */}

      <button
        onClick={
          handleBack
        }
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


/* ============================================================
   TAG COMPONENT
============================================================ */

function Tag({
  children
}) {

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


/* ============================================================
   SMALL INFORMATION COMPONENT
============================================================ */

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