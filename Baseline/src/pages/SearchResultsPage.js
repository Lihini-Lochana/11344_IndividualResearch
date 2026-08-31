import { useState, useEffect, useContext, useRef } from "react";

import { useLocation, useNavigate } from "react-router-dom";

import { TrackingContext } from "../context/TrackingContext";

import doctors from "../data/doctors";
import { filterDoctors } from "../utils/searchEngine";

import DoctorCard from "../components/DoctorCard";
import BasicSearchForm from "../components/BasicSearchForm";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

import useIsMobile from "../hooks/useIsMobile";

function SearchResultsPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const isMobile = useIsMobile();

  const filters = location.state || {};

  const results = filterDoctors(doctors, filters);

  const {
    trackPageVisit,
    trackClick,
    trackInteraction,
    trackHesitation,
    trackBackClick,
  } = useContext(TrackingContext);

  const isHospitalSearch = filters.hospital && !filters.doctorName;

  const [selectedDoctor, setSelectedDoctor] = useState(null);

  const interactionStartTime = useRef(Date.now());

  const calculateHesitation = (eventName) => {
    const timeSpent = (Date.now() - interactionStartTime.current) / 1000;

    if (timeSpent > 5) {
      trackHesitation(Number(timeSpent.toFixed(2)));
    }

    trackInteraction(`${eventName}_hesitation_time`, {
      seconds: Number(timeSpent.toFixed(2)),
    });

    interactionStartTime.current = Date.now();
  };

  useEffect(() => {
    trackPageVisit("SearchResultsPage");

    trackInteraction("search_results_view", {
      filters,
    });

    interactionStartTime.current = Date.now();
  }, []);

  useEffect(() => {
    if (!isHospitalSearch && results.length > 0) {
      setSelectedDoctor(results[0]);
    } else {
      setSelectedDoctor(null);
    }
  }, [location.state]);

  const handleBack = () => {
    calculateHesitation("back_click");

    trackBackClick();

    trackClick("back_button");

    trackInteraction("search_results_back_clicked", {
      from: "SearchResultsPage",
    });

    navigate(-1);
  };

  return (
    <div
      style={{
        width: "100%",
        overflowX: "hidden",
      }}
    >
      <Navbar />

      <div
        style={{
          padding: isMobile ? "15px" : "20px",

          background: "#ffffff",

          minHeight: "100vh",

          width: "100%",

          boxSizing: "border-box",
        }}
      >
        <BasicSearchForm initialFilters={filters} />

        <h2
          style={{
            marginBottom: isMobile ? 15 : 20,

            fontSize: isMobile ? 24 : 28,

            color: "#1e293b",
          }}
        >
          Search Results
        </h2>

        {results.length === 0 ? (
          <div
            style={{
              background: "white",

              padding: isMobile ? 15 : 20,

              borderRadius: 10,

              width: "100%",

              boxSizing: "border-box",
            }}
          >
            No doctors found
          </div>
        ) : (
          <div
            style={{
              display: "flex",

              flexDirection: isMobile ? "column" : "row",

              gap: isMobile ? 20 : 10,

              alignItems: "flex-start",

              width: "100%",

              boxSizing: "border-box",
            }}
          >
            <div
              style={{
                flex: isMobile ? "none" : 3,

                width: isMobile ? "100%" : "auto",

                minWidth: 0,
              }}
            >
              <div
                style={{
                  display: "grid",

                  gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)",

                  gap: isMobile ? 15 : 20,

                  width: "100%",
                }}
              >
                {results.map((doc) => (
                  <div
                    key={doc.id}
                    onClick={() => {
                      calculateHesitation("doctor_select");

                      setSelectedDoctor(doc);

                      trackClick("doctor_card_click");

                      trackInteraction("doctor_selected", {
                        doctorId: doc.id,

                        doctorName: doc.name,
                      });
                    }}
                  >
                    <DoctorCard
                      doctor={doc}
                      isSelected={selectedDoctor?.id === doc.id}
                    />
                  </div>
                ))}
              </div>
            </div>

            {!isHospitalSearch && selectedDoctor && (
              <div
                style={{
                  flex: isMobile ? "none" : 5,

                  width: isMobile ? "100%" : "auto",

                  maxWidth: isMobile ? "100%" : 1800,

                  minWidth: 0,

                  boxSizing: "border-box",
                }}
              >
                <div
                  style={{
                    background: "linear-gradient(135deg, #e0f2fe, #f8fafc)",

                    padding: isMobile ? 12 : 15,

                    borderRadius: 12,

                    width: "100%",

                    boxSizing: "border-box",
                  }}
                >
                  <h3
                    style={{
                      marginBottom: 10,

                      fontSize: isMobile ? 20 : 22,
                    }}
                  >
                    Available Hospitals
                  </h3>

                  {selectedDoctor.hospitals?.map((h, i) => (
                    <div
                      key={i}
                      style={{
                        display: "flex",

                        flexDirection: isMobile ? "column" : "row",

                        justifyContent: "space-between",

                        alignItems: isMobile ? "stretch" : "center",

                        borderRadius: 10,

                        padding: isMobile ? 12 : 10,

                        marginBottom: 10,

                        background: "#fafafa",

                        gap: isMobile ? 10 : 15,

                        boxSizing: "border-box",
                      }}
                    >
                      <div
                        style={{
                          minWidth: 0,

                          flex: 1,
                        }}
                      >
                        <h4
                          style={{
                            margin: 0,

                            fontSize: isMobile ? 16 : 17,

                            wordBreak: "break-word",
                          }}
                        >
                          {h.name}
                        </h4>

                        <p
                          style={{
                            margin: 0,

                            marginTop: 5,

                            fontSize: 13,

                            wordBreak: "break-word",
                          }}
                        >
                          {h.location}
                        </p>

                        <p
                          style={{
                            margin: 0,

                            marginTop: 5,

                            fontSize: 13,

                            color: "#666",

                            wordBreak: "break-word",
                          }}
                        >
                          {selectedDoctor.specialization}
                        </p>
                      </div>

                      <button
                        onClick={() => {
                          calculateHesitation("book_click");

                          trackClick("book_button");

                          trackInteraction("booking_started", {
                            doctorId: selectedDoctor.id,

                            hospital: h.name,
                          });

                          navigate(
                            `/booking/${selectedDoctor.id}/${encodeURIComponent(h.name)}`,
                          );
                        }}
                        style={{
                          height: 32,

                          width: isMobile ? "100%" : "auto",

                          padding: "0 12px",

                          background: "#28a745",

                          color: "white",

                          border: "none",

                          borderRadius: 6,

                          cursor: "pointer",

                          flexShrink: 0,

                          boxSizing: "border-box",
                        }}
                      >
                        Book
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        <div
          style={{
            marginTop: isMobile ? 25 : 30,
            marginBottom: isMobile ? 10 : 15,
            display: "flex",
            justifyContent: "flex-start",
          }}
        >
          <button
            onClick={handleBack}
            style={{
              height: 42,
              padding: isMobile ? "0 18px" : "0 22px",

              background: "#64748b",
              color: "white",

              border: "none",
              borderRadius: 8,

              cursor: "pointer",
              fontWeight: "600",

              fontSize: isMobile ? 14 : 15,

              width: isMobile ? "100%" : "auto",

              boxSizing: "border-box",
            }}
          >
            Back
          </button>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default SearchResultsPage;
