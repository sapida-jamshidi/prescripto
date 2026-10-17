
import { useState } from "react";
import {
  Mail,
  Phone,
  MapPin,
  Send,
  Stethoscope,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

const initialFormData = {
  name: "",
  email: "",
  subject: "",
  message: "",
};

function Contact() {
  const [formData, setFormData] = useState(initialFormData);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Update form fields
  function handleChange(e) {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setSuccess(false);
    setError("");
  }

  // Validate form
  function validateForm() {
    const name = formData.name.trim();
    const email = formData.email.trim();
    const subject = formData.subject.trim();
    const message = formData.message.trim();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (name.length < 2) {
      return "Full name must contain at least 2 characters.";
    }

    if (!emailRegex.test(email)) {
      return "Please enter a valid email address.";
    }

    if (subject.length < 3) {
      return "Subject must contain at least 3 characters.";
    }

    if (message.length < 10) {
      return "Message must contain at least 10 characters.";
    }

    return "";
  }

  // Submit contact form
  function handleSubmit(e) {
    e.preventDefault();

    setSuccess(false);
    setError("");

    const validationError = validateForm();

    if (validationError) {
      setError(validationError);
      return;
    }

    setIsSubmitting(true);

    try {
      const saved = JSON.parse(
        localStorage.getItem("prescripto_contact_messages") ||
          "[]"
      );

      const messages = Array.isArray(saved) ? saved : [];

      const newMessage = {
        id: crypto.randomUUID(),
        name: formData.name.trim(),
        email: formData.email.trim(),
        subject: formData.subject.trim(),
        message: formData.message.trim(),
        createdAt: new Date().toISOString(),
      };

      localStorage.setItem(
        "prescripto_contact_messages",
        JSON.stringify([...messages, newMessage])
      );

      setSuccess(true);
      setFormData({ ...initialFormData });
    } catch {
      setError(
        "Unable to save your message. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  const inputClass =
    "w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-700 outline-none transition focus:border-primary focus:ring-2 focus:ring-blue-100";

  return (
    <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6">

      {/* Page Title */}
      <div className="mb-14 text-center">
        <h1 className="text-3xl font-semibold text-gray-700">
          CONTACT <span className="text-gray-900">US</span>
        </h1>

        <div className="mx-auto mt-3 h-1 w-20 rounded-full bg-primary" />

        <p className="mt-5 text-gray-500">
          Have questions? We would love to hear from you.
        </p>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">

        {/* Left Side */}
        <section>
          {/* Illustration */}
          <div className="flex min-h-72 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-100 to-indigo-200">
            <Stethoscope
              size={130}
              strokeWidth={1.2}
              className="text-primary"
            />
          </div>

          <h2 className="mt-10 text-2xl font-semibold text-gray-800">
            Get in Touch
          </h2>

          <p className="mt-4 leading-7 text-gray-500">
            We are here to help you with questions about
            finding doctors, booking appointments, and
            using our platform.
          </p>

          {/* Contact Details */}
          <div className="mt-8 space-y-6">

            {/* Location */}
            <div className="flex items-start gap-4">
              <div className="rounded-lg bg-blue-50 p-3">
                <MapPin className="text-primary" size={22} />
              </div>

              <div>
                <h3 className="font-semibold text-gray-800">
                  Our Location
                </h3>

                <p className="mt-1 text-sm text-gray-500">
                  Online Healthcare Platform
                </p>
              </div>
            </div>

            {/* Phone */}
            <div className="flex items-start gap-4">
              <div className="rounded-lg bg-blue-50 p-3">
                <Phone className="text-primary" size={22} />
              </div>

              <div>
                <h3 className="font-semibold text-gray-800">
                  Phone Number
                </h3>

                <p className="mt-1 text-sm text-gray-500">
                  Coming Soon
                </p>
              </div>
            </div>

            {/* Email */}
            <div className="flex items-start gap-4">
              <div className="rounded-lg bg-blue-50 p-3">
                <Mail className="text-primary" size={22} />
              </div>

              <div>
                <h3 className="font-semibold text-gray-800">
                  Email Address
                </h3>

                <p className="mt-1 text-sm text-gray-500">
                  Coming Soon
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Right Side */}
        <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-10">

          <h2 className="text-2xl font-semibold text-gray-800">
            Send Us a Message
          </h2>

          <p className="mt-2 text-sm text-gray-500">
            Fill out the form below to leave a message.
          </p>

          <form
            onSubmit={handleSubmit}
            noValidate
            className="mt-8 space-y-5"
          >

            {/* Full Name */}
            <div>
              <label
                htmlFor="contact-name"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Full Name
              </label>

              <input
                id="contact-name"
                type="text"
                name="name"
                autoComplete="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your full name"
                minLength={2}
                maxLength={100}
                required
                aria-invalid={Boolean(error)}
                className={inputClass}
              />
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="contact-email"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Email Address
              </label>

              <input
                id="contact-email"
                type="email"
                name="email"
                autoComplete="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                maxLength={254}
                required
                aria-invalid={Boolean(error)}
                className={inputClass}
              />
            </div>

            {/* Subject */}
            <div>
              <label
                htmlFor="contact-subject"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Subject
              </label>

              <input
                id="contact-subject"
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                placeholder="Message subject"
                minLength={3}
                maxLength={150}
                required
                aria-invalid={Boolean(error)}
                className={inputClass}
              />
            </div>

            {/* Message */}
            <div>
              <label
                htmlFor="contact-message"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Your Message
              </label>

              <textarea
                id="contact-message"
                name="message"
                rows={5}
                value={formData.message}
                onChange={handleChange}
                placeholder="Write your message here..."
                minLength={10}
                maxLength={2000}
                required
                aria-invalid={Boolean(error)}
                className={`${inputClass} resize-none`}
              />

              <p className="mt-2 text-right text-xs text-gray-400">
                {formData.message.length}/2000 characters
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div
                role="alert"
                className="flex items-start gap-3 rounded-lg border border-red-100 bg-red-50 p-4 text-sm text-red-600"
              >
                <AlertCircle
                  size={20}
                  className="shrink-0"
                />

                <span>{error}</span>
              </div>
            )}

            {/* Success Message */}
            {success && (
              <div
                role="status"
                className="flex items-start gap-3 rounded-lg border border-green-100 bg-green-50 p-4 text-sm text-green-700"
              >
                <CheckCircle2
                  size={20}
                  className="shrink-0"
                />

                <span>
                  Message saved successfully in this browser!
                </span>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-6 py-4 font-medium text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Send size={18} />

              {isSubmitting
                ? "Saving..."
                : "Send Message"}
            </button>

          </form>
        </section>
      </div>
    </main>
  );
}
export default Contact;
