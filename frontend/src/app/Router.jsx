import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import HomePage from "../pages/HomePage";
import LoginPage from "../pages/LoginPage";
import NotFoundPage from "../pages/NotFoundPage";
import ProtectedRoute from "../components/common/ProtectedRoute";
import DashboardPage from "../pages/DashboardPage";
import UnauthorizedPage from "../pages/UnauthorizedPage";
import RoleRoute from "../components/common/RoleRoute";
import UsersPage from "../pages/UsersPage";
import PaymentsPage from "../pages/PaymentsPage";
import ReportsPage from "../pages/ReportsPage";
import MyFeesPage from "../pages/MyFeesPage";

const Router = () => {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/unauthorized" element={<UnauthorizedPage />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            {/* ADMIN */}
            <Route element={<RoleRoute allowedRoles={["ADMIN"]} />}>
              <Route path="/users" element={<UsersPage />} />
            </Route>
            {/* ADMIN AND ACCOUNTANT  */}
            <Route
              element={<RoleRoute allowedRoles={["ADMIN", "ACCOUNTANT"]} />}
            >
              <Route path="/payments" element={<PaymentsPage />} />
            </Route>
            {/* ADMIN AND PRINCIPAL  */}
            <Route
              element={<RoleRoute allowedRoles={["ADMIN", "PRINCIPAL"]} />}
            >
              <Route path="/reports" element={<ReportsPage />} />
            </Route>

            {/* STUDENT  */}
            <Route element={<RoleRoute allowedRoles={["STUDENT"]} />}>
              <Route path="/my-fees" element={<MyFeesPage />} />
            </Route>
          </Route>
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default Router;
