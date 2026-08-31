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

export default function HospitalRecommendedDoctorsPage() {

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


  const pageStartTimeRef = useRef(Date.now());

  const hesitationTrackedRef = useRef(false);


  const hospital = location.state?.hospital;
  const symptomId = location.state?.symptomId;
  const doctorPreference = location.state?.doctorPreference;

  const symptom = symptoms.find(
    (s) => s.id === symptomId
  );

    // ======================================================
  // PAGE VISIT + HESITATION
  // ======================================================

  useEffect(() => {

    // Record that this page was visited
    trackPageVisit(
      "HospitalRecommendedDoctorsPage"
    );

    trackInteraction(
      "PAGE_VISIT",
      {
        page: "HospitalRecommendedDoctorsPage",
        hospitalId: hospital?.id,
        hospitalName: hospital?.name,
        symptomId,
        doctorPreference
      }
    );

    pageStartTimeRef.current = Date.now();

    hesitationTrackedRef.current = false;

  }, []);


    // ======================================================
  // RECORD HESITATION
  // ======================================================

  const recordHesitation = () => {

    if (hesitationTrackedRef.current) {
      return;
    }

    const hesitationSeconds =
      (Date.now() -
        pageStartTimeRef.current) / 1000;

    /*
     * Only count meaningful hesitation.
     * Less than 3 seconds is treated as
     * normal interaction rather than hesitation.
     */
    if (hesitationSeconds > 5) {

      trackHesitation(
        Number(
          hesitationSeconds.toFixed(2)
        )
      );

      trackInteraction(
        "HESITATION",
        {
          page:
            "HospitalRecommendedDoctorsPage",

          seconds:
            Number(
              hesitationSeconds.toFixed(2)
            )
        }
      );

      hesitationTrackedRef.current = true;
    }
  };

  console.log("========== HOSPITAL RECOMMENDED DOCTORS ==========");
console.log("Full location state:", location.state);
console.log("Hospital:", hospital);
console.log("Hospital ID:", hospital?.id);
console.log("Symptom ID:", symptomId);
console.log("Doctor Preference:", doctorPreference);
console.log("Found symptom:", symptom);
console.log("==================================================");

  /*
   * Get doctors who match the selected
   * specialty and are available at
   * the selected hospital.
   *
   */


  console.log("========== DOCTOR FILTERING ==========");
console.log("Total doctors:", doctors.length);
console.log("Total availability records:", availability.length);
console.log("Selected hospital ID:", hospital?.id);
console.log("Selected symptom:", symptom);
console.log("Selected specialty:", symptom?.specialty);
console.log("Selected preference:", doctorPreference);
console.log("======================================");


const availableDoctors = doctors
  .filter((doctor) => {

    const specialtyMatches =
      doctor.specialty === symptom?.specialty;

    const genderMatches =
      doctorPreference === "No Preference" ||
      (doctorPreference === "Male Doctor" &&
        doctor.gender === "Male") ||
      (doctorPreference === "Female Doctor" &&
        doctor.gender === "Female");

    return (
      specialtyMatches &&
      genderMatches
    );
  })
  .map((doctor) => {

    const doctorAvailability =
      availability.find(
        (item) =>
          item.doctorId === doctor.id &&
          item.hospitalId === hospital?.id
      );

     console.log(
    "Availability check:",
    doctor.name,
    "Doctor ID:",
    doctor.id,
    "Hospital ID:",
    hospital?.id,
    "Availability:",
    doctorAvailability
  );

    if (!doctorAvailability) {
      return null;
    }

    return {
      ...doctor,
      fee: doctorAvailability.fee,
      nextSlot: doctorAvailability.nextSlot,
      availableDates:
        doctorAvailability.availableDates,
      slots: doctorAvailability.slots
    };
  })
  .filter(Boolean);

  console.log("========== FINAL RESULT ==========");
console.log("Available doctors:", availableDoctors);
console.log("Available doctor count:", availableDoctors.length);
console.log("==================================");

  /*
   * Convert appointment time
   * into minutes.
   */
  const getTimeInMinutes = (slot) => {

    if (!slot) {
      return Infinity;
    }

    const match = slot.match(
      /(\d{1,2}):(\d{2})\s*(AM|PM)/i
    );

    if (!match) {
      return Infinity;
    }

    let hours =
      parseInt(match[1], 10);

    const minutes =
      parseInt(match[2], 10);

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

  /*
   * Today → Tomorrow → Later
   */
  const getDayRank = (slot) => {

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

  /*
   * Sort doctors by earliest
   * available appointment.
   */
  const sortedDoctors = [
    ...availableDoctors
  ].sort((a, b) => {

    const dayA =
      getDayRank(a.nextSlot);

    const dayB =
      getDayRank(b.nextSlot);

    if (dayA !== dayB) {
      return dayA - dayB;
    }

    return (
      getTimeInMinutes(a.nextSlot) -
      getTimeInMinutes(b.nextSlot)
    );
  });

  const recommendedDoctor =
    sortedDoctors[0];

  const otherDoctors =
    sortedDoctors.slice(1);

  const steps = [
    "Hospital Search",
    "Symptoms",
    "Doctor Preference",
    "Doctors",
    "Appointment",
    "Confirmation"
  ];

  /*
   * Navigate to appointment page.
   */
  const handleDoctorSelect = (doctor) => {

    recordHesitation();

  // Record click
  trackClick(
    "Book/View Availability",
    "HospitalRecommendedDoctorsPage"
  );

  // Record detailed interaction
  trackInteraction(
    "CLICK",
    {
      page:
        "HospitalRecommendedDoctorsPage",

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

  /*
   * Back to symptom selection.
   */
  const handleBack = () => {

    recordHesitation();

    // Record back click
    trackBackClick(
      "HospitalRecommendedDoctorsPage"
    );

    // Record detailed interaction
    trackInteraction(
      "BACK_CLICK",
      {
        page:
          "HospitalRecommendedDoctorsPage",

        destination:
          "HospitalSymptomsPage"
      }
    );

    navigate(
      "/hospital-symptoms",
      {
        state: {
          hospital
        }
      }
    );
  };

  /*
   * Safety check.
   */
  if (!hospital || !symptom) {

     console.error(
    "UNABLE TO LOAD DOCTORS",
    {
      hospital,
      symptomId,
      symptom,
      doctorPreference,
      locationState: location.state
    }
  );

    return (
      <div
        style={{
          minHeight: "100vh",
          background: "#F8FAFC",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: "20px",
          textAlign: "center",
          boxSizing: "border-box"
        }}
      >

        <div>

          <h2>
            Unable to load doctors
          </h2>

          <p
            style={{
              color: "#64748B"
            }}
          >
            Hospital or health problem
            information is missing.
          </p>

          <button
            onClick={handleBack}
            style={{
              background: "#2563EB",
              color: "#FFFFFF",
              border: "none",
              padding: "12px 20px",
              borderRadius: "10px",
              cursor: "pointer",
              fontWeight: "600"
            }}
          >
            Go Back
          </button>

        </div>

      </div>
    );
  }

  /*
   * No doctors found.
   */
  if (availableDoctors.length === 0) {

    return (
      <div
        style={{
          minHeight: "100vh",
          background: "#F8FAFC"
        }}
      >

        <Header />

        <div
          style={{
            maxWidth: "700px",
            margin: isMobile
              ? "40px auto"
              : "80px auto",
            padding: isMobile
              ? "15px"
              : "20px",
            textAlign: "center",
            boxSizing: "border-box"
          }}
        >

          <div
            style={{
              background: "#FFFFFF",
              borderRadius: "20px",
              padding: isMobile
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
                color: "#0F172A"
              }}
            >
              No doctors available
            </h2>

            <p
              style={{
                color: "#64748B",
                lineHeight: "1.6"
              }}
            >
              No doctors matching{" "}
              <strong>
                {symptom.title}
              </strong>{" "}
              are currently available at{" "}
              <strong>
                {hospital.name}
              </strong>.
            </p>

            <button
              onClick={handleBack}
              style={{
                marginTop: "15px",
                background: "#2563EB",
                color: "#FFFFFF",
                border: "none",
                padding: "13px 22px",
                borderRadius: "12px",
                cursor: "pointer",
                fontWeight: "600",
                width: isMobile
                  ? "100%"
                  : "auto"
              }}
            >
              <FaArrowLeft />
              {" "}
              Choose Another Problem
            </button>

          </div>

        </div>

      </div>
    );
  }

  return (

    <div
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(to bottom,#F8FAFC,#EFF6FF)",
        paddingBottom:
          isMobile
            ? "90px"
            : "100px",
        boxSizing: "border-box"
      }}
    >

      <Header />

      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",

          padding: isMobile
            ? "18px 14px 90px"
            : "25px 20px 100px",

          boxSizing: "border-box"
        }}
      >

        {/* STEP */}

        <h4
          style={{
            textAlign: "center",
            color: "#64748B",
            margin: isMobile
              ? "5px 0 12px"
              : "10px 0 18px",
            fontSize: "14px"
          }}
        >
          Step 4 of 6
        </h4>

        {/* PROGRESS */}

        <ProgressTracker
          currentStep={3}
          steps={steps}
        />

        {/* TITLE */}

        <div
          style={{
            textAlign: "center",

            margin: isMobile
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

              lineHeight: "1.2",

              color: "#0F172A",

              margin:
                "0 0 12px"
            }}
          >
            Doctors available
            for you
          </h1>

          <p
            style={{
              color: "#64748B",
              maxWidth: "700px",
              margin: "0 auto",
              lineHeight: "1.6",

              fontSize:
                isMobile
                  ? "14px"
                  : "clamp(14px,2vw,17px)"
            }}
          >
            We found doctors who match
            your selected health problem, doctor preference,
            and are available at your
            selected hospital.
          </p>

        </div>

        {/* CONTEXT */}

        <div
          style={{
            background: "#FFFFFF",
            borderRadius: "18px",

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

            display: "flex",
            justifyContent: "center",

            gap: "8px",

            flexWrap: "wrap"
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

        {/* RECOMMENDED DOCTOR */}

        <div
          style={{
            background: "#FFFFFF",

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

            boxSizing: "border-box"
          }}
        >

          {/* BADGE */}

          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "7px",
              background: "#DCFCE7",
              color: "#15803D",

              padding:
                "7px 12px",

              borderRadius: "999px",
              fontSize: "12px",
              fontWeight: "700",

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

          {/* DOCTOR */}

          <div
            style={{
              display: "flex",

              justifyContent:
                isMobile
                  ? "flex-start"
                  : "space-between",

              alignItems:
                isMobile
                  ? "flex-start"
                  : "center",

              gap: "16px",

              flexDirection:
                isMobile
                  ? "column"
                  : "row"
            }}
          >

            <div
              style={{
                display: "flex",
                gap: "14px",
                alignItems: "center",
                width: "100%",
                minWidth: 0
              }}
            >

              {/* DOCTOR ICON */}

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

                  borderRadius: "50%",

                  background: "#EFF6FF",

                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",

                  flexShrink: 0
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
                  minWidth: 0
                }}
              >

                <h2
                  style={{
                    margin: 0,
                    color: "#0F172A",

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
                    color: "#64748B",
                    marginTop: "5px",
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
                    display: "flex",
                    alignItems: "center",
                    gap: "5px",
                    marginTop: "7px",
                    color: "#F59E0B"
                  }}
                >

                  <FaStar />

                  {recommendedDoctor.rating}

                </div>

              </div>

            </div>

          </div>

          {/* INFO */}

          <div
            style={{
              display: "grid",
                        gridTemplateColumns:
                          "1fr 1fr",
                        gap: "10px",
                        marginTop: "18px"
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
              display: "flex",
              justifyContent: "center",
              marginTop: "20px"
            }}
          >

            <button
              onClick={() =>
                handleDoctorSelect(
                  recommendedDoctor
                )
              }
              style={{
                background: "#2563EB",
                color: "#FFFFFF",
                border: "none",

                padding:
                  isMobile
                    ? "13px 20px"
                    : "14px 30px",

                borderRadius: "12px",
                fontWeight: "700",
                cursor: "pointer",

                width:
                  isMobile
                    ? "100%"
                    : "auto",

                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px"
              }}
            >
              Book Appointment
              <FaArrowRight />
            </button>

          </div>

          {/* DESCRIPTION */}

          <p
            style={{
              color: "#64748B",
              margin: "18px 0 0",
              lineHeight: "1.6",
              fontSize: "14px"
            }}
          >
            This doctor is recommended because
            they are the earliest available match
            for your selected health problem at{" "}
            <strong>
              {hospital.name}
            </strong>.
          </p>

        </div>

        {/* OTHER DOCTORS */}

        {otherDoctors.length > 0 && (

          <div>

            <div
              style={{
                marginBottom: "18px"
              }}
            >

              <h2
                style={{
                  margin: 0,
                  color: "#0F172A",

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
                  color: "#64748B",
                  marginTop: "6px",
                  lineHeight: "1.5",

                  fontSize:
                    isMobile
                      ? "13px"
                      : "14px"
                }}
              >
                Other doctors available for{" "}
                {symptom.title} at{" "}
                {hospital.name}.
              </p>

            </div>

            {/* DOCTOR GRID */}

            <div
              style={{
                display: "grid",

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
                      background: "#FFFFFF",
                      borderRadius: "20px",

                      padding:
                        isMobile
                          ? "18px"
                          : "22px",

                      border:
                        "1px solid #E2E8F0",

                      boxShadow:
                        "0 6px 20px rgba(0,0,0,.04)"
                    }}
                  >

                    {/* HEADER */}

                    <div
                      style={{
                        display: "flex",
                        gap: "14px",
                        alignItems: "center"
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

                          borderRadius: "50%",

                          background:
                            "#EFF6FF",

                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",

                          flexShrink: 0
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
                          minWidth: 0
                        }}
                      >

                        <h3
                          style={{
                            margin: 0,
                            color: "#0F172A",
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
                            color: "#64748B",
                            fontSize: "13px",
                            marginTop: "4px"
                          }}
                        >
                          {doctor.specialty}
                        </div>

                        

                    <div
                      style={{
                        marginTop: "15px",
                        color: "#F59E0B",
                        display: "flex",
                        gap: "5px",
                        alignItems: "center"
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
                        display: "grid",
                        gridTemplateColumns:
                          "1fr 1fr",
                        gap: "10px",
                        marginTop: "18px"
                      }}
                    >

                      <InfoSmall
                        label="Next Slot"
                        value={doctor.nextSlot}
                      />

                      <InfoSmall
                        label="Fee"
                        value={doctor.fee}
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
                        width: "100%",
                        marginTop: "20px",

                        background: "#FFFFFF",
                        color: "#2563EB",

                        border:
                          "1px solid #2563EB",

                        padding: "12px",

                        borderRadius: "12px",

                        fontWeight: "600",

                        cursor: "pointer",

                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "7px"
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

        {/* INFORMATION CARD */}

        <div
          style={{
            marginTop:
              isMobile
                ? "22px"
                : "30px",

            background: "#EFF6FF",

            border:
              "1px solid #BFDBFE",

            borderRadius: "16px",

            padding:
              isMobile
                ? "14px"
                : "17px",

            color: "#1E40AF",

            display: "flex",

            alignItems: "flex-start",

            gap: "10px",

            fontSize:
              isMobile
                ? "13px"
                : "14px",

            lineHeight: "1.6"
          }}
        >

          <FaInfoCircle
            style={{
              marginTop: "3px",
              flexShrink: 0
            }}
          />

          <span>
            We only show doctors who match
            your selected health problem, doctor preference and
            are available at{" "}
            {hospital.name}. The recommended
            doctor is the earliest available
            option.
          </span>

        </div>

      </div>

      {/* FIXED BACK BUTTON */}

      <button
        onClick={handleBack}
        style={{
          position: "fixed",
          bottom:
            isMobile
              ? "15px"
              : "20px",

          left:
            isMobile
              ? "15px"
              : "20px",

          zIndex: 1000,

          display: "flex",
          alignItems: "center",
          justifyContent: "center",

          gap: "8px",

          background: "#FFFFFF",
          color: "#2563EB",

          border:
            "1px solid #CBD5E1",

          borderRadius: "12px",

          padding:
            isMobile
              ? "11px 16px"
              : "12px 18px",

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
  );
}


/* TAG */

function Tag({ children }) {

  return (

    <div
      style={{
        background: "#F8FAFC",

        border:
          "1px solid #E2E8F0",

        borderRadius: "999px",

        padding: "8px 12px",

        display: "flex",

        alignItems: "center",

        gap: "7px",

        fontSize: "13px",

        color: "#334155",

        maxWidth: "100%",

        boxSizing: "border-box",

        wordBreak: "break-word"
      }}
    >
      {children}
    </div>

  );
}


/* SMALL INFORMATION */

function InfoSmall({
  icon,
  label,
  value
}) {

  return (

    <div
      style={{
        background: "#F8FAFC",

        borderRadius: "12px",

        padding: "12px",

        textAlign: "center",

        minWidth: 0,

        boxSizing: "border-box"
      }}
    >

      {icon && (

        <div
          style={{
            color: "#2563EB",
            marginBottom: "5px"
          }}
        >
          {icon}
        </div>

      )}

      <div
        style={{
          color: "#64748B",

          fontSize: "11px",

          marginBottom: "4px"
        }}
      >
        {label}
      </div>

      <div
        style={{
          fontWeight: "700",

          color: "#0F172A",

          fontSize: "13px",

          wordBreak: "break-word"
        }}
      >
        {value}
      </div>

    </div>

  );
}