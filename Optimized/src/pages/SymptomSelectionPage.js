import {
  useState,
  useContext,
  useEffect,
  useRef
} from "react";

import { useNavigate } from "react-router-dom";

import symptoms from "../data/symptoms";

import SymptomCard from "../components/SymptomCard";
import ProgressTracker from "../components/ProgressTracker";
import GuidanceCard from "../components/GuidanceCard";
import Footer from "../components/Footer";
import Header from "../components/Header";

import useIsMobile from "../hooks/useIsMobile";

import { TrackingContext } from "../context/TrackingContext";


// ======================================================
// SYMPTOM SELECTION PAGE
// ======================================================

function SymptomSelectionPage() {

  // ====================================================
  // NAVIGATION
  // ====================================================

  const navigate = useNavigate();


  // ====================================================
  // TRACKING CONTEXT
  // ====================================================

  const {
    startNewTest,
    trackPageVisit,
    trackClick,
    trackInteraction,
    trackHesitation
  } = useContext(TrackingContext);


  // ====================================================
  // UI STATE
  // ====================================================

  const [selected, setSelected] = useState(null);

  const isMobile = useIsMobile();


  // ====================================================
  // PAGE START TIME
  // Used to measure how long user takes before
  // selecting a symptom.
  // ====================================================

  const pageStartTime = useRef(Date.now());


  // ====================================================
  // PREVENT DUPLICATE HESITATION
  //
  // We only want to measure the user's first
  // decision on this page.
  // ====================================================

  const decisionTracked = useRef(false);


  // ====================================================
  // START FLOW + PAGE VISIT
  // ====================================================

  useEffect(() => {

    // --------------------------------------------------
    // Start the "I Know My Health Problem" flow.
    //
    // IMPORTANT:
    // This value matches getFlowStages() in the
    // TrackingDashboard.
    // --------------------------------------------------
 

  


    // --------------------------------------------------
    // Track page visit
    // --------------------------------------------------

    trackPageVisit(
      "SymptomSelectionPage"
    );


    // --------------------------------------------------
    // Track that the page was opened
    // --------------------------------------------------

    trackInteraction(
      "page_opened",
      {
        page: "SymptomSelectionPage"
      }
    );

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  // ====================================================
  // USER SELECTS SYMPTOM
  // ====================================================

  const handleSymptomSelect = (symptom) => {

    // Safety check
    if (!symptom) {
      return;
    }


    // --------------------------------------------------
    // Current time
    // --------------------------------------------------

    const now = Date.now();


    // --------------------------------------------------
    // Calculate decision time
    //
    // This represents how long the user stayed on
    // the symptom page before selecting a symptom.
    // --------------------------------------------------

    const decisionTime =
      (now - pageStartTime.current) / 1000;


    const decisionTimeRounded =
      Number(
        decisionTime.toFixed(2)
      );


    // ==================================================
    // HESITATION TRACKING
    // ==================================================

    // Only track the first decision once.
    if (!decisionTracked.current) {

      // Consider more than 5 seconds as hesitation.
      if (decisionTime > 5) {

        trackHesitation(
          decisionTimeRounded
        );

      }

      decisionTracked.current = true;
    }


    // ==================================================
    // TRACK CARD CLICK
    // ==================================================

    trackClick(
      `symptom_${symptom.id}`,
      "SymptomSelectionPage"
    );


    // ==================================================
    // TRACK SYMPTOM SELECTION
    // ==================================================

    trackInteraction(
      "symptom_selected",
      {
        symptomId: symptom.id,

        symptomName: symptom.name,

        decisionTimeSeconds:
          decisionTimeRounded
      }
    );


    // ==================================================
    // UPDATE EXISTING UI STATE
    //
    // This keeps your original behaviour.
    // ==================================================

    setSelected(symptom);


    // ==================================================
    // EXISTING NAVIGATION LOGIC
    //
    // DO NOT CHANGE THIS.
    // The selected symptom ID is passed to the
    // Doctor Preference page.
    // ==================================================

    navigate(
      "/dr-preference",
      {
        state: {
          symptomId: symptom.id
        }
      }
    );
  };


  // ====================================================
  // PROGRESS STEPS
  // ====================================================

  const guidedSteps = [
    "Health Problem",
    "Doctor Preference",
    "Location",
    "Doctors",
    "Appointment"
  ];


  // ====================================================
  // RENDER
  // ====================================================

  return (

    <div
      style={{
        fontFamily:
          "Inter, sans-serif",

        background:
          "#F8FAFC",

        minHeight:
          "100vh"
      }}
    >

      {/* ==================================================
          HEADER
      ================================================== */}

      <Header />


      {/* ==================================================
          MAIN CONTENT
      ================================================== */}

      <main
        style={{
          maxWidth:
            "1200px",

          margin:
            "0 auto",

          padding:
            isMobile
              ? "25px 20px 40px"
              : "40px"
        }}
      >

        {/* ==================================================
            STEP NUMBER
        ================================================== */}

        <h4
          style={{
            textAlign:
              "center",

            color:
              "#6B7280",

            fontSize:
              isMobile
                ? "13px"
                : "15px",

            margin:
              "0 0 15px 0"
          }}
        >
          Step 1 of 5
        </h4>


        {/* ==================================================
            PROGRESS TRACKER
        ================================================== */}

        <ProgressTracker
          currentStep={0}
          steps={guidedSteps}
        />


        {/* ==================================================
            MAIN HEADING
        ================================================== */}

        <h1
          style={{
            textAlign:
              "center",

            fontSize:
              isMobile
                ? "28px"
                : "40px",

            lineHeight:
              isMobile
                ? "1.3"
                : "1.2",

            marginTop:
              isMobile
                ? "30px"
                : "40px",

            marginBottom:
              "15px",

            color:
              "#0F172A"
          }}
        >
          What problem are you
          <br />
          experiencing today?
        </h1>


        {/* ==================================================
            DESCRIPTION
        ================================================== */}

        <p
          style={{
            textAlign:
              "center",

            color:
              "#6B7280",

            fontSize:
              isMobile
                ? "14px"
                : "16px",

            lineHeight:
              "1.6",

            maxWidth:
              "600px",

            margin:
              isMobile
                ? "0 auto 30px auto"
                : "0 auto 50px auto"
          }}
        >
          Choose the option that best
          matches your situation. We'll
          help you find the right doctor.
        </p>


        {/* ==================================================
            SYMPTOM CARDS
        ================================================== */}

        <div
          style={{
            display:
              "grid",

            gridTemplateColumns:
              isMobile
                ? "1fr"
                : "repeat(3, minmax(0, 1fr))",

            gap:
              isMobile
                ? "16px"
                : "24px"
          }}
        >

          {symptoms.map(
            (symptom) => (

              <SymptomCard
                key={
                  symptom.id
                }

                symptom={
                  symptom
                }

                selected={
                  selected?.id ===
                  symptom.id
                }

                onClick={() =>
                  handleSymptomSelect(
                    symptom
                  )
                }
              />

            )
          )}

        </div>


        {/* ==================================================
            GUIDANCE
        ================================================== */}

        <div
          style={{
            marginTop:
              isMobile
                ? "25px"
                : "35px"
          }}
        >

          <GuidanceCard />

        </div>

      </main>


      {/* ==================================================
          FOOTER
      ================================================== */}

      <Footer />

    </div>
  );
}


export default SymptomSelectionPage;