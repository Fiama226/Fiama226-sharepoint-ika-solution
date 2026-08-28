import * as React from "react";

import { IFaqListProps } from "./IFaqListProps";
import { IFaqItem } from "../../../models/IIkaModels";
import { cn, stripHtml } from "../../../common/utils/spUtils";

const COLUMN_CLASSES: Record<number, string> = {
  1: "",
  2: "lg:ika-grid-cols-2",
};

const Chevron: React.FC<{ open: boolean }> = (props) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.8}
    aria-hidden="true"
    focusable="false"
    className={cn(
      "ika-h-5 ika-w-5 ika-shrink-0 ika-text-brand-muted ika-transition-transform",
      props.open && "ika-rotate-180"
    )}
  >
    <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const FaqRow: React.FC<{
  item: IFaqItem;
  open: boolean;
  onToggle: () => void;
}> = (props) => {
  const { item, open, onToggle } = props;
  const panelId = `ika-faq-panel-${item.Id}`;
  const buttonId = `ika-faq-button-${item.Id}`;

  return (
    <div className="ika-overflow-hidden ika-rounded-xl ika-border ika-border-brand-line ika-bg-white">
      <h3>
        <button
          type="button"
          id={buttonId}
          onClick={onToggle}
          aria-expanded={open}
          aria-controls={panelId}
          className="ika-flex ika-w-full ika-items-center ika-justify-between ika-gap-3 ika-p-4 ika-text-left ika-transition-colors hover:ika-bg-brand-surface focus:ika-outline-none focus-visible:ika-ring-2 focus-visible:ika-ring-inset focus-visible:ika-ring-brand-cyan"
        >
          <span className="ika-font-medium ika-text-brand-ink">
            {stripHtml(item.Title)}
          </span>
          <Chevron open={open} />
        </button>
      </h3>

      <div
        id={panelId}
        role="region"
        aria-labelledby={buttonId}
        hidden={!open}
        className="ika-border-t ika-border-brand-line ika-bg-brand-surface/40 ika-px-4 ika-py-3 ika-text-sm ika-leading-relaxed ika-text-brand-muted"
      >
        {stripHtml(item.Answer)}
      </div>
    </div>
  );
};

export const FaqList: React.FC<IFaqListProps> = (props) => {
  const {
    title,
    items,
    loading,
    error,
    columns,
    groupByCategory,
    allowMultipleOpen,
  } = props;

  const [openIds, setOpenIds] = React.useState<number[]>([]);

  const toggle = (id: number): void => {
    setOpenIds((current) => {
      const isOpen = current.indexOf(id) !== -1;
      if (isOpen) return current.filter((value) => value !== id);
      return allowMultipleOpen ? current.concat([id]) : [id];
    });
  };

  const gridClass = cn(
    "ika-grid ika-gap-3",
    COLUMN_CLASSES[columns] || COLUMN_CLASSES[2]
  );

  const renderRows = (list: IFaqItem[]): React.ReactElement => (
    <div className={gridClass}>
      {list.map((item) => (
        <FaqRow
          key={item.Id}
          item={item}
          open={openIds.indexOf(item.Id) !== -1}
          onToggle={() => toggle(item.Id)}
        />
      ))}
    </div>
  );

  const renderBody = (): React.ReactElement => {
    if (loading) {
      return (
        <div className={cn(gridClass, "ika-animate-pulse")} aria-hidden="true">
          {[0, 1, 2, 3].map((index) => (
            <div
              key={index}
              className="ika-rounded-xl ika-border ika-border-brand-line ika-bg-white ika-p-4"
            >
              <div className="ika-h-4 ika-w-3/4 ika-rounded ika-bg-slate-200" />
            </div>
          ))}
        </div>
      );
    }

    if (error) {
      return (
        <div
          role="alert"
          className="ika-rounded-xl ika-border ika-border-red-200 ika-bg-red-50 ika-p-6"
        >
          <p className="ika-text-sm ika-font-medium ika-text-red-800">{error}</p>
        </div>
      );
    }

    if (!items || items.length === 0) {
      return (
        <div className="ika-rounded-xl ika-border ika-border-dashed ika-border-brand-line ika-bg-white ika-p-8 ika-text-center">
          <p className="ika-text-sm ika-text-brand-muted">
            Aucune question pour le moment.
          </p>
        </div>
      );
    }

    if (!groupByCategory) return renderRows(items);

    const categories: string[] = [];
    items.forEach((item) => {
      const key = item.FaqCategory || "Général";
      if (categories.indexOf(key) === -1) categories.push(key);
    });

    return (
      <div className="ika-space-y-6">
        {categories.map((category) => (
          <div key={category}>
            <h3 className="ika-mb-2 ika-text-xs ika-font-semibold ika-uppercase ika-tracking-wider ika-text-brand-cyan-dark">
              {category}
            </h3>
            {renderRows(
              items.filter(
                (item) => (item.FaqCategory || "Général") === category
              )
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="ika-root">
      <section aria-labelledby={title ? "ika-faq-title" : undefined}>
        {title ? (
          <h2
            id="ika-faq-title"
            className="ika-mb-4 ika-text-lg ika-font-semibold ika-text-brand-navy"
          >
            {title}
          </h2>
        ) : null}
        {renderBody()}
      </section>
    </div>
  );
};
