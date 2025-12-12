import { ShieldSubtle, Server, Lock } from "lucide-react"; // Custom icon names
import { EyeOff, ShieldCheck, LockKeyhole } from "lucide-react";
import { TranslationKeys } from "../../(public)/translations";

interface SecuritySectionProps {
    t: TranslationKeys["security"];
}

export default function SecuritySection({ t }: SecuritySectionProps) {
    const cards = [
        {
            icon: EyeOff,
            title: t.minimalInfo.title,
            desc: t.minimalInfo.desc,
        },
        {
            icon: Server,
            title: t.secureInfra.title,
            desc: t.secureInfra.desc,
        },
        {
            icon: ShieldCheck,
            title: t.authAccess.title,
            desc: t.authAccess.desc,
        },
    ];

    return (
        <section id="security" className="py-20 bg-slate-50 border-t border-slate-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 mb-6">
                        <LockKeyhole className="w-8 h-8 text-blue-600" />
                    </div>
                    <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                        {t.title}
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {cards.map((card, index) => (
                        <div key={index} className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:border-blue-200 transition-colors">
                            <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center mb-6">
                                <card.icon className="w-6 h-6 text-slate-700" />
                            </div>
                            <h3 className="text-lg font-bold text-slate-900 mb-3">
                                {card.title}
                            </h3>
                            <p className="text-slate-600 leading-relaxed">
                                {card.desc}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
