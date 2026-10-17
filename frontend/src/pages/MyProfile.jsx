
import { useState, useRef } from "react";
import {
  UserRound,
  Pencil,
  Save,
  X,
  Camera,
  Mail,
  Phone,
  CalendarDays,
  MapPin,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

const defaultProfile = {
  name: "",
  email: "",
  phone: "",
  birthday: "",
  address: "",
  image: "",
};

function loadProfile() {
  try {
    const saved = localStorage.getItem("prescripto_profile");

    return saved
      ? { ...defaultProfile, ...JSON.parse(saved) }
      : { ...defaultProfile };
  } catch {
    return { ...defaultProfile };
  }
}

function MyProfile() {
  const [profile, setProfile] = useState(loadProfile);
  const [isEditing, setIsEditing] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const fileInputRef = useRef(null);

  function handleChange(event) {
    const { name, value } = event.target;

    setProfile((prev) => ({
      ...prev,
      [name]: value,
    }));

    setMessage("");
    setError("");
  }

  function handleImageChange(event) {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      setError("Please select a JPG, PNG, or WebP image.");
      return;
    }

    if (file.size > 1024 * 1024) {
      setError("Image size must be less than 1 MB.");
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      setProfile((prev) => ({
        ...prev,
        image: String(reader.result),
      }));

      setError("");
      setMessage("");
    };

    reader.onerror = () => {
      setError("Unable to read the selected image.");
    };

    reader.readAsDataURL(file);
  }

  function validateProfile() {
    if (profile.name.trim().length < 2) {
      return "Full name must contain at least 2 characters.";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(profile.email.trim())) {
      return "Please enter a valid email address.";
    }

    if (
      profile.phone.trim() &&
      !/^\+?[0-9\s()-]{7,20}$/.test(profile.phone.trim())
    ) {
      return "Please enter a valid phone number.";
    }

    if (
      profile.birthday &&
      profile.birthday > new Date().toISOString().slice(0, 10)
    ) {
      return "Date of birth cannot be in the future.";
    }

    return "";
  }

  function handleSave(event) {
    event.preventDefault();

    const validationError = validateProfile();

    if (validationError) {
      setError(validationError);
      setMessage("");
      return;
    }

    try {
      localStorage.setItem(
        "prescripto_profile",
        JSON.stringify(profile)
      );

      setIsEditing(false);
      setError("");
      setMessage("Profile saved successfully!");
    } catch {
      setError("Unable to save profile. Try a smaller image.");
      setMessage("");
    }
  }

  function handleCancel() {
    setProfile(loadProfile());
    setIsEditing(false);
    setError("");
    setMessage("");
  }

  const inputClass =
    "w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700 outline-none transition focus:border-primary disabled:bg-gray-50 disabled:text-gray-500";

  return (
    <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6">

      {/* Page Title */}
      <div className="mb-8">
        <h1 className="text-3xl font-semibold text-gray-800">
          My Profile
        </h1>

        <p className="mt-2 text-sm text-gray-500">
          View and manage your personal information.
        </p>
      </div>

      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">

        {/* Profile Header */}
        <div className="h-32 bg-gradient-to-r from-primary to-blue-400" />

        <div className="px-6 pb-8 sm:px-10">

          {/* Profile Image */}
          <div className="-mt-14 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">

            <div className="relative w-fit">
              <div className="flex h-28 w-28 items-center justify-center overflow-hidden rounded-full border-4 border-white bg-blue-100 shadow-md">

                {profile.image ? (
                  <img
                    src={profile.image}
                    alt="Profile"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <UserRound
                    size={65}
                    className="text-primary"
                  />
                )}
              </div>

              {isEditing && (
                <>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    onChange={handleImageChange}
                    className="hidden"
                  />

                  <button
                    type="button"
                    aria-label="Change profile picture"
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute bottom-0 right-0 rounded-full bg-primary p-2 text-white shadow-md hover:opacity-90"
                  >
                    <Camera size={17} />
                  </button>
                </>
              )}
            </div>

            {!isEditing && (
              <button
                type="button"
                onClick={() => {
                  setIsEditing(true);
                  setMessage("");
                  setError("");
                }}
                className="flex items-center justify-center gap-2 rounded-full border border-primary px-6 py-3 text-sm font-medium text-primary transition hover:bg-blue-50"
              >
                <Pencil size={17} />
                Edit Profile
              </button>
            )}
          </div>

          <div className="mt-5">
            <h2 className="text-2xl font-semibold text-gray-800">
              {profile.name || "Your Name"}
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              {profile.email || "Your email address"}
            </p>
          </div>

          <div className="my-8 border-t border-gray-200" />

          {/* Profile Form */}
          <form onSubmit={handleSave} className="space-y-8">

            {/* Contact Information */}
            <section>
              <h3 className="mb-6 text-lg font-semibold text-gray-800">
                Contact Information
              </h3>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">

                {/* Name */}
                <div>
                  <label
                    htmlFor="profile-name"
                    className="mb-2 block text-sm font-medium text-gray-600"
                  >
                    Full Name
                  </label>

                  <div className="mb-2 flex items-center gap-2 text-primary">
                    <UserRound size={18} />
                    <span className="text-xs">Personal details</span>
                  </div>

                  <input
                    id="profile-name"
                    name="name"
                    type="text"
                    value={profile.name}
                    onChange={handleChange}
                    disabled={!isEditing}
                    required
                    className={inputClass}
                    placeholder="Enter your full name"
                  />
                </div>

                {/* Email */}
                <div>
                  <label
                    htmlFor="profile-email"
                    className="mb-2 block text-sm font-medium text-gray-600"
                  >
                    Email Address
                  </label>

                  <div className="mb-2 flex items-center gap-2 text-primary">
                    <Mail size={18} />
                    <span className="text-xs">Email contact</span>
                  </div>

                  <input
                    id="profile-email"
                    name="email"
                    type="email"
                    value={profile.email}
                    onChange={handleChange}
                    disabled={!isEditing}
                    required
                    className={inputClass}
                    placeholder="Enter your email"
                  />
                </div>

                {/* Phone */}
                <div>
                  <label
                    htmlFor="profile-phone"
                    className="mb-2 block text-sm font-medium text-gray-600"
                  >
                    Phone Number
                  </label>

                  <div className="mb-2 flex items-center gap-2 text-primary">
                    <Phone size={18} />
                    <span className="text-xs">Phone contact</span>
                  </div>

                  <input
                    id="profile-phone"
                    name="phone"
                    type="tel"
                    value={profile.phone}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className={inputClass}
                    placeholder="+1 234 567 890"
                  />
                </div>

                {/* Birthday */}
                <div>
                  <label
                    htmlFor="profile-birthday"
                    className="mb-2 block text-sm font-medium text-gray-600"
                  >
                    Date of Birth
                  </label>

                  <div className="mb-2 flex items-center gap-2 text-primary">
                    <CalendarDays size={18} />
                    <span className="text-xs">Personal details</span>
                  </div>

                  <input
                    id="profile-birthday"
                    name="birthday"
                    type="date"
                    max={new Date().toISOString().slice(0, 10)}
                    value={profile.birthday}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className={inputClass}
                  />
                </div>

              </div>
            </section>

            {/* Address */}
            <section>
              <h3 className="mb-5 text-lg font-semibold text-gray-800">
                Address Information
              </h3>

              <label
                htmlFor="profile-address"
                className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-600"
              >
                <MapPin size={18} className="text-primary" />
                Your Address
              </label>

              <textarea
                id="profile-address"
                name="address"
                value={profile.address}
                onChange={handleChange}
                disabled={!isEditing}
                rows={3}
                className={`${inputClass} resize-none`}
                placeholder="Enter your address"
              />
            </section>

            {/* Error Message */}
            {error && (
              <div
                role="alert"
                className="flex items-center gap-2 rounded-lg bg-red-50 p-4 text-sm text-red-600"
              >
                <AlertCircle size={20} className="shrink-0" />
                {error}
              </div>
            )}

            {/* Success Message */}
            {message && (
              <div
                role="status"
                className="flex items-center gap-2 rounded-lg bg-green-50 p-4 text-sm text-green-700"
              >
                <CheckCircle2 size={20} className="shrink-0" />
                {message}
              </div>
            )}

            {/* Action Buttons */}
            {isEditing && (
              <div className="flex flex-wrap gap-4 border-t border-gray-200 pt-6">

                <button
                  type="submit"
                  className="flex items-center gap-2 rounded-full bg-primary px-7 py-3 text-sm font-medium text-white transition hover:opacity-90"
                >
                  <Save size={18} />
                  Save Information
                </button>

                <button
                  type="button"
                  onClick={handleCancel}
                  className="flex items-center gap-2 rounded-full border border-gray-300 px-7 py-3 text-sm font-medium text-gray-600 transition hover:bg-gray-50"
                >
                  <X size={18} />
                  Cancel
                </button>

              </div>
            )}

          </form>
        </div>
      </div>
    </main>
  );
}
export default MyProfile;
