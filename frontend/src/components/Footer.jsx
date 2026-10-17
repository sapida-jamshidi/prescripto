
import { Link } from "react-router-dom";

import {
  Stethoscope,
  Globe,
  Camera,
  BriefcaseBusiness,
  MapPin,
  Phone,
  Mail,
} from "lucide-react";

function Footer() {
  return (
    <footer className="mt-20 border-t border-gray-200 bg-white">

      {/* Main Footer */}
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-12 px-6 py-14 md:grid-cols-3">

        {/* Website Information */}
        <div>
          <Link
            to="/"
            className="flex items-center gap-2"
          >
            <Stethoscope
              size={34}
              className="text-primary"
            />

            <span className="text-2xl font-bold text-gray-800">
              Prescripto
            </span>
          </Link>

          <p className="mt-6 max-w-sm text-sm leading-7 text-gray-500">
            Prescripto helps patients find trusted doctors,
            explore medical specialties, and book appointments
            through a simple and convenient platform.
          </p>

          {/* Social Media */}
          <div className="mt-6 flex items-center gap-4">

            {/* Facebook */}
            <a
              href="https://www.facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              title="Facebook"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-50 text-gray-600 transition hover:bg-primary hover:text-white"
            >
              <Globe size={20} />
            </a>

            {/* Instagram */}
            <a
              href="https://www.instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              title="Instagram"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-50 text-gray-600 transition hover:bg-primary hover:text-white"
            >
              <Camera size={20} />
            </a>

            {/* LinkedIn */}
            <a
              href="https://www.linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              title="LinkedIn"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-50 text-gray-600 transition hover:bg-primary hover:text-white"
            >
              <BriefcaseBusiness size={20} />
            </a>

          </div>
        </div>

        {/* Navigation Links */}
        <div className="md:mx-auto">

          <h3 className="text-lg font-semibold text-gray-800">
            COMPANY
          </h3>

          <ul className="mt-6 space-y-4 text-sm text-gray-500">

            <li>
              <Link
                to="/"
                className="transition hover:text-primary"
              >
                Home
              </Link>
            </li>

            <li>
              <Link
                to="/doctors"
                className="transition hover:text-primary"
              >
                All Doctors
              </Link>
            </li>

            <li>
              <Link
                to="/about"
                className="transition hover:text-primary"
              >
                About Us
              </Link>
            </li>

            <li>
              <Link
                to="/contact"
                className="transition hover:text-primary"
              >
                Contact Us
              </Link>
            </li>

            <li>
              <Link
                to="/my-appointments"
                className="transition hover:text-primary"
              >
                My Appointments
              </Link>
            </li>

          </ul>
        </div>

        {/* Contact Information */}
        <div>

          <h3 className="text-lg font-semibold text-gray-800">
            GET IN TOUCH
          </h3>

          <div className="mt-6 space-y-5 text-sm text-gray-500">

            {/* Location */}
            <div className="flex items-start gap-3">
              <MapPin
                size={20}
                className="shrink-0 text-primary"
              />

              <span>
                Online Healthcare Platform
              </span>
            </div>

            {/* Phone */}
            <div className="flex items-center gap-3">
              <Phone
                size={20}
                className="shrink-0 text-primary"
              />

              <span>
                Phone: Coming Soon
              </span>
            </div>

            {/* Email */}
            <div className="flex items-center gap-3">
              <Mail
                size={20}
                className="shrink-0 text-primary"
              />

              <span>
                Email: Coming Soon
              </span>
            </div>

          </div>
        </div>

      </div>

      {/* Copyright */}
      <div className="mx-auto max-w-7xl border-t border-gray-200 px-6 py-6">

        <p className="text-center text-sm text-gray-500">
          © {new Date().getFullYear()} Prescripto.
          All Rights Reserved.
        </p>

      </div>

    </footer>
  );
}
export default Footer;
