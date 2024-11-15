import React, { useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import TicketManager from './Components/ticketManager';
import SampleTicket from './Components/sampleTicket';

const App = () => {
  useEffect(() => {
    const setViewportHeight = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty("--vh", `${vh}px`);
    };

    setViewportHeight(); // İlk yüklemede ayarla
    window.addEventListener("resize", setViewportHeight); // Yeniden boyutlandırmada güncelle

    return () => window.removeEventListener("resize", setViewportHeight);
  }, []);

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/ticket/:ticketId" element={<TicketManager />} />
          <Route path="/sample-ticket" element={<SampleTicket />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
