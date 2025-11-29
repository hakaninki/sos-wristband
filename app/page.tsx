import Link from "next/link";
import { Shield, Smartphone, School, Users, ArrowRight, Lock, Activity, CheckCircle } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-zinc-900 font-sans selection:bg-teal-100">
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-zinc-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-teal-600 rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold tracking-tight text-zinc-900">SOS System</span>
            </div>
            <Link
              href="/login"
              className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-teal-600 hover:bg-teal-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
            >
              Login
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 lg:pt-40 lg:pb-28 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-zinc-900 mb-6">
              Next-Gen Safety for <span className="text-teal-600">Schools & Students</span>
            </h1>
            <p className="text-lg sm:text-xl text-zinc-600 mb-10 leading-relaxed">
              The complete emergency response system. Instant identification, medical data access, and automated alerts via NFC & QR wristbands.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/login"
                className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-full text-white bg-teal-600 hover:bg-teal-700 md:text-lg md:px-10 transition-all shadow-lg hover:shadow-teal-500/25"
              >
                Get Started
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
              <a
                href="#how-it-works"
                className="inline-flex items-center justify-center px-8 py-3 border border-zinc-200 text-base font-medium rounded-full text-zinc-700 bg-white hover:bg-zinc-50 md:text-lg md:px-10 transition-all"
              >
                Learn More
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 bg-zinc-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-base text-teal-600 font-semibold tracking-wide uppercase">Features</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-zinc-900 sm:text-4xl">
              Everything you need for student safety
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <Smartphone className="w-6 h-6 text-teal-600" />,
                title: "Instant Identification",
                desc: "Scan QR or tap NFC to instantly access critical student information and emergency contacts."
              },
              {
                icon: <Activity className="w-6 h-6 text-teal-600" />,
                title: "Medical Data",
                desc: "Securely store and access allergies, medications, and blood type information when it matters most."
              },
              {
                icon: <Lock className="w-6 h-6 text-teal-600" />,
                title: "Admin Dashboard",
                desc: "Comprehensive control panel for schools to manage students, staff, and emergency protocols."
              }
            ].map((feature, i) => (
              <div key={i} className="bg-white p-8 rounded-2xl shadow-sm border border-zinc-100 hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-teal-50 rounded-xl flex items-center justify-center mb-6">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-zinc-900 mb-3">{feature.title}</h3>
                <p className="text-zinc-600 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section id="how-it-works" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-2 lg:gap-16 items-center">
            <div>
              <h2 className="text-3xl font-extrabold text-zinc-900 mb-6">
                Simple, Fast, & Effective
              </h2>
              <div className="space-y-8">
                {[
                  { step: "01", title: "Wear the Band", desc: "Students wear the comfortable, durable SOS wristband daily." },
                  { step: "02", title: "Scan in Emergency", desc: "First responders or staff scan the QR code or tap the NFC chip." },
                  { step: "03", title: "Instant Access", desc: "Secure profile loads instantly with medical info and parent contacts." }
                ].map((item, i) => (
                  <div key={i} className="flex gap-4">
                    <span className="text-2xl font-bold text-teal-200">{item.step}</span>
                    <div>
                      <h3 className="text-lg font-bold text-zinc-900">{item.title}</h3>
                      <p className="text-zinc-600">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-10 lg:mt-0 relative">
              <div className="aspect-square rounded-2xl bg-gradient-to-br from-teal-100 to-blue-50 p-8 flex items-center justify-center">
                {/* Abstract representation of the system */}
                <div className="relative w-full max-w-sm bg-white rounded-xl shadow-xl p-6">
                  <div className="flex items-center gap-4 mb-6 border-b border-zinc-100 pb-4">
                    <div className="w-12 h-12 bg-zinc-100 rounded-full"></div>
                    <div className="space-y-2">
                      <div className="h-4 w-32 bg-zinc-100 rounded"></div>
                      <div className="h-3 w-20 bg-zinc-100 rounded"></div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="h-3 w-full bg-zinc-50 rounded"></div>
                    <div className="h-3 w-5/6 bg-zinc-50 rounded"></div>
                    <div className="h-3 w-4/6 bg-zinc-50 rounded"></div>
                  </div>
                  <div className="mt-6 flex gap-3">
                    <div className="h-10 w-full bg-teal-600 rounded-lg opacity-10"></div>
                    <div className="h-10 w-full bg-zinc-100 rounded-lg"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* For Schools / Parents */}
      <section className="py-20 bg-zinc-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <School className="w-8 h-8 text-teal-400" />
                <h3 className="text-2xl font-bold">For Schools</h3>
              </div>
              <ul className="space-y-4 text-zinc-300">
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-teal-500 mt-1" />
                  <span>Centralized database of all student emergency info</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-teal-500 mt-1" />
                  <span>Quickly identify students during evacuations or trips</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-teal-500 mt-1" />
                  <span>Manage staff access and permissions easily</span>
                </li>
              </ul>
            </div>
            <div>
              <div className="flex items-center gap-3 mb-6">
                <Users className="w-8 h-8 text-teal-400" />
                <h3 className="text-2xl font-bold">For Parents</h3>
              </div>
              <ul className="space-y-4 text-zinc-300">
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-teal-500 mt-1" />
                  <span>Peace of mind knowing medical info is accessible</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-teal-500 mt-1" />
                  <span>Instant notification system (coming soon)</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-teal-500 mt-1" />
                  <span>Easy profile updates via secure portal</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-zinc-100 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-teal-600 rounded-md flex items-center justify-center">
              <Shield className="w-3 h-3 text-white" />
            </div>
            <span className="text-lg font-bold text-zinc-900">SOS System</span>
          </div>
          <p className="text-zinc-500 text-sm">
            © {new Date().getFullYear()} SOS Wristband System. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
