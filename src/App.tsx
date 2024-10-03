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


import Vehicles from './components/Vehicles';
import Mails from './components/Mails';
import NewMail from './components/Mails/New';
import DeliveryNewExtract from './components/Mails/Delivery/NewExtract';
import DeliveryEdit from './components/Mails/Delivery/Edit';
import New2 from './components/Mails/New2';

import ResidentList from './components/Residents'
import ResidentCreate from './components/Residents/Create'
import ResidentDetails from './components/Residents/Details'

import ApartmentAssociationList from './components/Residents/ApartmentAssociation'
import ApartmentAssociationCreate from './components/Residents/ApartmentAssociation/Create'
import ApartmentAssociationDetails from './components/Residents/ApartmentAssociation/Details'
import ApartmentAssociationEdit from './components/Residents/ApartmentAssociation/Edit'

import Apartments from './components/Apartments';
import NewApartment from './components/Apartments/Create';
import ApartmentDetails from './components/Apartments/Details';
import ApartmentHistory from './components/Apartments/History';

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
          <Button color="inherit" component={Link} to="/residents">
            Residents
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
          <Route path="/apartments/new" element={<NewApartment />} />
          <Route path="/apartments/:id" element={<ApartmentDetails />} />
          <Route path="/apartments/:id/history" element={<ApartmentHistory />} />

          <Route path="/residents" element={<ResidentList />} />
          <Route path="/residents/create" element={<ResidentCreate />} />
          <Route path="/residents/:id" element={<ResidentDetails />} />

          <Route path="/residents/:id/apartments" element={<ApartmentAssociationList />} />
          <Route path="/residents/:id/apartments/create" element={<ApartmentAssociationCreate />} />
          <Route path="/apartment_residents/:id" element={<ApartmentAssociationDetails />} />
          <Route path="/apartment_residents/:id/edit" element={<ApartmentAssociationEdit />} />

          <Route path="/vehicles" element={<Vehicles />} />
          <Route path="/mails" element={<Mails />} />
          <Route path="/new-mail" element={<NewMail />} />
          <Route path="/new2" element={<New2 />} />
          <Route path="/delivery-extract" element={<DeliveryNewExtract />} />
          <Route path="/delivery-validate" element={<DeliveryEdit />} />
        </Routes>
      </Box>
    </Router>
  );
};

export default App;

