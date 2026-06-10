import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";

interface Props {
  target: string;
  onDone: () => void;
}

export function NukeLaunchAnimation({ target, onDone }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    const W = canvas.width,
      H = canvas.height;

    let t = 0;
    let particles: any[] = [];
    let raf: number;

    const launchX = W * 0.5,
      launchY = H * 0.5;
    const targetX = W * 0.5;
    const targetY = -180;
    const arcCtrlX = W * 0.5,
      arcCtrlY = H * 0.1;

    function lerp(a: number, b: number, t: number) {
      return a + (b - a) * t;
    }
    function easeIn(t: number) {
      return t * t;
    }

    function bezier(
      p0x: number,
      p0y: number,
      p1x: number,
      p1y: number,
      p2x: number,
      p2y: number,
      bt: number,
    ) {
      return {
        x: lerp(lerp(p0x, p1x, bt), lerp(p1x, p2x, bt), bt),
        y: lerp(lerp(p0y, p1y, bt), lerp(p1y, p2y, bt), bt),
      };
    }

    function spawnSmoke(x: number, y: number) {
      particles.push({
        x,
        y,
        vx: (Math.random() - 0.5) * 0.4,
        vy: -0.6 - Math.random() * 0.4,
        life: 120,
        maxLife: 120,
        r: 4 + Math.random() * 6,
        type: "smoke",
      });
    }
    function spawnFire(x: number, y: number) {
      for (let i = 0; i < 6; i++) {
        particles.push({
          x: x + (Math.random() - 0.5) * 8,
          y: y + (Math.random() - 0.5) * 8,
          vx: (Math.random() - 0.5) * 1.2,
          vy: -1.5 - Math.random() * 2,
          life: 30 + Math.random() * 20,
          maxLife: 50,
          r: 3 + Math.random() * 4,
          type: "fire",
        });
      }
    }

    function drawGroundFlare(progress: number) {
      if (progress > 0.15) return;
      const alpha = 1 - progress / 0.15,
        r = (20 * progress) / 0.15;
      const grd = ctx.createRadialGradient(
        launchX,
        launchY,
        0,
        launchX,
        launchY,
        r * 3,
      );
      grd.addColorStop(0, `rgba(255,200,50,${alpha * 0.9})`);
      grd.addColorStop(0.4, `rgba(255,100,20,${alpha * 0.5})`);
      grd.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = grd;
      ctx.beginPath();
      ctx.arc(launchX, launchY, r * 3, 0, Math.PI * 2);
      ctx.fill();
    }

    function drawMissile(pos: { x: number; y: number }, progress: number) {
      const trailLen = Math.min(100, progress * 500);

      for (let i = 0; i < 40; i++) {
        const tp = Math.max(0, progress - (trailLen / 500) * (i / 40));
        const tp2 = Math.max(0, progress - (trailLen / 500) * ((i + 1) / 40));

        const p1 = bezier(
          launchX,
          launchY,
          arcCtrlX,
          arcCtrlY,
          targetX,
          targetY,
          tp,
        );
        const p2 = bezier(
          launchX,
          launchY,
          arcCtrlX,
          arcCtrlY,
          targetX,
          targetY,
          tp2,
        );

        const fade = 1 - i / 40;

        ctx.strokeStyle = `rgba(220,220,220,${fade * 0.7})`;
        ctx.lineWidth = fade * 5.36;

        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.stroke();
      }

      const ahead = bezier(
        launchX,
        launchY,
        arcCtrlX,
        arcCtrlY,
        targetX,
        targetY,
        Math.min(1, progress + 0.02),
      );
      const angle = Math.atan2(ahead.y - pos.y, ahead.x - pos.x);

      ctx.save();
      ctx.translate(pos.x, pos.y);
      ctx.rotate(angle + Math.PI / 2);

      ctx.strokeStyle = "#1a1a1a";
      ctx.lineWidth = 2;
      ctx.lineJoin = "round";

      ctx.fillStyle = "#ff3300";
      ctx.beginPath();
      ctx.moveTo(-6.7, 13.4);
      ctx.lineTo(0, 30.15 + Math.random() * 10);
      ctx.lineTo(6.7, 13.4);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = "#ffcc00";
      ctx.beginPath();
      ctx.moveTo(-4, 13.4);
      ctx.lineTo(0, 23.45 + Math.random() * 5.3);
      ctx.lineTo(4, 13.4);
      ctx.closePath();
      ctx.fill();

      ctx.fillStyle = "#ff2a2a";
      ctx.beginPath();
      ctx.moveTo(-9.38, 10.72);
      ctx.lineTo(-17.42, 18.76);
      ctx.lineTo(-8.04, 16.08);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(9.38, 10.72);
      ctx.lineTo(17.42, 18.76);
      ctx.lineTo(8.04, 16.08);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = "#ffffff";
      ctx.beginPath();
      ctx.moveTo(0, -24.12);
      ctx.lineTo(9.38, 13.4);
      ctx.lineTo(-9.38, 13.4);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = "#00e5ff";
      ctx.fillRect(-5.36, -2.68, 10.72, 13.4);
      ctx.strokeRect(-5.36, -2.68, 10.72, 13.4);

      ctx.restore();

      if (t % 2 === 0) {
        spawnSmoke(pos.x, pos.y + 10.7);
      }
    }

    function loop() {
      ctx.clearRect(0, 0, W, H);

      t++;

      drawGroundFlare(t / 140);

      if (t % 3 === 0) {
        spawnFire(launchX, launchY);
      }

      const progress = easeIn(t / 140);

      const pos = bezier(
        launchX,
        launchY,
        arcCtrlX,
        arcCtrlY,
        targetX,
        targetY,
        progress,
      );

      drawMissile(pos, progress);

      if (progress >= 1) {
        onDone();
        return;
      }

      raf = requestAnimationFrame(loop);
    }

    const run = async () => {
      soundManager.play('nukelaunch')
      await sleep(500)
      raf = requestAnimationFrame(loop);

    }
    run()
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "transparent",
      }}
    >
      <canvas
        ref={canvasRef}
        width={1080}
        height={1080}
        style={{ width: "min(680px,100vw)", borderRadius: 8 }}
      />
    </div>
  );
}
import { soundManager } from "../../services/SoundManager";

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export function NukeExplosionAnimation({ target, onDone }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const started = useRef(false);

  useEffect(() => {
    if (started.current) return;
    started.current = true;
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    const W = canvas.width,
      H = canvas.height;

    let state: "idle" | "falling" | "explosion" = "idle";
    let t = 0;
    let explosionTimer = 0;
    const explosionDuration = 460;

    let particles: any[] = [];
    let raf: number;

    const entryX = W * 0.5,
      entryY = -60;
    const targetX = W * 0.5;
    const targetY = H * 0.5 + 300;
    const arcCtrlX = W * 0.5,
      arcCtrlY = H * 0.2;

    function lerp(a: number, b: number, t: number) {
      return a + (b - a) * t;
    }
    function easeIn(t: number) {
      return t * t;
    }

    function bezier(
      p0x: number,
      p0y: number,
      p1x: number,
      p1y: number,
      p2x: number,
      p2y: number,
      bt: number,
    ) {
      return {
        x: lerp(lerp(p0x, p1x, bt), lerp(p1x, p2x, bt), bt),
        y: lerp(lerp(p0y, p1y, bt), lerp(p1y, p2y, bt), bt),
      };
    }

    function spawnExplosionParticles(x: number, y: number) {
      if (particles.length > 60) return;
      for (let i = 0; i < 4; i++) {
        particles.push({
          x: x + (Math.random() - 0.5) * 100,
          y: y + (Math.random() - 0.5) * 50,
          vx: (Math.random() - 0.5) * 24,
          vy: -8 - Math.random() * 18,
          life: 260 + Math.random() * 100,
          maxLife: 360,
          r: 140 + Math.random() * 60,
          type: "fire",
        });
      }
      for (let i = 0; i < 3; i++) {
        particles.push({
          x: x + (Math.random() - 0.5) * 80,
          y: y + (Math.random() - 0.5) * 30,
          vx: (Math.random() - 0.5) * 32,
          vy: -1 - Math.random() * 5,
          life: 300 + Math.random() * 120,
          maxLife: 420,
          r: 120 + Math.random() * 90,
          type: "smoke",
        });
      }
    }

    function drawIncomingMissile(
      pos: { x: number; y: number },
      progress: number,
    ) {
      const trailLen = Math.min(100, progress * 500);

      for (let i = 0; i < 30; i++) {
        const tp = Math.max(0, progress - (trailLen / 500) * (i / 30));
        const tp2 = Math.max(0, progress - (trailLen / 500) * ((i + 1) / 30));

        const p1 = bezier(
          entryX,
          entryY,
          arcCtrlX,
          arcCtrlY,
          targetX,
          targetY,
          tp,
        );
        const p2 = bezier(
          entryX,
          entryY,
          arcCtrlX,
          arcCtrlY,
          targetX,
          targetY,
          tp2,
        );
        const fade = 1 - i / 30;

        ctx.strokeStyle = `rgba(255, 90, 30, ${fade * 0.6})`;
        ctx.lineWidth = fade * 8;
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.stroke();
      }

      const ahead = bezier(
        entryX,
        entryY,
        arcCtrlX,
        arcCtrlY,
        targetX,
        targetY,
        Math.min(1, progress + 0.02),
      );
      const angle = Math.atan2(ahead.y - pos.y, ahead.x - pos.x);

      ctx.save();
      ctx.translate(pos.x, pos.y);
      ctx.rotate(angle - Math.PI / 2);

      ctx.strokeStyle = "#1a1a1a";
      ctx.lineWidth = 2;
      ctx.lineJoin = "round";

      ctx.fillStyle = "#ff6600";
      ctx.beginPath();
      ctx.moveTo(-6.7, -13.4);
      ctx.lineTo(0, -25 - Math.random() * 10);
      ctx.lineTo(6.7, -13.4);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = "#ff2a2a";
      ctx.beginPath();
      ctx.moveTo(-9.38, -10.72);
      ctx.lineTo(-17.42, -18.76);
      ctx.lineTo(-8.04, -16.08);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(9.38, -10.72);
      ctx.lineTo(17.42, -18.76);
      ctx.lineTo(8.04, -16.08);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = "#ffffff";
      ctx.beginPath();
      ctx.moveTo(0, 24.12);
      ctx.lineTo(9.38, -13.4);
      ctx.lineTo(-9.38, -13.4);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = "#00e5ff";
      ctx.fillRect(-5.36, -10.72, 10.72, 13.4);
      ctx.strokeRect(-5.36, -10.72, 10.72, 13.4);

      ctx.restore();
    }

    function updateExplosion() {
      explosionTimer++;

      if (explosionTimer < 95 && explosionTimer % 4 === 0) {
        spawnExplosionParticles(targetX, targetY);
      }

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.life--;

        p.vx *= 0.92;
        p.vy *= 0.92;

        if (p.life <= 0) {
          particles.splice(i, 1);
          continue;
        }

        const lifePct = p.life / p.maxLife;
        const currentRadius = p.r * (1 + (1 - lifePct) * 3.5);

        ctx.save();
        ctx.strokeStyle = "#1a1a1a";
        ctx.lineWidth = 4;

        if (p.type === "fire") {
          const r = 255;
          const g = Math.floor(lerp(20, 255, lifePct));
          const b = Math.floor(lerp(0, 60, lifePct));
          ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${Math.min(1, lifePct * 2.0)})`;
          ctx.beginPath();
          ctx.arc(p.x, p.y, currentRadius, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();
          ctx.restore();
        } else {
          const gray = Math.floor(lerp(30, 80, lifePct));
          ctx.fillStyle = `rgba(${gray}, ${gray}, ${gray}, ${lifePct * 0.95})`;
          ctx.beginPath();
          ctx.arc(p.x, p.y, currentRadius, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }
      }
    }

    function loop() {
      ctx.clearRect(0, 0, W, H);

      if (state === "falling") {
        t++;
        const progress = easeIn(t / 50);
        const pos = bezier(
          entryX,
          entryY,
          arcCtrlX,
          arcCtrlY,
          targetX,
          targetY,
          progress,
        );

        drawIncomingMissile(pos, progress);

        if (progress >= 1) {
          state = "explosion";
        }
      }

      if (state === "explosion") {
        updateExplosion();

        if (explosionTimer >= explosionDuration) {
          console.log(explosionDuration + " timer:" + explosionTimer)
          onDone();
          return;
        }
      }

      raf = requestAnimationFrame(loop);
    }

    const run = async () => {
      soundManager.play("nukearrival");

      await sleep(11500);

      state = "falling";
      raf = requestAnimationFrame(loop);
    };

    run();

    return () => {
      cancelAnimationFrame(raf);
    };
  }, []);

  const mapElement = document.querySelector(".game-map");
  if (!mapElement) return null;

  return createPortal(
    <div
      style={{
        position: "absolute",
        inset: 0,
        zIndex: 45,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "transparent",
        width: "100%",
        height: "100%",
        pointerEvents: "none",
      }}
    >
      <canvas
        ref={canvasRef}
        width={2400}
        height={2400}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
        }}
      />
    </div>,
    mapElement
  );
}
