import React, { useRef, useEffect, useState } from "react";
import { Compass, MapPin } from "lucide-react";

/**
 * Globe3D Component
 * Interactive hardware-accelerated 3D wireframe globe.
 * Visualizes Sidharth's engineering hub in Bengaluru, India (12.97° N, 77.59° E)
 * with rotating parallels, meridians, orbital satellite ring, and drag-to-spin physics.
 * 
 * Performance Optimized:
 * - Uses IntersectionObserver to pause RAF loop when scrolled offscreen
 * - Pauses on document visibility hidden
 * - Uses isDraggingRef to avoid tearing down and rebuilding canvas on drag
 */
export default function Globe3D({ theme = "dark", size = 260 }) {
  const canvasRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const isDraggingRef = useRef(false);
  const dragStartRef = useRef({ x: 0, y: 0 });
  const rotRef = useRef({ lon: 77.59, lat: 18.0 });
  const velRef = useRef({ lon: 0.35, lat: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    ctx.scale(dpr, dpr);

    const radius = size * 0.38;
    const centerX = size / 2;
    const centerY = size / 2;

    let animId = null;
    let isVisible = false;
    let isRunning = false;
    const isDark = theme === "dark";

    // Colors matching design system
    const globeLineColor = isDark ? "rgba(224, 138, 95, 0.28)" : "rgba(185, 65, 20, 0.45)";
    const equatorColor = isDark ? "rgba(224, 138, 95, 0.55)" : "rgba(185, 65, 20, 0.75)";
    const markerColor = isDark ? "#ff9357" : "#c44212";
    const ringColor = isDark ? "rgba(255, 255, 255, 0.12)" : "rgba(0, 0, 0, 0.08)";

    // Bengaluru Coordinates
    const targetCity = {
      name: "Bengaluru, IN",
      lat: 12.9716,
      lon: 77.5946,
    };

    let orbitAngle = 0;

    const render = () => {
      ctx.clearRect(0, 0, size, size);

      // Auto-rotation inertia if not actively dragging
      if (!isDraggingRef.current) {
        rotRef.current.lon += velRef.current.lon;
        velRef.current.lon *= 0.985;
        if (Math.abs(velRef.current.lon) < 0.25) {
          velRef.current.lon = 0.25; // Gentle constant drift
        }
      }

      orbitAngle += 0.02;

      const toRad = Math.PI / 180;
      const rotLon = rotRef.current.lon * toRad;
      const rotLat = rotRef.current.lat * toRad;

      const cosLat = Math.cos(rotLat);
      const sinLat = Math.sin(rotLat);

      // 3D Point Projection Helper
      const project3D = (latDeg, lonDeg) => {
        const phi = latDeg * toRad;
        const theta = lonDeg * toRad + rotLon;

        // Spherical to Cartesian
        const x0 = radius * Math.cos(phi) * Math.sin(theta);
        const y0 = radius * -Math.sin(phi);
        const z0 = radius * Math.cos(phi) * Math.cos(theta);

        // Pitch rotation (tilt)
        const y1 = y0 * cosLat - z0 * sinLat;
        const z1 = z0 * cosLat + y0 * sinLat;

        return {
          x: centerX + x0,
          y: centerY + y1,
          z: z1,
          visible: z1 > 0,
        };
      };

      // 1. Draw outer subtle sphere boundary glow
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      ctx.fillStyle = isDark ? "rgba(224, 138, 95, 0.03)" : "rgba(185, 65, 20, 0.04)";
      ctx.fill();
      ctx.strokeStyle = ringColor;
      ctx.lineWidth = 1;
      ctx.stroke();

      // 2. Draw Latitude Parallels
      const latitudes = [-60, -30, 0, 30, 60];
      latitudes.forEach((lat) => {
        ctx.beginPath();
        let first = true;
        for (let lon = 0; lon <= 360; lon += 5) {
          const pt = project3D(lat, lon);
          if (pt.visible) {
            if (first) {
              ctx.moveTo(pt.x, pt.y);
              first = false;
            } else {
              ctx.lineTo(pt.x, pt.y);
            }
          } else {
            first = true;
          }
        }
        ctx.strokeStyle = lat === 0 ? equatorColor : globeLineColor;
        ctx.lineWidth = lat === 0 ? 1.2 : 0.75;
        ctx.stroke();
      });

      // 3. Draw Longitude Meridians
      for (let lon = 0; lon < 360; lon += 30) {
        ctx.beginPath();
        let first = true;
        for (let lat = -90; lat <= 90; lat += 5) {
          const pt = project3D(lat, lon);
          if (pt.visible) {
            if (first) {
              ctx.moveTo(pt.x, pt.y);
              first = false;
            } else {
              ctx.lineTo(pt.x, pt.y);
            }
          } else {
            first = true;
          }
        }
        ctx.strokeStyle = globeLineColor;
        ctx.lineWidth = 0.75;
        ctx.stroke();
      }

      // 4. Draw Orbital Satellite Ellipse Ring
      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(-0.35);
      ctx.beginPath();
      ctx.ellipse(0, 0, radius * 1.35, radius * 0.45, 0, 0, Math.PI * 2);
      ctx.strokeStyle = isDark ? "rgba(224, 138, 95, 0.25)" : "rgba(185, 65, 20, 0.35)";
      ctx.lineWidth = 0.8;
      ctx.stroke();

      // Satellite Bead
      const satX = Math.cos(orbitAngle) * (radius * 1.35);
      const satY = Math.sin(orbitAngle) * (radius * 0.45);
      ctx.fillStyle = markerColor;
      ctx.beginPath();
      ctx.arc(satX, satY, 2.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // 5. Draw Target Marker: Bengaluru, India
      const blrPt = project3D(targetCity.lat, targetCity.lon);
      if (blrPt.visible) {
        // Pulsing radar ripple
        const pulse = (Math.sin(orbitAngle * 3) + 1) / 2;
        const rippleR = 5 + pulse * 7;

        ctx.beginPath();
        ctx.arc(blrPt.x, blrPt.y, rippleR, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(224, 138, 95, ${1 - pulse * 0.75})`;
        ctx.lineWidth = 1;
        ctx.stroke();

        // Glowing center dot
        ctx.beginPath();
        ctx.arc(blrPt.x, blrPt.y, 3.5, 0, Math.PI * 2);
        ctx.fillStyle = markerColor;
        ctx.fill();

        // City Callout Tag
        ctx.font = "10px 'Geist Mono', monospace";
        ctx.fillStyle = isDark ? "#fff" : "#111";
        ctx.fillText("BLR // 12.97°N", blrPt.x + 8, blrPt.y - 4);
      }

      if (isRunning) {
        animId = requestAnimationFrame(render);
      }
    };

    const startLoop = () => {
      if (!isRunning) {
        isRunning = true;
        animId = requestAnimationFrame(render);
      }
    };

    const stopLoop = () => {
      isRunning = false;
      if (animId) cancelAnimationFrame(animId);
    };

    // IntersectionObserver to pause rendering when offscreen
    let observer = null;
    if (typeof IntersectionObserver !== "undefined") {
      observer = new IntersectionObserver(
        ([entry]) => {
          isVisible = entry.isIntersecting;
          if (isVisible && !document.hidden) {
            startLoop();
          } else {
            stopLoop();
          }
        },
        { rootMargin: "150px" }
      );
      observer.observe(canvas);
    } else {
      // Fallback
      startLoop();
    }

    const handleVisibilityChange = () => {
      if (document.hidden) {
        stopLoop();
      } else if (isVisible) {
        startLoop();
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      stopLoop();
      if (observer) observer.disconnect();
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [theme, size]);

  const handleMouseDown = (e) => {
    isDraggingRef.current = true;
    setIsDragging(true);
    dragStartRef.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e) => {
    if (!isDraggingRef.current) return;
    const dx = e.clientX - dragStartRef.current.x;
    const dy = e.clientY - dragStartRef.current.y;
    dragStartRef.current = { x: e.clientX, y: e.clientY };

    rotRef.current.lon += dx * 0.5;
    rotRef.current.lat = Math.max(-60, Math.min(60, rotRef.current.lat - dy * 0.3));
    velRef.current.lon = dx * 0.4;
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
    setIsDragging(false);
  };

  const handleTouchStart = (e) => {
    if (e.touches.length === 1) {
      isDraggingRef.current = true;
      setIsDragging(true);
      dragStartRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    }
  };

  const handleTouchMove = (e) => {
    if (!isDraggingRef.current || e.touches.length !== 1) return;
    const dx = e.touches[0].clientX - dragStartRef.current.x;
    const dy = e.touches[0].clientY - dragStartRef.current.y;
    dragStartRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };

    rotRef.current.lon += dx * 0.5;
    rotRef.current.lat = Math.max(-60, Math.min(60, rotRef.current.lat - dy * 0.3));
    velRef.current.lon = dx * 0.4;
  };

  const handleTouchEnd = () => {
    isDraggingRef.current = false;
    setIsDragging(false);
  };

  return (
    <div
      className="relative flex flex-col items-center justify-center p-3 rounded-2xl bg-[var(--paper-2)]/30 backdrop-blur-md border border-[var(--line)]/60 shadow-sm select-none w-full max-w-[280px]"
      style={{ maxWidth: `${size + 16}px` }}
    >
      <div className="w-full flex items-center justify-between text-[10px] font-mono text-[var(--muted)] mb-1 px-1">
        <span className="flex items-center gap-1 text-orange-400 font-semibold">
          <Compass className="w-3 h-3" />
          GEO_RADAR // 3D
        </span>
        <span className="flex items-center gap-1">
          <MapPin className="w-3 h-3 text-emerald-400" />
          IST (UTC+5:30)
        </span>
      </div>

      <canvas
        ref={canvasRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        style={{
          width: "100%",
          maxWidth: `${size}px`,
          aspectRatio: "1 / 1",
          touchAction: "none",
          cursor: isDragging ? "grabbing" : "grab",
        }}
        className="rounded-full will-change-transform"
        title="Interactive 3D Bengaluru Geo-Sphere — Drag to Rotate"
      />

      <div className="w-full mt-2 pt-2 border-t border-[var(--line)]/60 text-center text-[10.5px] font-mono text-[var(--ink-2)]">
        Bengaluru, India · <span className="text-orange-400 font-medium">12.97°N, 77.59°E</span>
      </div>
    </div>
  );
}
