// Original implementation of the grouped toolbar pattern shown by Preet Suthar
// on 21st.dev. No locked source is copied. See THIRD_PARTY.md.
import { Button } from "./ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";
import type { ReactNode } from "react";
export function Tool({
  label,
  children,
  onClick,
  active,
  disabled,
}: {
  label: string;
  children: ReactNode;
  onClick: () => void;
  active?: boolean;
  disabled?: boolean;
}) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          size="icon"
          variant={active ? "secondary" : "ghost"}
          aria-label={label}
          aria-pressed={active}
          onClick={onClick}
          disabled={disabled}
        >
          {children}
        </Button>
      </TooltipTrigger>
      <TooltipContent>{label}</TooltipContent>
    </Tooltip>
  );
}
export function WorkbenchToolbar({
  children,
  label,
}: {
  children: ReactNode;
  label: string;
}) {
  return (
    <div className="workbench-toolbar" role="group" aria-label={label}>
      {children}
    </div>
  );
}
