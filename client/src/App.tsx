import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import FAQ from "./components/Faqs";
import Register from "./components/Register";
import Login from "./components/Login";
import DashboardRouter from "./components/dashboards/DashboardRouter";

function App() {
  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <>
              <Navbar />
              <Hero />
              <FAQ />
            </>
          }
        />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<DashboardRouter />} />
      </Routes>
    </Router>
  );
}

export default App;
