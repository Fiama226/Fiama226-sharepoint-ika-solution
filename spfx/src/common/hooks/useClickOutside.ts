import * as React from "react";

export function useClickOutside<T extends HTMLElement>(
  onOutside: () => void,
  enabled: boolean = true
): React.RefObject<T> {
  const ref = React.useRef<T>(null);
  const handler = React.useRef(onOutside);

  React.useEffect(() => {
    handler.current = onOutside;
  }, [onOutside]);

  React.useEffect(() => {
    if (!enabled) return undefined;

    const onMouseDown = (event: MouseEvent): void => {
      const node = ref.current;
      if (node && !node.contains(event.target as Node)) {
        handler.current();
      }
    };

    const onKeyDown = (event: KeyboardEvent): void => {
      if (event.key === "Escape") handler.current();
    };

    document.addEventListener("mousedown", onMouseDown);
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("mousedown", onMouseDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [enabled]);

  return ref;
}
