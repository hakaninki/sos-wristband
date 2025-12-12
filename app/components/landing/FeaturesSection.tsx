import { BatteryCharging, Smartphone, Droplets, Smile } from "lucide-react";
import { TranslationKeys } from "../../(public)/translations";

interface FeaturesSectionProps {
    t: TranslationKeys["features"];
}

export default function FeaturesSection({ t }: FeaturesSectionProps) {
    const features = [
        {
            icon: BatteryCharging,
            title: t.batteryFree.title,
            desc: t.batteryFree.desc,
            color: "text-emerald-500",
            bg: "bg-emerald-50",
            border: "border-emerald-100"
        },
        {
            icon: Smartphone,
            title: t.hybridTech.title,
            desc: t.hybridTech.desc,
            color: "text-blue-500",
            bg: "bg-blue-50",
            border: "border-blue-100"
        },
        {
            icon: Droplets,
            title: t.waterResistant.title,
            desc: t.waterResistant.desc,
            color: "text-cyan-500",
            bg: "bg-cyan-50",
            border: "border-cyan-100"
        },
        {
            icon: Smile,
            title: t.comfortable.title,
            desc: t.comfortable.desc,
            color: "text-orange-500",
            bg: "bg-orange-50",
            border: "border-orange-100"
        },
    ];

    return (
        <section id="features" className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                        {t.title}
                    </h2>
                    <p className="text-xl text-slate-600">
                        {t.subtitle}
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {features.map((feature, index) => (
                        <div key={index} className={`p-8 rounded-2xl ${feature.bg} border ${feature.border} hover:shadow-lg transition-all duration-300 group`}>
                            <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <feature.icon className={`w-6 h-6 ${feature.color}`} />
                            </div>
                            <h3 className="text-lg font-bold text-slate-900 mb-3">
                                {feature.title}
                            </h3>
                            <p className="text-slate-600 text-sm leading-relaxed">
                                {feature.desc}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
