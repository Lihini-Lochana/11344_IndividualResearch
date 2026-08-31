import { useState, useContext, useRef } from "react";

import { useNavigate } from "react-router-dom";

import Select from "react-select";

import doctors from "../data/doctors";
import hospitals from "../data/hospitals";
import specializations from "../data/specializations";

import { TrackingContext } from "../context/TrackingContext";

import useIsMobile from "../hooks/useIsMobile";

function BasicSearchForm({ initialFilters = {} }) {
  const navigate = useNavigate();

  const isMobile = useIsMobile();

  const {
    trackClick,
    trackError,
    trackInteraction,
    trackHesitation,
    trackSuccess,
  } = useContext(TrackingContext);

  const [doctorName, setDoctorName] = useState(
    initialFilters.doctorName
      ? {
          value: initialFilters.doctorName,
          label: initialFilters.doctorName,
        }
      : null,
  );

  const [hospital, setHospital] = useState(
    initialFilters.hospital
      ? {
          value: initialFilters.hospital,
          label: initialFilters.hospital,
        }
      : null,
  );

  const [specialization, setSpecialization] = useState(
    initialFilters.specialization
      ? {
          value: initialFilters.specialization,
          label: initialFilters.specialization,
        }
      : null,
  );

  const [date, setDate] = useState(initialFilters.date || "");

  const interactionStartTime = useRef(Date.now());

  const calculateHesitation = () => {
    const hesitationTime = (Date.now() - interactionStartTime.current) / 1000;

    if (hesitationTime > 5) {
      trackHesitation(Number(hesitationTime.toFixed(2)));
    }

    interactionStartTime.current = Date.now();
  };

  const doctorOptions = doctors.map((d) => ({
    value: d.name,
    label: d.name,
  }));

  const hospitalOptions = hospitals.map((h) => ({
    value: h,
    label: h,
  }));

  const specializationOptions = specializations.map((s) => ({
    value: s,
    label: s,
  }));

  const handleSearch = () => {
    trackClick();

    calculateHesitation();

    trackInteraction("basic_search_button_clicked", {
      doctor: doctorName?.value || "",
      hospital: hospital?.value || "",
      specialization: specialization?.value || "",
      date,
    });

    if (!doctorName && !hospital && !specialization && !date) {
      trackError();

      trackInteraction("basic_search_validation_error", {
        reason: "empty_search_fields",
      });

      alert("Please enter at least one field");

      return;
    }

    navigate("/results", {
      state: {
        doctorName: doctorName?.value || "",

        hospital: hospital?.value || "",

        specialization: specialization?.value || "",

        date,
      },
    });
  };

  const selectStyles = {
    container: (base) => ({
      ...base,
      width: "100%",
      marginBottom: 0,
    }),

    control: (base, state) => ({
      ...base,

      minHeight: 44,
      height: 44,

      borderRadius: 8,

      borderColor: state.isFocused ? "#2684FF" : "#ccc",

      boxShadow: "none",

      "&:hover": {
        borderColor: "#2684FF",
      },
    }),

    valueContainer: (base) => ({
      ...base,
      height: 44,
      padding: "0 10px",
    }),

    input: (base) => ({
      ...base,
      margin: 0,
      padding: 0,
    }),

    indicatorsContainer: (base) => ({
      ...base,
      height: 44,
    }),

    menu: (base) => ({
      ...base,
      zIndex: 99999,
    }),

    menuPortal: (base) => ({
      ...base,
      zIndex: 99999,
    }),
  };

  const fieldStyle = {
    width: "100%",
    minWidth: isMobile ? 0 : undefined,
    overflow: "visible",
  };

  return (
    <div
      style={{
        background: "linear-gradient(135deg, #e0f2fe, #f8fafc)",

        padding: isMobile ? "18px" : "20px",

        borderRadius: 12,

        marginBottom: 25,

        boxShadow: "0 2px 10px rgba(0,0,0,0.06)",

        overflow: "visible",

        width: "100%",
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          display: "flex",

          flexDirection: isMobile ? "column" : "row",

          alignItems: isMobile ? "stretch" : "center",

          gap: isMobile ? 16 : 12,

          overflow: "visible",

          flexWrap: isMobile ? "wrap" : "nowrap",

          width: "100%",
        }}
      >
        <div
          style={
            isMobile
              ? fieldStyle
              : {
                  minWidth: 240,
                  overflow: "visible",
                }
          }
        >
          <label
            style={{
              display: "block",
              marginBottom: 6,
              fontWeight: 500,
            }}
          >
            Doctor
          </label>

          <Select
            options={doctorOptions}
            value={doctorName}
            onChange={(selected) => {
              calculateHesitation();

              setDoctorName(selected);

              trackInteraction("doctor_selected", {
                value: selected?.value || "",
              });
            }}
            onInputChange={(value) => {
              trackInteraction("doctor_search_typing", {
                keyword: value,
              });
            }}
            placeholder="Doctor Name"
            isSearchable
            isClearable
            styles={selectStyles}
            menuPortalTarget={document.body}
            menuPosition="fixed"
          />
        </div>

        <div
          style={
            isMobile
              ? fieldStyle
              : {
                  minWidth: 240,
                  overflow: "visible",
                }
          }
        >
          <label
            style={{
              display: "block",
              marginBottom: 6,
              fontWeight: 500,
            }}
          >
            Hospital
          </label>

          <Select
            options={hospitalOptions}
            value={hospital}
            onChange={(selected) => {
              calculateHesitation();

              setHospital(selected);

              trackInteraction("hospital_selected", {
                value: selected?.value || "",
              });
            }}
            onInputChange={(value) => {
              trackInteraction("hospital_search_typing", {
                keyword: value,
              });
            }}
            placeholder="Hospital"
            isSearchable
            isClearable
            styles={selectStyles}
            menuPortalTarget={document.body}
            menuPosition="fixed"
          />
        </div>

        <div
          style={
            isMobile
              ? fieldStyle
              : {
                  minWidth: 240,
                  overflow: "visible",
                }
          }
        >
          <label
            style={{
              display: "block",
              marginBottom: 6,
              fontWeight: 500,
            }}
          >
            Specialization
          </label>

          <Select
            options={specializationOptions}
            value={specialization}
            onChange={(selected) => {
              calculateHesitation();

              setSpecialization(selected);

              trackInteraction("specialization_selected", {
                value: selected?.value || "",
              });
            }}
            onInputChange={(value) => {
              trackInteraction("specialization_typing", {
                keyword: value,
              });
            }}
            placeholder="Specialization"
            isSearchable
            isClearable
            styles={selectStyles}
            menuPortalTarget={document.body}
            menuPosition="fixed"
          />
        </div>

        <div
          style={{
            width: "100%",

            minWidth: isMobile ? 0 : 220,
          }}
        >
          <label
            style={{
              display: "block",
              marginBottom: 6,
              fontWeight: 500,
            }}
          >
            Date
          </label>

          <input
            type="date"
            value={date}
            onChange={(e) => {
              calculateHesitation();

              setDate(e.target.value);

              trackInteraction("date_selected", {
                value: e.target.value,
              });
            }}
            style={{
              width: "100%",

              height: 44,
              minHeight: 44,

              border: "1px solid #ccc",

              borderRadius: 8,

              padding: "0 12px",

              boxSizing: "border-box",

              margin: 0,
            }}
          />
        </div>

        <button
          onClick={handleSearch}
          style={{
            height: 44,

            width: isMobile ? "100%" : "auto",

            minWidth: isMobile ? "100%" : 140,

            marginTop: isMobile ? 0 : 28,

            padding: "0 25px",

            background: "#28a745",

            color: "white",

            border: "none",

            borderRadius: 8,

            cursor: "pointer",

            fontWeight: "bold",

            whiteSpace: "nowrap",

            boxSizing: "border-box",
          }}
        >
          Search
        </button>
      </div>
    </div>
  );
}

export default BasicSearchForm;
