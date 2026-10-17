
import { Link } from "react-router-dom";
import { UserRound } from "lucide-react";

function Banner() {
  return (
    <section className="relative mt-16 overflow-hidden rounded-2xl bg-primary px-8 pt-12 text-white md:px-16 md:pt-16">
      <div className="flex flex-col items-center gap-8 md:flex-row md:justify-between">

        {/* Left Side */}
        <div className="z-10 max-w-xl pb-12 text-center md:pb-16 md:text-left">
          <h2 className="text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl">
            Book Appointment
            <br />
            With 100+ Trusted
            <br />
            Doctors
          </h2>

          <Link
            to="/login"
            className="mt-8 inline-block rounded-full bg-white px-9 py-4 font-medium text-gray-700 transition duration-300 hover:scale-105 hover:bg-gray-100"
          >
            Create Account
          </Link>
        </div>

        {/* Right Side */}
        <div className="flex h-56 w-full max-w-sm items-end justify-center md:h-72 md:w-2/5">
          <div className="flex h-52 w-52 items-center justify-center rounded-full bg-white/20 md:h-64 md:w-64">
            <UserRound
              size={150}
              strokeWidth={1}
              className="text-white"
            />
          </div>
        </div>

      </div>
    </section>
  );
}
export default Banner;
