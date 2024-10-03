import React from 'react';
// Styles
import "../../../App.css";

// React
import { useState } from "react";

// Components
import QrReader2 from "../../QrReader2";

const DeliveryNewExtract: React.FC = () => {
  const [openQr, setOpenQr] = useState<boolean>(false);

  return (
    <div>
      <button onClick={() => setOpenQr(!openQr)}>
        {openQr ? "Close" : "Open"} QR Scanner
      </button>
      {openQr && <QrReader2 openQr={openQr} setOpenQr={setOpenQr} />}
    </div>
  );
}

export default DeliveryNewExtract;

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