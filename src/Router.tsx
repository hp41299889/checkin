import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Checkin from "./page/Checkin";

const Router = () => {
  return (
    <BrowserRouter basename={process.env.PUBLIC_URL}>
      <Routes>
        <Route path="/comfirm/:id" element={<Checkin />}></Route>
        <Route path="/" element={<Navigate to="/comfirm" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
