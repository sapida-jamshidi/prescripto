
import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import heroImage from "../assets/hero.png";

function Header() {
  return (
    <section className="mx-auto mt-5 max-w-7xl px-4 sm:px-6">
      <div className="relative overflow-hidden rounded-2xl bg-primary">

        <div className="grid min-h-[480px] grid-cols-1 items-center gap-8 px-7 pt-12 md:grid-cols-2 md:px-12 md:pt-8 lg:px-16">

          {/* Left Side */}
          <div className="relative z-10 text-center text-white md:text-left">

            <h1 className="text-3xl font-semibold leading-tight sm:text-4xl lg:text-5xl">
              Book Appointment
              <br />
              With Trusted
              <br />
              Doctors
            </h1>

            <p className="mx-auto mt-6 max-w-md text-sm leading-7 text-blue-50 md:mx-0 sm:text-base">
              Browse our list of healthcare professionals,
              find the right doctor for your needs, and
              book an appointment in just a few steps.
            </p>

            {/* Features */}
            <div className="mt-6 flex flex-wrap justify-center gap-4 text-sm md:justify-start">
              <span className="flex items-center gap-2">
                <CheckCircle2 size={18} />
                Easy Booking
              </span>

              <span className="flex items-center gap-2">
                <CheckCircle2 size={18} />
                Multiple Specialties
              </span>
            </div>

            {/* Button */}
            <Link
              to="/doctors"
              className="mt-8 inline-flex items-center gap-3 rounded-full bg-white px-7 py-4 text-sm font-medium text-gray-700 shadow-md transition hover:scale-105 hover:bg-blue-50"
            >
              Book Appointment
              <ArrowRight size={18} />
            </Link>
          </div>

          {/* Right Side */}
          <div className="relative flex h-72 items-end justify-center sm:h-96 md:h-[450px]">

            <div className="absolute bottom-0 h-60 w-60 rounded-full bg-white/10 blur-2xl sm:h-80 sm:w-80" />

            <img
              src={heroImage}
              alt="Healthcare appointment illustration"
              className="relative z-10 max-h-full w-full object-contain object-bottom"
            />
          </div>

        </div>
      </div>
    </section>
  );
}
export default Header;
