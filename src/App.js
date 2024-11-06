import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import TicketManager from './Components/ticketManager';
import SampleTicket from './Components/sampleTicket';

const App = () => {
  return (
    <Router>
      <div className="app">
        <h1>Ticket Display</h1>
        <Routes>
          <Route path="/ticket/:ticketId" element={<TicketManager />} />
          <Route path="/sample-ticket" element={<SampleTicket />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
