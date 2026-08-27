import * as React from "react";

import { INewsDetailProps } from "./INewsDetailProps";
import { IComment, INewsItem } from "../../../models/IIkaModels";
import {
  buildImageUrl,
  buildUserPhotoUrl,
  formatDate,
  sanitizeHtml,
  stripHtml,
} from "../../../common/utils/spUtils";
import { Icon } from "../../../common/utils/Icon";

/**
 * NewsDetail — page de détail d'un article (route `#actualite/{id}`) :
 * article complet + métadonnées (date, auteur, temps de lecture) +
 * commentaires.
 */

const WORDS_PER_MINUTE = 200;

function estimateReadingTime(body: string | undefined): number {
  if (!body) return 0;
  const words = stripHtml(body).trim().split(/\s+/).filter(Boolean);
  return Math.max(1, Math.ceil(words.length / WORDS_PER_MINUTE));
}

function isMeaningfullyUpdated(item: INewsItem): boolean {
  if (!item.Modified) return false;
  const base = item.PublishDate || item.Created;
  if (!base) return false;
  // Comparaison au jour près : SharePoint bumpe `Modified` même sur une
  // resauvegarde sans changement réel.
  return item.Modified.slice(0, 10) !== base.slice(0, 10);
}

export const NewsDetail: React.FC<INewsDetailProps> = (props) => {
  const { newsId, news, getNewsDetail, getComments, postComment } = props;

  const fallbackItem = React.useMemo(
    () => (newsId ? news.find((n) => n.Id === newsId) : undefined),
    [news, newsId]
  );

  const [item, setItem] = React.useState<INewsItem | undefined>(fallbackItem);
  const [loadingDetail, setLoadingDetail] = React.useState<boolean>(!!newsId);

  const [comments, setComments] = React.useState<IComment[]>([]);
  const [loadingComments, setLoadingComments] = React.useState<boolean>(!!newsId);
  const [commentsError, setCommentsError] = React.useState<string | undefined>(
    undefined
  );

  const [draft, setDraft] = React.useState<string>("");
  const [submitting, setSubmitting] = React.useState<boolean>(false);
  const [submitError, setSubmitError] = React.useState<string | undefined>(
    undefined
  );

  React.useEffect(() => {
    setItem(fallbackItem);
    if (!newsId) return undefined;

    let cancelled = false;

    setLoadingDetail(true);
    getNewsDetail(newsId).then(
      (full) => {
        if (!cancelled) {
          if (full) setItem(full);
          setLoadingDetail(false);
        }
      },
      () => {
        if (!cancelled) setLoadingDetail(false);
      }
    );

    setLoadingComments(true);
    setCommentsError(undefined);
    getComments(newsId).then(
      (list) => {
        if (!cancelled) {
          setComments(list);
          setLoadingComments(false);
        }
      },
      () => {
        if (!cancelled) {
          setCommentsError("Impossible de charger les commentaires pour le moment.");
          setLoadingComments(false);
        }
      }
    );

    return () => {
      cancelled = true;
    };
    // Volontairement scopé à `newsId` seul : `news`/`getNewsDetail`/
    // `getComments` sont stables depuis le web part parent et ne doivent
    // pas redéclencher un rechargement à chaque re-render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [newsId]);

  const handleSubmitComment = (e: React.FormEvent): void => {
    e.preventDefault();
    if (!newsId || !draft.trim() || submitting) return;

    setSubmitting(true);
    setSubmitError(undefined);
    postComment(newsId, draft.trim()).then(
      (created) => {
        setComments((prev) => [...prev, created]);
        setDraft("");
        setSubmitting(false);
      },
      () => {
        setSubmitError("Impossible d'envoyer votre commentaire, réessayez.");
        setSubmitting(false);
      }
    );
  };

  if (!newsId || (!item && !loadingDetail)) {
    return (
      <div className="ika-rounded-3xl ika-border ika-border-dashed ika-border-slate-300 ika-bg-white ika-p-10 ika-text-center">
        <p className="ika-text-sm ika-font-medium ika-text-slate-900">
          Article introuvable
        </p>
        <a
          href="#actualites"
          className="ika-mt-4 ika-inline-flex ika-items-center ika-gap-1 ika-text-sm ika-font-semibold ika-text-brand-accent"
        >
          <Icon name="ChevronLeft" className="ika-h-4 ika-w-4" />
          Retour aux actualités
        </a>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="ika-animate-pulse ika-space-y-4" aria-hidden="true">
        <div className="ika-h-64 ika-w-full ika-rounded-2xl ika-bg-slate-200" />
        <div className="ika-h-8 ika-w-2/3 ika-rounded ika-bg-slate-200" />
        <div className="ika-h-4 ika-w-1/3 ika-rounded ika-bg-slate-100" />
      </div>
    );
  }

  const readingTime = estimateReadingTime(item.Body);

  return (
    <article>
      <a
        href="#actualites"
        className="ika-mb-6 ika-inline-flex ika-items-center ika-gap-1 ika-text-sm ika-font-semibold ika-text-slate-500 hover:ika-text-brand-accent"
      >
        <Icon name="ChevronLeft" className="ika-h-4 ika-w-4" />
        Retour aux actualités
      </a>

      {item.HeaderImage ? (
        <img
          src={buildImageUrl(item.HeaderImage, 1200)}
          alt={item.Title}
          className="ika-mb-6 ika-h-64 ika-w-full ika-rounded-2xl ika-object-cover sm:ika-h-96"
        />
      ) : null}

      <span className="ika-text-[11px] ika-font-bold ika-uppercase ika-tracking-widest ika-text-brand-accent">
        {item.Category}
      </span>

      <h1 className="ika-mt-2 ika-text-3xl ika-font-bold ika-leading-tight ika-text-slate-900 sm:ika-text-4xl">
        {item.Title}
      </h1>

      <div className="ika-mt-4 ika-flex ika-flex-wrap ika-items-center ika-gap-x-5 ika-gap-y-2 ika-text-sm ika-text-slate-500">
        {item.NewsAuthor ? (
          <span className="ika-flex ika-items-center ika-gap-2">
            <img
              src={buildUserPhotoUrl(item.NewsAuthor.EMail, "S")}
              alt=""
              className="ika-h-6 ika-w-6 ika-rounded-full ika-bg-slate-200 ika-object-cover"
            />
            {item.NewsAuthor.Title}
          </span>
        ) : null}

        <span className="ika-flex ika-items-center ika-gap-1.5">
          <Icon name="Calendar" className="ika-h-4 ika-w-4" />
          <time dateTime={item.PublishDate}>{formatDate(item.PublishDate)}</time>
        </span>

        {isMeaningfullyUpdated(item) ? (
          <span className="ika-flex ika-items-center ika-gap-1.5">
            Mis à jour le{" "}
            <time dateTime={item.Modified}>{formatDate(item.Modified)}</time>
          </span>
        ) : null}

        {readingTime > 0 ? (
          <span className="ika-flex ika-items-center ika-gap-1.5">
            <Icon name="Clock" className="ika-h-4 ika-w-4" />
            {readingTime} min de lecture
          </span>
        ) : null}
      </div>

      {item.Body ? (
        <div
          className="ika-mt-8 ika-text-slate-700 ika-leading-relaxed [&_h2]:ika-mb-3 [&_h2]:ika-mt-8 [&_h2]:ika-text-xl [&_h2]:ika-font-bold [&_h2]:ika-text-slate-900 [&_p]:ika-mb-4 [&_p:last-child]:ika-mb-0 [&_ul]:ika-mb-4 [&_ul]:ika-list-disc [&_ul]:ika-pl-5"
          dangerouslySetInnerHTML={{ __html: sanitizeHtml(item.Body) }}
        />
      ) : (
        <p className="ika-mt-8 ika-text-slate-600">{item.Excerpt}</p>
      )}

      <section className="ika-mt-14 ika-border-t ika-border-slate-200 ika-pt-8">
        <h2 className="ika-mb-6 ika-text-lg ika-font-bold ika-text-slate-900">
          Commentaires{comments.length > 0 ? ` (${comments.length})` : ""}
        </h2>

        {loadingComments ? (
          <div className="ika-animate-pulse ika-space-y-3" aria-hidden="true">
            <div className="ika-h-16 ika-rounded-xl ika-bg-slate-100" />
            <div className="ika-h-16 ika-rounded-xl ika-bg-slate-100" />
          </div>
        ) : commentsError ? (
          <p className="ika-text-sm ika-text-red-600">{commentsError}</p>
        ) : comments.length === 0 ? (
          <p className="ika-text-sm ika-text-slate-500">
            Soyez le premier à commenter cet article.
          </p>
        ) : (
          <ul className="ika-space-y-5">
            {comments.map((comment) => (
              <li key={comment.Id} className="ika-flex ika-gap-3">
                <img
                  src={buildUserPhotoUrl(comment.Author?.EMail, "S")}
                  alt=""
                  className="ika-h-9 ika-w-9 ika-shrink-0 ika-rounded-full ika-bg-slate-200 ika-object-cover"
                />
                <div className="ika-min-w-0 ika-flex-1 ika-rounded-2xl ika-bg-slate-50 ika-px-4 ika-py-3">
                  <div className="ika-flex ika-flex-wrap ika-items-baseline ika-gap-x-2">
                    <span className="ika-text-sm ika-font-semibold ika-text-slate-900">
                      {comment.Author?.Title || "Collaborateur"}
                    </span>
                    <time
                      dateTime={comment.Created}
                      className="ika-text-xs ika-text-slate-400"
                    >
                      {formatDate(comment.Created)}
                    </time>
                  </div>
                  <p className="ika-mt-1 ika-whitespace-pre-wrap ika-text-sm ika-text-slate-700">
                    {comment.CommentText}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        )}

        <form onSubmit={handleSubmitComment} className="ika-mt-6">
          <label htmlFor="news-comment-input" className="ika-sr-only">
            Votre commentaire
          </label>
          <textarea
            id="news-comment-input"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="Ajouter un commentaire..."
            rows={3}
            maxLength={2000}
            className="ika-w-full ika-rounded-2xl ika-border ika-border-slate-200 ika-p-4 ika-text-sm ika-text-slate-900 focus:ika-border-brand-accent focus:ika-outline-none"
          />
          {submitError ? (
            <p className="ika-mt-2 ika-text-sm ika-text-red-600">{submitError}</p>
          ) : null}
          <div className="ika-mt-3 ika-flex ika-justify-end">
            <button
              type="submit"
              disabled={!draft.trim() || submitting}
              className="ika-rounded-full ika-bg-brand-accent ika-px-5 ika-py-2 ika-text-sm ika-font-semibold ika-text-white ika-transition-opacity disabled:ika-cursor-not-allowed disabled:ika-opacity-50"
            >
              {submitting ? "Envoi..." : "Publier"}
            </button>
          </div>
        </form>
      </section>
    </article>
  );
};
