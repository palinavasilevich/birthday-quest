import { useEffect, useRef, useState } from "react";

interface TextTyperProps {
  text: string;
  speed?: number;
  onComplete?: () => void;
}

export function TextTyper({ text, speed = 35, onComplete }: TextTyperProps) {
  const [displayed, setDisplayed] = useState("");
  const onCompleteRef = useRef(onComplete);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    let index = 0;

    const interval = window.setInterval(() => {
      index += 1;

      setDisplayed(text.slice(0, index));

      if (index >= text.length) {
        window.clearInterval(interval);
        onCompleteRef.current?.();
      }
    }, speed);

    return () => {
      window.clearInterval(interval);
    };
  }, [text, speed]);

  return (
    <p className="mt-6 max-w-xl text-center text-2xl leading-relaxed text-white/80">
      {displayed}
    </p>
  );
}
