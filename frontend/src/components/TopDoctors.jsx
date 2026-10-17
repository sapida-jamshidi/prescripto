
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { getDoctors } from "../utils/doctorStorage";
import DoctorCard from "./DoctorCard";

function TopDoctors() {
  // Load doctors from shared Admin Panel storage
  const [doctors, setDoctors] = useState(() =>
    getDoctors()
  );

  // Keep doctors synchronized with Admin Panel
  useEffect(() => {
    function refreshDoctors() {
      setDoctors(getDoctors());
    }

    refreshDoctors();

    window.addEventListener(
      "doctorsUpdated",
      refreshDoctors
    );

    window.addEventListener(
      "storage",
      refreshDoctors
    );

    window.addEventListener(
      "focus",
      refreshDoctors
    );

    return () => {
      window.removeEventListener(
        "doctorsUpdated",
        refreshDoctors
      );

      window.removeEventListener(
        "storage",
        refreshDoctors
      );

      window.removeEventListener(
        "focus",
        refreshDoctors
      );
    };
  }, []);

  // Display the first five doctors
  const topDoctors = doctors.slice(0, 5);

  return (
    <section className="py-16">

      {/* Section Header */}
      <div className="mb-10 text-center">
        <h2 className="text-3xl font-semibold text-gray-800">
          Top Doctors to Book
        </h2>

        <p className="mt-4 text-gray-600">
          Simply browse through our extensive list
          of trusted doctors.
        </p>
      </div>

      {/* Doctors Grid */}
      {topDoctors.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
          {topDoctors.map((doctor) => (
            <DoctorCard
              key={doctor.id}
              doctor={doctor}
            />
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-gray-200 bg-white px-6 py-12 text-center">
          <p className="text-gray-500">
            No doctors are currently available.
          </p>
        </div>
      )}

      {/* More Doctors Button */}
      <div className="mt-12 text-center">
        <Link
          to="/doctors"
          className="inline-block rounded-full bg-blue-50 px-12 py-4 text-gray-700 transition hover:bg-blue-100"
        >
          More
        </Link>
      </div>

    </section>
  );
}
export default TopDoctors;
