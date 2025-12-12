import { Users, Database, Globe } from "lucide-react";
import { TranslationKeys } from "../../(public)/translations";

interface SchoolManagementSectionProps {
    t: TranslationKeys["panel"];
}

export default function SchoolManagementSection({ t }: SchoolManagementSectionProps) {
    const features = [
        {
            icon: Users,
            title: t.roleBased.title,
            desc: t.roleBased.desc,
        },
        {
            icon: Database,
            title: t.easyData.title,
            desc: t.easyData.desc,
        },
        {
            icon: Globe,
            title: t.multiTenant.title,
            desc: t.multiTenant.desc,
        },
    ];

    return (
        <section id="panel" className="py-20 bg-slate-900 overflow-hidden relative">
            {/* Background elements */}
            <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
            <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 bg-emerald-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="flex flex-col lg:flex-row items-center gap-16">
                    {/* Visual / Mockup Side */}
                    <div className="flex-1 w-full order-2 lg:order-1">
                        <div className="relative rounded-xl bg-slate-800 border border-slate-700 shadow-2xl p-2 md:p-4 rotate-1 lg:rotate-2 hover:rotate-0 transition-all duration-500">
                            {/* Mock Panel UI */}
                            <div className="bg-slate-900 rounded-lg overflow-hidden min-h-[300px] flex flex-col">
                                {/* Header */}
                                <div className="h-12 border-b border-slate-800 flex items-center px-4 space-x-2">
                                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                                </div>
                                {/* Body */}
                                <div className="flex-1 p-6 grid grid-cols-12 gap-4">
                                    {/* Sidebar */}
                                    <div className="col-span-3 space-y-2 hidden sm:block">
                                        <div className="h-2 w-20 bg-slate-800 rounded"></div>
                                        <div className="h-2 w-16 bg-slate-800 rounded"></div>
                                        <div className="h-2 w-24 bg-slate-800 rounded"></div>
                                    </div>
                                    {/* Main Content */}
                                    <div className="col-span-12 sm:col-span-9 space-y-4">
                                        <div className="h-8 w-1/3 bg-blue-600/20 rounded"></div>
                                        <div className="space-y-2">
                                            <div className="h-12 w-full bg-slate-800/50 rounded flex items-center px-4">
                                                <div className="h-2 w-8 bg-slate-700 rounded mr-4"></div>
                                                <div className="h-2 w-32 bg-slate-700 rounded"></div>
                                            </div>
                                            <div className="h-12 w-full bg-slate-800/50 rounded flex items-center px-4">
                                                <div className="h-2 w-8 bg-slate-700 rounded mr-4"></div>
                                                <div className="h-2 w-32 bg-slate-700 rounded"></div>
                                            </div>
                                            <div className="h-12 w-full bg-slate-800/50 rounded flex items-center px-4">
                                                <div className="h-2 w-8 bg-slate-700 rounded mr-4"></div>
                                                <div className="h-2 w-32 bg-slate-700 rounded"></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Text Side */}
                    <div className="flex-1 space-y-8 order-1 lg:order-2">
                        <div>
                            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                                {t.title}
                            </h2>
                            <p className="text-lg text-slate-400 leading-relaxed">
                                {t.subtitle}
                            </p>
                        </div>

                        <div className="space-y-6">
                            {features.map((feature, index) => (
                                <div key={index} className="flex gap-4">
                                    <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center border border-slate-700">
                                        <feature.icon className="w-6 h-6 text-blue-400" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-white mb-2">
                                            {feature.title}
                                        </h3>
                                        <p className="text-slate-400 leading-relaxed">
                                            {feature.desc}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
