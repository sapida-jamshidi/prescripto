
const STORAGE_KEY = "prescripto_appointments";

export function getAppointments() {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    const parsed = data ? JSON.parse(data) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveAppointment(appointment) {
  const appointments = getAppointments();

  const alreadyBooked = appointments.some(
    (item) =>
      item.doctorId === appointment.doctorId &&
      item.date === appointment.date &&
      item.time === appointment.time &&
      item.status !== "Cancelled"
  );

  if (alreadyBooked) {
    return {
      success: false,
      message: "This time slot is already booked.",
    };
  }

  const newAppointment = {
    ...appointment,
    id: crypto.randomUUID(),
    status: "Pending",
    createdAt: new Date().toISOString(),
  };

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify([...appointments, newAppointment])
  );

  return {
    success: true,
    message: "Appointment saved successfully!",
  };
}

export function cancelAppointment(id) {
  const appointments = getAppointments();

  const updated = appointments.map((item) =>
    item.id === id
      ? { ...item, status: "Cancelled" }
      : item
  );

  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
}
