import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { TranslationKeys } from "../../(public)/translations";

interface HeroSectionProps {
    t: TranslationKeys["hero"];
}

export default function HeroSection({ t }: HeroSectionProps) {
    return (
        <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden bg-slate-50">
            {/* Gradient Wave Background */}
            <div className="absolute inset-0 z-0 opacity-30 pointer-events-none">
                <svg
                    className="absolute bottom-0 left-0 right-0 w-full h-auto text-blue-100"
                    viewBox="0 0 1440 320"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        fill="#e0f2fe"
                        fillOpacity="1"
                        d="M0,96L48,112C96,128,192,160,288,186.7C384,213,480,235,576,213.3C672,192,768,128,864,128C960,128,1056,192,1152,208C1248,224,1344,192,1392,176L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
                    ></path>
                </svg>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-24">
                    {/* Left Content */}
                    <div className="flex-1 text-center lg:text-left">
                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 leading-tight mb-6">
                            {t.title}
                        </h1>
                        <p className="text-lg sm:text-xl text-slate-600 mb-8 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                            {t.subtitle}
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                            <Link
                                href="/login" // Assuming this leads to the "Get Info" or "Login" flow
                                className="inline-flex items-center justify-center px-8 py-4 border border-transparent text-lg font-bold rounded-2xl text-white bg-blue-600 hover:bg-blue-700 transition-all shadow-lg hover:shadow-blue-500/25 ring-offset-2 focus:ring-2 focus:ring-blue-500"
                            >
                                {t.primaryCta}
                                <ArrowRight className="ml-2 w-5 h-5" />
                            </Link>
                            <Link
                                href="#demo"
                                className="inline-flex items-center justify-center px-8 py-4 border border-slate-200 text-lg font-semibold rounded-2xl text-slate-700 bg-white hover:bg-slate-50 transition-all shadow-sm hover:shadow-md"
                            >
                                {t.secondaryCta}
                            </Link>
                        </div>
                    </div>

                    <div className="flex-1 w-full flex justify-center lg:justify-end relative">
                        <div className="absolute -top-4 -right-4 w-72 h-72 bg-emerald-100 rounded-full blur-3xl opacity-50 animate-pulse pointer-events-none"></div>
                        <div className="absolute -bottom-4 -left-4 w-72 h-72 bg-blue-100 rounded-full blur-3xl opacity-50 animate-pulse delay-700 pointer-events-none"></div>

                        <Image
                            src="/assets/hero-section.png"
                            alt="Signal Of Safety hero"
                            width={600}
                            height={450}
                            className="w-full h-auto max-w-xl relative z-10 drop-shadow-2xl"
                            priority
                            unoptimized
                        />
                    </div>
                </div>
            </div>
        </section>
    );
}
