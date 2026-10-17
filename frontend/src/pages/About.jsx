
import {
  Stethoscope,
  ShieldCheck,
  CalendarCheck,
  HeartHandshake,
  Users,
  Clock3,
} from "lucide-react";

function About() {
  const features = [
    {
      icon: <ShieldCheck size={30} />,
      title: "Efficiency",
      description:
        "Streamlined appointment scheduling that fits into your busy lifestyle.",
    },
    {
      icon: <CalendarCheck size={30} />,
      title: "Convenience",
      description:
        "Access trusted healthcare professionals and book appointments easily.",
    },
    {
      icon: <HeartHandshake size={30} />,
      title: "Personalization",
      description:
        "Find doctors based on your healthcare needs and preferences.",
    },
  ];

  return (
    <main className="mx-auto max-w-7xl px-5 py-12">

      {/* Page Title */}
      <div className="mb-14 text-center">
        <h1 className="text-3xl font-semibold text-gray-700">
          ABOUT <span className="text-gray-900">US</span>
        </h1>
        <div className="mx-auto mt-3 h-1 w-20 rounded-full bg-primary" />
      </div>

      {/* About Content */}
      <section className="grid grid-cols-1 items-center gap-12 md:grid-cols-2">

        {/* Illustration */}
        <div className="flex min-h-80 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-100 to-indigo-200 p-10">
          <div className="relative flex h-64 w-64 items-center justify-center rounded-full bg-white/70 shadow-lg">
            <Stethoscope
              size={115}
              strokeWidth={1.2}
              className="text-primary"
            />

            <div className="absolute -right-4 top-5 rounded-xl bg-white p-4 shadow-md">
              <Users size={30} className="text-primary" />
            </div>

            <div className="absolute -bottom-3 left-4 rounded-xl bg-white p-4 shadow-md">
              <Clock3 size={30} className="text-primary" />
            </div>
          </div>
        </div>

        {/* About Text */}
        <div className="space-y-6 text-sm leading-8 text-gray-600">
          <p>
            Welcome to Prescripto, your trusted partner in
            managing healthcare needs conveniently and efficiently.
            We understand the challenges individuals face when
            scheduling doctor appointments and accessing quality
            healthcare services.
          </p>

          <p>
            Prescripto is committed to making healthcare more
            accessible. Our platform allows users to explore
            medical specialties, find doctors, and schedule
            appointments through a simple interface.
          </p>

          <h2 className="text-lg font-semibold text-gray-800">
            Our Vision
          </h2>

          <p>
            Our vision is to create a seamless healthcare
            experience for every user by connecting patients
            with healthcare professionals and making appointment
            management easier.
          </p>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="mt-20">
        <h2 className="mb-8 text-2xl font-semibold text-gray-800">
          WHY <span className="text-primary">CHOOSE US</span>
        </h2>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="group rounded-xl border border-gray-200 p-8 transition-all duration-300 hover:-translate-y-1 hover:border-primary hover:bg-primary hover:shadow-lg"
            >
              <div className="mb-6 text-primary group-hover:text-white">
                {feature.icon}
              </div>

              <h3 className="mb-4 text-lg font-semibold text-gray-800 group-hover:text-white">
                {feature.title}
              </h3>

              <p className="text-sm leading-7 text-gray-500 group-hover:text-white">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
export default About;
