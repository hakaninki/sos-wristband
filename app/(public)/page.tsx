"use client";

import { useState } from "react";
import { translations, Language } from "./translations";

import Navbar from "../components/landing/Navbar";
import HeroSection from "../components/landing/HeroSection";
import WhySosSection from "../components/landing/WhySosSection";
import HowItWorksSection from "../components/landing/HowItWorksSection";
import FeaturesSection from "../components/landing/FeaturesSection";
import SchoolManagementSection from "../components/landing/SchoolManagementSection";
import SecuritySection from "../components/landing/SecuritySection";
import Footer from "../components/landing/Footer";

export default function LandingPage() {
    const [lang, setLang] = useState<Language>("tr"); // Default to Turkish
    const t = translations[lang];

    return (
        <main className="min-h-screen bg-slate-50 font-sans selection:bg-blue-100 selection:text-blue-900">
            <Navbar lang={lang} setLang={setLang} t={t.nav} />
            <HeroSection t={t.hero} />
            <WhySosSection t={t.whySos} />
            <HowItWorksSection t={t.howItWorks} />
            <FeaturesSection t={t.features} />
            <SchoolManagementSection t={t.panel} />
            <SecuritySection t={t.security} />
            <Footer t={t.footer} />
        </main>
    );
}
