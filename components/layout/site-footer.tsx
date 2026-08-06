import Image from "next/image";
import {
  FaFacebookF,
  FaInstagram,
  FaXTwitter,
  FaLinkedinIn,
  FaWhatsapp,
  FaEnvelope,
  FaPhone,
} from "react-icons/fa6";

export function SiteFooter() {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    {
      name: "Facebook",
      icon: FaFacebookF,
      href: "https://facebook.com",
      hoverColor: "hover:bg-[#1877F2] hover:text-white",
      ariaLabel: "Visitez notre page Facebook",
    },
    {
      name: "Instagram",
      icon: FaInstagram,
      href: "https://instagram.com",
      hoverColor:
        "hover:bg-gradient-to-br hover:from-purple-600 hover:to-pink-500 hover:text-white",
      ariaLabel: "Suivez-nous sur Instagram",
    },
    {
      name: "Twitter",
      icon: FaXTwitter,
      href: "https://twitter.com",
      hoverColor: "hover:bg-black hover:text-white",
      ariaLabel: "Suivez-nous sur Twitter",
    },
    {
      name: "LinkedIn",
      icon: FaLinkedinIn,
      href: "https://linkedin.com",
      hoverColor: "hover:bg-[#0A66C2] hover:text-white",
      ariaLabel: "Connectez-vous sur LinkedIn",
    },
    {
      name: "WhatsApp",
      icon: FaWhatsapp,
      href: "https://whatsapp.com",
      hoverColor: "hover:bg-[#25D366] hover:text-white",
      ariaLabel: "Contactez-nous sur WhatsApp",
    },
  ];

  const quickLinks = [
    { label: "Accueil", href: "/" },
    { label: "À propos", href: "/about" },
    { label: "Services", href: "/services" },
    { label: "Contact", href: "/contact" },
  ];

  const legalLinks = [
    { label: "Mentions légales", href: "/legal" },
    { label: "Politique de confidentialité", href: "/privacy" },
    { label: "Conditions d'utilisation", href: "/terms" },
  ];

  return (
    <footer className="mt-auto border-t border-brand-navy/20 bg-gradient-to-br from-brand-navy via-brand-navy to-brand-navy/95 text-white">
      <div className="max-w-7xl mx-auto px-6 py-12 lg:py-16">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12 mb-12">
          {/* Company Info */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center space-x-3">
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-brand-accent to-blue-500 rounded-lg blur opacity-25 group-hover:opacity-50 transition duration-300"></div>
                <div className="relative bg-white rounded-lg p-1">
                  <Image
                    alt="IKA Solution Logo"
                    src="/assets/logo.png"
                    width={44}
                    height={44}
                    className="h-11 w-11"
                  />
                </div>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                IKA Solution
              </span>
            </div>

            <p className="text-gray-300 text-sm leading-relaxed max-w-md">
              L&apos;intranet « IKA Solution » est votre passerelle vers un
              univers de connaissances, de collaboration et d&apos;innovation.
              Explorez nos ressources, échangez avec vos collègues et restez
              informé.
            </p>

            {/* Contact Info */}
            <div className="space-y-3 text-sm text-gray-300">
              <a
                href="mailto:contact@ikasolution.com"
                className="flex items-center gap-3 hover:text-brand-accent transition-colors group"
              >
                <FaEnvelope className="text-brand-accent group-hover:scale-110 transition-transform" />
                <span>contact@ikasolution.com</span>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 relative inline-block">
              Liens rapides
              <span className="absolute bottom-0 left-0 w-12 h-0.5 bg-gradient-to-r from-brand-accent to-transparent"></span>
            </h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-gray-300 hover:text-brand-accent transition-colors text-sm flex items-center gap-2 group"
                  >
                    <span className="w-0 group-hover:w-2 h-0.5 bg-brand-accent transition-all duration-300"></span>
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 relative inline-block">
              Informations légales
              <span className="absolute bottom-0 left-0 w-12 h-0.5 bg-gradient-to-r from-brand-accent to-transparent"></span>
            </h3>
            <ul className="space-y-3">
              {legalLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-gray-300 hover:text-brand-accent transition-colors text-sm flex items-center gap-2 group"
                  >
                    <span className="w-0 group-hover:w-2 h-0.5 bg-brand-accent transition-all duration-300"></span>
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-white/10 mb-8"></div>

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Social Media Icons */}
          <div className="flex items-center gap-3">
            {socialLinks.map((social) => {
              const IconComponent = social.icon;
              return (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.ariaLabel}
                  className={`
                    p-3 rounded-full bg-white/5 backdrop-blur-sm
                    border border-white/10 
                    transition-all duration-300 
                    hover:scale-110 hover:shadow-lg hover:shadow-brand-accent/20
                    hover:-translate-y-1
                    ${social.hoverColor}
                  `}
                >
                  <IconComponent size={18} />
                </a>
              );
            })}
          </div>

          {/* Copyright */}
          <p className="text-gray-400 text-sm text-center md:text-right">
            © {currentYear} IKA Solution. Tous droits réservés.
          </p>
        </div>
      </div>

      {/* Decorative gradient at bottom */}
      <div className="h-1 bg-gradient-to-r from-transparent via-brand-accent to-transparent opacity-50"></div>
    </footer>
  );
}
