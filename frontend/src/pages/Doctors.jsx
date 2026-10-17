
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

import {
  Search,
  SlidersHorizontal,
  X,
  Stethoscope,
  RotateCcw,
  Users,
} from "lucide-react";

import { getDoctors } from "../utils/doctorStorage";
import DoctorCard from "../components/DoctorCard";

const specialities = [
  "General physician",
  "Gynecologist",
  "Dermatologist",
  "Pediatricians",
  "Neurologist",
  "Gastroenterologist",
];

function Doctors() {
  const [searchParams, setSearchParams] = useSearchParams();

  // Load doctors from shared storage
  const [doctors, setDoctors] = useState(() => getDoctors());

  const [searchQuery, setSearchQuery] = useState("");
  const [availableOnly, setAvailableOnly] = useState(false);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Keep doctors synchronized with Admin Panel
  useEffect(() => {
    function refreshDoctors() {
      setDoctors(getDoctors());
    }

    refreshDoctors();

    window.addEventListener("doctorsUpdated", refreshDoctors);
    window.addEventListener("storage", refreshDoctors);
    window.addEventListener("focus", refreshDoctors);

    return () => {
      window.removeEventListener("doctorsUpdated", refreshDoctors);
      window.removeEventListener("storage", refreshDoctors);
      window.removeEventListener("focus", refreshDoctors);
    };
  }, []);

  const selectedSpeciality = searchParams.get("speciality") || "";

  // Filter doctors by speciality, search and availability
  const filteredDoctors = doctors.filter((doctor) => {
    const matchesSpeciality =
      !selectedSpeciality ||
      doctor.speciality === selectedSpeciality;

    const query = searchQuery.trim().toLowerCase();

    const matchesSearch =
      (doctor.name || "").toLowerCase().includes(query) ||
      (doctor.speciality || "").toLowerCase().includes(query);

    const matchesAvailability =
      !availableOnly || doctor.available;

    return (
      matchesSpeciality &&
      matchesSearch &&
      matchesAvailability
    );
  });

  // Select speciality
  function selectSpeciality(speciality) {
    if (selectedSpeciality === speciality) {
      setSearchParams({});
    } else {
      setSearchParams({ speciality });
    }

    setShowMobileFilters(false);
  }

  // Clear all filters
  function clearFilters() {
    setSearchQuery("");
    setAvailableOnly(false);
    setSearchParams({});
    setShowMobileFilters(false);
  }

  const hasActiveFilters =
    Boolean(selectedSpeciality) ||
    Boolean(searchQuery.trim()) ||
    availableOnly;

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6">

      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-semibold text-gray-800">
          Find Your Doctor
        </h1>

        <p className="mt-3 text-sm leading-7 text-gray-500">
          Browse our trusted doctors and find the right
          specialist for your healthcare needs.
        </p>
      </div>

      {/* Search Bar */}
      <div className="mb-7 flex flex-col gap-4 sm:flex-row">

        <div className="relative flex-1">
          <Search
            size={21}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
          />

          <input
            type="search"
            value={searchQuery}
            onChange={(event) =>
              setSearchQuery(event.target.value)
            }
            placeholder="Search by doctor name or speciality..."
            aria-label="Search doctors"
            className="w-full rounded-xl border border-gray-200 bg-white py-4 pl-12 pr-12 text-sm text-gray-700 outline-none transition focus:border-primary focus:ring-2 focus:ring-blue-100"
          />

          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              aria-label="Clear search"
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
            >
              <X size={19} />
            </button>
          )}
        </div>

        {/* Mobile Filter Button */}
        <button
          type="button"
          onClick={() =>
            setShowMobileFilters((prev) => !prev)
          }
          aria-expanded={showMobileFilters}
          className="flex items-center justify-center gap-2 rounded-xl border border-gray-200 px-6 py-4 text-sm font-medium text-gray-700 md:hidden"
        >
          <SlidersHorizontal size={19} />
          Filters
        </button>
      </div>

      {/* Results and Clear Filters */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">

        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Users size={19} className="text-primary" />

          <span>
            <strong className="text-gray-800">
              {filteredDoctors.length}
            </strong>{" "}
            {filteredDoctors.length === 1
              ? "doctor found"
              : "doctors found"}
          </span>
        </div>

        {hasActiveFilters && (
          <button
            type="button"
            onClick={clearFilters}
            className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
          >
            <RotateCcw size={16} />
            Clear Filters
          </button>
        )}
      </div>

      {/* Main Layout */}
      <div className="flex flex-col gap-8 md:flex-row">

        {/* Sidebar Filters */}
        <aside
          className={`w-full shrink-0 md:block md:w-56 ${
            showMobileFilters ? "block" : "hidden"
          }`}
        >
          <div className="rounded-2xl border border-gray-200 bg-white p-4">

            <h2 className="mb-5 flex items-center gap-2 font-semibold text-gray-800">
              <SlidersHorizontal
                size={19}
                className="text-primary"
              />
              Filter Doctors
            </h2>

            <h3 className="mb-3 text-sm font-medium text-gray-600">
              Speciality
            </h3>

            {/* All Doctors */}
            <button
              type="button"
              onClick={() => {
                setSearchParams({});
                setShowMobileFilters(false);
              }}
              className={`mb-2 w-full rounded-lg border px-4 py-3 text-left text-sm transition ${
                !selectedSpeciality
                  ? "border-primary bg-blue-50 font-medium text-primary"
                  : "border-gray-200 text-gray-600 hover:bg-gray-50"
              }`}
            >
              All Doctors
            </button>

            {/* Specialities */}
            {specialities.map((speciality) => (
              <button
                key={speciality}
                type="button"
                onClick={() =>
                  selectSpeciality(speciality)
                }
                className={`mb-2 w-full rounded-lg border px-4 py-3 text-left text-sm transition ${
                  selectedSpeciality === speciality
                    ? "border-primary bg-blue-50 font-medium text-primary"
                    : "border-gray-200 text-gray-600 hover:bg-gray-50"
                }`}
              >
                {speciality}
              </button>
            ))}

            {/* Availability Filter */}
            <div className="mt-6 border-t border-gray-200 pt-5">

              <h3 className="mb-4 text-sm font-medium text-gray-600">
                Availability
              </h3>

              <label className="flex cursor-pointer items-center gap-3 text-sm text-gray-700">
                <input
                  type="checkbox"
                  checked={availableOnly}
                  onChange={(event) =>
                    setAvailableOnly(event.target.checked)
                  }
                  className="h-4 w-4 accent-primary"
                />

                Available Doctors Only
              </label>
            </div>
          </div>
        </aside>

        {/* Doctor Results */}
        <section
          aria-label="Doctor search results"
          className="min-w-0 flex-1"
        >
          {filteredDoctors.length > 0 ? (

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">

              {filteredDoctors.map((doctor) => (
                <DoctorCard
                  key={doctor.id}
                  doctor={doctor}
                />
              ))}

            </div>

          ) : (

            /* Empty State */
            <div className="flex min-h-80 flex-col items-center justify-center rounded-2xl border border-gray-200 bg-white px-6 py-12 text-center">

              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-blue-50">
                <Stethoscope
                  size={38}
                  className="text-primary"
                />
              </div>

              <h2 className="mt-6 text-xl font-semibold text-gray-800">
                No Doctors Found
              </h2>

              <p className="mt-3 max-w-sm text-sm leading-7 text-gray-500">
                We could not find any doctors matching your
                search. Try another name or speciality.
              </p>

              <button
                type="button"
                onClick={clearFilters}
                className="mt-6 rounded-full bg-primary px-7 py-3 text-sm font-medium text-white transition hover:opacity-90"
              >
                Clear All Filters
              </button>
            </div>

          )}
        </section>
      </div>
    </main>
  );
}
export default Doctors;
