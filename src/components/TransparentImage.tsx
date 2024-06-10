import React, { useEffect, useRef, useState } from "react";

interface Props {
  maskImageSrc: string;
  originalImage: File;
}

const TransparentImage: React.FC<Props> = ({ maskImageSrc, originalImage }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [bgColor, setBgColor] = useState<string>("red-500");

  useEffect(() => {
    if (originalImage && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");

      if (!ctx) {
        console.error("Failed to get canvas context");
        return;
      }

      const originalImg = new Image();
      const maskImg = new Image();

      const reader = new FileReader();
      reader.onload = (e) => {
        originalImg.src = e.target?.result as string;
      };
      reader.readAsDataURL(originalImage);

      originalImg.onload = () => {
        canvas.width = originalImg.width;
        canvas.height = originalImg.height;

        // Draw the original image
        ctx.drawImage(originalImg, 0, 0);

        maskImg.src = maskImageSrc;
        maskImg.onload = () => {
          const offscreenCanvas = document.createElement("canvas");
          const offscreenCtx = offscreenCanvas.getContext("2d");

          if (!offscreenCtx) {
            console.error("Failed to get offscreen canvas context");
            return;
          }

          offscreenCanvas.width = originalImg.width;
          offscreenCanvas.height = originalImg.height;

          // Draw the mask image onto the off-screen canvas
          offscreenCtx.drawImage(
            maskImg,
            0,
            0,
            originalImg.width,
            originalImg.height
          );

          const maskImageData = offscreenCtx.getImageData(
            0,
            0,
            originalImg.width,
            originalImg.height
          );
          const maskData = maskImageData.data;

          const originalImageData = ctx.getImageData(
            0,
            0,
            originalImg.width,
            originalImg.height
          );
          const originalData = originalImageData.data;

          for (let i = 0; i < maskData.length; i += 4) {
            if (
              maskData[i] >= 200 &&
              maskData[i + 1] >= 200 &&
              maskData[i + 2] >= 200
            ) {
              originalData[i + 3] = 0; // Setting image transparency to 0
            }
          }

          ctx.putImageData(originalImageData, 0, 0);
        };

        maskImg.onerror = (e) => {
          console.error("Failed to load mask image", e);
        };
      };

      originalImg.onerror = (e) => {
        console.error("Failed to load original image", e);
      };
    }
  }, [originalImage, maskImageSrc]);

  const handleDownload = () => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const dataURL = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = dataURL;
      link.download = "merged_image.png";
      link.click();
    }
  };

  const changeColor = () => {
    const colors = ["red-500", "green-500", "blue-500"];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    setBgColor(randomColor);
  };

  return (
    <div className="text-center relative mt-8">
      <div className={`bg-${bgColor} p-4`}>
        <canvas ref={canvasRef} className="border border-gray-300" />
      </div>
      <button
        className="px-4 py-2 mt-4 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75"
        onClick={handleDownload}
      >
        Download as PNG
      </button>
      <button
        className="px-4 py-2 mt-4 ml-4 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75"
        onClick={changeColor}
      >
        Change Background Color
      </button>
    </div>
  );
};

export default TransparentImage;
