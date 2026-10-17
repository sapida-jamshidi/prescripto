
import { Link } from "react-router-dom";
import {
  SearchX,
  House,
  ArrowLeft,
} from "lucide-react";

function NotFound() {
  return (
    <main className="flex min-h-[70vh] items-center justify-center bg-gray-50 px-4 py-16">
      <div className="mx-auto max-w-lg text-center">

        {/* Icon */}
        <div className="mx-auto mb-7 flex h-24 w-24 items-center justify-center rounded-full bg-blue-100">
          <SearchX size={48} className="text-primary" />
        </div>

        {/* Error Code */}
        <h1 className="text-7xl font-bold tracking-tight text-primary sm:text-8xl">
          404
        </h1>

        {/* Heading */}
        <h2 className="mt-5 text-2xl font-semibold text-gray-800 sm:text-3xl">
          Page Not Found
        </h2>

        {/* Description */}
        <p className="mt-4 leading-7 text-gray-500">
          Sorry, the page you are looking for does not
          exist or may have been moved.
        </p>

        {/* Buttons */}
        <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3 font-medium text-white transition hover:opacity-90"
          >
            <House size={19} />
            Back to Home
          </Link>

          <Link
            to="/doctors"
            className="inline-flex items-center gap-2 rounded-full border border-gray-300 bg-white px-7 py-3 font-medium text-gray-700 transition hover:border-primary hover:text-primary"
          >
            <ArrowLeft size={19} />
            View Doctors
          </Link>
        </div>

      </div>
    </main>
  );
}
export default NotFound;
