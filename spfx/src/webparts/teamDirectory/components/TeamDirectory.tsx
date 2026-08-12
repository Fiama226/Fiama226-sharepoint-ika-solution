import * as React from "react";

import { ITeamDirectoryProps } from "./ITeamDirectoryProps";
import { Icon } from "../../../common/utils/Icon";
import {
  buildImageUrl,
  buildUserPhotoUrl,
  cn,
} from "../../../common/utils/spUtils";

const COLUMN_CLASSES: Record<number, string> = {
  1: "",
  2: "sm:ika-grid-cols-2",
  3: "sm:ika-grid-cols-2 lg:ika-grid-cols-3",
  4: "sm:ika-grid-cols-2 lg:ika-grid-cols-4",
};

function initials(name: string): string {
  return name
    .split(" ")
    .filter((part) => part.length > 0)
    .map((part) => part.charAt(0))
    .join("")
    .substring(0, 2)
    .toUpperCase();
}

const Avatar: React.FC<{
  name: string;
  photoUrl?: string;
  showPhoto: boolean;
}> = (props) => {
  const [failed, setFailed] = React.useState<boolean>(false);
  const usePhoto = props.showPhoto && !!props.photoUrl && !failed;

  if (usePhoto) {
    return (
      <img
        src={props.photoUrl}
        alt=""
        loading="lazy"
        onError={() => setFailed(true)}
        className="ika-h-11 ika-w-11 ika-shrink-0 ika-rounded-full ika-object-cover"
      />
    );
  }

  return (
    <span
      aria-hidden="true"
      className="ika-grid ika-h-11 ika-w-11 ika-shrink-0 ika-place-items-center ika-rounded-full ika-bg-brand-navy ika-text-sm ika-font-semibold ika-text-white"
    >
      {initials(props.name)}
    </span>
  );
};

const Skeleton: React.FC<{ columns: number }> = (props) => (
  <ul
    className={cn(
      "ika-mt-4 ika-grid ika-gap-3 ika-animate-pulse",
      COLUMN_CLASSES[props.columns] || COLUMN_CLASSES[3]
    )}
    aria-hidden="true"
  >
    {[0, 1, 2].map((index) => (
      <li
        key={index}
        className="ika-flex ika-items-start ika-gap-3 ika-rounded-lg ika-border ika-border-brand-line ika-bg-white ika-p-4"
      >
        <span className="ika-h-11 ika-w-11 ika-shrink-0 ika-rounded-full ika-bg-slate-200" />
        <span className="ika-min-w-0 ika-flex-1 ika-space-y-2">
          <span className="ika-block ika-h-4 ika-w-2/3 ika-rounded ika-bg-slate-200" />
          <span className="ika-block ika-h-3 ika-w-1/2 ika-rounded ika-bg-slate-100" />
          <span className="ika-block ika-h-3 ika-w-full ika-rounded ika-bg-slate-100" />
        </span>
      </li>
    ))}
  </ul>
);

export const TeamDirectory: React.FC<ITeamDirectoryProps> = (props) => {
  const { title, members, loading, error, columns, showPhotos } = props;

  const renderBody = (): React.ReactElement => {
    if (loading) return <Skeleton columns={columns} />;

    if (error) {
      return (
        <div
          role="alert"
          className="ika-mt-4 ika-rounded-lg ika-border ika-border-red-200 ika-bg-red-50 ika-p-6"
        >
          <p className="ika-text-sm ika-font-medium ika-text-red-800">{error}</p>
        </div>
      );
    }

    if (!members || members.length === 0) {
      return (
        <div className="ika-mt-4 ika-rounded-lg ika-border ika-border-dashed ika-border-brand-line ika-bg-white ika-p-8 ika-text-center">
          <p className="ika-text-sm ika-text-brand-muted">
            Aucun collaborateur à afficher.
          </p>
        </div>
      );
    }

    return (
      <ul
        className={cn(
          "ika-mt-4 ika-grid ika-gap-3",
          COLUMN_CLASSES[columns] || COLUMN_CLASSES[3]
        )}
      >
        {members.map((member) => {
          const fromList = member.Photo ? buildImageUrl(member.Photo, 96) : "";
          const photo = fromList || buildUserPhotoUrl(member.Email, "M");

          return (
            <li key={member.Id}>
              <article className="ika-flex ika-h-full ika-items-start ika-gap-3 ika-rounded-lg ika-border ika-border-brand-line ika-bg-white ika-p-4 ika-transition-colors hover:ika-border-brand-cyan">
                <Avatar
                  name={member.Title}
                  photoUrl={photo}
                  showPhoto={showPhotos}
                />

                <div className="ika-min-w-0">
                  <p className="ika-font-medium ika-text-brand-ink">
                    {member.Title}
                  </p>
                  <p className="ika-text-sm ika-text-brand-muted">
                    {member.JobTitle}
                  </p>

                  <dl className="ika-mt-2 ika-space-y-0.5 ika-text-xs ika-text-brand-muted">
                    {member.Email ? (
                      <div className="ika-flex ika-items-center ika-gap-1.5">
                        <dt className="ika-sr-only">Email</dt>
                        <Icon name="Mail" className="ika-h-3.5 ika-w-3.5" />
                        <dd className="ika-min-w-0">
                          <a
                            href={`mailto:${member.Email}`}
                            className="ika-block ika-truncate hover:ika-text-brand-cyan-dark hover:ika-underline"
                          >
                            {member.Email}
                          </a>
                        </dd>
                      </div>
                    ) : null}

                    {member.Phone ? (
                      <div className="ika-flex ika-items-center ika-gap-1.5">
                        <dt className="ika-sr-only">Téléphone</dt>
                        <Icon name="Phone" className="ika-h-3.5 ika-w-3.5" />
                        <dd>
                          <a
                            href={`tel:${member.Phone.replace(/\s/g, "")}`}
                            className="hover:ika-text-brand-cyan-dark hover:ika-underline"
                          >
                            {member.Phone}
                          </a>
                        </dd>
                      </div>
                    ) : null}

                    {member.OfficeLocation ? (
                      <div className="ika-flex ika-items-center ika-gap-1.5">
                        <dt className="ika-sr-only">Localisation</dt>
                        <Icon name="MapPin" className="ika-h-3.5 ika-w-3.5" />
                        <dd className="ika-truncate">{member.OfficeLocation}</dd>
                      </div>
                    ) : null}
                  </dl>
                </div>
              </article>
            </li>
          );
        })}
      </ul>
    );
  };

  return (
    <div className="ika-root">
      <section aria-labelledby="ika-team-title">
        <h2
          id="ika-team-title"
          className="ika-text-lg ika-font-semibold ika-text-brand-navy"
        >
          {title}
        </h2>
        {renderBody()}
      </section>
    </div>
  );
};
