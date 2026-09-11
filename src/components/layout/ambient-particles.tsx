import { useEffect, useRef } from "react";

export function AmbientParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;

    if (!canvas) {
      return;
    }

    const ctx = canvas.getContext("2d");

    if (!ctx) {
      return;
    }

    let particles: {
      x: number;
      y: number;
      r: number;
      s: number;
    }[] = [];

    let animationFrame: number;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

      particles = Array.from({ length: 40 }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 2,
        s: 0.2 + Math.random() * 0.8,
      }));
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = "rgba(255, 255, 255, 0.3)";

      for (const particle of particles) {
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.r, 0, Math.PI * 2);
        ctx.fill();

        particle.y -= particle.s;

        if (particle.y < 0) {
          particle.y = canvas.height;
        }
      }

      animationFrame = requestAnimationFrame(draw);
    };

    resize();
    draw();

    window.addEventListener("resize", resize);

    return () => {
      cancelAnimationFrame(animationFrame);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none absolute inset-0 z-0 opacity-30"
    />
  );
}
