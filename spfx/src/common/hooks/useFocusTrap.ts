import * as React from "react";

const FOCUSABLE =
  'button:not([disabled]), a[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

export interface IFocusTrapOptions {
  onClose: () => void;
  onPrevious?: () => void;
  onNext?: () => void;
}

export function useFocusTrap<T extends HTMLElement>(
  active: boolean,
  options: IFocusTrapOptions
): React.RefObject<T> {
  const containerRef = React.useRef<T>(null);
  const handlers = React.useRef(options);
  const restoreTo = React.useRef<HTMLElement | undefined>(undefined);

  React.useEffect(() => {
    handlers.current = options;
  }, [options]);

  React.useEffect(() => {
    if (!active) return undefined;

    restoreTo.current = (document.activeElement as HTMLElement) || undefined;

    const container = containerRef.current;
    if (container) {
      const first = container.querySelector<HTMLElement>(FOCUSABLE);
      if (first) first.focus();
    }

    const onKeyDown = (event: KeyboardEvent): void => {
      if (event.key === "Escape") {
        event.preventDefault();
        handlers.current.onClose();
        return;
      }

      if (event.key === "ArrowLeft" && handlers.current.onPrevious) {
        event.preventDefault();
        handlers.current.onPrevious();
        return;
      }

      if (event.key === "ArrowRight" && handlers.current.onNext) {
        event.preventDefault();
        handlers.current.onNext();
        return;
      }

      if (event.key !== "Tab") return;

      const node = containerRef.current;
      if (!node) return;

      const focusable = node.querySelectorAll<HTMLElement>(FOCUSABLE);
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey) {
        if (document.activeElement === first) {
          event.preventDefault();
          last.focus();
        }
      } else if (document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
      if (restoreTo.current && restoreTo.current.focus) {
        restoreTo.current.focus();
      }
    };
  }, [active]);

  return containerRef;
}
