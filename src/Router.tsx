import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Checkin from "./page/Checkin";

const Router = () => {
  return (
    <BrowserRouter basename={process.env.PUBLIC_URL}>
      <Routes>
        <Route path="/checkin" element={<Checkin />}></Route>
        <Route path="/" element={<Navigate to="/checkin" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
