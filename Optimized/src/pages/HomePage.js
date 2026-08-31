import {
  useContext,
  useEffect
} from "react";

import Header from "../components/Header";
import HeroSection from "../components/HeroSection";
import ServicesSection from "../components/ServicesSection";
import HowItWorks from "../components/HowItWorks";
import Footer from "../components/Footer";
import BlueDivider from "../components/BlueDivider";

import {
  TrackingContext
} from "../context/TrackingContext";

function HomePage() {

  const {
    trackPageVisit,
    trackInteraction
  } = useContext(TrackingContext);


  // ====================================================
  // HOME PAGE TRACKING
  // ====================================================

  useEffect(() => {

    

    // --------------------------------------------------
    // Track Home Page visit
    // --------------------------------------------------

    trackPageVisit(
      "HomePage"
    );


    // --------------------------------------------------
    // Track that Home Page was opened
    // --------------------------------------------------

    trackInteraction(
      "page_opened",
      {
        page: "HomePage"
      }
    );

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  return (

    <div
      style={{
        backgroundColor: "#F8FAFC",
        minHeight: "100vh",
        fontFamily: "Inter, sans-serif",
        overflowX: "hidden"
      }}
    >

      <Header />

      <HeroSection />

      <BlueDivider />

      <ServicesSection />

      <BlueDivider />

      <HowItWorks />

      <Footer />

    </div>
  );
}

export default HomePage;