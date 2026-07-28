import Image from "next/image";

import {
  FaFacebookF,
  FaInstagram,
  FaXTwitter,
  FaLinkedinIn,
  FaWhatsapp,
} from "react-icons/fa6";

export function SiteFooter() {
  return (
    <footer className="mt-16 border-t border-brand-navy/20 bg-brand-navy text-white">
      <div className="max-w-7xl mx-auto px-6 py-16 flex flex-col items-center">
        <div className="flex items-center space-x-3 mb-6">
          <Image
            alt=""
            className="h-11"
            src="/assets/logo.png"
            width={44}
            height={44}
          />
        </div>

        <p className="text-center max-w-xl text-sm font-normal leading-relaxed">
          L&apos;intranet « IKA Solution » est votre passerelle vers un univers de
          connaissances, de collaboration et d&apos;innovation. Explorez nos
          ressources, échangez avec vos collègues et restez informé des
          dernières actualités au sein de notre organisation.
        </p>

        {/* Social Media Icons */}
        <div className="flex items-center gap-4 mt-6">
          <a
            href="https://facebook.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-brand-accent transition-colors"
          >
            <FaFacebookF size={22} />
          </a>

          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-pink-400 transition-colors"
          >
            <FaInstagram size={22} />
          </a>

          <a
            href="https://twitter.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-sky-400 transition-colors"
          >
            <FaXTwitter size={22} />
          </a>

          <a
            href="https://linkedin.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-blue-500 transition-colors"
          >
            <FaLinkedinIn size={22} />
          </a>

          <a
            href="https://whatsapp.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-green-500 transition-colors"
          >
            <FaWhatsapp size={22} />
          </a>
        </div>

        <div className="border-t border-white/10 mt-8 pt-8">
          <p className="text-center text-sm font-normal">
            ©2026. Tous droits réservés.
          </p>
        </div>
      </div>
    </footer>
  );
}
