import Link from "next/link";
import Image from "next/image";
import { Menu, Globe, ChevronDown } from "lucide-react";
import { useState } from "react";
import { Language, TranslationKeys } from "../../(public)/translations";

interface NavbarProps {
    lang: Language;
    setLang: (lang: Language) => void;
    t: TranslationKeys["nav"];
}

export default function Navbar({ lang, setLang, t }: NavbarProps) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isLangOpen, setIsLangOpen] = useState(false);

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
    const toggleLang = () => setIsLangOpen(!isLangOpen);

    const handleLangSelect = (selected: Language) => {
        setLang(selected);
        setIsLangOpen(false);
    };

    return (
        <nav className="fixed w-full z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-20">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2">
                        <div className="relative">
                            <Image
                                src="/assets/sos-logo.png"
                                alt="Signal Of Safety logo"
                                width={160}
                                height={40}
                                className="h-10 w-auto"
                                priority
                                unoptimized
                            />
                        </div>
                        <span className="text-xl font-bold bg-gradient-to-r from-blue-700 to-teal-600 bg-clip-text text-transparent">
                            Signal Of Safety
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-8">
                        <Link href="#how-it-works" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">
                            {t.howItWorks}
                        </Link>
                        <Link href="#features" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">
                            {t.features}
                        </Link>
                        <Link href="#panel" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">
                            {t.panel}
                        </Link>
                        <Link href="#security" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">
                            {t.security}
                        </Link>

                        {/* Language Selector */}
                        <div className="relative">
                            <button
                                onClick={toggleLang}
                                className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-slate-700 bg-slate-50 hover:bg-slate-100 rounded-lg transition-colors"
                            >
                                <Globe className="w-4 h-4 text-slate-500" />
                                <span className="uppercase">{lang}</span>
                                <ChevronDown className={`w-3 h-3 text-slate-400 transition-transform ${isLangOpen ? 'rotate-180' : ''}`} />
                            </button>

                            {isLangOpen && (
                                <>
                                    <div
                                        className="fixed inset-0 z-10"
                                        onClick={() => setIsLangOpen(false)}
                                    ></div>
                                    <div className="absolute right-0 top-full mt-2 w-24 bg-white rounded-xl shadow-xl border border-slate-100 py-1 z-20 overflow-hidden">
                                        {(['tr', 'en', 'de'] as Language[]).map((l) => (
                                            <button
                                                key={l}
                                                onClick={() => handleLangSelect(l)}
                                                className={`w-full text-left px-4 py-2 text-sm font-medium hover:bg-slate-50 transition-colors ${lang === l ? 'text-blue-600 bg-blue-50/50' : 'text-slate-700'}`}
                                            >
                                                {l.toUpperCase()}
                                            </button>
                                        ))}
                                    </div>
                                </>
                            )}
                        </div>

                        {/* CTA */}
                        <Link
                            href="/login"
                            className="hidden lg:inline-flex px-5 py-2.5 text-sm font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-all shadow-md hover:shadow-lg"
                        >
                            {t.login}
                        </Link>
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden flex items-center gap-4">
                        {/* Mobile Language Selector (Simplified) */}
                        <button
                            onClick={() => {
                                const langs: Language[] = ['en', 'tr', 'de'];
                                const nextIndex = (langs.indexOf(lang) + 1) % langs.length;
                                setLang(langs[nextIndex]);
                            }}
                            className="flex items-center gap-1 px-2 py-1.5 text-xs font-bold text-slate-700 bg-slate-100 rounded-md"
                        >
                            <Globe className="w-3 h-3" />
                            {lang.toUpperCase()}
                        </button>

                        <button
                            onClick={toggleMenu}
                            className="p-2 text-slate-600 hover:text-slate-900 transition-colors"
                        >
                            <Menu className="w-6 h-6" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="md:hidden border-t border-slate-100 bg-white">
                    <div className="px-4 py-6 space-y-4">
                        <Link
                            href="#how-it-works"
                            onClick={() => setIsMenuOpen(false)}
                            className="block text-base font-semibold text-slate-600 hover:text-blue-600"
                        >
                            {t.howItWorks}
                        </Link>
                        <Link
                            href="#features"
                            onClick={() => setIsMenuOpen(false)}
                            className="block text-base font-semibold text-slate-600 hover:text-blue-600"
                        >
                            {t.features}
                        </Link>
                        <Link
                            href="#panel"
                            onClick={() => setIsMenuOpen(false)}
                            className="block text-base font-semibold text-slate-600 hover:text-blue-600"
                        >
                            {t.panel}
                        </Link>
                        <Link
                            href="#security"
                            onClick={() => setIsMenuOpen(false)}
                            className="block text-base font-semibold text-slate-600 hover:text-blue-600"
                        >
                            {t.security}
                        </Link>
                        <Link
                            href="/login"
                            onClick={() => setIsMenuOpen(false)}
                            className="block text-base font-bold text-slate-900 hover:text-blue-600"
                        >
                            {t.login}
                        </Link>
                    </div>
                </div>
            )}
        </nav>
    );
}
