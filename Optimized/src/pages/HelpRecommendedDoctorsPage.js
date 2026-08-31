import { useLocation, useNavigate } from "react-router-dom";
import {
  useContext,
  useEffect,
  useRef
} from "react";
import Header from "../components/Header";
import ProgressTracker from "../components/ProgressTracker";

import symptoms from "../data/symptoms";
import doctors from "../data/doctors";
import availability from "../data/doctorHospitalAvailability";
import hospitals from "../data/hospitals";

import useIsMobile from "../hooks/useIsMobile";
import { TrackingContext } from "../context/TrackingContext";

import {
  FaMapMarkerAlt,
  FaClock,
  FaUserMd,
  FaStar,
  FaArrowLeft,
  FaInfoCircle,
  FaMoneyBillWave,
  FaHospital,
  FaCheckCircle
} from "react-icons/fa";

export default function HelpRecommendedDoctorsPage() {
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

// ==================================================
// PAGE START TIME
// Used to measure how long the user takes
// before selecting a doctor.
// ==================================================

const pageStartTime = useRef(Date.now());


// ==================================================
// PREVENT DUPLICATE HESITATION
// Only the first doctor-selection decision
// is measured.
// ==================================================

const doctorDecisionTracked = useRef(false);

  /*
   * Data received from previous pages
   */
  const symptomId = location.state?.symptomId;

  const selectedLocation =
    location.state?.location || "Colombo";

  const doctorPreference =
    location.state?.doctorPreference ||
    location.state?.preference ||
    "No Preference";

  const urgency =
    location.state?.urgency || "Flexible";

    

  /*
   * Progress
   */
  const steps = [
    "Health Problem",
    "Location",
    "Doctor Preference",
    "Urgency",
    "Doctors",
    "Appointment"
  ];

  /*
   * Selected health problem
   */
  const symptom = symptoms.find(
    (s) => s.id === symptomId
  );

  // ==================================================
// PAGE OPEN TRACKING
// ==================================================

useEffect(() => {

  // ------------------------------------------------
  // Track page visit
  // ------------------------------------------------

  trackPageVisit(
    "HelpRecommendedDoctorsPage"
  );


  // ------------------------------------------------
  // Track page opened
  // ------------------------------------------------

  trackInteraction(
    "page_opened",
    {
      page:
        "HelpRecommendedDoctorsPage",

      flow:
        "help_choose",

      symptomId,

      symptomName:
        symptom?.name ||
        symptom?.title ||
        null,

      doctorPreference,

      urgency,

      location:
        selectedLocation
    }
  );


  // ------------------------------------------------
  // Start timing from page load
  // ------------------------------------------------

  pageStartTime.current =
    Date.now();


  // ------------------------------------------------
  // Allow hesitation to be measured
  // again when page opens.
  // ------------------------------------------------

  doctorDecisionTracked.current =
    false;


  // We intentionally want this effect
  // to run only when the page opens.
  // eslint-disable-next-line react-hooks/exhaustive-deps

}, []);

  /*
   * Convert availability slot into
   * a sortable value.
   *
   * Earlier appointment = smaller value.
   */
  const getSlotValue = (slot) => {
    if (!slot) {
      return Infinity;
    }

    const lowerSlot = slot.toLowerCase();

    let dayRank = 10;

    if (lowerSlot.includes("today")) {
      dayRank = 1;
    } else if (lowerSlot.includes("tomorrow")) {
      dayRank = 2;
    } else if (
      lowerSlot.includes("day after tomorrow")
    ) {
      dayRank = 3;
    } else if (
      lowerSlot.includes("this week")
    ) {
      dayRank = 4;
    }

    const match = slot.match(
      /(\d{1,2}):(\d{2})\s*(AM|PM)/i
    );

    if (!match) {
      return dayRank * 1440;
    }

    let hours = parseInt(
      match[1],
      10
    );

    const minutes = parseInt(
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
      dayRank * 1440 +
      hours * 60 +
      minutes
    );
  };

  /*
   * Convert distance into a sortable number.
   */
  const getDistanceValue = (hospital) => {
    if (!hospital?.distance) {
      return Infinity;
    }

    return parseFloat(
      hospital.distance
    ) || Infinity;
  };

  /*
   * Check hospital location.
   */
  const hospitalMatchesLocation = (
    hospital
  ) => {
    if (!hospital) {
      return false;
    }

    const selected =
      selectedLocation
        .toLowerCase()
        .trim();

    const hospitalName =
      hospital.name
        ?.toLowerCase()
        .trim() || "";

    const hospitalLocation =
      hospital.location
        ?.toLowerCase()
        .trim() || "";

    const hospitalCity =
      hospital.city
        ?.toLowerCase()
        .trim() || "";

    return (
      hospitalName.includes(selected) ||
      selected.includes(hospitalName) ||
      hospitalLocation.includes(selected) ||
      selected.includes(hospitalLocation) ||
      hospitalCity.includes(selected) ||
      selected.includes(hospitalCity)
    );
  };

  /*
   * Check doctor gender preference.
   *
   * Assumes doctor.gender contains:
   * "Male" or "Female"
   */
  const doctorMatchesPreference = (
    doctor
  ) => {
    if (
      !doctorPreference ||
      doctorPreference === "No Preference"
    ) {
      return true;
    }

    return (
      doctor.gender?.toLowerCase() ===
      doctorPreference.toLowerCase()
    );
  };

  /*
   * Check whether the doctor is suitable
   * for the selected urgency.
   *
   * The availability data is expected
   * to contain nextSlot / availableDates.
   */
  const matchesUrgency = (doctorAvailability) => {
  if (!doctorAvailability) {
    return false;
  }

  const today = new Date();

  // Remove the time portion
  today.setHours(0, 0, 0, 0);

  const availableDates =
    doctorAvailability.availableDates || [];

  if (availableDates.length === 0) {
    return false;
  }

  // Your availableDates contains objects:
  // { date: "2026-08-19", slots: {...} }

  const dates = availableDates
    .map((item) => {
      if (!item?.date) {
        return null;
      }

      const date = new Date(`${item.date}T00:00:00`);

      return isNaN(date.getTime())
        ? null
        : date;
    })
    .filter(Boolean)
    .sort((a, b) => a - b);

  /*
   * TODAY
   */
  if (urgency === "Today") {
    return dates.some(
      (date) =>
        date.getTime() === today.getTime()
    );
  }

  /*
   * WITHIN 2–3 DAYS
   */
  if (urgency === "Within 2–3 Days") {
    const maxDate = new Date(today);

    maxDate.setDate(
      today.getDate() + 3
    );

    return dates.some(
      (date) =>
        date >= today &&
        date <= maxDate
    );
  }

  /*
   * THIS WEEK
   */
  if (urgency === "This Week") {
    const endOfWeek = new Date(today);

    const dayOfWeek = today.getDay();

    // Sunday = 0
    // Saturday = 6
    const daysUntilSaturday =
      6 - dayOfWeek;

    endOfWeek.setDate(
      today.getDate() +
      daysUntilSaturday
    );

    endOfWeek.setHours(
      23,
      59,
      59,
      999
    );

    return dates.some(
      (date) =>
        date >= today &&
        date <= endOfWeek
    );
  }

  /*
   * FLEXIBLE
   */
  if (urgency === "Flexible") {
    return dates.some(
      (date) =>
        date >= today
    );
  }

  return false;
};

  /*
   * First filter doctors by health problem
   * and gender preference.
   */
  const matchingDoctors = doctors.filter(
    (doctor) =>
      doctor.specialty ===
        symptom?.specialty &&
      doctorMatchesPreference(doctor)
  );

  console.log("================================");
console.log("SYMPTOM SPECIALTY:", symptom?.specialty);
console.log("DOCTOR PREFERENCE:", doctorPreference);
console.log("ALL DOCTORS:", doctors);

console.log(
  "DOCTORS AFTER SPECIALTY + GENDER FILTER:",
  matchingDoctors
);

  /*
   * Add hospital + availability information.
   */
  const enrichedDoctors = matchingDoctors
    .map((doctor) => {

      const doctorAvailabilities =
        availability
          .filter(
            (a) =>
              a.doctorId === doctor.id
          )
          .map((doctorAvail) => {

            const hospital =
              hospitals.find(
                (h) =>
                  h.id ===
                  doctorAvail.hospitalId
              );

            if (!hospital) {
              return null;
            }

            /*
             * Location filter
             */
            if (
              !hospitalMatchesLocation(
                hospital
              )
            ) {
              return null;
            }

            /*
             * Urgency filter
             */
            if (
              !matchesUrgency(
                doctorAvail
              )
            ) {
              return null;
            }

            return {
              ...doctor,

              hospital,

              fee:
                doctorAvail.fee,

              nextSlot:
                doctorAvail.nextSlot,

              availableDates:
                doctorAvail.availableDates,

              slots:
                doctorAvail.slots
            };
          })
          .filter(Boolean);

      if (
        doctorAvailabilities.length === 0
      ) {
        return null;
      }

      /*
       * If doctor has multiple hospitals,
       * select the earliest suitable slot.
       */
      const earliest =
        doctorAvailabilities.sort(
          (a, b) =>
            getSlotValue(
              a.nextSlot
            ) -
            getSlotValue(
              b.nextSlot
            )
        )[0];

      return earliest;
    })
    .filter(Boolean);

  /*
   * SORTING
   *
   * 1. Earliest appointment
   * 2. Nearest hospital
   * 3. Highest rating
   */
  const sortedDoctors =
    enrichedDoctors.sort(
      (a, b) => {

        const slotDifference =
          getSlotValue(
            a.nextSlot
          ) -
          getSlotValue(
            b.nextSlot
          );

        if (
          slotDifference !== 0
        ) {
          return slotDifference;
        }

        const distanceDifference =
          getDistanceValue(
            a.hospital
          ) -
          getDistanceValue(
            b.hospital
          );

        if (
          distanceDifference !== 0
        ) {
          return distanceDifference;
        }

        return (
          (b.rating || 0) -
          (a.rating || 0)
        );
      }
    );

  /*
   * First doctor = best recommendation
   */
  const recommendedDoctor =
    sortedDoctors[0];

  /*
   * Remaining doctors
   */
  const otherDoctors =
    sortedDoctors.slice(1);

  /*
   * Back button
   */
  const handleBack = () => {
    trackBackClick(
    "HelpRecommendedDoctorsPage_back"
  );


  // ==================================================
  // TRACK BACK NAVIGATION
  // ==================================================

  trackInteraction(
    "back_navigation",
    {
      from:
        "HelpRecommendedDoctorsPage",

      to:
        "HelpUrgencyPage",

      symptomId,

      symptomName:
        symptom?.name ||
        symptom?.title ||
        null,

      doctorPreference,

      urgency,

      location:
        selectedLocation,

      flow:
        "help_choose"
            }
  );
    navigate(-1);
  };

  /*
   * Select doctor
   */
  const handleDoctorSelect = (
    doctor
  ) => {

    if (!doctor) {
    return;
  }


  // ==================================================
  // CALCULATE DECISION TIME
  // ==================================================

  const now =
    Date.now();

  const decisionTime =
    (
      now -
      pageStartTime.current
    ) / 1000;

  const decisionTimeRounded =
    Number(
      decisionTime.toFixed(2)
    );
if (
    !doctorDecisionTracked.current
  ) {

    if (
      decisionTime > 5
    ) {

      trackHesitation(
        decisionTimeRounded,
        "HelpRecommendedDoctorsPage"
      );

    }

    doctorDecisionTracked.current =
      true;
  }

  trackClick(
    `doctor_${doctor.id}`,
    "HelpRecommendedDoctorsPage"
  );


  // ==================================================
  // TRACK DOCTOR SELECTION
  // ==================================================

  trackInteraction(
    "doctor_selected",
    {
      doctorId:
        doctor.id,

      doctorName:
        doctor.name,

      doctorGender:
        doctor.gender,

      specialty:
        doctor.specialty,

      hospitalId:
        doctor.hospital?.id,
         hospitalName:
        doctor.hospital?.name,

      location:
        selectedLocation,

      symptomId,

      symptomName:
        symptom?.name ||
        symptom?.title ||
        null,

      doctorPreference,

      urgency,

      nextSlot:
        doctor.nextSlot,

      fee:
        doctor.fee,

      distance:
        doctor.hospital?.distance,

      rating:
        doctor.rating,

      decisionTimeSeconds:
        decisionTimeRounded,
         flow:
        "help_choose"
    }
  );


  // ==================================================
  // NAVIGATION
  // ==================================================

  trackInteraction(
    "doctor_selection_navigation",
    {
      from:
        "HelpRecommendedDoctorsPage",

      to:
        "AppointmentDateTimePage",

      doctorId:
        doctor.id,

      doctorName:
        doctor.name
    }
  );

    navigate(
      "/appointment-date-time",
      {
        state: {
          doctor,
          hospital:
            doctor.hospital,

          symptomId,

          location:
            selectedLocation,

          doctorPreference,

          urgency
        }
      }
    );
  };

  /*
   * Safety check
   */
  if (!symptom) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "#F8FAFC",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "20px",
          textAlign: "center"
        }}
      >
        <div>

          <h2>
            Unable to find health problem
          </h2>

          <button
            onClick={handleBack}
            style={{
              marginTop: "15px",
              padding: "12px 20px",
              border: "none",
              borderRadius: "10px",
              background: "#2563EB",
              color: "#FFFFFF",
              cursor: "pointer"
            }}
          >
            <FaArrowLeft /> Back
          </button>

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
            ? "80px"
            : "90px",
        boxSizing: "border-box"
      }}
    >

      <Header />

      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",

          padding:
            isMobile
              ? "20px 14px 70px"
              : "25px 20px 80px",

          boxSizing: "border-box"
        }}
      >

        {/* STEP */}

        <h4
          style={{
            textAlign: "center",
            color: "#64748B",

            margin:
              isMobile
                ? "8px 0 12px"
                : "10px 0 15px",

            fontSize: "14px"
          }}
        >
          Step 5 of 6
        </h4>

        {/* PROGRESS */}

        <ProgressTracker
          currentStep={4}
          steps={steps}
        />

        {/* TITLE */}

        <div
          style={{
            textAlign: "center",

            margin:
              isMobile
                ? "28px auto 22px"
                : "35px auto 25px",

            padding:
              isMobile
                ? "0 4px"
                : "0 10px"
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
            Recommended doctors
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
            We found doctors matching
            your answers near{" "}
            <strong
              style={{
                color: "#2563EB"
              }}
            >
              {selectedLocation}
            </strong>
            .
          </p>

        </div>

        {/* ANSWERS SUMMARY */}

        <div
          style={{
            background: "#FFFFFF",
            borderRadius: "18px",

            padding:
              isMobile
                ? "14px"
                : "16px",

            marginBottom:
              isMobile
                ? "22px"
                : "30px",

            border:
              "1px solid #E2E8F0",

            display: "flex",

            justifyContent:
              "center",

            gap: "8px",

            flexWrap: "wrap"
          }}
        >

          <SummaryTag>
            <FaMapMarkerAlt />
            {selectedLocation}
          </SummaryTag>

          <SummaryTag>
            <FaUserMd />
            {symptom.name ||
              symptom.title}
          </SummaryTag>

          <SummaryTag>
            <FaUserMd />
            {doctorPreference}
          </SummaryTag>

          <SummaryTag>
            <FaClock />
            {urgency}
          </SummaryTag>

        </div>

        {/* NO DOCTORS */}

        {!recommendedDoctor && (
          <div
            style={{
              background: "#FFFFFF",
              borderRadius: "20px",

              padding:
                isMobile
                  ? "30px 18px"
                  : "40px 25px",

              textAlign: "center",

              border:
                "1px solid #E2E8F0",

              boxShadow:
                "0 8px 25px rgba(0,0,0,.05)"
            }}
          >

            <FaUserMd
              size={45}
              color="#94A3B8"
            />

            <h2
              style={{
                color: "#0F172A",
                margin:
                  "15px 0 10px",

                fontSize:
                  isMobile
                    ? "22px"
                    : "24px"
              }}
            >
              No doctors available
            </h2>

            <p
              style={{
                color: "#64748B",
                lineHeight: "1.6",
                fontSize:
                  isMobile
                    ? "14px"
                    : "15px"
              }}
            >
              We couldn't find a doctor
              matching your selected
              health problem, location,
              preference and urgency.
            </p>

            <button
              onClick={handleBack}
              style={{
                marginTop: "15px",
                padding:
                  isMobile
                    ? "11px 16px"
                    : "12px 20px",

                border: "none",
                borderRadius: "10px",

                background:
                  "#2563EB",

                color: "#FFFFFF",

                fontWeight: "600",
                cursor: "pointer"
              }}
            >
              <FaArrowLeft />{" "}
              Change Urgency
            </button>

          </div>
        )}

        {/* RESULTS */}

        {recommendedDoctor && (
          <>

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
                    ? "20px"
                    : "30px",

                border:
                  "2px solid #2563EB",

                boxShadow:
                  "0 10px 30px rgba(37,99,235,.10)",

                marginBottom: "30px"
              }}
            >

              {/* BADGE */}

              <div
                style={{
                  display:
                    "inline-flex",

                  alignItems:
                    "center",

                  gap: "7px",

                  background:
                    "#DCFCE7",

                  color: "#15803D",

                  padding:
                    "7px 12px",

                  borderRadius:
                    "999px",

                  fontSize: "12px",

                  fontWeight: "700",

                  marginBottom:
                    "20px"
                }}
              >
                <FaCheckCircle />

                Urgency Available
              </div>

              {/* DOCTOR HEADER */}

              <div
                style={{
                  display: "flex",

                  alignItems:
                    isMobile
                      ? "flex-start"
                      : "center",

                  gap:
                    isMobile
                      ? "12px"
                      : "16px",

                  flexWrap: "wrap"
                }}
              >

                <div
                  style={{
                    width:
                      isMobile
                        ? "60px"
                        : "72px",

                    height:
                      isMobile
                        ? "60px"
                        : "72px",

                    borderRadius:
                      "50%",

                    background:
                      "#EFF6FF",

                    display: "flex",

                    alignItems:
                      "center",

                    justifyContent:
                      "center",

                    flexShrink: 0
                  }}
                >
                  <FaUserMd
                    size={
                      isMobile
                        ? 28
                        : 34
                    }
                    color="#2563EB"
                  />
                </div>

                <div
                  style={{
                    flex: 1,
                    minWidth: 0
                  }}
                >

                  <h2
                    style={{
                      margin: 0,

                      color:
                        "#0F172A",

                      fontSize:
                        isMobile
                          ? "21px"
                          : "28px",

                      wordBreak:
                        "break-word"
                    }}
                  >
                    {
                      recommendedDoctor.name
                    }
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
                          : "15px"
                    }}
                  >
                    {
                      recommendedDoctor.specialty
                    }
                  </div>

                  <div
                    style={{
                      display: "flex",

                      alignItems:
                        "center",

                      gap: "6px",

                      marginTop: "7px",

                      color:
                        "#F59E0B",

                      fontSize: "14px"
                    }}
                  >
                    <FaStar />

                    {
                      recommendedDoctor.rating
                    }
                  </div>

                </div>

              </div>

              {/* INFORMATION GRID */}

              <div
                style={{
                  display: "grid",

                  gridTemplateColumns:
                    "repeat(2, minmax(0, 1fr))",

                  gap:
                    isMobile
                      ? "8px"
                      : "12px",

                  marginTop: "18px"
                }}
              >

                <InfoSmall
                  icon={
                    <FaHospital />
                  }
                  label="Hospital"
                  value={
                    recommendedDoctor
                      .hospital.name
                  }
                />

                <InfoSmall
                  icon={
                    <FaClock />
                  }
                  label="Earliest Slot"
                  value={
                    recommendedDoctor
                      .nextSlot
                  }
                />

                <InfoSmall
                  icon={
                    <FaMoneyBillWave />
                  }
                  label="Consultation Fee"
                  value={
                    recommendedDoctor
                      .fee
                  }
                />

                <InfoSmall
                  icon={
                    <FaMapMarkerAlt />
                  }
                  label="Distance"
                  value={
                    recommendedDoctor
                      .hospital
                      .distance
                      ? `${recommendedDoctor.hospital.distance} km`
                      : "Nearby"
                  }
                />

              </div>

              {/* DESCRIPTION */}

              <p
                style={{
                  color: "#64748B",

                  lineHeight: "1.6",

                  fontSize: "14px",

                  margin:
                    "20px 0 0"
                }}
              >
                This doctor is the best
                match for your selected
                health problem, location,
                doctor preference and
                urgency.
              </p>

              {/* BOOK */}

              <button
                onClick={() =>
                  handleDoctorSelect(
                    recommendedDoctor
                  )
                }
                style={{
                  width: "100%",

                  marginTop: "20px",

                  background:
                    "#2563EB",

                  color: "#FFFFFF",

                  padding:
                    isMobile
                      ? "13px"
                      : "14px",

                  border: "none",

                  borderRadius:
                    "12px",

                  fontWeight: "700",

                  cursor: "pointer",

                  fontSize: "15px"
                }}
              >
                Book Appointment
              </button>

            </div>

            {/* OTHER MATCHING DOCTORS */}

            {otherDoctors.length > 0 && (
              <>
                <h2
                  style={{
                    color: "#0F172A",

                    fontSize:
                      isMobile
                        ? "21px"
                        : "24px",

                    margin:
                      "0 0 18px"
                  }}
                >
                  Other matching doctors
                </h2>

                <div
                  style={{
                    display: "grid",

                    gridTemplateColumns:
                      isMobile
                        ? "1fr"
                        : "repeat(2, minmax(0, 1fr))",

                    gap:
                      isMobile
                        ? "16px"
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
                              : "20px",

                          border:
                            "1px solid #E2E8F0",

                          boxShadow:
                            "0 6px 20px rgba(0,0,0,.04)"
                        }}
                      >

                        {/* DOCTOR HEADER */}

                        <div
                          style={{
                            display: "flex",

                            alignItems:
                              "center",

                            gap: "14px"
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

                              flexShrink: 0
                            }}
                          >
                            <FaUserMd
                              size={
                                isMobile
                                  ? 23
                                  : 26
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

                                color:
                                  "#0F172A",

                                fontSize:
                                  "18px",

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
                              {
                                doctor.specialty
                              }
                            </div>

                            <div
                              style={{
                                display:
                                  "flex",

                                alignItems:
                                  "center",

                                gap: "6px",

                                marginTop:
                                  "7px",

                                color:
                                  "#F59E0B",

                                fontSize:
                                  "14px"
                              }}
                            >
                              <FaStar />

                              {doctor.rating}
                            </div>

                          </div>

                        </div>

                        {/* INFO GRID */}

                        <div
                          style={{
                            display: "grid",

                            gridTemplateColumns:
                              "repeat(2, minmax(0, 1fr))",

                            gap:
                              isMobile
                                ? "8px"
                                : "12px",

                            marginTop:
                              "18px"
                          }}
                        >

                          <InfoSmall
                            icon={
                              <FaHospital />
                            }
                            label="Hospital"
                            value={
                              doctor
                                .hospital
                                .name
                            }
                          />

                          <InfoSmall
                            icon={
                              <FaClock />
                            }
                            label="Earliest Slot"
                            value={
                              doctor
                                .nextSlot
                            }
                          />

                          <InfoSmall
                            icon={
                              <FaMoneyBillWave />
                            }
                            label="Fee"
                            value={
                              doctor.fee
                            }
                          />

                          <InfoSmall
                            icon={
                              <FaMapMarkerAlt />
                            }
                            label="Distance"
                            value={
                              doctor
                                .hospital
                                .distance
                                ? `${doctor.hospital.distance} km`
                                : "Nearby"
                            }
                          />

                        </div>

                        {/* VIEW */}

                        <button
                          onClick={() =>
                            handleDoctorSelect(
                              doctor
                            )
                          }
                          style={{
                            width: "100%",

                            marginTop:
                              "18px",

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
                              "pointer"
                          }}
                        >
                          View Availability
                        </button>

                      </div>

                    )
                  )}

                </div>
              </>
            )}

            {/* INFORMATION */}

            <div
              style={{
                marginTop: "30px",

                background:
                  "#EFF6FF",

                border:
                  "1px solid #BFDBFE",

                borderRadius:
                  "16px",

                padding:
                  isMobile
                    ? "14px"
                    : "16px",

                color:
                  "#1E40AF",

                display: "flex",

                alignItems:
                  "flex-start",

                gap: "10px",

                fontSize:
                  isMobile
                    ? "12px"
                    : "13px",

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
                Doctors shown here match
                your selected health problem,
                location, doctor preference and
                urgency. Results are ordered by
                earliest available appointment,
                nearest distance and hospital
                rating.
              </span>

            </div>

          </>
        )}

      </div>

      {/* BACK BUTTON */}

      <button
        onClick={handleBack}
        style={{
          position: "fixed",

          left:
            isMobile
              ? "12px"
              : "20px",

          bottom:
            isMobile
              ? "12px"
              : "20px",

          zIndex: 1000,

          display: "flex",

          alignItems:
            "center",

          gap: "8px",

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
              ? "10px 15px"
              : "12px 18px",

          fontSize:
            isMobile
              ? "13px"
              : "14px",

          fontWeight:
            "600",

          cursor:
            "pointer",

          boxShadow:
            "0 4px 15px rgba(15,23,42,.10)"
        }}
      >
        <FaArrowLeft />
        Back
      </button>

    </div>
  );
}


/*
 * SUMMARY TAG
 */
function SummaryTag({
  children
}) {
  return (
    <div
      style={{
        display: "flex",

        alignItems:
          "center",

        gap: "8px",

        background:
          "#F8FAFC",

        border:
          "1px solid #E2E8F0",

        padding:
          "8px 12px",

        borderRadius:
          "999px",

        fontSize:
          "13px",

        color:
          "#334155",

        maxWidth:
          "100%",

        wordBreak:
          "break-word"
      }}
    >
      {children}
    </div>
  );
}


/*
 * SMALL INFORMATION CARD
 */
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

        minWidth: 0,

        overflow:
          "hidden"
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
            "break-word",

          overflowWrap:
            "anywhere"
        }}
      >
        {value}
      </div>

    </div>
  );
}