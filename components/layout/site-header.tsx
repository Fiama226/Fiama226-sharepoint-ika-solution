"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import {
  Home,
  Calculator,
  Shield,
  Users,
  Wrench,
  Calendar,
  GitBranch,
  BookOpen,
  ChevronDown,
  Bell,
  Search,
  Menu,
  X,
  FolderOpen,
} from "lucide-react";

// --- DONNÉES (Conservées pour votre logique métier) ---
const PRIMARY_NAV = [
  { href: "/", label: "Accueil", icon: Home },
  { href: "/comptabilite", label: "Comptabilité", icon: Calculator },
  { href: "/administration", label: "Administration", icon: Shield },
  { href: "/commerciaux", label: "Commerciaux", icon: Users },
  { href: "/techniciens", label: "Techniciens", icon: Wrench },
];

const SECONDARY_NAV = [
  { href: "/organigramme", label: "Organigramme", icon: GitBranch },
  { href: "/agenda", label: "Agenda", icon: Calendar },
  { href: "/histoire", label: "Histoire", icon: BookOpen },
];

const DEPARTMENT_DOCS = {
  comptabilite: {
    name: "Comptabilité",
    icon: Calculator,
    color: "blue",
    totalDocs: 24,
  },
  administration: {
    name: "Administration",
    icon: Shield,
    color: "purple",
    totalDocs: 18,
  },
  commerciaux: {
    name: "Commerciaux",
    icon: Users,
    color: "green",
    totalDocs: 32,
  },
  techniciens: {
    name: "Techniciens",
    icon: Wrench,
    color: "orange",
    totalDocs: 45,
  },
};

const DOCS_STATS = { total: 119 };

// --- COMPOSANT ---
export default function SiteHeader() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isDocsMenuOpen, setIsDocsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const profileRef = useRef<HTMLDivElement>(null);
  const docsMenuRef = useRef<HTMLDivElement>(null);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  // Fermeture des dropdowns au clic extérieur
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target as Node)
      ) {
        setIsProfileOpen(false);
      }
      if (
        docsMenuRef.current &&
        !docsMenuRef.current.contains(event.target as Node)
      ) {
        setIsDocsMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/80 backdrop-blur-md">
      <div className="mx-auto max-w-7xl">
        {/* Barre supérieure subtile (Navigation secondaire) */}
        <div className="hidden lg:flex items-center justify-between px-6 h-10 bg-gray-50/50 border-b border-gray-100 text-sm">
          <Link href="/" className="flex-shrink-0 w-[260px]">
            <span className="sr-only">IKA Solution</span>
          </Link>
          <nav className="flex items-center gap-6">
            {SECONDARY_NAV.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-1.5 transition-colors ${
                    isActive(item.href)
                      ? "text-blue-700 font-medium"
                      : "text-gray-500 hover:text-blue-600"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Barre principale */}
        <div className="flex items-center justify-between px-4 sm:px-6 lg:px-8 h-16">
          {/* Gauche : Logo + Navigation Principale */}
          <div className="flex items-center gap-6 lg:gap-8">
            <Link href="/" className="flex-shrink-0">
              <span className="sr-only">IKA Solution</span>
              <Image
                src="/assets/logo.png"
                alt="Logo IKA Solution"
                width={260}
                height={250}
                priority
                className="h-16 W-16 w-auto object-contain"
              />
            </Link>
          </div>

          {/* Droite : Recherche + Actions */}
          <div className="flex items-center gap-2">
            {/* Barre de recherche style "Command Palette" */}
            <div className="hidden md:flex items-center relative group">
              <Search className="absolute left-3 w-4 h-4 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
              <input
                type="text"
                placeholder="Rechercher..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-8 py-2 w-56 lg:w-64 bg-gray-100 border border-transparent text-sm rounded-full focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none"
              />
              <kbd className="absolute right-3 hidden lg:inline-block px-1.5 py-0.5 text-[10px] font-semibold text-gray-400 bg-gray-200 rounded border border-gray-300">
                ⌘K
              </kbd>
            </div>

            {/* Dropdown Documents Simplifié */}
            <div className="relative" ref={docsMenuRef}>
              <button
                onClick={() => setIsDocsMenuOpen(!isDocsMenuOpen)}
                className={`flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                  isDocsMenuOpen
                    ? "bg-blue-50 text-blue-700"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                }`}
              >
                <FolderOpen className="w-4 h-4" />
                <span className="hidden xl:inline">Documents</span>
                <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full font-semibold">
                  {DOCS_STATS.total}
                </span>
              </button>

              {isDocsMenuOpen && (
                <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50">
                  <div className="px-4 py-2 border-b border-gray-100 mb-1">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Bibliothèque
                    </p>
                  </div>
                  {Object.entries(DEPARTMENT_DOCS).map(([key, dept]) => {
                    const Icon = dept.icon;
                    return (
                      <Link
                        key={key}
                        href={`/${key}/documents`}
                        onClick={() => setIsDocsMenuOpen(false)}
                        className="flex items-center justify-between px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors group"
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`p-1.5 rounded-lg bg-${dept.color}-50 text-${dept.color}-600 group-hover:bg-white transition-colors`}
                          >
                            <Icon className="w-4 h-4" />
                          </div>
                          <span className="font-medium">{dept.name}</span>
                        </div>
                        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full group-hover:bg-blue-100 group-hover:text-blue-700 transition-colors">
                          {dept.totalDocs}
                        </span>
                      </Link>
                    );
                  })}
                  <div className="mt-2 border-t border-gray-100 pt-2">
                    <Link
                      href="/documents"
                      onClick={() => setIsDocsMenuOpen(false)}
                      className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg mx-2 transition-colors"
                    >
                      <FolderOpen className="w-4 h-4" />
                      Voir toute la bibliothèque
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Notifications */}
            <button
              className="relative p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-900 rounded-lg transition-colors"
              aria-label="Notifications"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>

            {/* Profil Utilisateur */}
            <div className="relative hidden md:block" ref={profileRef}>
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-2 p-1 pr-3 rounded-full hover:bg-gray-100 transition-colors border border-gray-200"
              >
                <Image
                  src="/assets/team/landry.jpeg"
                  alt="User"
                  width={32}
                  height={32}
                  className="w-8 h-8 rounded-full object-cover"
                />
                <ChevronDown
                  className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${
                    isProfileOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50">
                  <div className="px-4 py-3 border-b border-gray-100">
                    <p className="text-sm font-semibold text-gray-900">
                      Landry
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      landry@ikasolution.com
                    </p>
                  </div>
                  <Link
                    href="/profile"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-blue-700 transition-colors"
                  >
                    Mon profil
                  </Link>
                  <Link
                    href="/settings"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-blue-700 transition-colors"
                  >
                    Paramètres
                  </Link>
                  <hr className="my-2 border-gray-100" />
                  <button className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors">
                    Déconnexion
                  </button>
                </div>
              )}
            </div>

            {/* Bouton Menu Mobile */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Menu Mobile Épuré */}
        {isMenuOpen && (
          <div className="lg:hidden absolute top-16 left-0 right-0 bg-white border-b border-gray-200 shadow-xl max-h-[calc(100vh-4rem)] overflow-y-auto z-40">
            <div className="p-4 space-y-4">
              {/* Recherche Mobile */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Rechercher..."
                  className="w-full pl-9 pr-4 py-2.5 bg-gray-100 border-transparent rounded-lg text-sm focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              {/* Navigation Principale */}
              <div className="space-y-1">
                {PRIMARY_NAV.map((item) => {
                  const Icon = item.icon;
                  const active = isActive(item.href);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setIsMenuOpen(false)}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                        active
                          ? "bg-blue-50 text-blue-700"
                          : "text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      {item.label}
                    </Link>
                  );
                })}
              </div>

              <hr className="border-gray-100" />

              {/* Navigation Secondaire */}
              <div className="space-y-1">
                <p className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
                  Ressources
                </p>
                {SECONDARY_NAV.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors"
                    >
                      <Icon className="w-5 h-5" />
                      {item.label}
                    </Link>
                  );
                })}
              </div>

              <hr className="border-gray-100" />

              {/* Profil Mobile */}
              <div className="flex items-center gap-3 px-3 py-3 bg-gray-50 rounded-xl">
                <Image
                  src="/assets/team/landry.jpeg"
                  alt="User"
                  width={40}
                  height={40}
                  className="w-10 h-10 rounded-full object-cover border border-gray-200"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    Landry
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    landry@ikasolution.com
                  </p>
                </div>
                <Link
                  href="/profile"
                  onClick={() => setIsMenuOpen(false)}
                  className="p-2 text-gray-500 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  <ChevronDown className="w-4 h-4 rotate-[-90deg]" />
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
