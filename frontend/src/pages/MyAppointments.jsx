
import { useState } from "react";
import { Link } from "react-router-dom";
import {
  CalendarDays,
  Clock3,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Stethoscope,
  DollarSign,
  ArrowRight,
  CalendarX2,
} from "lucide-react";

import { doctors } from "../data/doctors";

import {
  getAppointments,
  cancelAppointment,
} from "../utils/appointments";

// Convert AM/PM time to 24-hour time
function convertTo24Hour(time) {
  if (!time || typeof time !== "string") {
    return null;
  }

  const match = time.match(
    /^(\d{1,2}):(\d{2})\s*(AM|PM)$/i
  );

  if (!match) return null;

  let hours = Number(match[1]);
  const minutes = Number(match[2]);
  const period = match[3].toUpperCase();

  if (hours < 1 || hours > 12 || minutes > 59) {
    return null;
  }

  if (period === "PM" && hours !== 12) hours += 12;
  if (period === "AM" && hours === 12) hours = 0;

  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
}

// Check appointment status
function getAppointmentStatus(appointment) {
  const time24 = convertTo24Hour(appointment.time);

  if (!time24 || !appointment.date) {
    return "unknown";
  }

  const appointmentDate = new Date(
    `${appointment.date}T${time24}:00`
  );

  if (Number.isNaN(appointmentDate.getTime())) {
    return "unknown";
  }

  return appointmentDate < new Date()
    ? "completed"
    : "upcoming";
}

// Format date
function formatDate(dateString) {
  if (!dateString) return "Not specified";

  const date = new Date(`${dateString}T12:00:00`);

  if (Number.isNaN(date.getTime())) {
    return dateString;
  }

  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function MyAppointments() {
  const [appointments, setAppointments] = useState(
    () => getAppointments()
  );

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [cancellingId, setCancellingId] = useState(null);

  // Cancel an appointment
  function handleCancel(id) {
    const confirmed = window.confirm(
      "Are you sure you want to cancel this appointment?"
    );

    if (!confirmed) return;

    setMessage("");
    setError("");
    setCancellingId(id);

    try {
      cancelAppointment(id);

      const updatedAppointments = getAppointments();

      if (
        updatedAppointments.some(
          (appointment) => appointment.id === id
        )
      ) {
        throw new Error("Appointment was not cancelled.");
      }

      setAppointments(updatedAppointments);

      setMessage("Appointment cancelled successfully!");
    } catch {
      setError(
        "Unable to cancel appointment. Please try again."
      );
    } finally {
      setCancellingId(null);
    }
  }

  const upcomingCount = appointments.filter(
    (appointment) =>
      getAppointmentStatus(appointment) === "upcoming"
  ).length;

  return (
    <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6">

      {/* Page Header */}
      <div className="mb-8 flex flex-col justify-between gap-4 border-b border-gray-200 pb-6 sm:flex-row sm:items-center">

        <div>
          <h1 className="text-3xl font-semibold text-gray-800">
            My Appointments
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            View and manage your booked appointments.
          </p>
        </div>

        <Link
          to="/doctors"
          className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-medium text-white transition hover:opacity-90"
        >
          Book New Appointment
          <ArrowRight size={17} />
        </Link>
      </div>

      {/* Statistics */}
      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2">

        <div className="rounded-xl border border-blue-100 bg-blue-50 p-5">
          <div className="flex items-center gap-3">
            <CalendarDays
              size={25}
              className="text-primary"
            />

            <span className="text-sm text-gray-600">
              Total Appointments
            </span>
          </div>

          <p className="mt-3 text-3xl font-semibold text-gray-800">
            {appointments.length}
          </p>
        </div>

        <div className="rounded-xl border border-green-100 bg-green-50 p-5">
          <div className="flex items-center gap-3">
            <Clock3
              size={25}
              className="text-green-600"
            />

            <span className="text-sm text-gray-600">
              Upcoming Appointments
            </span>
          </div>

          <p className="mt-3 text-3xl font-semibold text-gray-800">
            {upcomingCount}
          </p>
        </div>

      </div>

      {/* Success Message */}
      {message && (
        <div
          role="status"
          className="mb-6 flex items-center gap-3 rounded-xl border border-green-100 bg-green-50 p-4 text-sm text-green-700"
        >
          <CheckCircle2
            size={21}
            className="shrink-0"
          />

          {message}
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div
          role="alert"
          className="mb-6 flex items-center gap-3 rounded-xl border border-red-100 bg-red-50 p-4 text-sm text-red-600"
        >
          <AlertCircle
            size={21}
            className="shrink-0"
          />

          {error}
        </div>
      )}

      {/* Empty State */}
      {appointments.length === 0 ? (
        <div className="rounded-2xl border border-gray-200 bg-white px-6 py-16 text-center shadow-sm">

          <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-blue-50">
            <CalendarX2
              size={45}
              className="text-primary"
            />
          </div>

          <h2 className="mt-6 text-xl font-semibold text-gray-800">
            No Appointments Yet
          </h2>

          <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-gray-500">
            You have not booked any appointments yet.
            Explore our doctors and book your first appointment.
          </p>

          <Link
            to="/doctors"
            className="mt-7 inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3 font-medium text-white transition hover:opacity-90"
          >
            <Stethoscope size={19} />
            Find Doctors
          </Link>

        </div>
      ) : (

        /* Appointment Cards */
        <div className="space-y-6">

          {appointments.map((appointment) => {
            const doctor = doctors.find(
              (item) => item.id === appointment.doctorId
            );

            const status = getAppointmentStatus(appointment);

            return (
              <article
                key={appointment.id}
                className="overflow-hidden rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:shadow-md sm:p-6"
              >

                <div className="flex flex-col gap-6 md:flex-row">

                  {/* Doctor Image */}
                  <div className="flex h-56 w-full shrink-0 items-end justify-center overflow-hidden rounded-xl bg-blue-100 md:h-48 md:w-48">

                    {doctor?.image ? (
                      <img
                        src={doctor.image}
                        alt={appointment.doctorName}
                        className="h-full w-full object-cover object-top"
                      />
                    ) : (
                      <Stethoscope
                        size={75}
                        className="mb-10 text-primary"
                      />
                    )}

                  </div>

                  {/* Appointment Details */}
                  <div className="min-w-0 flex-1">

                    <div className="flex flex-wrap items-start justify-between gap-3">

                      <div>
                        <h2 className="text-xl font-semibold text-gray-800">
                          {appointment.doctorName}
                        </h2>

                        <p className="mt-2 text-sm text-gray-500">
                          {appointment.speciality ||
                            doctor?.speciality ||
                            "Doctor"}
                        </p>
                      </div>

                      {/* Status */}
                      <span
                        className={`rounded-full px-4 py-2 text-xs font-medium ${
                          status === "upcoming"
                            ? "bg-blue-50 text-primary"
                            : status === "completed"
                            ? "bg-gray-100 text-gray-600"
                            : "bg-yellow-50 text-yellow-700"
                        }`}
                      >
                        {status === "upcoming"
                          ? "Upcoming"
                          : status === "completed"
                          ? "Past Appointment"
                          : "Status Unknown"}
                      </span>

                    </div>

                    <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">

                      {/* Date */}
                      <div className="flex items-center gap-3 text-sm text-gray-600">
                        <CalendarDays
                          size={19}
                          className="shrink-0 text-primary"
                        />

                        <span>
                          {formatDate(appointment.date)}
                        </span>
                      </div>

                      {/* Time */}
                      <div className="flex items-center gap-3 text-sm text-gray-600">
                        <Clock3
                          size={19}
                          className="shrink-0 text-primary"
                        />

                        <span>
                          {appointment.time || "Not specified"}
                        </span>
                      </div>

                      {/* Fee */}
                      <div className="flex items-center gap-3 text-sm text-gray-600">
                        <DollarSign
                          size={19}
                          className="shrink-0 text-primary"
                        />

                        <span>
                          Appointment Fee: $
                          {appointment.fees ?? doctor?.fees ?? "N/A"}
                        </span>
                      </div>

                    </div>

                    {/* Action */}
                    <div className="mt-6 border-t border-gray-100 pt-5">

                      <button
                        type="button"
                        disabled={cancellingId === appointment.id}
                        onClick={() => handleCancel(appointment.id)}
                        className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-red-200 px-5 py-3 text-sm font-medium text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
                      >
                        <Trash2 size={18} />

                        {cancellingId === appointment.id
                          ? "Cancelling..."
                          : "Cancel Appointment"}
                      </button>

                    </div>

                  </div>
                </div>
              </article>
            );
          })}

        </div>
      )}
    </main>
  );
}
export default MyAppointments;
