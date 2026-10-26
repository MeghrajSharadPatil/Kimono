import React, { useEffect, useRef } from 'react';

interface SakuraTreeCanvasProps {
  breezeActive: boolean;
}

interface Petal {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  rotation: number;
  rotationSpeed: number;
  opacity: number;
  tint: string;
}

export const SakuraTreeCanvas: React.FC<SakuraTreeCanvasProps> = ({ breezeActive }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = 420);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = 420;
    };
    window.addEventListener('resize', handleResize);

    const tints = ['#FFD1DC', '#FFB7C5', '#F898B0', '#FFF0F5', '#F47B9E'];
    const petals: Petal[] = Array.from({ length: 42 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: 5 + Math.random() * 6,
      speedX: 0.35 + Math.random() * 0.7,
      speedY: 0.45 + Math.random() * 0.65,
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - 0.5) * 0.02,
      opacity: 0.45 + Math.random() * 0.45,
      tint: tints[Math.floor(Math.random() * tints.length)],
    }));

    const drawNotchedSakuraFlower = (
      c: CanvasRenderingContext2D,
      cx: number,
      cy: number,
      radius: number,
      petalColor: string,
      coreColor: string,
      angleOffset = 0
    ) => {
      c.save();
      c.translate(cx, cy);
      c.rotate(angleOffset);
      for (let i = 0; i < 5; i++) {
        c.save();
        c.rotate((i * Math.PI * 2) / 5);
        c.beginPath();
        c.moveTo(0, 0);
        c.quadraticCurveTo(-radius * 0.55, -radius * 0.65, -radius * 0.22, -radius);
        c.lineTo(0, -radius * 0.82); // classic sakura petal notch
        c.lineTo(radius * 0.22, -radius);
        c.quadraticCurveTo(radius * 0.55, -radius * 0.65, 0, 0);
        c.fillStyle = petalColor;
        c.fill();
        c.restore();
      }
      // Pistil / stamens
      c.beginPath();
      c.arc(0, 0, radius * 0.2, 0, Math.PI * 2);
      c.fillStyle = coreColor;
      c.fill();
      c.restore();
    };

    const drawSakuraBoughs = (c: CanvasRenderingContext2D) => {
      c.save();
      // Left sweeping sakura tree trunk & boughs
      c.strokeStyle = '#4A2C35';
      c.lineCap = 'round';

      // Main left bough
      c.lineWidth = 11;
      c.beginPath();
      c.moveTo(-10, 45);
      c.quadraticCurveTo(140, 65, 290, 32);
      c.stroke();

      c.lineWidth = 6;
      c.beginPath();
      c.moveTo(110, 56);
      c.quadraticCurveTo(210, 110, 340, 95);
      c.stroke();

      // Right sweeping sakura bough
      c.lineWidth = 10;
      c.beginPath();
      c.moveTo(width + 10, 38);
      c.quadraticCurveTo(width - 160, 72, width - 330, 28);
      c.stroke();

      c.lineWidth = 5.5;
      c.beginPath();
      c.moveTo(width - 130, 58);
      c.quadraticCurveTo(width - 230, 118, width - 360, 92);
      c.stroke();

      // Blossom clusters along left and right boughs
      const leftClusters = [
        { x: 45, y: 48, r: 16 },
        { x: 95, y: 58, r: 19 },
        { x: 155, y: 52, r: 15 },
        { x: 210, y: 44, r: 18 },
        { x: 265, y: 36, r: 14 },
        { x: 185, y: 88, r: 16 },
        { x: 250, y: 98, r: 15 },
        { x: 315, y: 92, r: 13 },
      ];
      leftClusters.forEach((cl, i) => {
        drawNotchedSakuraFlower(
          c,
          cl.x,
          cl.y,
          cl.r,
          i % 2 === 0 ? '#FFB7C8' : '#F88DAD',
          '#E04D7A',
          i * 0.5
        );
      });

      const rightClusters = [
        { x: width - 50, y: 45, r: 17 },
        { x: width - 110, y: 56, r: 19 },
        { x: width - 175, y: 52, r: 15 },
        { x: width - 240, y: 40, r: 17 },
        { x: width - 305, y: 32, r: 13 },
        { x: width - 200, y: 92, r: 16 },
        { x: width - 270, y: 102, r: 14 },
        { x: width - 335, y: 90, r: 12 },
      ];
      rightClusters.forEach((cl, i) => {
        drawNotchedSakuraFlower(
          c,
          cl.x,
          cl.y,
          cl.r,
          i % 2 === 0 ? '#FFB7C8' : '#F88DAD',
          '#E04D7A',
          i * 0.7
        );
      });

      c.restore();
    };

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      drawSakuraBoughs(ctx);

      petals.forEach((p) => {
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.globalAlpha = p.opacity;

        // Draw notched single sakura petal
        ctx.beginPath();
        ctx.moveTo(0, p.size);
        ctx.quadraticCurveTo(-p.size * 0.8, 0, -p.size * 0.3, -p.size);
        ctx.lineTo(0, -p.size * 0.65);
        ctx.lineTo(p.size * 0.3, -p.size);
        ctx.quadraticCurveTo(p.size * 0.8, 0, 0, p.size);
        ctx.fillStyle = p.tint;
        ctx.fill();
        ctx.restore();

        if (breezeActive && !prefersReducedMotion) {
          p.x += p.speedX + Math.sin(p.y * 0.02) * 0.35;
          p.y += p.speedY;
          p.rotation += p.rotationSpeed;

          if (p.y > height + 15) {
            p.y = -12;
            p.x = Math.random() * width;
          }
          if (p.x > width + 15) {
            p.x = -12;
          }
        }
      });

      if (breezeActive && !prefersReducedMotion) {
        animationFrameId = requestAnimationFrame(render);
      }
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  }, [breezeActive]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none absolute top-0 left-0 w-full h-[420px] z-0 opacity-85"
    />
  );
};
