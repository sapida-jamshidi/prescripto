
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";

function DoctorCard({ doctor }) {
  return (
    <Link
      to={`/appointment/${doctor.id}`}
      className="group block overflow-hidden rounded-xl border border-blue-100 bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
    >
      {/* Doctor Image */}
      <div className="flex h-60 items-end justify-center overflow-hidden bg-blue-50">
        <img
          src={doctor.image}
          alt={`Dr. ${doctor.name}`}
          loading="lazy"
          className="h-full w-full object-cover object-top transition-transform duration-300 group-hover:scale-105"
        />
      </div>

      {/* Doctor Information */}
      <div className="p-5">
        <div className="mb-3 flex items-center gap-2">
          <span
            className={`h-2.5 w-2.5 rounded-full ${
              doctor.available ? "bg-green-500" : "bg-red-500"
            }`}
          />

          <span
            className={`text-sm ${
              doctor.available ? "text-green-600" : "text-red-500"
            }`}
          >
            {doctor.available ? "Available" : "Unavailable"}
          </span>
        </div>

        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className="text-lg font-semibold text-gray-800">
              {doctor.name}
            </h3>

            <p className="mt-1 text-sm text-gray-500">
              {doctor.speciality}
            </p>
          </div>

          <ArrowUpRight
            size={20}
            className="text-primary transition-transform group-hover:translate-x-1 group-hover:-translate-y-1"
          />
        </div>

        <div className="mt-4 border-t border-gray-100 pt-3">
          <p className="text-sm text-gray-600">
            Consultation Fee:
            <span className="ml-2 font-semibold text-primary">
              ${doctor.fees}
            </span>
          </p>
        </div>
      </div>
    </Link>
  );
}
export default DoctorCard;
