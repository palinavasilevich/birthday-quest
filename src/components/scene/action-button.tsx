import type { ButtonHTMLAttributes } from "react";

type ActionButtonSize = "default" | "small";
type ActionButtonVariant = "default" | "warm";

interface ActionButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  text: string;
  code?: string;
  size?: ActionButtonSize;
  variant?: ActionButtonVariant;
}

const variantClasses: Record<
  ActionButtonVariant,
  { frame: string; inner: string; text: string }
> = {
  default: {
    frame: `
      bg-[#ff9b00]
      text-[#ff9b00]
      hover:bg-[#8b0000]
      hover:shadow-[inset_0_0_5px_3px_rgba(1,1,1,0.3)]
      focus-visible:outline-[#ff9b00]
    `,
    inner:
      "bg-[radial-gradient(circle,rgb(0,0,0)_0%,rgb(0,0,0)_0%,rgba(0,0,20,1)_50%)]",
    text: "text-[#ff9b00] group-hover:text-[#8b0000]",
  },
  warm: {
    frame: `
      bg-amber-200
      text-amber-100
      hover:bg-amber-50
      focus-visible:outline-amber-200
    `,
    inner:
      "bg-[radial-gradient(circle,rgba(70,38,8,1)_0%,rgba(30,15,4,1)_70%)]",
    text: "text-amber-100 [text-shadow:0_0_8px_rgba(255,214,140,0.7)] group-hover:text-white",
  },
};

export function ActionButton({
  text,
  code = "bda249",
  size = "default",
  variant = "default",
  disabled,
  className = "",
  ...props
}: ActionButtonProps) {
  const sizeClasses =
    size === "small" ? "px-12 py-4 text-xs" : "px-22.5 py-7 text-base";
  const v = variantClasses[variant];

  return (
    <button
      {...props}
      disabled={disabled}
      className={`
        group
        relative
        z-3
        cursor-pointer
        border-0
        ${v.frame}
        ${sizeClasses}
        uppercase
        outline-none
        transition-all
        duration-200
        [clip-path:polygon(92%_0,100%_25%,100%_100%,8%_100%,0_75%,0_0)]
        focus-visible:outline-1
        focus-visible:outline-offset-4
        disabled:cursor-not-allowed
        disabled:opacity-40
        ${className}
        ${disabled ? "cursor-not-allowed opacity-40" : ""}
      `}
    >
      <span
        className={`
          absolute
          inset-0.5
          z-4
          flex
          items-center
          justify-center
          font-bold
          ${v.inner}
          ${v.text}
          transition-colors
          duration-200
          [clip-path:polygon(92%_0,100%_25%,100%_100%,8%_100%,0_75%,0_0)]
        `}
      >
        {text}
      </span>

      <span
        className={`
          absolute
          -bottom-0.75
          right-[8%]
          z-5
          h-3
          ${v.inner}
          px-1.25
          text-[0.5rem]
          leading-none
          font-bold
          lowercase
          ${v.text}
          transition-colors
          duration-200
        `}
      >
        {code}
      </span>
    </button>
  );
}
