import { Outlet } from "react-router-dom";

export default function DashboardLayout() {
    return (
        <div className="flex min-h-screen bg-base-100">
            {/* Sidebar */}
            <aside className="w-64 bg-base-200 p-5">
                <h2 className="text-xl font-bold mb-6">Dashboard</h2>

                <ul className="menu">
                    <li>
                        <a href="/dashboard">Dashboard Home</a>
                    </li>
                    <li>
                        <a href="/dashboard/employee/profile">My Profile</a>
                    </li>
                    <li>
                        <a href="/dashboard/admin">Admin Dashboard</a>
                    </li>
                </ul>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-8">
                <Outlet />
            </main>
        </div>
    );
}
