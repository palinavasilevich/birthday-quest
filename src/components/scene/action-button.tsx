import type { ButtonHTMLAttributes } from "react";

type ActionButtonSize = "default" | "medium" | "small";
type ActionButtonVariant = "default" | "warm";

interface ActionButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  text: string;
  code?: string;
  size?: ActionButtonSize;
  variant?: ActionButtonVariant;
}

/** Frame thickness in px — must match the button's `p-0.5`. */
const BORDER = 2;

/** Corner cut size (px) per button size. */
const BEVEL: Record<ActionButtonSize, number> = {
  default: 16,
  medium: 12,
  small: 8,
};

/**
 * 45° bevels on the top-right and bottom-left corners.
 * For the inner layer the cut is shrunk by BORDER·(2−√2) so the diagonal
 * frame stays exactly as thick as the straight sides.
 */
function bevelPath(bevel: number) {
  return `polygon(calc(100% - ${bevel}px) 0, 100% ${bevel}px, 100% 100%, ${bevel}px 100%, 0 calc(100% - ${bevel}px), 0 0)`;
}

const variantClasses: Record<
  ActionButtonVariant,
  { frame: string; inner: string; text: string }
> = {
  default: {
    frame: `
      bg-[#ff9b00]
      enabled:hover:bg-[#8b0000]
      focus-visible:outline-[#ff9b00]
    `,
    inner:
      "bg-[radial-gradient(circle,rgb(0,0,0)_0%,rgba(0,0,20,1)_50%)]",
    text: "text-[#ff9b00] group-enabled:group-hover:text-[#ff5a3c]",
  },
  warm: {
    frame: `
      bg-amber-200
      enabled:hover:bg-amber-50
      focus-visible:outline-amber-200
    `,
    inner:
      "bg-[radial-gradient(circle,rgba(70,38,8,1)_0%,rgba(30,15,4,1)_70%)]",
    text: "text-amber-100 [text-shadow:0_0_8px_rgba(255,214,140,0.7)] group-enabled:group-hover:text-white",
  },
};

const sizeClasses: Record<ActionButtonSize, string> = {
  default: "min-w-44 px-8 py-4 text-lg",
  medium: "min-w-36 px-7 py-3.5 text-base tracking-wide",
  small: "min-w-23 px-4 py-1.5 text-xs",
};

export function ActionButton({
  text,
  code = "bda249",
  size = "default",
  variant = "default",
  className = "",
  ...props
}: ActionButtonProps) {
  const v = variantClasses[variant];
  const bevel = BEVEL[size];
  const innerBevel = bevel - BORDER * (2 - Math.SQRT2);

  return (
    <button
      {...props}
      style={{ clipPath: bevelPath(bevel), ...props.style }}
      className={`
        group
        relative
        z-3
        inline-flex
        cursor-pointer
        border-0
        p-0.5
        uppercase
        outline-none
        transition-colors
        duration-200
        ${v.frame}
        focus-visible:outline-1
        focus-visible:outline-offset-4
        disabled:cursor-not-allowed
        disabled:opacity-40
        ${className}
      `}
    >
      <span
        style={{ clipPath: bevelPath(innerBevel) }}
        className={`
          flex
          w-full
          items-center
          justify-center
          font-bold
          whitespace-nowrap
          transition-colors
          duration-200
          ${sizeClasses[size]}
          ${v.inner}
          ${v.text}
        `}
      >
        {text}
      </span>

      <span
        className={`
          pointer-events-none
          absolute
          right-2
          bottom-1.5
          z-5
          text-[0.6rem]
          leading-none
          font-bold
          lowercase
          opacity-60
          transition-colors
          duration-200
          ${v.text}
        `}
      >
        {code}
      </span>
    </button>
  );
}
