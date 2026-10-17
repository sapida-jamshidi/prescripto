
import { NavLink } from "react-router-dom";

const menuItems = [
  {
    name: "Dashboard",
    path: "/admin/dashboard",
    icon: "▦",
  },
  {
    name: "Appointments",
    path: "/admin/appointments",
    icon: "▤",
  },
  {
    name: "Add Doctor",
    path: "/admin/add-doctor",
    icon: "+",
  },
  {
    name: "Doctors List",
    path: "/admin/doctors",
    icon: "♙",
  },
];

function AdminSidebar() {
  return (
    <aside className="w-full border-r border-gray-200 bg-white md:min-h-screen md:w-64 md:shrink-0">
      <div className="border-b border-gray-100 px-6 py-5">
        <h2 className="text-lg font-bold text-gray-800">
          Management
        </h2>
        <p className="text-xs text-gray-500">
          Admin Navigation
        </p>
      </div>

      <nav className="flex gap-2 overflow-x-auto p-4 md:flex-col">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex shrink-0 items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
                isActive
                  ? "bg-blue-50 text-blue-600"
                  : "text-gray-600 hover:bg-gray-100"
              }`
            }
          >
            <span className="text-xl">
              {item.icon}
            </span>
            <span>{item.name}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
export default AdminSidebar;
