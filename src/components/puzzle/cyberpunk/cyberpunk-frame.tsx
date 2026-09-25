import type { ReactNode } from "react";

interface CyberpunkFrameProps {
  title?: string;
  status?: string;
  date?: string;
  children: ReactNode;
  footer?: ReactNode;
  className?: string;
}

export function CyberpunkFrame({
  title = "LOCAL TERMINAL",
  status = "ONLINE",
  date = "21/11/2026",
  children,
  footer,
  className = "",
}: CyberpunkFrameProps) {
  return (
    <div
      className={[
        "relative mx-auto w-full max-w-3xl overflow-hidden",
        "border border-[#d99b22]/35 bg-[#030504]",
        "font-mono text-[#d8d2b0]",
        "shadow-[0_0_45px_rgba(0,0,0,0.65)]",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {/* TOP FRAME */}

      <div className="relative flex items-center justify-between border-b border-[#d99b22]/30 bg-[#090b09] px-5 py-3">
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-linear-to-r from-transparent via-[#d99b22]/60 to-transparent" />

        <div>
          <div className="text-[11px] font-semibold tracking-[0.2em] text-[#e4a72c]">
            {title}
          </div>

          <div className="mt-1 text-[8px] uppercase tracking-[0.18em] text-[#65705f]">
            {status}
          </div>
        </div>

        <div className="text-right">
          <div className="text-[8px] tracking-[0.15em] text-[#56605a]">
            LOCAL SYSTEM
          </div>

          <div className="mt-1 text-[10px] tracking-[0.12em] text-[#d99b22]/80">
            {date}
          </div>
        </div>
      </div>

      {/* SCREEN */}

      <div className="relative overflow-hidden px-6 py-7 sm:px-8 sm:py-8">
        {/* scanlines */}

        <div className="pointer-events-none absolute inset-0 opacity-[0.06] [background:repeating-linear-gradient(to_bottom,transparent_0px,transparent_3px,rgba(255,255,255,0.25)_4px)]" />

        {/* amber dot grid */}

        <div className="pointer-events-none absolute inset-0 opacity-[0.08] [background-image:radial-gradient(circle,#d99b22_0.7px,transparent_0.7px)] [background-size:18px_18px]" />

        {/* vignette */}

        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_30%,rgba(0,0,0,0.55)_100%)]" />

        <div className="relative z-10">{children}</div>
      </div>

      {/* FOOTER */}

      {footer}
    </div>
  );
}

interface CyberpunkConsoleLabelProps {
  children?: ReactNode;
}

export function CyberpunkConsoleLabel({
  children = "SYSTEM CONSOLE",
}: CyberpunkConsoleLabelProps) {
  return (
    <div className="mb-6 flex items-center gap-2 text-[9px] uppercase tracking-[0.2em] text-[#5f6961]">
      <span className="h-1.5 w-1.5 rounded-full bg-[#d99b22] shadow-[0_0_8px_rgba(217,155,34,0.7)]" />

      {children}
    </div>
  );
}

interface CyberpunkSystemLogProps {
  ready?: boolean;
}

export function CyberpunkSystemLog({ ready = false }: CyberpunkSystemLogProps) {
  return (
    <div className="border-t border-[#d99b22]/15 bg-black/30 px-5 py-2.5">
      <div className="flex items-center justify-between text-[7px] uppercase tracking-[0.16em]">
        <span className="text-[#465149]">SYSTEM LOG</span>

        <span className={ready ? "text-[#78c98c]" : "text-[#d99b22]/60"}>
          {ready ? "READY" : "PROCESSING"}
        </span>
      </div>
    </div>
  );
}

interface CyberpunkActionProps {
  label: string;
  onClick: () => void;
  disabled?: boolean;
}

export function CyberpunkAction({
  label,
  onClick,
  disabled = false,
}: CyberpunkActionProps) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className="w-full border border-[#d99b22]/40 bg-[#d99b22]/5 px-5 py-3 font-mono text-[10px] uppercase tracking-[0.22em] text-[#d99b22] transition-all duration-200 hover:border-[#d99b22] hover:bg-[#d99b22]/10 hover:shadow-[0_0_20px_rgba(217,155,34,0.12)] disabled:cursor-not-allowed disabled:opacity-30"
    >
      &gt; {label}
    </button>
  );
}
