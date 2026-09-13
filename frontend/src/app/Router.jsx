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
import AppLayout from "../components/layout/AppLayout";
import StudentsPage from "../pages/StudentPage";
import StudentDetailsPage from "../pages/StudentDetailsPage";
import StudentEditPage from "../pages/StudentEditPage";
import ClassesPage from "../pages/ClassesPage";
import ClassDetailsPage from "../components/classes/ClassDetailsPage";
import ClassEditPage from "../components/classes/ClassEditPage";
import SectionsPage from "../pages/SectionsPage";
import SectionDetailsPage from "../components/sections/SectionDetailsPage";
import SectionEditPage from "../components/sections/SectionEditPage";
import AcademicYearPage from "../pages/AcademicYearPage";
import FeeStructurePage from "../pages/FeeStructurePage";

const Router = () => {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/unauthorized" element={<UnauthorizedPage />} />
          <Route element={<ProtectedRoute />}>
            <Route element={<AppLayout />}>
              <Route path="/dashboard" element={<DashboardPage />} />
              {/* ADMIN */}
              <Route element={<RoleRoute allowedRoles={["ADMIN"]} />}>
                <Route path="/users" element={<UsersPage />} />
              </Route>
              <Route element={<RoleRoute allowedRoles={["ADMIN"]} />}>
                <Route path="/fee-structures" element={<FeeStructurePage />} />
              </Route>

              <Route element={<RoleRoute allowedRoles={["ADMIN"]} />}>
                <Route path="/classes" element={<ClassesPage />} />
                <Route
                  path="/classes/:classId"
                  element={<ClassDetailsPage />}
                />
                <Route
                  path="/classes/:classId/edit"
                  element={<ClassEditPage />}
                />
              </Route>

              <Route element={<RoleRoute allowedRoles={["ADMIN"]} />}>
                <Route path="/sections" element={<SectionsPage />} />
                <Route
                  path="/sections/:sectionId/edit"
                  element={<SectionEditPage />}
                />
                <Route
                  path="/sections/:sectionId"
                  element={<SectionDetailsPage />}
                />
              </Route>
              <Route element={<RoleRoute allowedRoles={["ADMIN"]} />}>
                <Route path="/academic-years" element={<AcademicYearPage />} />
              </Route>

              <Route
                element={
                  <RoleRoute
                    allowedRoles={["ADMIN", "ACCOUNTANT", "PRINCIPAL"]}
                  />
                }
              >
                <Route path="/students" element={<StudentsPage />} />
                <Route
                  path="/students/:studentId"
                  element={<StudentDetailsPage />}
                />
                <Route
                  path="/students/:studentId/edit"
                  element={<StudentEditPage />}
                />
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
          </Route>
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default Router;
