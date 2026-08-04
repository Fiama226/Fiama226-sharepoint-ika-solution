import "../../../styles/tailwind.css";

import * as React from "react";

import { IIkaFooterProps } from "../../../models/IChromeModels";
import { SocialIcon, SocialNetwork } from "./SocialIcon";

const NETWORKS: SocialNetwork[] = [
  "facebook",
  "instagram",
  "twitter",
  "linkedin",
  "whatsapp",
];

export const IkaFooter: React.FC<IIkaFooterProps> = (props) => {
  const { company, description, logoUrl } = props;

  const social = company ? company.social : {};
  const year =
    company && company.copyrightYears
      ? company.copyrightYears
      : String(new Date().getFullYear());

  const hasSocial = NETWORKS.some(
    (network) => !!social[network as keyof typeof social]
  );

  return (
    <div className="ika-root">
      <footer className="ika-mt-16 ika-border-t ika-border-brand-navy/20 ika-bg-brand-navy ika-text-white">
        <div className="ika-mx-auto ika-flex ika-max-w-7xl ika-flex-col ika-items-center ika-px-6 ika-py-14">
          <img
            src={logoUrl}
            alt=""
            className="ika-mb-6 ika-h-11 ika-w-auto ika-object-contain"
          />

          <p className="ika-max-w-xl ika-text-center ika-text-sm ika-leading-relaxed">
            {description}
          </p>

          {hasSocial ? (
            <div className="ika-mt-6 ika-flex ika-items-center ika-gap-4">
              {NETWORKS.map((network) => (
                <SocialIcon
                  key={network}
                  network={network}
                  url={(social[network as keyof typeof social] as string) || ""}
                />
              ))}
            </div>
          ) : null}

          {company && (company.email || company.phone || company.address) ? (
            <div className="ika-mt-6 ika-flex ika-flex-wrap ika-items-center ika-justify-center ika-gap-x-6 ika-gap-y-2 ika-text-sm ika-text-white/80">
              {company.address ? <span>{company.address}</span> : null}
              {company.email ? (
                <a
                  href={`mailto:${company.email}`}
                  className="hover:ika-text-brand-cyan hover:ika-underline"
                >
                  {company.email}
                </a>
              ) : null}
              {company.phone ? (
                <a
                  href={`tel:${company.phone.replace(/\s/g, "")}`}
                  className="hover:ika-text-brand-cyan hover:ika-underline"
                >
                  {company.phone}
                </a>
              ) : null}
            </div>
          ) : null}

          <div className="ika-mt-8 ika-border-t ika-border-white/10 ika-pt-8">
            <p className="ika-text-center ika-text-sm">
              © {year}
              {company && company.legalName ? ` ${company.legalName}` : ""}. Tous
              droits réservés.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};
