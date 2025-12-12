import Image from "next/image";
import { TranslationKeys } from "../../(public)/translations";

interface WhySosSectionProps {
    t: TranslationKeys["whySos"];
}

export default function WhySosSection({ t }: WhySosSectionProps) {
    return (
        <section className="py-20 bg-white relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col lg:flex-row items-center gap-16">
                    {/* Text Content */}
                    <div className="flex-1 space-y-6">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-sm font-bold uppercase tracking-wider">
                            Signal Of Safety
                        </div>
                        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 leading-tight">
                            {t.title}
                        </h2>
                        <div className="space-y-4 text-lg text-slate-600 leading-relaxed">
                            <p>{t.description1}</p>
                            <p className="font-medium text-slate-800 border-l-4 border-blue-500 pl-4">
                                {t.description2}
                            </p>
                        </div>
                    </div>

                    {/* Visual */}
                    <div className="flex-1 w-full relative flex justify-center lg:justify-end">
                        <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-orange-100 rounded-full z-[-1]"></div>
                        <div className="absolute -top-6 -left-6 w-32 h-32 bg-blue-50 rounded-full z-[-1]"></div>

                        <Image
                            src="/assets/hiw-section.png"
                            alt="How Signal Of Safety works"
                            width={600}
                            height={450}
                            className="w-full h-auto max-w-xl rounded-2xl shadow-2xl border border-slate-100"
                            unoptimized
                        />
                    </div>
                </div>
            </div>
        </section>
    );
}
