import { FileText, Watch, Smartphone } from "lucide-react";
import { Scan, UserCheck, KeyRound } from "lucide-react";
import { TranslationKeys } from "../../(public)/translations";

interface HowItWorksSectionProps {
    t: TranslationKeys["howItWorks"];
}

export default function HowItWorksSection({ t }: HowItWorksSectionProps) {
    const steps = [
        {
            icon: FileText,
            title: t.step1Title,
            desc: t.step1Desc,
            color: "text-blue-600",
            bg: "bg-blue-100",
        },
        {
            icon: Watch,
            title: t.step2Title,
            desc: t.step2Desc,
            color: "text-emerald-600",
            bg: "bg-emerald-100",
        },
        {
            icon: Scan,
            title: t.step3Title,
            desc: t.step3Desc,
            color: "text-orange-600",
            bg: "bg-orange-100",
        },
    ];

    return (
        <section id="how-it-works" className="py-20 bg-slate-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                        {t.title}
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
                    {/* Connecting Line (Desktop) */}
                    <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-0.5 bg-slate-200 -z-10 bg-gradient-to-r from-transparent via-slate-300 to-transparent"></div>

                    {steps.map((step, index) => (
                        <div key={index} className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow border border-slate-100 text-center relative group">
                            <div className={`w-24 h-24 mx-auto ${step.bg} rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                                <step.icon className={`w-10 h-10 ${step.color}`} />
                            </div>
                            <div className="absolute top-8 right-8 text-6xl font-black text-slate-50 opacity-50 z-0 select-none">
                                {index + 1}
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-3 relative z-10">
                                {step.title}
                            </h3>
                            <p className="text-slate-600 leading-relaxed relative z-10">
                                {step.desc}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
