import { useEffect, useRef } from "react";

export type ParticlesVariant = "default" | "fireflies";

interface AmbientParticlesProps {
  variant?: ParticlesVariant;
  /* Fireflies only: particles accelerate away from the screen center. */
  scatter?: boolean;
}

interface Particle {
  x: number;
  y: number;
  r: number;
  s: number;
  /* Fireflies only: phase for twinkle and sideways drift. */
  phase: number;
  twinkle: number;
  drift: number;
  /* Scatter direction (unit vector) and individual speed multiplier. */
  dx: number;
  dy: number;
  boost: number;
}

const COUNT: Record<ParticlesVariant, number> = {
  default: 40,
  fireflies: 32,
};

/* Extra fireflies that burst out of the center when scattering. */
const BURST_COUNT = 28;

function setScatterDirection(particle: Particle, cx: number, cy: number) {
  let dx = particle.x - cx;
  let dy = particle.y - cy;
  const length = Math.hypot(dx, dy);

  if (length < 1) {
    const angle = Math.random() * Math.PI * 2;
    dx = Math.cos(angle);
    dy = Math.sin(angle);
  } else {
    dx /= length;
    dy /= length;
  }

  particle.dx = dx;
  particle.dy = dy;
}

export function AmbientParticles({
  variant = "default",
  scatter = false,
}: AmbientParticlesProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const scatterRef = useRef(scatter);

  useEffect(() => {
    scatterRef.current = scatter;
  }, [scatter]);

  useEffect(() => {
    const canvas = canvasRef.current;

    if (!canvas) {
      return;
    }

    const ctx = canvas.getContext("2d");

    if (!ctx) {
      return;
    }

    const isFireflies = variant === "fireflies";

    let particles: Particle[] = [];
    let scatterStart: number | null = null;

    let animationFrame: number;

    const createParticle = (x: number, y: number): Particle => ({
      x,
      y,
      r: isFireflies ? 1.2 + Math.random() * 2.3 : Math.random() * 2,
      s: isFireflies ? 0.1 + Math.random() * 0.35 : 0.2 + Math.random() * 0.8,
      phase: Math.random() * Math.PI * 2,
      twinkle: 0.6 + Math.random() * 1.4,
      drift: 0.2 + Math.random() * 0.5,
      dx: 0,
      dy: 0,
      boost: 0.6 + Math.random() * 0.8,
    });

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

      if (scatterStart !== null) {
        return;
      }

      particles = Array.from({ length: COUNT[variant] }, () =>
        createParticle(
          Math.random() * canvas.width,
          Math.random() * canvas.height,
        ),
      );
    };

    const startScatter = (time: number) => {
      scatterStart = time;

      const cx = canvas.width / 2;
      const cy = canvas.height / 2;

      for (let i = 0; i < BURST_COUNT; i++) {
        particles.push(
          createParticle(
            cx + (Math.random() - 0.5) * 120,
            cy + (Math.random() - 0.5) * 80,
          ),
        );
      }

      for (const particle of particles) {
        setScatterDirection(particle, cx, cy);
      }
    };

    const drawDefault = () => {
      ctx.fillStyle = "rgba(255, 255, 255, 0.3)";

      for (const particle of particles) {
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.r, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    const drawFireflies = (t: number, scatterElapsed: number) => {
      ctx.globalCompositeOperation = "lighter";

      for (const particle of particles) {
        /* 0.15..1: slow, uneven blinking; fully lit while scattering. */
        const twinkle =
          0.15 +
          0.85 *
            Math.pow(
              (Math.sin(t * particle.twinkle + particle.phase) + 1) / 2,
              2,
            );
        const glow = Math.min(1, twinkle + scatterElapsed * 2);

        const x =
          particle.x + Math.sin(t * particle.drift + particle.phase) * 12;
        const haloRadius = particle.r * (6 + scatterElapsed * 4);

        const halo = ctx.createRadialGradient(
          x,
          particle.y,
          0,
          x,
          particle.y,
          haloRadius,
        );
        halo.addColorStop(0, `rgba(255, 214, 120, ${0.55 * glow})`);
        halo.addColorStop(0.35, `rgba(251, 160, 36, ${0.25 * glow})`);
        halo.addColorStop(1, "rgba(251, 140, 20, 0)");

        ctx.fillStyle = halo;
        ctx.beginPath();
        ctx.arc(x, particle.y, haloRadius, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = `rgba(255, 240, 200, ${0.9 * glow})`;
        ctx.beginPath();
        ctx.arc(x, particle.y, particle.r * 0.6, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.globalCompositeOperation = "source-over";
    };

    const move = (scatterElapsed: number) => {
      if (scatterStart !== null) {
        /* Slow start, then a fast dash towards the edges. */
        const speed = 0.5 + Math.pow(scatterElapsed * 2.2, 2) * 4;

        for (const particle of particles) {
          particle.x += particle.dx * speed * particle.boost;
          particle.y += particle.dy * speed * particle.boost;
        }

        return;
      }

      for (const particle of particles) {
        particle.y -= particle.s;

        if (particle.y < -20) {
          particle.y = canvas.height + 20;
          particle.x = Math.random() * canvas.width;
        }
      }
    };

    const draw = (time: number) => {
      if (isFireflies && scatterRef.current && scatterStart === null) {
        startScatter(time);
      }

      const scatterElapsed =
        scatterStart === null ? 0 : (time - scatterStart) / 1000;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (isFireflies) {
        drawFireflies(time / 1000, scatterElapsed);
      } else {
        drawDefault();
      }

      move(scatterElapsed);

      animationFrame = requestAnimationFrame(draw);
    };

    resize();
    animationFrame = requestAnimationFrame(draw);

    window.addEventListener("resize", resize);

    return () => {
      cancelAnimationFrame(animationFrame);
      window.removeEventListener("resize", resize);
    };
  }, [variant]);

  return (
    <canvas
      ref={canvasRef}
      className={`pointer-events-none absolute inset-0 z-0 ${
        variant === "fireflies" ? "opacity-90" : "opacity-30"
      }`}
    />
  );
}
