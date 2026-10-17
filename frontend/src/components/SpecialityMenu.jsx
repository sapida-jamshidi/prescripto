
import { useNavigate } from "react-router-dom";
import {
  Stethoscope,
  Baby,
  Brain,
  HeartPulse,
  Activity,
  Microscope,
} from "lucide-react";

const specialities = [
  {
    name: "General physician",
    icon: Stethoscope,
    color: "bg-blue-100 text-blue-600",
  },
  {
    name: "Gynecologist",
    icon: HeartPulse,
    color: "bg-pink-100 text-pink-600",
  },
  {
    name: "Dermatologist",
    icon: Microscope,
    color: "bg-purple-100 text-purple-600",
  },
  {
    name: "Pediatricians",
    icon: Baby,
    color: "bg-yellow-100 text-yellow-600",
  },
  {
    name: "Neurologist",
    icon: Brain,
    color: "bg-green-100 text-green-600",
  },
  {
    name: "Gastroenterologist",
    icon: Activity,
    color: "bg-orange-100 text-orange-600",
  },
];

function SpecialityMenu() {
  const navigate = useNavigate();

  function handleSpeciality(name) {
    navigate(`/doctors?speciality=${encodeURIComponent(name)}`);
  }

  return (
    <section className="mx-auto max-w-7xl px-5 py-20 text-center">
      <h2 className="text-3xl font-semibold text-gray-800">
        Find by Speciality
      </h2>

      <p className="mx-auto mt-4 max-w-lg text-sm leading-6 text-gray-600">
        Simply browse through our extensive list of trusted
        doctors and schedule your appointment hassle-free.
      </p>

      <div className="mt-12 grid grid-cols-2 gap-8 sm:grid-cols-3 lg:grid-cols-6">
        {specialities.map((speciality) => {
          const Icon = speciality.icon;

          return (
            <button
              key={speciality.name}
              type="button"
              onClick={() => handleSpeciality(speciality.name)}
              className="group flex flex-col items-center gap-4"
            >
              <div
                className={`flex h-24 w-24 items-center justify-center rounded-full transition-transform duration-300 group-hover:-translate-y-2 ${speciality.color}`}
              >
                <Icon size={40} strokeWidth={1.5} />
              </div>

              <span className="text-sm font-medium text-gray-700">
                {speciality.name}
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
export default SpecialityMenu;
