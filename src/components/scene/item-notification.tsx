import { useEffect } from "react";

interface ItemNotificationProps {
  itemId: string;
  name: string;
  description: string;
  image?: string;
  onClose: () => void;
}

export function ItemNotification({
  itemId,
  name,
  description,
  image,
  onClose,
}: ItemNotificationProps) {
  useEffect(() => {
    const timer = window.setTimeout(onClose, 4000);

    return () => window.clearTimeout(timer);
  }, [itemId, onClose]);

  return (
    <div
      key={itemId}
      className="fixed right-6 top-6 z-[100] w-[min(380px,calc(100vw-2rem))]
        animate-in fade-in slide-in-from-top-3 duration-300"
      role="status"
      aria-live="polite"
    >
      <div
        className="flex items-start gap-4 rounded-lg border border-amber-700/60
          bg-zinc-950/95 p-4 text-stone-100 shadow-2xl backdrop-blur-md"
      >
        <div
          className="flex h-16 w-16 shrink-0 items-center justify-center
            overflow-hidden rounded-md border border-amber-600/40
            bg-amber-950/40"
        >
          {image ? (
            <img
              src={image}
              alt={name}
              className="h-full w-full object-contain p-1"
            />
          ) : (
            <span className="text-2xl" aria-hidden="true">
              ✦
            </span>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <p
            className="mb-1 text-xs font-semibold uppercase tracking-[0.2em]
              text-amber-500"
          >
            Предмет получен
          </p>

          <p className="font-medium text-stone-100">{name}</p>

          <p className="mt-1 text-sm leading-relaxed text-stone-400">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
}
