import {BrowserRouter, Routes, Route} from "react-router-dom";

import BrowserBackTracker from "./components/BrowserBackTracker";

import HomePage from "./pages/HomePage";
import SymptomSelectionPage from "./pages/SymptomSelectionPage";
import DoctorPreferencePage from "./pages/DoctorPreferencePage";
import LocationMethodPage from "./pages/LocationMethodPage";
import ConfirmLocationPage from "./pages/ConfirmLocationPage";
import FindingDoctorsPage from "./pages/FindingDoctorsPage";
import DoctorSearchPage from "./pages/DoctorSearchPage";
import DoctorHospitalsPage from "./pages/DoctorHospitalsPage";
import AppointmentDateTimePage from "./pages/AppointmentDateTimePage";
import BookingConfirmationPage from "./pages/BookingConfirmationPage";
import HospitalSelectionPage from "./pages/HospitalSelectionPage";
import HospitalSymptomPage from "./pages/HospitalSymptomPage";
import HospitalRecommendedDoctorsPage from "./pages/HospitalRecommendedDoctorsPage";
import FindNearestLocationPage from "./pages/FindNearestLocationPage";
import NearestSymptomSelectionPage from "./pages/NearestSymptomSelectionPage";
import NearestFastestDoctorsPage from "./pages/NearestFastestDoctorsPage";
import HelpChooseProblemPage from "./pages/HelpChooseProblemPage";
import HelpConfirmLocationPage from "./pages/HelpConfirmLocationPage";
import HelpDoctorPreferencePage from "./pages/HelpDoctorPreferencePage";
import HelpUrgencyPage from "./pages/HelpUrgencyPage";
import HelpRecommendedDoctorsPage from "./pages/HelpRecommendedDoctorsPage";
import HospitalDoctorPreferencePage from "./pages/HospitalDoctorPreferencePage";
import NearestDoctorPreferencePage from "./pages/NearestDoctorPreferencePage";
import TrackingDashboard from "./pages/TrackingDashboard";
import ConfirmHospitalSelectionPage from "./pages/ConfirmHospitalSelectionPage";
import ConfirmTownSelectionPage from "./pages/ConfirmTownSelectionPage";
import DetectedLocationRecommendedDoctors from "./pages/DetectedLocationRecommendedDoctors";
import ConfirmedHospitalRecommendedDoctorsPage from "./pages/ConfirmedHospitalRecommendedDoctorsPage";
import ConfirmedTownRecommendedDoctorsPage from "./pages/ConfirmedTownRecommendedDoctorsPage";

function App() {
  return (
    <BrowserRouter>
      <BrowserBackTracker />
      <Routes>

        <Route
          path="/tracking"
          element={<TrackingDashboard />}
        />

        <Route path="/" element={<HomePage />}/>

        <Route path="/symptoms" element={<SymptomSelectionPage />}/>

        <Route path="/dr-preference" element={<DoctorPreferencePage /> }/>

        <Route path="/location" element={<LocationMethodPage /> }/>

        <Route path="/confirm-location" element={<ConfirmLocationPage /> }/>

        <Route path="/detected-location-doctors" element={<DetectedLocationRecommendedDoctors /> }/>

        <Route path="/confirm-hospital" element={<ConfirmHospitalSelectionPage /> }/>

        <Route path="/confirmed-hospital-doctors" element={<ConfirmedHospitalRecommendedDoctorsPage /> }/>

        <Route path="/confirm-town" element={<ConfirmTownSelectionPage /> }/>

        <Route path="/confirmed-town-doctors" element={<ConfirmedTownRecommendedDoctorsPage /> }/>
        
        <Route path="/finding-doctors" element={<FindingDoctorsPage /> }/>

              <Route
          path="/doctor-search"
          element={<DoctorSearchPage />}
        />

        <Route
          path="/doctor-hospitals"
          element={<DoctorHospitalsPage />}
        />

        <Route
          path="/appointment-date-time"
          element={<AppointmentDateTimePage />}
        />

        <Route
          path="/booking-confirmation"
          element={<BookingConfirmationPage />}
        />
        <Route
          path="/hospital-based"
          element={<HospitalSelectionPage />}
        />

        <Route
          path="/hospital-based"
          element={<HospitalSelectionPage />}
        />

        <Route
          path="/hospital-symptoms"
          element={<HospitalSymptomPage />}
        />

        <Route
          path="/hospital-dr-preference"
          element={<HospitalDoctorPreferencePage />}
        />

        <Route
          path="/hospital-doctors"
          element={<HospitalRecommendedDoctorsPage />}
        />

        <Route
          path="/nearest-location"
          element={<FindNearestLocationPage />}
        />

        <Route
          path="/nearest-health-problem"
          element={<NearestSymptomSelectionPage />}
        />

        <Route
          path="/fastest-doctors"
          element={<NearestFastestDoctorsPage />}
        />

         <Route
          path="/nearest-dr-preference"
          element={<NearestDoctorPreferencePage />}
        />

        <Route
          path="/help-me"
          element={<HelpChooseProblemPage />}
        />

        <Route
          path="/help-choose-location"
          element={<HelpConfirmLocationPage />}
        />

         <Route
          path="/help-me-choose-preference"
          element={<HelpDoctorPreferencePage />}
        />

          <Route
          path="/help-urgency"
          element={<HelpUrgencyPage />}
        />

        <Route
          path="/help-recommended-doctors"
          element={<HelpRecommendedDoctorsPage />}
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;