"use client";

import { useRef, useEffect } from "react";
import { motion } from "framer-motion";

interface CardProps {
  id: number;
  isFlipped: boolean;
  image: string;
  onClick: () => void;
  isTarget: boolean;
  width?: number;
  height?: number;
}

export const Card = ({
  id,
  isFlipped,
  image,
  onClick,
  isTarget,
  width = 200,
  height = 280,
}: CardProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const cardFrontRef = useRef<HTMLCanvasElement>(null);

  // Draw card back (question marks)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas dimensions
    canvas.width = width;
    canvas.height = height;

    // Draw card back
    ctx.fillStyle = "#2563eb"; // Blue background
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Add some texture/gradient
    const gradient = ctx.createLinearGradient(
      0,
      0,
      canvas.width,
      canvas.height,
    );
    gradient.addColorStop(0, "rgba(59, 130, 246, 0.8)");
    gradient.addColorStop(1, "rgba(37, 99, 235, 0.9)");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw border
    ctx.strokeStyle = "#fcd34d";
    ctx.lineWidth = width < 160 ? 3 : 5;
    ctx.strokeRect(10, 10, canvas.width - 20, canvas.height - 20);

    // Draw question marks
    ctx.fillStyle = "#fcd34d";
    const fontSize = width < 160 ? 36 : 48;
    ctx.font = `bold ${fontSize}px Arial`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    // Draw multiple question marks - adjust for smaller screens
    const positions =
      width < 160
        ? [
            { x: canvas.width / 2, y: canvas.height / 2 - 20 },
            { x: canvas.width / 2 - 20, y: canvas.height / 2 + 20 },
            { x: canvas.width / 2 + 20, y: canvas.height / 2 + 20 },
          ]
        : [
            { x: canvas.width / 2, y: canvas.height / 2 - 40 },
            { x: canvas.width / 2 - 40, y: canvas.height / 2 + 40 },
            { x: canvas.width / 2 + 40, y: canvas.height / 2 + 40 },
            { x: canvas.width / 2, y: canvas.height / 2 },
          ];

    positions.forEach((pos) => {
      ctx.fillText("?", pos.x, pos.y);
    });
  }, [width, height]);

  // Update the card front rendering to make the target card more distinctive
  useEffect(() => {
    const canvas = cardFrontRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas dimensions
    canvas.width = width;
    canvas.height = height;

    // Draw card background
    ctx.fillStyle = "#f5f5f5";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw border - make target card border more distinctive
    ctx.strokeStyle = isTarget ? "#ff9500" : "#fcd34d";
    ctx.lineWidth = isTarget ? (width < 160 ? 5 : 8) : width < 160 ? 3 : 5;
    ctx.strokeRect(10, 10, canvas.width - 20, canvas.height - 20);

    // Draw placeholder image or target indicator
    if (isTarget) {
      // For the target card, we'll draw a special indicator
      const img = new Image();
      img.crossOrigin = "anonymous";

      // Using placeholder for now, will be replaced with actual image
      img.src = "/colorful-paintbrush.png";

      img.onload = () => {
        const imageSize = width < 160 ? 80 : 120;
        const offsetX = canvas.width / 2 - imageSize / 2;
        const offsetY = canvas.height / 2 - imageSize / 2;

        ctx.drawImage(img, offsetX, offsetY, imageSize, imageSize);

        // Add a title - adjust font size for smaller screens
        ctx.fillStyle = "#000";
        const fontSize = width < 160 ? 14 : 18;
        ctx.font = `bold ${fontSize}px Arial`;
        ctx.textAlign = "center";
        ctx.fillText("TARGET CARD", canvas.width / 2, 30);

        // Add a glow effect for the target card
        ctx.shadowColor = "#ff9500";
        ctx.shadowBlur = width < 160 ? 10 : 15;
        ctx.strokeStyle = "#ff9500";
        ctx.strokeRect(20, 20, canvas.width - 40, canvas.height - 40);
        ctx.shadowBlur = 0;
      };
    } else {
      // For non-target cards
      const img = new Image();
      img.crossOrigin = "anonymous";

      // Using placeholder for now, will be replaced with actual image
      img.src = id === 2 ? "/fantasy-card-item.png" : "/magical-item-card.png";

      img.onload = () => {
        const imageSize = width < 160 ? 80 : 120;
        const offsetX = canvas.width / 2 - imageSize / 2;
        const offsetY = canvas.height / 2 - imageSize / 2;

        ctx.drawImage(img, offsetX, offsetY, imageSize, imageSize);

        // Add a title - adjust font size for smaller screens
        ctx.fillStyle = "#000";
        const fontSize = width < 160 ? 12 : 16;
        ctx.font = `bold ${fontSize}px Arial`;
        ctx.textAlign = "center";
        ctx.fillText(`Card ${id}`, canvas.width / 2, 30);
      };
    }
  }, [id, isTarget, width, height]);

  return (
    <div
      className="relative cursor-pointer"
      onClick={onClick}
      style={{ width: `${width}px`, height: `${height}px` }}
    >
      <motion.div
        className="absolute w-full h-full backface-hidden"
        initial={false}
        animate={{
          rotateY: isFlipped ? 180 : 0,
          opacity: isFlipped ? 0 : 1,
        }}
        transition={{ duration: 0.6 }}
      >
        <canvas
          ref={canvasRef}
          className="w-full h-full rounded-lg shadow-lg"
        />
      </motion.div>

      <motion.div
        className="absolute w-full h-full backface-hidden"
        initial={false}
        animate={{
          rotateY: isFlipped ? 0 : -180,
          opacity: isFlipped ? 1 : 0,
        }}
        transition={{ duration: 0.6 }}
      >
        <canvas
          ref={cardFrontRef}
          className="w-full h-full rounded-lg shadow-lg"
        />
      </motion.div>
    </div>
  );
};
