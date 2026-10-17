
import { doctors as defaultDoctors } from "../data/doctors";

const STORAGE_KEY = "prescripto_doctors";

export function getDoctors() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);

    if (saved !== null) {
      const parsed = JSON.parse(saved);

      if (Array.isArray(parsed)) {
        return parsed;
      }
    }
  } catch (error) {
    console.error("Unable to load doctors:", error);
  }

  return defaultDoctors;
}

export function saveDoctors(doctorsList) {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(doctorsList)
  );

  window.dispatchEvent(new Event("doctorsUpdated"));
}

export function addDoctor(doctorData) {
  const doctorsList = getDoctors();

  const newDoctor = {
    ...doctorData,
    id: crypto.randomUUID(),
    available: doctorData.available ?? true,
  };

  saveDoctors([...doctorsList, newDoctor]);

  return newDoctor;
}

export function updateDoctor(id, updatedData) {
  const doctorsList = getDoctors();

  const updatedDoctors = doctorsList.map((doctor) =>
    doctor.id === id
      ? { ...doctor, ...updatedData, id: doctor.id }
      : doctor
  );

  saveDoctors(updatedDoctors);
}

export function deleteDoctor(id) {
  const doctorsList = getDoctors();

  const updatedDoctors = doctorsList.filter(
    (doctor) => doctor.id !== id
  );

  saveDoctors(updatedDoctors);
}

export function toggleDoctorAvailability(id) {
  const doctorsList = getDoctors();

  const updatedDoctors = doctorsList.map((doctor) =>
    doctor.id === id
      ? { ...doctor, available: !doctor.available }
      : doctor
  );

  saveDoctors(updatedDoctors);
}
