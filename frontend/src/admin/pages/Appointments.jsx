
import { useEffect, useState } from "react";
import {
  CalendarDays,
  Search,
  CheckCircle2,
  XCircle,
  Clock3,
} from "lucide-react";
import toast from "react-hot-toast";

import { getAppointments } from "../../utils/appointments";

const STORAGE_KEY = "prescripto_appointments";

function Appointments() {
  const [appointments, setAppointments] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  function loadAppointments() {
    setAppointments(getAppointments());
  }

  useEffect(() => {
    loadAppointments();

    window.addEventListener("focus", loadAppointments);
    window.addEventListener("storage", loadAppointments);

    return () => {
      window.removeEventListener("focus", loadAppointments);
      window.removeEventListener("storage", loadAppointments);
    };
  }, []);

  function updateStatus(id, status) {
    const appointment = appointments.find(
      (item) => item.id === id
    );

    if (!appointment) {
      toast.error("Appointment not found.");
      return;
    }

    if (appointment.status === "Cancelled") {
      toast.error("Cancelled appointments cannot be changed.");
      return;
    }

    if (appointment.status === status) {
      return;
    }

    if (
      status === "Cancelled" &&
      !window.confirm("Are you sure you want to cancel this appointment?")
    ) {
      return;
    }

    try {
      const latestAppointments = getAppointments();

      const updated = latestAppointments.map((item) =>
        item.id === id
          ? { ...item, status }
          : item
      );

      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(updated)
      );

      setAppointments(updated);

      if (status === "Completed") {
        toast.success("Appointment marked as completed.");
      } else {
        toast.success("Appointment cancelled successfully.");
      }
    } catch {
      toast.error("Unable to update appointment.");
    }
  }

  const filteredAppointments = appointments
    .filter((item) => {
      const query = search.toLowerCase().trim();

      const matchesSearch =
        (item.doctorName || "")
          .toLowerCase()
          .includes(query) ||
        (item.patientName || "")
          .toLowerCase()
          .includes(query) ||
        (item.patientEmail || "")
          .toLowerCase()
          .includes(query) ||
        (item.date || "").includes(query);

      const matchesFilter =
        filter === "All" ||
        (item.status || "Pending") === filter;

      return matchesSearch && matchesFilter;
    })
    .sort(
      (a, b) =>
        new Date(b.createdAt || 0) -
        new Date(a.createdAt || 0)
    );

  const pendingCount = appointments.filter(
    (item) => (item.status || "Pending") === "Pending"
  ).length;

  const completedCount = appointments.filter(
    (item) => item.status === "Completed"
  ).length;

  const cancelledCount = appointments.filter(
    (item) => item.status === "Cancelled"
  ).length;

  function getStatusStyle(status) {
    if (status === "Completed") {
      return "bg-green-50 text-green-700";
    }

    if (status === "Cancelled") {
      return "bg-red-50 text-red-600";
    }

    return "bg-yellow-50 text-yellow-700";
  }

  return (
    <div className="space-y-7">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">
          All Appointments
        </h1>

        <p className="mt-2 text-sm text-gray-500">
          View and manage patient appointments.
        </p>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3 text-yellow-600">
            <Clock3 size={22} />
            <span className="font-medium">Pending</span>
          </div>

          <p className="mt-3 text-3xl font-bold text-gray-800">
            {pendingCount}
          </p>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3 text-green-600">
            <CheckCircle2 size={22} />
            <span className="font-medium">Completed</span>
          </div>

          <p className="mt-3 text-3xl font-bold text-gray-800">
            {completedCount}
          </p>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3 text-red-600">
            <XCircle size={22} />
            <span className="font-medium">Cancelled</span>
          </div>

          <p className="mt-3 text-3xl font-bold text-gray-800">
            {cancelledCount}
          </p>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col gap-4 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:flex-row">
        <div className="relative flex-1">
          <Search
            size={19}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
          />

          <input
            type="text"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search by doctor, patient or date..."
            className="w-full rounded-xl border border-gray-200 py-3 pl-11 pr-4 text-sm outline-none focus:border-primary"
          />
        </div>

        <select
          value={filter}
          onChange={(event) => setFilter(event.target.value)}
          className="rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700 outline-none focus:border-primary"
        >
          <option value="All">All Statuses</option>
          <option value="Pending">Pending</option>
          <option value="Completed">Completed</option>
          <option value="Cancelled">Cancelled</option>
        </select>
      </div>

      {/* Appointments Table */}
      <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
        {filteredAppointments.length === 0 ? (
          <div className="px-5 py-16 text-center">
            <CalendarDays
              size={48}
              className="mx-auto text-gray-300"
            />

            <h2 className="mt-4 font-semibold text-gray-700">
              No appointments found
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              Appointments will appear here when patients book them.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[850px] text-left text-sm">
              <thead className="bg-gray-50 text-gray-500">
                <tr>
                  <th className="px-5 py-4 font-medium">#</th>
                  <th className="px-5 py-4 font-medium">Doctor</th>
                  <th className="px-5 py-4 font-medium">Patient</th>
                  <th className="px-5 py-4 font-medium">Date & Time</th>
                  <th className="px-5 py-4 font-medium">Fee</th>
                  <th className="px-5 py-4 font-medium">Status</th>
                  <th className="px-5 py-4 font-medium">Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredAppointments.map((appointment, index) => {
                  const status = appointment.status || "Pending";
                  const isPending = status === "Pending";

                  return (
                    <tr
                      key={appointment.id}
                      className="border-t border-gray-100"
                    >
                      <td className="px-5 py-4 text-gray-500">
                        {index + 1}
                      </td>

                      <td className="px-5 py-4">
                        <p className="font-medium text-gray-800">
                          {appointment.doctorName || "Unknown Doctor"}
                        </p>
                        <p className="mt-1 text-xs text-gray-400">
                          {appointment.speciality || ""}
                        </p>
                      </td>

                      <td className="px-5 py-4 text-gray-600">
                        {appointment.patientName ||
                          appointment.patientEmail ||
                          "Not recorded"}
                      </td>

                      <td className="px-5 py-4 text-gray-600">
                        <p>{appointment.date}</p>
                        <p className="mt-1 text-xs text-gray-400">
                          {appointment.time}
                        </p>
                      </td>

                      <td className="px-5 py-4 font-medium text-gray-700">
                        ${appointment.fees ?? 0}
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-medium ${getStatusStyle(status)}`}
                        >
                          {status}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        {isPending ? (
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() =>
                                updateStatus(appointment.id, "Completed")
                              }
                              title="Mark as completed"
                              className="rounded-lg bg-green-50 p-2 text-green-600 transition hover:bg-green-100"
                            >
                              <CheckCircle2 size={19} />
                            </button>

                            <button
                              type="button"
                              onClick={() =>
                                updateStatus(appointment.id, "Cancelled")
                              }
                              title="Cancel appointment"
                              className="rounded-lg bg-red-50 p-2 text-red-600 transition hover:bg-red-100"
                            >
                              <XCircle size={19} />
                            </button>
                          </div>
                        ) : (
                          <span className="text-xs text-gray-400">
                            No actions
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
export default Appointments;
