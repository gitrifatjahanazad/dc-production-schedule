import React from "react";
import "./App.css";
import { ToastContainer } from "react-toastify";
import ScheduleGrid from "./app/features/scheduleGrid/scheduleGrid";
import DailyReview from "./app/features/dailyReview/dailyReview";
import { Route, Routes } from "react-router-dom";
import Layout from "./app/common/Layout";
import PageNotFound from "./app/common/PageNotFound";
import Configuration from "./app/features/configurations/Configuration";
import Login from "./app/authentications/Login";
import RequireAuth from "./app/authentications/RequireAuth";
import DownloadFiles from "./app/features/dailyReview/components/downlodFiles/DownloadFiles";
import ResponsiveForm from './app/features/scheduleGrid/ResponsiveForm';
import ProductionForm from "./app/features/dailyReview/components/settingsTextForm/settingsForm";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Login></Login>} />
        <Route path="/" element={<Layout></Layout>}>
          <Route element={<RequireAuth />}>
            <Route path="/daily-review" element={<DailyReview></DailyReview>} />
            <Route path="/download" element={<DownloadFiles />} />
            <Route path="/ScheduleGrid" element={<ScheduleGrid></ScheduleGrid>} />
            <Route path="/configuration" element={<ProductionForm />} />
            <Route path="/form" element={<ResponsiveForm></ResponsiveForm>} />
          </Route>
          <Route element={<RequireAuth />}>
            <Route path="/home" element={<DailyReview></DailyReview>} />
          </Route>
          <Route path="*" element={<PageNotFound />} />
        </Route>
      </Routes>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      {/* Same as */}
      <ToastContainer />
    </>
  );
}

export default App;
