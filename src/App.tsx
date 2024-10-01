// // Styles
// import "./App.css";

// // React
// import { useState } from "react";

// // Components
// import QrReader from "./components/QrReader";

// function App() {
//   const [openQr, setOpenQr] = useState<boolean>(false);
//   return (
//     <div>
//       <button onClick={() => setOpenQr(!openQr)}>
//         {openQr ? "Close" : "Open"} QR Scanner
//       </button>
//       {openQr && <QrReader />}
//     </div>
//   );
// }

// export default App;

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { AppBar, Toolbar, Button, Typography, Box } from '@mui/material';
import Apartments from './components/Apartments';
import Vehicles from './components/Vehicles';
import Mails from './components/Mails';
import NewMail from './components/Mails/New';

const App: React.FC = () => {
  return (
    <Router>
      {/* Top Menu Bar */}
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            My Dashboard
          </Typography>
          {/* Links to different routes */}
          <Button color="inherit" component={Link} to="/apartments">
            Apartments
          </Button>
          <Button color="inherit" component={Link} to="/vehicles">
            Vehicles
          </Button>
          <Button color="inherit" component={Link} to="/mails">
            Mails
          </Button>
        </Toolbar>
      </AppBar>

      {/* Define Routes */}
      <Box p={3}>
        <Routes>
          <Route path="/apartments" element={<Apartments />} />
          <Route path="/vehicles" element={<Vehicles />} />
          <Route path="/mails" element={<Mails />} />
          <Route path="/new-mail" element={<NewMail />} />
        </Routes>
      </Box>
    </Router>
  );
};

export default App;

