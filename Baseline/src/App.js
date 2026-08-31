import { BrowserRouter, Routes, Route } from "react-router-dom";

import BrowserBackTracker from "./components/BrowserBackTracker";

import HomePage from "./pages/HomePage";
import SearchResultsPage from "./pages/SearchResultsPage";
import DoctorProfilePage from "./pages/DoctorProfilePage";
import BookingPage from "./pages/BookingPage";
import BookingFormPage from "./pages/BookingFormPage";
import TrackingDashboard from "./pages/TrackingDashboard";

function App() {
  return (
    <BrowserRouter>
      <BrowserBackTracker />

      <Routes>
        <Route path="/" element={<HomePage />} />

        <Route path="/results" element={<SearchResultsPage />} />

        <Route path="/doctor/:id" element={<DoctorProfilePage />} />

        <Route path="/booking/:doctorId/:hospitalName" element={<BookingPage />} />

        <Route path="/booking-form/:doctorId/:hospitalName/:sessionIndex" element={<BookingFormPage />} />

        <Route path="/tracking" element={<TrackingDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
