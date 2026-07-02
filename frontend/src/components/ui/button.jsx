import React from "react";
import { cn } from "@/lib/utils";
import { cva } from "class-variance-authority";

const buttonVariants = cva(
  "inline-flex min-w-0 items-center justify-center gap-2 rounded-lg text-center text-sm font-semibold leading-tight transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy-800 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98] sm:whitespace-nowrap",
  {
    variants: {
      variant: {
        primary: "bg-navy-900 text-white shadow-sm hover:bg-navy-800 hover:shadow-md",
        secondary: "border border-slate-300 bg-white text-navy-900 hover:border-navy-800 hover:bg-slate-50",
        ghost: "bg-transparent text-navy-800 hover:bg-slate-100",
        outline: "border border-navy-900/20 bg-transparent text-navy-900 hover:bg-navy-900 hover:text-white",
        link: "bg-transparent text-navy-900 underline-offset-4 hover:underline p-0 h-auto",
      },
      size: {
        default: "h-11 px-5 py-2",
        sm: "h-9 px-4 text-[13px]",
        lg: "h-12 px-7 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: { variant: "primary", size: "default" },
  }
);

const Button = React.forwardRef(({ className, variant, size, ...props }, ref) => (
  <button ref={ref} className={cn(buttonVariants({ variant, size }), className)} {...props} />
));
Button.displayName = "Button";

export { Button, buttonVariants };
