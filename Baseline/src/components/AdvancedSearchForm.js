import { useState, useContext, useRef } from "react";

import { useNavigate } from "react-router-dom";

import Select from "react-select";

import doctors from "../data/doctors";
import hospitals from "../data/hospitals";
import specializations from "../data/specializations";

import { TrackingContext } from "../context/TrackingContext";

import useIsMobile from "../hooks/useIsMobile";

function AdvancedSearchForm() {
  const navigate = useNavigate();

  const isMobile = useIsMobile();

  const {
    trackClick,
    trackError,
    trackInteraction,
    trackHesitation,
    trackSuccess,
  } = useContext(TrackingContext);

  const interactionStartTime = useRef(Date.now());

  const calculateHesitation = () => {
    const hesitationTime = (Date.now() - interactionStartTime.current) / 1000;

    if (hesitationTime > 5) {
      trackHesitation(Number(hesitationTime.toFixed(2)));
    }

    interactionStartTime.current = Date.now();
  };

  const [filters, setFilters] = useState({
    doctorName: null,
    location: null,
    hospital: null,
    specialization: null,
    hospitalType: "",
    gender: "",
    sessionTime: "",
    date: "",
    priceRange: "",
  });

  const doctorOptions = doctors.map((d) => ({
    value: d.name,
    label: d.name,
  }));

  const locationOptions = [
    {
      value: "Colombo",
      label: "Colombo",
    },
    {
      value: "Kandy",
      label: "Kandy",
    },
    {
      value: "Galle",
      label: "Galle",
    },
    {
      value: "Negombo",
      label: "Negombo",
    },
    {
      value: "Kurunegala",
      label: "Kurunegala",
    },
  ];

  const hospitalOptions = hospitals.map((h) => ({
    value: h,
    label: h,
  }));

  const specializationOptions = specializations.map((s) => ({
    value: s,
    label: s,
  }));

  const hospitalTypes = ["Private Hospital", "Government Hospital"];

  const genders = ["Any", "Male", "Female"];

  const sessionTimes = ["Any", "Morning", "Afternoon", "Evening"];

  const priceRanges = ["Any", "1000-2000", "2000-3000", "3000+"];

  const handleSearch = () => {
    trackClick();

    calculateHesitation();

    trackInteraction("advanced_search_button_clicked", {
      filters,
    });

    const isEmptySearch =
      !filters.doctorName &&
      !filters.location &&
      !filters.hospital &&
      !filters.specialization &&
      !filters.hospitalType &&
      !filters.gender &&
      !filters.sessionTime &&
      !filters.date &&
      !filters.priceRange;

    if (isEmptySearch) {
      trackError();

      trackInteraction("advanced_search_validation_error", {
        reason: "empty_advanced_search",
      });

      alert("Please select at least one filter");

      return;
    }

    trackInteraction("advanced_search_success", {
      doctorName: filters.doctorName?.value || "",

      location: filters.location?.value || "",

      hospital: filters.hospital?.value || "",

      specialization: filters.specialization?.value || "",

      hospitalType: filters.hospitalType,

      gender: filters.gender,

      sessionTime: filters.sessionTime,

      date: filters.date,

      priceRange: filters.priceRange,
    });

    navigate("/results", {
      state: {
        doctorName: filters.doctorName?.value || "",

        location: filters.location?.value || "",

        hospital: filters.hospital?.value || "",

        specialization: filters.specialization?.value || "",

        hospitalType: filters.hospitalType,

        gender: filters.gender,

        sessionTime: filters.sessionTime,

        date: filters.date,

        priceRange: filters.priceRange,
      },
    });
  };

  const selectStyles = {
    container: (base) => ({
      ...base,
      width: "100%",
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
    flex: isMobile ? "none" : 1,

    minWidth: isMobile ? 0 : 260,

    width: "100%",

    boxSizing: "border-box",
  };

  const labelStyle = {
    display: "block",

    marginBottom: 6,

    fontWeight: 500,
  };

  const selectFieldStyle = {
    width: "100%",

    height: 44,

    border: "1px solid #ccc",

    borderRadius: 8,

    padding: "0 12px",

    boxSizing: "border-box",
  };

  const rowStyle = {
    display: "flex",

    flexDirection: isMobile ? "column" : "row",

    gap: isMobile ? 16 : 16,

    marginBottom: 20,

    alignItems: isMobile ? "stretch" : "center",

    width: "100%",

    boxSizing: "border-box",
  };

  const handleSelectTracking = (field, value) => {
    calculateHesitation();

    trackClick();

    trackInteraction("advanced_filter_selected", {
      field,
      value,
    });
  };

  return (
    <div
      style={{
        background: "linear-gradient(135deg, #e0f2fe, #f8fafc)",

        padding: isMobile ? 18 : 25,

        borderRadius: 12,

        boxShadow: "0 2px 10px rgba(0,0,0,0.06)",

        width: "100%",

        boxSizing: "border-box",

        overflow: "visible",
      }}
    >
      <div style={rowStyle}>
        <div style={fieldStyle}>
          <label style={labelStyle}>Doctor Name</label>

          <Select
            options={doctorOptions}
            value={filters.doctorName}
            onChange={(selected) => {
              setFilters((prev) => ({
                ...prev,
                doctorName: selected,
              }));

              handleSelectTracking("doctorName", selected?.value);
            }}
            onInputChange={(value) => {
              trackInteraction("doctor_typing", {
                keyword: value,
              });
            }}
            placeholder="Select Doctor"
            isSearchable
            isClearable
            styles={selectStyles}
            menuPortalTarget={document.body}
            menuPosition="fixed"
          />
        </div>

        <div style={fieldStyle}>
          <label style={labelStyle}>Location</label>

          <Select
            options={locationOptions}
            value={filters.location}
            onChange={(selected) => {
              setFilters((prev) => ({
                ...prev,
                location: selected,
              }));

              handleSelectTracking("location", selected?.value);
            }}
            placeholder="Select Location"
            isSearchable
            isClearable
            styles={selectStyles}
            menuPortalTarget={document.body}
            menuPosition="fixed"
          />
        </div>

        <div style={fieldStyle}>
          <label style={labelStyle}>Hospital</label>

          <Select
            options={hospitalOptions}
            value={filters.hospital}
            onChange={(selected) => {
              setFilters((prev) => ({
                ...prev,
                hospital: selected,
              }));

              handleSelectTracking("hospital", selected?.value);
            }}
            placeholder="Select Hospital"
            isSearchable
            isClearable
            styles={selectStyles}
            menuPortalTarget={document.body}
            menuPosition="fixed"
          />
        </div>
      </div>

      <div style={rowStyle}>
        <div style={fieldStyle}>
          <label style={labelStyle}>Specialization</label>

          <Select
            options={specializationOptions}
            value={filters.specialization}
            onChange={(selected) => {
              setFilters((prev) => ({
                ...prev,
                specialization: selected,
              }));

              handleSelectTracking("specialization", selected?.value);
            }}
            placeholder="Select Specialization"
            isSearchable
            isClearable
            styles={selectStyles}
            menuPortalTarget={document.body}
            menuPosition="fixed"
          />
        </div>

        <div style={fieldStyle}>
          <label style={labelStyle}>Hospital Type</label>

          <select
            value={filters.hospitalType}
            onChange={(e) => {
              setFilters((prev) => ({
                ...prev,
                hospitalType: e.target.value,
              }));

              handleSelectTracking("hospitalType", e.target.value);
            }}
            style={selectFieldStyle}
          >
            <option value="">Select Hospital Type</option>

            {hospitalTypes.map((t, i) => (
              <option key={i} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>

        <div style={fieldStyle}>
          <label style={labelStyle}>Gender</label>

          <select
            value={filters.gender}
            onChange={(e) => {
              setFilters((prev) => ({
                ...prev,
                gender: e.target.value,
              }));

              handleSelectTracking("gender", e.target.value);
            }}
            style={selectFieldStyle}
          >
            <option value="">Select Gender</option>

            {genders.map((g, i) => (
              <option key={i} value={g}>
                {g}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div
        style={{
          ...rowStyle,

          marginBottom: 0,
        }}
      >
        <div style={fieldStyle}>
          <label style={labelStyle}>Session Time</label>

          <select
            value={filters.sessionTime}
            onChange={(e) => {
              setFilters((prev) => ({
                ...prev,
                sessionTime: e.target.value,
              }));

              handleSelectTracking("sessionTime", e.target.value);
            }}
            style={selectFieldStyle}
          >
            <option value="">Select Session Time</option>

            {sessionTimes.map((s, i) => (
              <option key={i} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        <div style={fieldStyle}>
          <label style={labelStyle}>Date</label>

          <input
            type="date"
            value={filters.date}
            onChange={(e) => {
              setFilters((prev) => ({
                ...prev,
                date: e.target.value,
              }));

              handleSelectTracking("date", e.target.value);
            }}
            style={selectFieldStyle}
          />
        </div>

        <div style={fieldStyle}>
          <label style={labelStyle}>Price Range</label>

          <select
            value={filters.priceRange}
            onChange={(e) => {
              setFilters((prev) => ({
                ...prev,
                priceRange: e.target.value,
              }));

              handleSelectTracking("priceRange", e.target.value);
            }}
            style={selectFieldStyle}
          >
            <option value="">Select Price Range</option>

            {priceRanges.map((p, i) => (
              <option key={i} value={p}>
                {p}
              </option>
            ))}
          </select>
        </div>

        <div
          style={{
            minWidth: isMobile ? 0 : 220,

            width: isMobile ? "100%" : undefined,

            alignSelf: isMobile ? "stretch" : "flex-end",

            boxSizing: "border-box",
          }}
        >
          <button
            onClick={handleSearch}
            style={{
              width: "100%",

              height: 44,

              background: "#28a745",

              color: "white",

              border: "none",

              borderRadius: 8,

              cursor: "pointer",

              fontWeight: "bold",

              boxSizing: "border-box",
            }}
          >
            Advanced Search
          </button>
        </div>
      </div>
    </div>
  );
}

export default AdvancedSearchForm;
