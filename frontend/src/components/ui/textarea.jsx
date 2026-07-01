import React from "react";
import { cn } from "@/lib/utils";

const Textarea = React.forwardRef(({ className, ...props }, ref) => (
  <textarea
    ref={ref}
    className={cn(
      "flex min-h-[100px] w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-navy-900 placeholder:text-slate-400 transition-colors focus:outline-none focus:ring-2 focus:ring-navy-800/30 focus:border-navy-800 disabled:cursor-not-allowed disabled:opacity-50",
      className
    )}
    {...props}
  />
));
Textarea.displayName = "Textarea";

export { Textarea };
