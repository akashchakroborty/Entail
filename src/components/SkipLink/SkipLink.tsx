import { styled } from "@mui/material";
import { forwardRef } from "react";
import { announceToScreenReader } from "src/utils/accessibilityUtils";

interface SkipLinkProps {
  targetId: string;
  text?: string;
  className?: string;
  ariaLabel?: string;
  announceOnUse?: boolean;
}

const StyledSkipLink = styled("a")(({ theme }) => ({
  position: "absolute",
  top: "-40px",
  left: theme.spacing(1),
  padding: theme.spacing(1, 2),
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
  fontWeight: 500,
  zIndex: theme.zIndex.tooltip + 1,
  borderRadius: theme.shape.borderRadius,
  transition: theme.transitions.create("top"),
  "&:focus": {
    top: theme.spacing(1),
    outline: `2px solid ${theme.palette.primary.dark}`,
    outlineOffset: 2,
  },
  "&:hover": {
    backgroundColor: theme.palette.primary.dark,
    textDecoration: "underline",
  },
}));

export const SkipLink = forwardRef<HTMLAnchorElement, SkipLinkProps>(
  (
    {
      targetId,
      text = "Skip to main content",
      className,
      ariaLabel,
      announceOnUse = true,
    },
    ref
  ) => (
    <StyledSkipLink
      ref={ref}
      href={`#${targetId}`}
      className={className}
      aria-label={ariaLabel || text}
      onClick={(e) => {
        e.preventDefault();
        const target = document.getElementById(targetId);
        if (target) {
          target.tabIndex = -1;
          target.focus();
          if (announceOnUse) {
            announceToScreenReader(
              `Skipped to ${target.getAttribute("aria-label") || targetId}`
            );
          }

          setTimeout(() => {
            if (target) target.tabIndex = 0;
          }, 100);
        }
      }}
    >
      {text}
    </StyledSkipLink>
  )
);

SkipLink.displayName = "SkipLink";
