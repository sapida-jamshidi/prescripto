
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getDoctors } from "../../utils/doctorStorage";
import { getAppointments } from "../../utils/appointments";

function Dashboard() {
  const [doctors, setDoctors] = useState([]);
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    function loadData() {
      setDoctors(getDoctors());
      setAppointments(getAppointments());
    }

    loadData();

    window.addEventListener("focus", loadData);
    window.addEventListener("storage", loadData);
    window.addEventListener("doctorsUpdated", loadData);

    return () => {
      window.removeEventListener("focus", loadData);
      window.removeEventListener("storage", loadData);
      window.removeEventListener("doctorsUpdated", loadData);
    };
  }, []);

  const pending = appointments.filter(
    (item) => item.status === "Pending"
  ).length;

  const completed = appointments.filter(
    (item) => item.status === "Completed"
  ).length;

  const availableDoctors = doctors.filter(
    (doctor) => doctor.available
  ).length;

  const recentAppointments = [...appointments]
    .sort(
      (a, b) =>
        new Date(b.createdAt || 0) -
        new Date(a.createdAt || 0)
    )
    .slice(0, 5);

  const stats = [
    { label: "Total Doctors", value: doctors.length },
    { label: "Available Doctors", value: availableDoctors },
    { label: "Total Appointments", value: appointments.length },
    { label: "Pending Appointments", value: pending },
    { label: "Completed Appointments", value: completed },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-800">
          Admin Dashboard
        </h1>
        <p className="mt-2 text-gray-500">
          Welcome to Prescripto Management Panel.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm"
          >
            <p className="text-sm font-medium text-gray-500">
              {stat.label}
            </p>
            <h2 className="mt-3 text-3xl font-bold text-blue-600">
              {stat.value}
            </h2>
          </div>
        ))}
      </div>

      <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-800">
            Recent Appointments
          </h2>

          <Link
            to="/admin/appointments"
            className="text-sm font-medium text-blue-600 hover:underline"
          >
            View All
          </Link>
        </div>

        {recentAppointments.length === 0 ? (
          <p className="p-8 text-center text-gray-500">
            No appointments yet.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[550px] text-left text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="p-4">Doctor</th>
                  <th className="p-4">Date</th>
                  <th className="p-4">Time</th>
                  <th className="p-4">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentAppointments.map((item) => (
                  <tr
                    key={item.id}
                    className="border-t border-gray-100"
                  >
                    <td className="p-4">
                      {item.doctorName || "Unknown"}
                    </td>
                    <td className="p-4">{item.date}</td>
                    <td className="p-4">{item.time}</td>
                    <td className="p-4">
                      {item.status || "Pending"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
export default Dashboard;
