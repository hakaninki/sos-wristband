import Link from "next/link";
import { TranslationKeys } from "../../(public)/translations";

interface FooterProps {
    t: TranslationKeys["footer"];
}

export default function Footer({ t }: FooterProps) {
    return (
        <footer className="bg-slate-50 border-t border-slate-200 pt-20 pb-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Final CTA */}
                <div className="bg-slate-900 rounded-3xl p-8 md:p-16 text-center mb-16 shadow-xl relative overflow-hidden">
                    {/* Decorative Gradients */}
                    <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-blue-600/30 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 bg-emerald-600/30 rounded-full blur-3xl"></div>

                    <div className="relative z-10 max-w-2xl mx-auto">
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-8">
                            {t.ctaTitle}
                        </h2>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link
                                href="/contact"
                                className="inline-flex items-center justify-center px-8 py-4 text-lg font-bold rounded-2xl text-blue-900 bg-white hover:bg-blue-50 transition-colors"
                            >
                                {t.ctaButton1}
                            </Link>
                            <Link
                                href="#demo"
                                className="inline-flex items-center justify-center px-8 py-4 text-lg font-bold rounded-2xl text-white border border-slate-600 hover:bg-slate-800 transition-colors"
                            >
                                {t.ctaButton2}
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Footer Bottom */}
                <div className="flex flex-col md:flex-row justify-between items-center gap-6 border-t border-slate-200 pt-8 text-sm text-slate-500">
                    <p>{t.copyright}</p>
                    <div className="flex gap-6">
                        <Link href="#" className="hover:text-slate-900 transition-colors">
                            {t.privacy}
                        </Link>
                        <Link href="#" className="hover:text-slate-900 transition-colors">
                            {t.terms}
                        </Link>
                        <Link href="#" className="hover:text-slate-900 transition-colors">
                            {t.kvkk}
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
