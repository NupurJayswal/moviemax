import { Navigate, Route, Routes } from "react-router-dom";

import Login from "../pages/Login";
import Movies from "../pages/Movies";
import ProtectedRoute from "../components/ProtectedRoute";

function TemporarySeatPage() {
  return (
    <div className="p-10">
      <h1 className="text-2xl font-bold">
        Seat Selection
      </h1>
    </div>
  );
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route element={<ProtectedRoute />}>
        <Route path="/movies" element={<Movies />} />

        <Route
          path="/seats/:movieId/:showtimeId"
          element={<TemporarySeatPage />}
        />
      </Route>

      <Route
        path="/"
        element={<Navigate to="/movies" replace />}
      />

      <Route
        path="*"
        element={<Navigate to="/movies" replace />}
      />
    </Routes>
  );
}

export default AppRoutes;