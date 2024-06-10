import React, { useEffect, useRef, useState } from "react";

interface Props {
  maskImageSrc: string;
  originalImage: File;
}

const colors: string[] = ["red", "green", "blue"];
function getRandomColor(): string {
  const randomIndex = Math.floor(Math.random() * colors.length);
  return colors[randomIndex];
}

// Example usage
const MergeImages: React.FC<Props> = ({ maskImageSrc, originalImage }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
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

          for (let i = 0; i < maskData.length; i += 4) {
            if (
              maskData[i] === 255 &&
              maskData[i + 1] === 255 &&
              maskData[i + 2] === 255
            ) {
              const originalPixelIndex = i / 4;
              const x = originalPixelIndex % originalImg.width;
              const y = Math.floor(originalPixelIndex / originalImg.width);
              ctx.clearRect(x, y, 1, 1);
            }
          }
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
  const [color, setColor] = useState("bg-red-500");
  const changeColor = () => {
    setColor(getRandomColor());
  };
  return (
    <div className="text-center relative mt-8 ">
      <div className={"bg-" + color + "-500"}>
        <canvas ref={canvasRef} />
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
        change background
      </button>
    </div>
  );
};

export default MergeImages;
