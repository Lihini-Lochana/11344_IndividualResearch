import { useLocation, useNavigate } from "react-router-dom";
import { useContext, useEffect, useRef } from "react";
import Header from "../components/Header";
import ProgressTracker from "../components/ProgressTracker";

import symptoms from "../data/symptoms";
import doctors from "../data/doctors";
import availability from "../data/doctorHospitalAvailability";
import hospitals from "../data/hospitals";

import useIsMobile from "../hooks/useIsMobile";

import {
  FaMapMarkerAlt,
  FaClock,
  FaUserMd,
  FaStar,
  FaArrowLeft,
  FaInfoCircle,
  FaMoneyBillWave,
  FaHospital
} from "react-icons/fa";

import { TrackingContext } from "../context/TrackingContext";

export default function NearestFastestDoctorsPage() {
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

  const selectedLocation =
    location.state?.location || "Colombo, Sri Lanka";

  const symptomId = location.state?.symptomId;

  const doctorPreference =
  location.state?.doctorPreference || "No Preference";

  const symptom = symptoms.find(
    (s) => s.id === symptomId
  );

  const pageStartTime = useRef(Date.now());
const decisionTracked = useRef(false);

useEffect(() => {
  // Start measuring the time from when this page is opened
  pageStartTime.current = Date.now();

  // Reset decision tracking when page opens
  decisionTracked.current = false;

  // Track page visit
  trackPageVisit("NearestFastestDoctorsPage");

  // Track page opened interaction
  trackInteraction(
    "page_opened",
    {
      page: "NearestFastestDoctorsPage",
      flow: "Flow 4 - Nearest Available Doctor",
      step: 3,
      location: selectedLocation,
      symptomId,
      doctorPreference,
    }
  );

  // eslint-disable-next-line react-hooks/exhaustive-deps
}, []);

  const steps = [
    "Location",
    "Health Problem",
    "Doctor Preference",
    "Doctors",
    "Appointment",
    "Confirmation"
  ];



  /*
   * Get doctors matching the selected
   * health problem.
   */
  const matchingDoctors = doctors.filter(
  (doctor) => {

    // First check health problem / specialty
    const specialtyMatches =
      doctor.specialty ===
      symptom?.specialty;

    // No preference → allow both genders
    if (
      doctorPreference ===
      "No Preference"
    ) {
      return specialtyMatches;
    }

    // Male preference
    if (
      doctorPreference ===
      "Male Doctor"
    ) {
      return (
        specialtyMatches &&
        doctor.gender?.toLowerCase() ===
          "male"
      );
    }

    // Female preference
    if (
      doctorPreference ===
      "Female Doctor"
    ) {
      return (
        specialtyMatches &&
        doctor.gender?.toLowerCase() ===
          "female"
      );
    }

    return specialtyMatches;
  }
);
  /*
   * Convert appointment slot into
   * sortable value.
   */
  const getSlotValue = (slot) => {
    if (!slot) {
      return Infinity;
    }

    const lowerSlot = slot.toLowerCase();

    let dayRank = 3;

    if (lowerSlot.includes("today")) {
      dayRank = 1;
    } else if (
      lowerSlot.includes("tomorrow")
    ) {
      dayRank = 2;
    }

    const match = slot.match(
      /(\d{1,2}):(\d{2})\s*(AM|PM)/i
    );

    if (!match) {
      return Infinity;
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

    const timeInMinutes =
      hours * 60 + minutes;

    return (
      dayRank * 1440 +
      timeInMinutes
    );
  };

  /*
   * Check whether hospital belongs
   * to selected location.
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
   * Create doctor + hospital +
   * availability combinations.
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

            if (
              !hospitalMatchesLocation(
                hospital
              )
            ) {
              return null;
            }

            return {
              ...doctor,
              hospital,
              fee: doctorAvail.fee,
              nextSlot:
                doctorAvail.nextSlot,
              availableDates:
                doctorAvail.availableDates,
              slots: doctorAvail.slots
            };
          })
          .filter(Boolean);

      if (
        doctorAvailabilities.length === 0
      ) {
        return null;
      }

      const earliestAvailability =
        doctorAvailabilities.sort(
          (a, b) =>
            getSlotValue(a.nextSlot) -
            getSlotValue(b.nextSlot)
        )[0];

      return earliestAvailability;
    })
    .filter(Boolean)
    .sort(
      (a, b) =>
        getSlotValue(a.nextSlot) -
        getSlotValue(b.nextSlot)
    );

  /*
   * First doctor = fastest available.
   */
  const fastestDoctor =
    enrichedDoctors[0];

  /*
   * Remaining doctors.
   */
  const otherDoctors =
    enrichedDoctors.slice(1);



  /*
   * Back button.
   */
  const handleBack = () => {

   trackBackClick(
    "NearestFastestDoctorsPage_back"
  );


  // ---------------------------------------------
  // Track click
  // ---------------------------------------------

  trackClick(
    "back_to_location",
    "NearestFastestDoctorsPage"
  );

  trackInteraction(
    "back_navigation",
    {
      from: "NearestFastestDoctorsPage",
      to: "LocationSelectionPage",

      location:
        selectedLocation,

      symptomId,

      doctorPreference,
    }
  );
    navigate(-1);
  };

 
  const handleDoctorSelect = (doctor) => {

  if (!doctor || !symptom) {
    return;
  }

  // ---------------------------------------------
  // Calculate decision time
  // ---------------------------------------------

  const now = Date.now();

  const decisionTime =
    (now - pageStartTime.current) / 1000;

  const decisionTimeRounded =
    Number(decisionTime.toFixed(2));


  // ---------------------------------------------
  // Track hesitation ONLY when the user
  // actually selects a doctor
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
  // Track doctor click
  // ---------------------------------------------

  trackClick(
    `doctor_${doctor.id}`,
    "NearestFastestDoctorsPage"
  );


  // ---------------------------------------------
  // Track doctor selection interaction
  // ---------------------------------------------

  trackInteraction(
    "doctor_selected",
    {
      doctorId: doctor.id,
      doctorName: doctor.name,
      doctorGender: doctor.gender || null,
      specialty: doctor.specialty || null,

      hospitalId:
        doctor.hospital?.id || null,

      hospitalName:
        doctor.hospital?.name || null,

      nextSlot:
        doctor.nextSlot || null,

      consultationFee:
        doctor.fee || null,

      location: selectedLocation,

      symptomId: symptom.id,

      symptom:
        symptom.title,

      doctorPreference,

      isFastestDoctor:
        fastestDoctor?.id === doctor.id,

      decisionTimeSeconds:
        decisionTimeRounded,
    }
  );


  // ---------------------------------------------
  // Navigate to appointment page
  // ---------------------------------------------

 navigate(
      "/appointment-date-time",
      {
        state: {
          doctor,
          hospital:
            doctor.hospital
        }
      }
    );
};

  /*
   * Safety check.
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
        paddingBottom: isMobile
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
          padding: isMobile
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
            margin: isMobile
              ? "8px 0 12px"
              : "10px 0 15px",
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
              : "35px auto 25px",
            padding: isMobile
              ? "0 4px"
              : "0 10px"
          }}
        >
          <h1
            style={{
              fontSize: isMobile
                ? "30px"
                : "clamp(28px,5vw,46px)",
              lineHeight: "1.2",
              color: "#0F172A",
              margin: "0 0 12px"
            }}
          >
            Fastest available
            <br />
            {isMobile
              ? "specialists near you"
              : "specialists near you"}
          </h1>

          <p
            style={{
              color: "#64748B",
              fontSize: isMobile
                ? "14px"
                : "clamp(14px,2vw,17px)",
              lineHeight: "1.6",
              margin: 0
            }}
          >
            We found doctors matching
            your health problem and
            available at hospitals near{" "}
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

        {/* CONTEXT */}

        <div
          style={{
            background: "#FFFFFF",
            borderRadius: "18px",
            padding: isMobile
              ? "14px"
              : "16px",
            marginBottom: isMobile
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
          <Tag
            icon={
              <FaMapMarkerAlt />
            }
            isMobile={isMobile}
          >
            {selectedLocation}
          </Tag>

          <Tag
            icon={<FaUserMd />}
            isMobile={isMobile}
          >
            {symptom.title}
          </Tag>

          <Tag
            icon={<FaUserMd />}
            isMobile={isMobile}
          >
            {symptom.specialty}
          </Tag>

          <Tag
            icon={<FaUserMd />}
            isMobile={isMobile}
          >
            {doctorPreference}
          </Tag>

          <Tag
            icon={<FaClock />}
            isMobile={isMobile}
          >
            Earliest Available
          </Tag>
        </div>

        {/* NO DOCTORS */}

        {!fastestDoctor && (
          <div
            style={{
              background: "#FFFFFF",
              borderRadius: "20px",
              padding: isMobile
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
                fontSize: isMobile
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
                fontSize: isMobile
                  ? "14px"
                  : "15px"
              }}
            >
              We couldn't find a{" "}
              {symptom.specialty}{" "}
              available near{" "}
              {selectedLocation}.
            </p>

            <button
              onClick={handleBack}
              style={{
                marginTop: "15px",
                padding: isMobile
                  ? "11px 16px"
                  : "12px 20px",
                border: "none",
                borderRadius: "10px",
                background: "#2563EB",
                color: "#FFFFFF",
                fontWeight: "600",
                cursor: "pointer"
              }}
            >
              <FaArrowLeft />{" "}
              Change Location
            </button>
          </div>
        )}

        {/* RESULTS */}

        {fastestDoctor && (
          <>
            {/* FASTEST DOCTOR */}

            <div
              style={{
                background: "#FFFFFF",
                borderRadius: isMobile
                  ? "20px"
                  : "24px",
                padding: isMobile
                  ? "20px"
                  : "clamp(20px,4vw,30px)",
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
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "7px",
                  background: "#DCFCE7",
                  color: "#15803D",
                  padding: "7px 12px",
                  borderRadius: "999px",
                  fontSize: "12px",
                  fontWeight: "700",
                  marginBottom: "20px"
                }}
              >
                <FaClock />

                Fastest Available
              </div>

              {/* DOCTOR HEADER */}

              <div
                style={{
                  display: "flex",
                  alignItems: isMobile
                    ? "flex-start"
                    : "center",
                  gap: isMobile
                    ? "12px"
                    : "16px",
                  flexWrap: "wrap"
                }}
              >
                {/* ICON */}

                <div
                  style={{
                    width: isMobile
                      ? "60px"
                      : "72px",
                    height: isMobile
                      ? "60px"
                      : "72px",
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
                      isMobile ? 28 : 34
                    }
                    color="#2563EB"
                  />
                </div>

                {/* DETAILS */}

                <div
                  style={{
                    flex: 1,
                    minWidth: isMobile
                      ? "0"
                      : "200px"
                  }}
                >
                  <h2
                    style={{
                      margin: 0,
                      color: "#0F172A",
                      fontSize: isMobile
                        ? "21px"
                        : "clamp(20px,3vw,28px)",
                      wordBreak:
                        "break-word"
                    }}
                  >
                    {fastestDoctor.name}
                  </h2>

                  <div
                    style={{
                      color: "#64748B",
                      marginTop: "5px",
                      fontSize: isMobile
                        ? "13px"
                        : "15px"
                    }}
                  >
                    {
                      fastestDoctor.specialty
                    }
                  </div>

                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                      marginTop: "7px",
                      color: "#F59E0B",
                      fontSize: "14px"
                    }}
                  >
                    <FaStar />

                    {
                      fastestDoctor.rating
                    }
                  </div>
                </div>
              </div>

              {/* INFORMATION */}

              <div
                style={{
                  display: "grid",
    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
    gap: isMobile ? "8px" : "12px",
    marginTop: "18px"
                }}
              >
                <InfoSmall
                  icon={<FaHospital />}
                  label="Available Hospital"
                  value={
                    fastestDoctor.hospital.name
                  }
                />

                <InfoSmall
                  icon={<FaClock />}
                  label="Earliest Slot"
                  value={
                    fastestDoctor.nextSlot
                  }
                />

                <InfoSmall
                  icon={
                    <FaMoneyBillWave />
                  }
                  label="Consultation Fee"
                  value={
                    fastestDoctor.fee
                  }
                />

                <InfoSmall
                  icon={
                    <FaMapMarkerAlt />
                  }
                  label="Distance"
                  value={
                    fastestDoctor.hospital
                      .distance
                      ? `${fastestDoctor.hospital.distance} km`
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
                This is the earliest available{" "}
                {symptom.specialty}{" "}
                {doctorPreference !== "No Preference" &&
                  `with your selected preference (${doctorPreference}) `}
                near{" "}
                <strong>
                  {selectedLocation}
                </strong>
                .
              </p>

              {/* BOOK */}

              <button
                onClick={() =>
                  handleDoctorSelect(
                    fastestDoctor
                  )
                }
                style={{
                  width: "100%",
                  marginTop: "20px",
                  background: "#2563EB",
                  color: "#FFFFFF",
                  padding: isMobile
                    ? "13px"
                    : "14px",
                  border: "none",
                  borderRadius: "12px",
                  fontWeight: "700",
                  cursor: "pointer",
                  fontSize: "15px"
                }}
              >
                Book Appointment
              </button>
            </div>

            {/* OTHER DOCTORS */}

            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  isMobile
                    ? "1fr"
                    : "repeat(2, minmax(0, 1fr))",
                gap: isMobile
                  ? "16px"
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
                      padding: isMobile
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
                        alignItems: "center",
                        gap: "14px"
                      }}
                    >
                      <div
                        style={{
                          width: isMobile
                            ? "50px"
                            : "55px",
                          height: isMobile
                            ? "50px"
                            : "55px",
                          borderRadius: "50%",
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

                    {/* INFORMATION GRID */}

                    <div
                      style={{
                        display: "grid",
    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
    gap: isMobile ? "8px" : "12px",
    marginTop: "18px"
                      }}
                    >
                      <InfoSmall
                        icon={
                          <FaHospital />
                        }
                        label="Available Hospital"
                        value={
                          doctor.hospital
                            .name
                        }
                      />

                      <InfoSmall
                        icon={
                          <FaClock />
                        }
                        label="Earliest Slot"
                        value={
                          doctor.nextSlot
                        }
                      />

                      <InfoSmall
                        icon={
                          <FaMoneyBillWave />
                        }
                        label="Consultation Fee"
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
                          doctor.hospital
                            .distance
                            ? `${doctor.hospital.distance} km`
                            : "Nearby"
                        }
                      />
                    </div>

                    {/* VIEW AVAILABILITY */}

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

            {/* INFORMATION */}

            <div
              style={{
                marginTop: "30px",
                background: "#EFF6FF",
                border:
                  "1px solid #BFDBFE",
                borderRadius: "16px",
                padding: isMobile
                  ? "14px"
                  : "16px",
                color: "#1E40AF",
                display: "flex",
                alignItems:
                  "flex-start",
                gap: "10px",
                fontSize: isMobile
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
                your selected health problem
                and are available at hospitals
                near your selected location.
                The fastest doctor is shown
                first based on the earliest
                available appointment slot.
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
          left: isMobile
            ? "12px"
            : "20px",
          bottom: isMobile
            ? "12px"
            : "20px",
          zIndex: 1000,

          display: "flex",
          alignItems: "center",
          gap: "8px",

          background: "#FFFFFF",
          color: "#2563EB",

          border:
            "1px solid #CBD5E1",

          borderRadius: "12px",

          padding: isMobile
            ? "10px 15px"
            : "12px 18px",

          fontSize: isMobile
            ? "13px"
            : "14px",

          fontWeight: "600",

          cursor: "pointer",

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

/* TAG */

function Tag({
  icon,
  children,
  isMobile
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "8px",
        background: "#F8FAFC",
        border:
          "1px solid #E2E8F0",
        padding: isMobile
          ? "7px 10px"
          : "8px 12px",
        borderRadius: "999px",
        fontSize: isMobile
          ? "12px"
          : "13px",
        color: "#334155",
        maxWidth: "100%",
        wordBreak: "break-word"
      }}
    >
      {icon}
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
        overflow: "hidden"
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