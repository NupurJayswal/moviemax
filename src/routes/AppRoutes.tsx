import { Navigate, Route, Routes } from "react-router-dom";

import Login from "../pages/Login";
import Movies from "../pages/Movies";
import SeatSelection from "../pages/SeatSelection";
import ProtectedRoute from "../components/ProtectedRoute";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route element={<ProtectedRoute />}>
        <Route path="/movies" element={<Movies />} />

        <Route path="/seats/:movieId/:showtimeId" element={<SeatSelection />} />
      </Route>

      <Route path="/" element={<Navigate to="/movies" replace />} />

      <Route path="*" element={<Navigate to="/movies" replace />} />
    </Routes>
  );
}

export default AppRoutes;
