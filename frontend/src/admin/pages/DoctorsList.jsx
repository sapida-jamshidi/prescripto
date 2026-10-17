
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  UserRoundPlus,
  Trash2,
  Stethoscope,
} from "lucide-react";
import toast from "react-hot-toast";

import {
  getDoctors,
  deleteDoctor,
  toggleDoctorAvailability,
} from "../../utils/doctorStorage";

function DoctorsList() {
  const [doctors, setDoctors] = useState([]);
  const [search, setSearch] = useState("");

  function loadDoctors() {
    setDoctors(getDoctors());
  }

  useEffect(() => {
    loadDoctors();

    window.addEventListener("doctorsUpdated", loadDoctors);
    window.addEventListener("storage", loadDoctors);
    window.addEventListener("focus", loadDoctors);

    return () => {
      window.removeEventListener("doctorsUpdated", loadDoctors);
      window.removeEventListener("storage", loadDoctors);
      window.removeEventListener("focus", loadDoctors);
    };
  }, []);

  function handleAvailability(id) {
    try {
      toggleDoctorAvailability(id);
      loadDoctors();
      toast.success("Doctor availability updated.");
    } catch {
      toast.error("Unable to update doctor.");
    }
  }

  function handleDelete(doctor) {
    const confirmed = window.confirm(
      `Are you sure you want to delete ${doctor.name}?`
    );

    if (!confirmed) return;

    try {
      deleteDoctor(doctor.id);
      loadDoctors();
      toast.success("Doctor deleted successfully.");
    } catch {
      toast.error("Unable to delete doctor.");
    }
  }

  const filteredDoctors = doctors.filter((doctor) => {
    const query = search.toLowerCase().trim();

    return (
      (doctor.name || "").toLowerCase().includes(query) ||
      (doctor.speciality || "").toLowerCase().includes(query) ||
      (doctor.degree || "").toLowerCase().includes(query)
    );
  });

  const availableCount = doctors.filter(
    (doctor) => doctor.available
  ).length;

  return (
    <div className="space-y-7">
      {/* Page Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Doctors List
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Manage all doctors and their availability.
          </p>
        </div>

        <Link
          to="/admin/add-doctor"
          className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-medium text-white transition hover:opacity-90"
        >
          <UserRoundPlus size={18} />
          Add Doctor
        </Link>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">
            Total Doctors
          </p>

          <h2 className="mt-3 text-3xl font-bold text-gray-800">
            {doctors.length}
          </h2>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">
            Available Doctors
          </p>

          <h2 className="mt-3 text-3xl font-bold text-green-600">
            {availableCount}
          </h2>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">
            Unavailable Doctors
          </p>

          <h2 className="mt-3 text-3xl font-bold text-red-500">
            {doctors.length - availableCount}
          </h2>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-lg">
        <Search
          size={19}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
        />

        <input
          type="text"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search doctors by name or speciality..."
          className="w-full rounded-xl border border-gray-200 bg-white py-3 pl-11 pr-4 text-sm outline-none focus:border-primary"
        />
      </div>

      {/* Doctors Grid */}
      {filteredDoctors.length === 0 ? (
        <div className="rounded-2xl border border-gray-100 bg-white px-5 py-16 text-center shadow-sm">
          <Stethoscope
            size={45}
            className="mx-auto text-gray-300"
          />

          <p className="mt-4 font-medium text-gray-700">
            No doctors found
          </p>

          <p className="mt-2 text-sm text-gray-500">
            Try another search or add a new doctor.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {filteredDoctors.map((doctor) => (
            <div
              key={doctor.id}
              className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition hover:shadow-md"
            >
              <div className="flex h-48 items-center justify-center bg-blue-50">
                {doctor.image ? (
                  <img
                    src={doctor.image}
                    alt={doctor.name}
                    className="h-full w-full object-contain"
                  />
                ) : (
                  <Stethoscope
                    size={55}
                    className="text-gray-300"
                  />
                )}
              </div>

              <div className="space-y-4 p-5">
                <div>
                  <h2 className="text-lg font-semibold text-gray-800">
                    {doctor.name}
                  </h2>

                  <p className="mt-1 text-sm text-gray-500">
                    {doctor.speciality}
                  </p>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">
                    {doctor.degree}
                  </span>

                  <span className="font-semibold text-gray-800">
                    ${doctor.fees}
                  </span>
                </div>

                <div className="flex items-center justify-between border-t border-gray-100 pt-4">
                  <label className="flex cursor-pointer items-center gap-3">
                    <input
                      type="checkbox"
                      checked={Boolean(doctor.available)}
                      onChange={() =>
                        handleAvailability(doctor.id)
                      }
                      className="h-4 w-4 accent-blue-600"
                    />

                    <span
                      className={`text-sm font-medium ${
                        doctor.available
                          ? "text-green-600"
                          : "text-red-500"
                      }`}
                    >
                      {doctor.available
                        ? "Available"
                        : "Unavailable"}
                    </span>
                  </label>

                  <button
                    type="button"
                    onClick={() => handleDelete(doctor)}
                    title={`Delete ${doctor.name}`}
                    className="rounded-lg bg-red-50 p-2 text-red-500 transition hover:bg-red-100"
                  >
                    <Trash2 size={19} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
export default DoctorsList;
