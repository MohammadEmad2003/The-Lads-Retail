import { Routes, Route, Navigate } from "react-router-dom";
import ButtonGradient from "./assets/svg/ButtonGradient";
import Benefits from "./components/Benefits";
import Collaboration from "./components/Collaboration";
import Footer from "./components/Footer";
import Header from "./components/Header";
import Hero from "./components/Hero";
import Login from "./components/Login";
import Pricing from "./components/Pricing";
import Roadmap from "./components/Roadmap";
import Services from "./components/Services";
import LiveCamera from "./components/LiveCamera";
import Analytics from "./components/Analytics";
import { authService } from "./services/authService";

const ProtectedRoute = ({ children }) => {
  if (!authService.isAuthenticated()) {
    return <Navigate to="/" replace />;
  }
  return children;
};

const MainLayout = () => {
  return (
    <>
      <Header />
      <div className="pt-[4.75rem] lg:pt-[5.25rem] overflow-hidden">
        <Hero />
        <Benefits />
        <Services />
        <Collaboration />
        <Pricing />
        <Roadmap />
        <Footer />
      </div>
    </>
  );
};

const App = () => {
  return (
    <div className="min-h-screen">
      <Routes>
        <Route
          path="/"
          element={
            <div className="h-screen overflow-hidden">
              <Login />
            </div>
          }
        />
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }
        />
        <Route
          path="/cameras"
          element={
            <ProtectedRoute>
              <div className="min-h-screen">
                <Header />
                <LiveCamera />
              </div>
            </ProtectedRoute>
          }
        />
        <Route
          path="/analytics"
          element={
            <ProtectedRoute>
              <div className="min-h-screen">
                <Header />
                <Analytics />
              </div>
            </ProtectedRoute>
          }
        />
      </Routes>
      <ButtonGradient />
    </div>
  );
};

export default App;
