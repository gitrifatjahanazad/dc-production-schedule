import React from "react";
import "./styles.css";

import Header from "./components/header/Header";
import Table1 from "./components/table1/table1";
import DownloadFiles from "./components/downlodFiles/DownloadFiles";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import ScrollToTopOnPageChange from "./components/scrollToTopOnPageChange/ScrollToTopOnPageChange";

// export default function App() {
//   return (
//     <div className="App">
//       <Router>
//         <ScrollToTopOnPageChange />
//         <Header />
//         <Routes>
//           <Route path="/" element={<Home />} />
//           <Route path="/download" element={<DownloadFiles />} />
//         </Routes>
//       </Router>
//     </div>
//   );
// }

export default function DailyReview() {
  return (
    <div>
      <Table1 />
    </div>
  );
}
