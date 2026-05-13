import { BrowserRouter, Routes, Route } from "react-router-dom";

import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import EventsPage from "./pages/EventsPage";
import DashboardPage from "./pages/DashboardPage";
import ProtectedRoute from "./routes/ProtectedRoute";

import Navbar from "./components/Navbar";
import SuccessPage from "./pages/SuccessPage";
import AddEventPage from "./pages/AddEventPage";
import BookEventPage from "./pages/BookEventPage";

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-blue-50">
        <Navbar />
        <Routes>
          <Route path="/" element={<EventsPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          <Route path="/success" element={<SuccessPage />} />
          <Route path="/add-event" element={<AddEventPage />} />
          <Route path="/events/:id" element={<BookEventPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;