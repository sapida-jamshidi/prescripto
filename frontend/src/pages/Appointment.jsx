
import { useEffect, useState } from "react";

import {
  Link,
  useParams,
  useNavigate,
  useLocation,
} from "react-router-dom";

import {
  CalendarDays,
  Clock3,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
  BadgeCheck,
  Stethoscope,
} from "lucide-react";

import toast from "react-hot-toast";

import { getDoctors } from "../utils/doctorStorage";
import { useAuth } from "../context/AuthContext.jsx";

import {
  getAppointments,
  saveAppointment,
} from "../utils/appointments";

const timeSlots = [
  "09:00 AM",
  "10:00 AM",
  "11:00 AM",
  "12:00 PM",
  "02:00 PM",
  "03:00 PM",
  "04:00 PM",
];

// Format date using local timezone
function formatLocalDate(date) {
  const year = date.getFullYear();

  const month = String(
    date.getMonth() + 1
  ).padStart(2, "0");

  const day = String(
    date.getDate()
  ).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

// Convert 12-hour time to 24-hour time
function convertTo24Hour(time) {
  const [clock, period] = time.split(" ");

  let [hours, minutes] = clock
    .split(":")
    .map(Number);

  if (period === "PM" && hours !== 12) {
    hours += 12;
  }

  if (period === "AM" && hours === 12) {
    hours = 0;
  }

  return `${String(hours).padStart(2, "0")}:${String(
    minutes
  ).padStart(2, "0")}`;
}

// Generate the next seven days
function getNextSevenDays() {
  return Array.from({ length: 7 }, (_, index) => {
    const date = new Date();

    date.setHours(12, 0, 0, 0);
    date.setDate(date.getDate() + index);

    return {
      value: formatLocalDate(date),

      weekday: date.toLocaleDateString("en-US", {
        weekday: "short",
      }),

      day: date.getDate(),

      month: date.toLocaleDateString("en-US", {
        month: "short",
      }),
    };
  });
}

function Appointment() {
  const { doctorId } = useParams();

  const navigate = useNavigate();
  const location = useLocation();

  const { isAuthenticated } = useAuth();

  // Doctors are shared with the Admin Panel
  const [doctors, setDoctors] = useState(() =>
    getDoctors()
  );

  // Refresh doctor information after admin changes
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

  // Find selected doctor
  const doctor = doctors.find(
    (item) => String(item.id) === String(doctorId)
  );

  const [selectedDate, setSelectedDate] =
    useState("");

  const [selectedTime, setSelectedTime] =
    useState("");

  const [message, setMessage] = useState("");

  const [bookingSuccess, setBookingSuccess] =
    useState(false);

  const [refreshKey, setRefreshKey] =
    useState(0);

  const days = getNextSevenDays();

  // Doctor not found
  if (!doctor) {
    return (
      <main className="flex min-h-[60vh] flex-col items-center justify-center gap-5 px-5">
        <AlertCircle
          size={55}
          className="text-red-500"
        />

        <h1 className="text-2xl font-semibold text-gray-800">
          Doctor Not Found
        </h1>

        <p className="text-center text-sm text-gray-500">
          This doctor may have been removed or is
          no longer available in our directory.
        </p>

        <Link
          to="/doctors"
          className="rounded-full bg-primary px-7 py-3 text-white"
        >
          Back to Doctors
        </Link>
      </main>
    );
  }

  // Get current appointments
  const appointments = getAppointments();

  // Check whether a time slot is unavailable
  function isSlotUnavailable(time) {
    if (!selectedDate) {
      return true;
    }

    const time24 = convertTo24Hour(time);

    const slotDate = new Date(
      `${selectedDate}T${time24}:00`
    );

    // Prevent booking past dates and times
    if (slotDate <= new Date()) {
      return true;
    }

    // Prevent double booking
    return appointments.some((appointment) => {
      const isSameDoctor =
        String(appointment.doctorId) ===
        String(doctor.id);

      const isSameDate =
        appointment.date === selectedDate;

      const isSameTime =
        appointment.time === time;

      const isCancelled =
        String(appointment.status || "")
          .toLowerCase() === "cancelled";

      return (
        isSameDoctor &&
        isSameDate &&
        isSameTime &&
        !isCancelled
      );
    });
  }

  // Display error message
  function showError(errorMessage) {
    setMessage(errorMessage);
    setBookingSuccess(false);

    toast.error(errorMessage);
  }

  // Handle appointment booking
  function handleBooking() {
    setMessage("");
    setBookingSuccess(false);

    // Get latest doctor information
    const latestDoctor = getDoctors().find(
      (item) =>
        String(item.id) === String(doctorId)
    );

    if (!latestDoctor) {
      showError("This doctor could not be found.");
      return;
    }

    if (!latestDoctor.available) {
      showError(
        "This doctor is currently unavailable."
      );
      return;
    }

    if (!selectedDate || !selectedTime) {
      showError(
        "Please select a date and time."
      );
      return;
    }

    if (
      !days.some(
        (day) => day.value === selectedDate
      )
    ) {
      showError(
        "Please select a date within the next 7 days."
      );
      return;
    }

    if (
      !timeSlots.includes(selectedTime) ||
      isSlotUnavailable(selectedTime)
    ) {
      showError(
        "This time slot is no longer available."
      );
      return;
    }

    // Check patient authentication
    if (!isAuthenticated) {
      toast(
        "Please login to book an appointment.",
        {
          icon: "🔐",
        }
      );

      navigate("/login", {
        state: {
          from: location,
        },
      });

      return;
    }

    // Save appointment
    try {
      const result = saveAppointment({
        doctorId: latestDoctor.id,
        doctorName: latestDoctor.name,
        speciality: latestDoctor.speciality,
        fees: latestDoctor.fees,
        date: selectedDate,
        time: selectedTime,
      });

      const resultMessage =
        result.message ||
        (result.success
          ? "Appointment booked successfully!"
          : "Unable to book appointment.");

      setMessage(resultMessage);
      setBookingSuccess(result.success);

      if (result.success) {
        toast.success(resultMessage);

        setSelectedDate("");
        setSelectedTime("");

        setRefreshKey(
          (prev) => prev + 1
        );
      } else {
        toast.error(resultMessage);
      }
    } catch {
      showError(
        "Unable to save appointment. Please try again."
      );
    }
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6">

      {/* Back Link */}
      <Link
        to="/doctors"
        className="mb-7 inline-flex items-center gap-2 text-sm text-gray-500 transition hover:text-primary"
      >
        <ArrowLeft size={18} />
        Back to Doctors
      </Link>

      {/* Doctor Information */}
      <section className="grid grid-cols-1 gap-6 md:grid-cols-[300px_1fr]">

        {/* Doctor Image */}
        <div className="flex h-80 items-end justify-center overflow-hidden rounded-2xl bg-blue-100">
          {doctor.image ? (
            <img
              src={doctor.image}
              alt={doctor.name}
              className="h-full w-full object-cover object-top"
            />
          ) : (
            <Stethoscope
              size={110}
              className="mb-16 text-primary"
            />
          )}
        </div>

        {/* Doctor Details */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">

          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-2xl font-semibold text-gray-800 sm:text-3xl">
              {doctor.name}
            </h1>

            <BadgeCheck
              size={24}
              className="text-primary"
            />
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-gray-500">
            <span>{doctor.degree}</span>

            <span>•</span>

            <span>{doctor.speciality}</span>

            <span className="rounded-full border border-gray-200 px-3 py-1">
              {doctor.experience}
            </span>
          </div>

          <h2 className="mt-7 text-lg font-semibold text-gray-800">
            About
          </h2>

          <p className="mt-3 max-w-2xl text-sm leading-7 text-gray-500">
            {doctor.about ||
              "Browse available appointment times and choose a convenient slot with this healthcare professional."}
          </p>

          <div className="mt-7 flex flex-wrap items-center justify-between gap-4 border-t border-gray-100 pt-5">

            <p className="text-gray-600">
              Appointment Fee:

              <span className="ml-2 text-xl font-semibold text-primary">
                ${doctor.fees}
              </span>
            </p>

            <span
              className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm ${
                doctor.available
                  ? "bg-green-50 text-green-700"
                  : "bg-red-50 text-red-600"
              }`}
            >
              <span
                className={`h-2.5 w-2.5 rounded-full ${
                  doctor.available
                    ? "bg-green-500"
                    : "bg-red-500"
                }`}
              />

              {doctor.available
                ? "Available"
                : "Unavailable"}
            </span>
          </div>
        </div>
      </section>

      {/* Booking Section */}
      <section className="mt-10 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-8">

        <h2 className="text-2xl font-semibold text-gray-800">
          Booking Slots
        </h2>

        <p className="mt-2 text-sm text-gray-500">
          Select a day and an available appointment time.
        </p>

        {/* Date Selection */}
        <div className="mt-8 flex items-center gap-2 text-gray-700">
          <CalendarDays
            size={21}
            className="text-primary"
          />

          <h3 className="font-semibold">
            Select Date
          </h3>
        </div>

        <div className="mt-5 flex gap-3 overflow-x-auto pb-3">
          {days.map((day) => (
            <button
              key={day.value}
              type="button"
              disabled={!doctor.available}
              onClick={() => {
                setSelectedDate(day.value);
                setSelectedTime("");
                setMessage("");
                setBookingSuccess(false);
              }}
              className={`flex min-w-20 flex-col items-center gap-2 rounded-full border px-4 py-5 text-sm transition ${
                selectedDate === day.value
                  ? "border-primary bg-primary text-white"
                  : "border-gray-200 text-gray-600 hover:border-primary"
              } disabled:cursor-not-allowed disabled:opacity-40`}
            >
              <span>{day.weekday}</span>

              <span className="text-lg font-semibold">
                {day.day}
              </span>

              <span className="text-xs">
                {day.month}
              </span>
            </button>
          ))}
        </div>

        {/* Time Selection */}
        <div className="mt-8 flex items-center gap-2 text-gray-700">
          <Clock3
            size={21}
            className="text-primary"
          />

          <h3 className="font-semibold">
            Select Time
          </h3>
        </div>

        <div className="mt-5 flex flex-wrap gap-3">
          {timeSlots.map((time) => {
            const unavailable =
              isSlotUnavailable(time);

            return (
              <button
                key={`${refreshKey}-${time}`}
                type="button"
                disabled={
                  !doctor.available ||
                  unavailable
                }
                onClick={() => {
                  setSelectedTime(time);
                  setMessage("");
                  setBookingSuccess(false);
                }}
                className={`rounded-full border px-5 py-3 text-sm transition ${
                  selectedTime === time
                    ? "border-primary bg-primary text-white"
                    : "border-gray-200 text-gray-600 hover:border-primary"
                } disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-400`}
              >
                {time}
              </button>
            );
          })}
        </div>

        {!selectedDate && (
          <p className="mt-3 text-xs text-gray-500">
            Choose a date to see available time slots.
          </p>
        )}

        {/* Appointment Summary */}
        {selectedDate && selectedTime && (
          <div className="mt-8 rounded-xl bg-blue-50 p-5">
            <h3 className="font-semibold text-gray-800">
              Appointment Summary
            </h3>

            <div className="mt-3 space-y-2 text-sm text-gray-600">
              <p>Doctor: {doctor.name}</p>
              <p>Date: {selectedDate}</p>
              <p>Time: {selectedTime}</p>
              <p>Fee: ${doctor.fees}</p>
            </div>
          </div>
        )}

        {/* Booking Button */}
        <button
          type="button"
          onClick={handleBooking}
          disabled={!doctor.available}
          className="mt-8 w-full rounded-full bg-primary px-10 py-4 font-medium text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
        >
          {isAuthenticated
            ? "Book an Appointment"
            : "Login to Book Appointment"}
        </button>

        {/* Status Message */}
        {message && (
          <div
            role="status"
            className={`mt-6 flex items-start gap-3 rounded-lg p-4 ${
              bookingSuccess
                ? "bg-green-50 text-green-700"
                : "bg-red-50 text-red-600"
            }`}
          >
            {bookingSuccess ? (
              <CheckCircle2
                size={21}
                className="shrink-0"
              />
            ) : (
              <AlertCircle
                size={21}
                className="shrink-0"
              />
            )}

            <p className="text-sm">
              {message}
            </p>
          </div>
        )}

        {/* View Appointments */}
        {bookingSuccess && (
          <Link
            to="/my-appointments"
            className="mt-5 inline-block text-sm font-medium text-primary underline"
          >
            View My Appointments
          </Link>
        )}
      </section>
    </main>
  );
}
export default Appointment;
