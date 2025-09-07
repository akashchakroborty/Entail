export function createAriaLabel(action: string, context?: string): string {
  return context ? `${action} ${context}` : action;
}

export function handleListKeyboardNavigation(
  e: React.KeyboardEvent,
  index: number,
  maxIndex: number,
  onSelect: (index: number) => void
): number {
  let newIndex = index;

  switch (e.key) {
    case "ArrowDown":
    case "ArrowRight":
      e.preventDefault();
      newIndex = index < maxIndex ? index + 1 : 0;
      onSelect(newIndex);
      break;
    case "ArrowUp":
    case "ArrowLeft":
      e.preventDefault();
      newIndex = index > 0 ? index - 1 : maxIndex;
      onSelect(newIndex);
      break;
    case "Home":
      e.preventDefault();
      newIndex = 0;
      onSelect(newIndex);
      break;
    case "End":
      e.preventDefault();
      newIndex = maxIndex;
      onSelect(newIndex);
      break;
    default:
      break;
  }

  return newIndex;
}

export interface SkipLinkProps {
  targetId: string;
  label?: string;
}

export function announceToScreenReader(
  message: string,
  politeness: "polite" | "assertive" = "polite"
): void {
  let announcer = document.getElementById("screen-reader-announcer");

  if (!announcer) {
    announcer = document.createElement("div");
    announcer.id = "screen-reader-announcer";
    announcer.setAttribute("aria-live", politeness);
    announcer.setAttribute("aria-atomic", "true");
    announcer.setAttribute("role", "status");
    announcer.style.position = "absolute";
    announcer.style.width = "1px";
    announcer.style.height = "1px";
    announcer.style.padding = "0";
    announcer.style.overflow = "hidden";
    announcer.style.clip = "rect(0, 0, 0, 0)";
    announcer.style.whiteSpace = "nowrap";
    announcer.style.border = "0";
    document.body.appendChild(announcer);
  } else {
    if (announcer.getAttribute("aria-live") !== politeness) {
      announcer.setAttribute("aria-live", politeness);
    }
  }

  announcer.textContent = message;

  setTimeout(() => {
    if (announcer) announcer.textContent = "";
  }, 3000);
}
