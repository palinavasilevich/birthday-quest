import type { ButtonHTMLAttributes } from "react";

interface ActionButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  text: string;
  code?: string;
}

export function ActionButton({
  text,
  code = "BDA249",
  ...props
}: ActionButtonProps) {
  return (
    <button
      {...props}
      className="
        group
        relative
        z-3
        cursor-pointer
        border-0
        bg-[#ff9b00]
        px-22.5
        py-7
        text-base
        uppercase
        text-[#ff9b00]
        outline-none
        transition-all
        duration-200
        [clip-path:polygon(92%_0,100%_25%,100%_100%,8%_100%,0_75%,0_0)]
        hover:bg-[#8b0000]
        hover:shadow-[inset_0_0_5px_3px_rgba(1,1,1,0.3)]
        focus-visible:outline-1
        focus-visible:outline-[#ff9b00]
        focus-visible:outline-offset-4
        disabled:cursor-not-allowed
        disabled:opacity-40
      "
    >
      <span
        className="
          absolute
          inset-0.5
          z-4
          flex
          items-center
          justify-center
          bg-[radial-gradient(circle,rgb(0,0,0)_0%,rgb(0,0,0)_0%,rgba(0,0,20,1)_50%)]
          text-[#ff9b00]
          transition-colors
          duration-200
          [clip-path:polygon(92%_0,100%_25%,100%_100%,8%_100%,0_75%,0_0)]
          group-hover:text-[#8b0000]
        "
      >
        {text}
      </span>

      <span
        className="
          absolute
          bottom-[-1.2px]
          right-[8%]
          z-5
          h-2.5
          bg-[radial-gradient(circle,rgb(0,0,0)_0%,rgb(0,0,0)_0%,rgba(0,0,20,1)_50%)]
          px-1.25
          text-[0.4rem]
          leading-none
          text-[#ff9b00]
          transition-colors
          duration-200
          group-hover:text-[#8b0000]
        "
      >
        {code}
      </span>
    </button>
  );
}
