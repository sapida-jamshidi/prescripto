
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ImagePlus, UserRoundPlus } from "lucide-react";
import toast from "react-hot-toast";

import { addDoctor } from "../../utils/doctorStorage";

const specialities = [
  "General physician",
  "Gynecologist",
  "Dermatologist",
  "Pediatricians",
  "Neurologist",
  "Gastroenterologist",
];

const initialForm = {
  name: "",
  email: "",
  degree: "",
  speciality: "General physician",
  experience: "",
  fees: "",
  address1: "",
  address2: "",
  about: "",
  available: true,
};

function AddDoctor() {
  const navigate = useNavigate();
  const [form, setForm] = useState(initialForm);
  const [image, setImage] = useState("");
  const [saving, setSaving] = useState(false);

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  function handleImageChange(event) {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image.");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      toast.error("Image must be smaller than 2 MB.");
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      setImage(String(reader.result));
    };

    reader.onerror = () => {
      toast.error("Unable to read the image.");
    };

    reader.readAsDataURL(file);
  }

  function handleSubmit(event) {
    event.preventDefault();

    if (!form.name.trim() || !form.degree.trim()) {
      toast.error("Please complete all required fields.");
      return;
    }

    if (!image) {
      toast.error("Please upload a doctor image.");
      return;
    }

    const fees = Number(form.fees);

    if (!Number.isFinite(fees) || fees <= 0) {
      toast.error("Please enter a valid consultation fee.");
      return;
    }

    setSaving(true);

    try {
      addDoctor({
        name: form.name.trim(),
        email: form.email.trim(),
        degree: form.degree.trim(),
        speciality: form.speciality,
        experience: form.experience.trim(),
        fees,
        address: {
          line1: form.address1.trim(),
          line2: form.address2.trim(),
        },
        about: form.about.trim(),
        image,
        available: form.available,
      });

      toast.success("Doctor added successfully!");
      setForm(initialForm);
      setImage("");
      navigate("/admin/doctors");
    } catch {
      toast.error("Unable to save doctor. Check browser storage.");
    } finally {
      setSaving(false);
    }
  }

  const inputClass =
    "w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700 outline-none transition focus:border-primary";

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">
          Add Doctor
        </h1>
        <p className="mt-2 text-sm text-gray-500">
          Enter the details of a new doctor.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-7 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:p-8"
      >
        <div>
          <h2 className="mb-4 font-semibold text-gray-800">
            Doctor Image
          </h2>

          <label className="flex cursor-pointer items-center gap-5">
            <div className="flex h-28 w-28 shrink-0 items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50">
              {image ? (
                <img
                  src={image}
                  alt="Doctor preview"
                  className="h-full w-full object-cover"
                />
              ) : (
                <ImagePlus size={35} className="text-gray-400" />
              )}
            </div>

            <div>
              <p className="font-medium text-primary">
                Upload doctor picture
              </p>
              <p className="mt-1 text-xs text-gray-500">
                JPG, PNG or WebP — maximum 2 MB
              </p>
            </div>

            <input
              type="file"
              accept="image/png,image/jpeg,image/webp"
              onChange={handleImageChange}
              className="hidden"
            />
          </label>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium">
              Doctor Name *
            </label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Dr. Sarah Johnson"
              required
              className={inputClass}
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              Doctor Email
            </label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="doctor@example.com"
              className={inputClass}
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              Degree *
            </label>
            <input
              name="degree"
              value={form.degree}
              onChange={handleChange}
              placeholder="MBBS, MD"
              required
              className={inputClass}
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              Speciality *
            </label>
            <select
              name="speciality"
              value={form.speciality}
              onChange={handleChange}
              className={inputClass}
            >
              {specialities.map((speciality) => (
                <option key={speciality} value={speciality}>
                  {speciality}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              Experience *
            </label>
            <input
              name="experience"
              value={form.experience}
              onChange={handleChange}
              placeholder="5 Years"
              required
              className={inputClass}
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              Consultation Fee ($) *
            </label>
            <input
              type="number"
              name="fees"
              value={form.fees}
              onChange={handleChange}
              placeholder="50"
              min="1"
              step="0.01"
              required
              className={inputClass}
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              Address Line 1
            </label>
            <input
              name="address1"
              value={form.address1}
              onChange={handleChange}
              placeholder="Street and building"
              className={inputClass}
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              Address Line 2
            </label>
            <input
              name="address2"
              value={form.address2}
              onChange={handleChange}
              placeholder="City and state"
              className={inputClass}
            />
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">
            About Doctor
          </label>
          <textarea
            name="about"
            value={form.about}
            onChange={handleChange}
            rows={5}
            placeholder="Write a short description of the doctor..."
            className={inputClass}
          />
        </div>

        <label className="flex items-center gap-3 text-sm text-gray-700">
          <input
            type="checkbox"
            checked={form.available}
            onChange={(event) =>
              setForm((previous) => ({
                ...previous,
                available: event.target.checked,
              }))
            }
            className="h-4 w-4 accent-blue-600"
          />
          Doctor is available for appointments
        </label>

        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-8 py-3 font-medium text-white transition hover:opacity-90 disabled:opacity-50"
        >
          <UserRoundPlus size={19} />
          {saving ? "Saving..." : "Add Doctor"}
        </button>
      </form>
    </div>
  );
}
export default AddDoctor;
