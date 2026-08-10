import "../../../styles/tailwind.css";

import * as React from "react";

import { IIkaFooterProps } from "../../../models/IChromeModels";
import { Icon } from "../../../common/utils/Icon";
import { SocialIcon } from "./SocialIcon";

/**
 * IkaFooter — port 1:1 du footer de la maquette Next.js
 * (components/layout/site-footer.tsx).
 *
 * Structure identique : bloc société + Liens rapides + Informations légales,
 * icônes sociales avec couleurs de marque au survol, copyright et barre
 * décorative accent.
 */

const QUICK_LINKS: { label: string; href: string }[] = [
  { label: "Accueil", href: "#accueil" },
  { label: "À propos", href: "#histoire" },
  { label: "Services", href: "#documents" },
  { label: "Contact", href: "#equipe" },
];

const LEGAL_LINKS: { label: string; href: string }[] = [
  { label: "Mentions légales", href: "#faq" },
  { label: "Politique de confidentialité", href: "#faq" },
  { label: "Conditions d'utilisation", href: "#faq" },
];

const SOCIALS: {
  network: "facebook" | "instagram" | "twitter" | "linkedin" | "whatsapp";
  href: string;
}[] = [
  { network: "facebook", href: "https://facebook.com" },
  { network: "instagram", href: "https://instagram.com" },
  { network: "twitter", href: "https://twitter.com" },
  { network: "linkedin", href: "https://linkedin.com" },
  { network: "whatsapp", href: "https://whatsapp.com" },
];

const LinkColumn: React.FC<{
  title: string;
  links: { label: string; href: string }[];
}> = (props) => (
  <div>
    <h3 className="ika-relative ika-mb-4 ika-inline-block ika-text-lg ika-font-semibold">
      {props.title}
      <span
        aria-hidden="true"
        className="ika-absolute ika-bottom-0 ika-left-0 ika-h-0.5 ika-w-12 ika-bg-gradient-to-r ika-from-brand-accent ika-to-transparent"
      />
    </h3>
    <ul className="ika-space-y-3">
      {props.links.map((link) => (
        <li key={link.href}>
          <a
            href={link.href}
            data-interception="propagate"
            className="ika-group ika-flex ika-items-center ika-gap-2 ika-text-sm ika-text-gray-300 ika-transition-colors hover:ika-text-brand-accent"
          >
            <span
              aria-hidden="true"
              className="ika-h-0.5 ika-w-0 ika-bg-brand-accent ika-transition-all ika-duration-300 group-hover:ika-w-2"
            />
            {link.label}
          </a>
        </li>
      ))}
    </ul>
  </div>
);

export const IkaFooter: React.FC<IIkaFooterProps> = (props) => {
  const { company, description, logoUrl } = props;

  const year =
    company && company.copyrightYears
      ? company.copyrightYears
      : String(new Date().getFullYear());
  const social = company ? company.social : {};

  return (
    <div className="ika-root">
      <footer className="ika-mt-auto ika-border-t ika-border-brand-navy/20 ika-bg-gradient-to-br ika-from-brand-navy ika-via-brand-navy ika-to-brand-navy/95 ika-text-white">
        <div className="ika-mx-auto ika-max-w-7xl ika-px-6 ika-py-12 lg:ika-py-16">
          {/* Contenu principal */}
          <div className="ika-mb-12 ika-grid ika-grid-cols-1 ika-gap-10 md:ika-grid-cols-2 lg:ika-grid-cols-4 lg:ika-gap-12">
            {/* Société */}
            <div className="ika-space-y-6 lg:ika-col-span-2">
              <div className="ika-flex ika-items-center ika-space-x-3">
                <div className="ika-relative ika-group">
                  <div
                    aria-hidden="true"
                    className="ika-absolute ika--inset-1 ika-rounded-lg ika-bg-gradient-to-r ika-from-brand-accent ika-to-blue-500 ika-blur ika-opacity-25 ika-transition ika-duration-300 group-hover:ika-opacity-50"
                  />
                  <div className="ika-relative ika-rounded-lg ika-bg-white ika-p-1">
                    {logoUrl ? (
                      <img
                        src={logoUrl}
                        alt="IKA Solution Logo"
                        className="ika-h-11 ika-w-11 ika-object-contain"
                      />
                    ) : (
                      <span className="ika-grid ika-h-11 ika-w-11 ika-place-items-center ika-rounded ika-bg-brand-navy ika-text-sm ika-font-black ika-text-white">
                        IKA
                      </span>
                    )}
                  </div>
                </div>
                <span className="ika-bg-gradient-to-r ika-from-white ika-to-gray-300 ika-bg-clip-text ika-text-xl ika-font-bold ika-text-transparent">
                  IKA Solution
                </span>
              </div>

              <p className="ika-max-w-md ika-text-sm ika-leading-relaxed ika-text-gray-300">
                {description ||
                  "L'intranet « IKA Solution » est votre passerelle vers un univers de connaissances, de collaboration et d'innovation. Explorez nos ressources, échangez avec vos collègues et restez informé."}
              </p>

              <div className="ika-space-y-3 ika-text-sm ika-text-gray-300">
                <a
                  href={
                    company && company.email
                      ? `mailto:${company.email}`
                      : "mailto:contact@ikasolution.com"
                  }
                  className="ika-group ika-flex ika-items-center ika-gap-3 ika-transition-colors hover:ika-text-brand-accent"
                >
                  <Icon
                    name="fa-envelope"
                    className="ika-h-4 ika-w-4 ika-text-brand-accent ika-transition-transform group-hover:ika-scale-110"
                  />
                  <span>{company && company.email ? company.email : "contact@ikasolution.com"}</span>
                </a>
              </div>
            </div>

            {/* Liens rapides */}
            <LinkColumn title="Liens rapides" links={QUICK_LINKS} />

            {/* Informations légales */}
            <LinkColumn title="Informations légales" links={LEGAL_LINKS} />
          </div>

          {/* Divider */}
          <div aria-hidden="true" className="ika-mb-8 ika-border-t ika-border-white/10" />

          {/* Bas de page */}
          <div className="ika-flex ika-flex-col ika-items-center ika-justify-between ika-gap-6 md:ika-flex-row">
            {/* Réseaux sociaux */}
            <div className="ika-flex ika-items-center ika-gap-3">
              {SOCIALS.map((item) => (
                <SocialIcon
                  key={item.network}
                  network={item.network}
                  url={
                    (social[item.network as keyof typeof social] as string) ||
                    item.href
                  }
                />
              ))}
            </div>

            {/* Copyright */}
            <p className="ika-text-center ika-text-sm ika-text-gray-400 md:ika-text-right">
              © {year} IKA Solution. Tous droits réservés.
            </p>
          </div>
        </div>

        {/* Barre décorative */}
        <div
          aria-hidden="true"
          className="ika-h-1 ika-bg-gradient-to-r ika-from-transparent ika-via-brand-accent ika-to-transparent ika-opacity-50"
        />
      </footer>
    </div>
  );
};
