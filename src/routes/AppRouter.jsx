import { createBrowserRouter } from "react-router-dom";
import Root from "../layouts/Root";
// import DashboardLayout from "../layouts/DashboardLayout";

// import Home from "../pages/Home/Home";
// import Login from "../pages/Auth/Login";
// import Register from "../pages/Auth/Register";
// import ContactUs from "../pages/ContactUs";
// import Blog from "../pages/Blog";
// import NotFound from "../pages/NotFound";
// import TermsOfService from "../pages/TermsOfService";
// import PrivacyPolicy from "../pages/PrivacyPolicy";
// import SelectRole from "../pages/SelectRole";

// import ProtectedRoute from "../components/ProtectedRoute";
// import RoleProtectedRoute from "../components/RoleProtectedRoute";

// // Dashboard pages
// import AdminDashboard from "../pages/Dashboard/Admin/AdminDashboard";
// import AllEmployeeList from "../pages/Dashboard/Admin/AllEmployeeList";
// import PayrollApproval from "../pages/Dashboard/Admin/PayrollApproval";
// import SendNotice from "../pages/Dashboard/Admin/SendNotice";

// import MyProfile from "../pages/Dashboard/Employee/MyProfile";
// import MyWorkLogs from "../pages/Dashboard/Employee/MyWorkLogs";
// import PayrollHistory from "../pages/Dashboard/Employee/PayrollHistory";
// import SubmitWork from "../pages/Dashboard/Employee/SubmitWork";
// import WorkSheet from "../pages/Dashboard/Employee/WorkSheet";

// import EmployeeList from "../pages/Dashboard/Hr/EmployeeList";
// import EmployeeDetails from "../pages/Dashboard/Hr/EmployeeDetails";
// import PayrollRequest from "../pages/Dashboard/Hr/PayrollRequest";
// import Progress from "../pages/Dashboard/Hr/Progress";

const AppRouter = createBrowserRouter([
    {
        path: "/",
        element: <Root />,
        children: [
            { path: "/", element: <Home /> },
            { path: "/login", element: <Login /> },
            { path: "/register", element: <Register /> },
            { path: "/contact", element: <ContactUs /> },
            { path: "/blog", element: <Blog /> },
            { path: "/terms", element: <TermsOfService /> },
            { path: "/privacy", element: <PrivacyPolicy /> },
            { path: "/select-role", element: <SelectRole /> },
        ],
        errorElement: <NotFound />,
    },

    // Dashboard Routes
    {
        path: "/dashboard",
        element: (
            <ProtectedRoute>
                <DashboardLayout />
            </ProtectedRoute>
        ),
        children: [
            // Admin Routes
            {
                path: "admin",
                element: (
                    <RoleProtectedRoute allowedRoles={["admin"]}>
                        <AdminDashboard />
                    </RoleProtectedRoute>
                ),
            },
            { path: "admin/employees", element: <AllEmployeeList /> },
            { path: "admin/payroll-approval", element: <PayrollApproval /> },
            { path: "admin/notice", element: <SendNotice /> },

            // Employee Routes
            {
                path: "employee/profile",
                element: (
                    <RoleProtectedRoute allowedRoles={["employee"]}>
                        <MyProfile />
                    </RoleProtectedRoute>
                ),
            },
            { path: "employee/work-logs", element: <MyWorkLogs /> },
            { path: "employee/payrolls", element: <PayrollHistory /> },
            { path: "employee/submit-work", element: <SubmitWork /> },
            { path: "employee/worksheet", element: <WorkSheet /> },

            // HR Routes
            {
                path: "hr/employees",
                element: (
                    <RoleProtectedRoute allowedRoles={["hr"]}>
                        <EmployeeList />
                    </RoleProtectedRoute>
                ),
            },
            { path: "hr/employee/:id", element: <EmployeeDetails /> },
            { path: "hr/payroll-request", element: <PayrollRequest /> },
            { path: "hr/progress", element: <Progress /> },
        ],
    },
]);

export default AppRouter;
