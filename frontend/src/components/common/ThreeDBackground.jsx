import React, { useEffect, useRef } from "react";

/**
 * ThreeDBackground Component
 * Hardware-accelerated 3D interactive particle field + floating wireframe polyhedra.
 * Features calibrated high-contrast rendering for Light Mode, luminous dark glow,
 * interactive cursor repulsion force-field, and 3D geometric depth.
 */
export default function ThreeDBackground({ theme = "dark" }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);

    let rawMouseX = width / 2;
    let rawMouseY = height / 2;
    let mouseNormX = 0;
    let mouseNormY = 0;
    let rotX = 0;
    let rotY = 0;
    let targetRotX = 0;
    let targetRotY = 0;
    let animId;

    const isDark = theme === "dark";
    const prefersReducedMotion = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const speedScale = prefersReducedMotion ? 0.25 : 1.0;

    // 3D Particles Constellation scaled for mobile through 4K
    const PARTICLE_COUNT = width < 480 ? 36 : width < 768 ? 48 : width > 1920 ? 110 : 80;
    const particles = [];
    const FIELD_SIZE = Math.max(1400, width * 1.15);

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.push({
        x: (Math.random() - 0.5) * FIELD_SIZE,
        y: (Math.random() - 0.5) * FIELD_SIZE,
        z: (Math.random() - 0.5) * 600,
        vx: (Math.random() - 0.5) * 0.45 * speedScale,
        vy: (Math.random() - 0.5) * 0.45 * speedScale,
        vz: (Math.random() - 0.5) * 0.45 * speedScale,
        dispX: 0,
        dispY: 0,
        baseRadius: Math.random() * 2 + 1.4,
      });
    }

    // 3D Wireframe Polyhedra drifting through the depth field
    // 1. Octahedron (6 vertices, 12 edges)
    // 2. Cube (8 vertices, 12 edges)
    // 3. Tetrahedron (4 vertices, 6 edges)
    const polyhedra = [
      {
        type: "octahedron",
        x: -width * 0.28,
        y: -height * 0.15,
        z: 40,
        vx: 0.15,
        vy: 0.12,
        rx: 0.2,
        ry: 0.3,
        rz: 0.1,
        vrx: 0.007,
        vry: 0.009,
        size: 55,
        vertices: [
          [1, 0, 0],
          [-1, 0, 0],
          [0, 1, 0],
          [0, -1, 0],
          [0, 0, 1],
          [0, 0, -1],
        ],
        edges: [
          [0, 2], [0, 3], [0, 4], [0, 5],
          [1, 2], [1, 3], [1, 4], [1, 5],
          [2, 4], [4, 3], [3, 5], [5, 2],
        ],
      },
      {
        type: "cube",
        x: width * 0.32,
        y: height * 0.22,
        z: -60,
        vx: -0.12,
        vy: -0.14,
        rx: 0.4,
        ry: 0.5,
        rz: 0.2,
        vrx: 0.006,
        vry: 0.008,
        size: 42,
        vertices: [
          [-1, -1, -1], [1, -1, -1], [1, 1, -1], [-1, 1, -1],
          [-1, -1, 1], [1, -1, 1], [1, 1, 1], [-1, 1, 1],
        ],
        edges: [
          [0, 1], [1, 2], [2, 3], [3, 0],
          [4, 5], [5, 6], [6, 7], [7, 4],
          [0, 4], [1, 5], [2, 6], [3, 7],
        ],
      },
      {
        type: "tetrahedron",
        x: width * 0.05,
        y: -height * 0.35,
        z: 80,
        vx: 0.1,
        vy: -0.1,
        rx: 0.1,
        ry: 0.2,
        rz: 0.3,
        vrx: 0.008,
        vry: 0.005,
        size: 48,
        vertices: [
          [1, 1, 1],
          [-1, -1, 1],
          [-1, 1, -1],
          [1, -1, -1],
        ],
        edges: [
          [0, 1], [1, 2], [2, 0],
          [0, 3], [1, 3], [2, 3],
        ],
      },
    ];

    let resizeRaf = null;
    const handleResize = () => {
      if (resizeRaf) cancelAnimationFrame(resizeRaf);
      resizeRaf = requestAnimationFrame(() => {
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = width * dpr;
        canvas.height = height * dpr;
        ctx.scale(dpr, dpr);
      });
    };

    const handleMouseMove = (e) => {
      rawMouseX = e.clientX;
      rawMouseY = e.clientY;
      mouseNormX = (e.clientX - width / 2) / (width / 2);
      mouseNormY = (e.clientY - height / 2) / (height / 2);
      targetRotY = mouseNormX * 0.4;
      targetRotX = -mouseNormY * 0.4;
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("mousemove", handleMouseMove, { passive: true });

    const FOCAL_LENGTH = 450;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Smooth camera rotational inertia
      rotX += (targetRotX - rotX) * 0.05;
      rotY += (targetRotY - rotY) * 0.05;

      const cosY = Math.cos(rotY);
      const sinY = Math.sin(rotY);
      const cosX = Math.cos(rotX);
      const sinX = Math.sin(rotX);

      // Mode-calibrated high contrast palette
      // In light mode: deep burnt terracotta/copper with crisp stroke
      // In dark mode: radiant warm terracotta glow
      const nodeColor = isDark ? "255, 155, 105" : "195, 68, 22";
      const lineColor = isDark ? "245, 142, 95" : "185, 62, 20";
      const polyColor = isDark ? "255, 168, 120" : "205, 75, 26";

      // -------------------------------------------------------------
      // 1. PROJECT & RENDER PARTICLES CONSTELLATION
      // -------------------------------------------------------------
      const projected = [];

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Drift motion
        p.x += p.vx;
        p.y += p.vy;
        p.z += p.vz;

        // Interactive cursor repulsion force-field
        p.dispX *= 0.92;
        p.dispY *= 0.92;

        // Boundary wrapping
        if (p.x < -FIELD_SIZE / 2) p.x = FIELD_SIZE / 2;
        if (p.x > FIELD_SIZE / 2) p.x = -FIELD_SIZE / 2;
        if (p.y < -FIELD_SIZE / 2) p.y = FIELD_SIZE / 2;
        if (p.y > FIELD_SIZE / 2) p.y = -FIELD_SIZE / 2;
        if (p.z < -300) p.z = 300;
        if (p.z > 300) p.z = -300;

        // 3D rotation Y
        const x1 = p.x * cosY - p.z * sinY;
        const z1 = p.z * cosY + p.x * sinY;

        // 3D rotation X
        const y2 = p.y * cosX - z1 * sinX;
        const z2 = z1 * cosX + p.y * sinX;

        // Perspective depth projection
        const depth = z2 + FOCAL_LENGTH;
        if (depth > 20) {
          const scale = FOCAL_LENGTH / depth;
          let screenX = x1 * scale + width / 2 + p.dispX;
          let screenY = y2 * scale + height / 2 + p.dispY;

          // Mouse proximity repulsion in screen space
          const dxMouse = screenX - rawMouseX;
          const dyMouse = screenY - rawMouseY;
          const distMouse = Math.sqrt(dxMouse * dxMouse + dyMouse * dyMouse);
          if (distMouse < 140 && distMouse > 1) {
            const push = (1 - distMouse / 140) * 12;
            p.dispX += (dxMouse / distMouse) * push;
            p.dispY += (dyMouse / distMouse) * push;
            screenX += (dxMouse / distMouse) * push;
            screenY += (dyMouse / distMouse) * push;
          }

          // Boosted alpha and radius for crisp visibility through semi-transparent cards
          const baseAlpha = Math.min(Math.max((scale - 0.3) * 0.95, 0.2), 0.9);
          const alpha = isDark ? baseAlpha : Math.min(baseAlpha * 1.35, 0.98);

          projected.push({
            x: screenX,
            y: screenY,
            z: z2,
            scale,
            alpha,
            radius: p.baseRadius * scale * (isDark ? 1.2 : 1.3),
          });
        }
      }

      // Draw constellation lines with high contrast in Light Mode (optimized with squared-distance early exit)
      const maxDist = width < 768 ? 95 : 145;
      const maxDist2 = maxDist * maxDist;
      const alphaFactor = isDark ? 0.82 : 0.95;
      ctx.lineWidth = isDark ? 1.15 : 1.25;

      for (let i = 0; i < projected.length; i++) {
        const p1 = projected[i];
        for (let j = i + 1; j < projected.length; j++) {
          const p2 = projected[j];
          const dx = p1.x - p2.x;
          const dx2 = dx * dx;
          if (dx2 > maxDist2) continue;
          const dy = p1.y - p2.y;
          const dy2 = dy * dy;
          const distSq = dx2 + dy2;

          if (distSq < maxDist2) {
            const dist = Math.sqrt(distSq);
            const lineAlpha = (1 - dist / maxDist) * Math.min(p1.alpha, p2.alpha) * alphaFactor;
            ctx.strokeStyle = `rgba(${lineColor}, ${lineAlpha})`;
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
      }

      // Draw glowing nodes
      for (let i = 0; i < projected.length; i++) {
        const p = projected[i];

        // Core node
        ctx.fillStyle = `rgba(${nodeColor}, ${p.alpha})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, Math.max(p.radius, 0.9), 0, Math.PI * 2);
        ctx.fill();

        // Light mode high-contrast stroke ring
        if (!isDark) {
          ctx.strokeStyle = `rgba(145, 42, 10, ${p.alpha * 0.65})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }

        // Depth halo for prominent foreground nodes
        if (p.scale > 1.08) {
          ctx.fillStyle = `rgba(${nodeColor}, ${p.alpha * (isDark ? 0.28 : 0.18)})`;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius * 2.4, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // -------------------------------------------------------------
      // 2. PROJECT & RENDER FLOATING 3D WIREFRAME POLYHEDRA
      // -------------------------------------------------------------
      for (let k = 0; k < polyhedra.length; k++) {
        const poly = polyhedra[k];

        // Drift
        poly.x += poly.vx;
        poly.y += poly.vy;
        poly.rx += poly.vrx;
        poly.ry += poly.vry;

        // Boundary wrapping
        const boundX = width * 0.45;
        const boundY = height * 0.45;
        if (poly.x < -boundX) poly.x = boundX;
        if (poly.x > boundX) poly.x = -boundX;
        if (poly.y < -boundY) poly.y = boundY;
        if (poly.y > boundY) poly.y = -boundY;

        // Local rotation matrices for the polyhedron
        const cosPRx = Math.cos(poly.rx);
        const sinPRx = Math.sin(poly.rx);
        const cosPRy = Math.cos(poly.ry);
        const sinPRy = Math.sin(poly.ry);

        // Project vertices
        const projVerts = [];
        let validPoly = true;

        for (let v = 0; v < poly.vertices.length; v++) {
          const [vx, vy, vz] = poly.vertices[v];
          // Scale to polyhedron size
          const sx = vx * poly.size;
          const sy = vy * poly.size;
          const sz = vz * poly.size;

          // Polyhedron local rotation
          const lx1 = sx * cosPRy - sz * sinPRy;
          const lz1 = sz * cosPRy + sx * sinPRy;
          const ly2 = sy * cosPRx - lz1 * sinPRx;
          const lz2 = lz1 * cosPRx + sy * sinPRx;

          // World position
          const wx = poly.x + lx1;
          const wy = poly.y + ly2;
          const wz = poly.z + lz2;

          // Global camera rotation
          const cx1 = wx * cosY - wz * sinY;
          const cz1 = wz * cosY + wx * sinY;
          const cy2 = wy * cosX - cz1 * sinX;
          const cz2 = cz1 * cosX + wy * sinX;

          const depth = cz2 + FOCAL_LENGTH;
          if (depth <= 20) {
            validPoly = false;
            break;
          }

          const scale = FOCAL_LENGTH / depth;
          const px = cx1 * scale + width / 2;
          const py = cy2 * scale + height / 2;

          projVerts.push({ x: px, y: py, scale });
        }

        if (validPoly && projVerts.length === poly.vertices.length) {
          const avgScale = projVerts[0].scale;
          const polyAlpha = isDark
            ? Math.min(Math.max((avgScale - 0.4) * 0.4, 0.12), 0.55)
            : Math.min(Math.max((avgScale - 0.4) * 0.65, 0.22), 0.78);

          // Draw wireframe edges
          ctx.strokeStyle = `rgba(${polyColor}, ${polyAlpha})`;
          ctx.lineWidth = isDark ? 1.0 : 1.25;

          for (let e = 0; e < poly.edges.length; e++) {
            const [i1, i2] = poly.edges[e];
            const p1 = projVerts[i1];
            const p2 = projVerts[i2];
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }

          // Draw vertex corner dots
          ctx.fillStyle = `rgba(${polyColor}, ${polyAlpha * 1.3})`;
          for (let v = 0; v < projVerts.length; v++) {
            const pv = projVerts[v];
            ctx.beginPath();
            ctx.arc(pv.x, pv.y, 2.2 * pv.scale, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }

      animId = requestAnimationFrame(render);
    };

    let isRunning = true;
    const handleVisibilityChange = () => {
      if (document.hidden) {
        isRunning = false;
        cancelAnimationFrame(animId);
      } else if (!isRunning) {
        isRunning = true;
        animId = requestAnimationFrame(render);
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);

    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      if (resizeRaf) cancelAnimationFrame(resizeRaf);
      cancelAnimationFrame(animId);
    };
  }, [theme]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[1] opacity-100 dark:opacity-95 transition-opacity duration-700"
      style={{ width: "100%", height: "100%" }}
      aria-hidden="true"
    />
  );
}
