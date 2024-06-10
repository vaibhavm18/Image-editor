import { useCallback, useEffect, useRef } from "react";
import { ReactSketchCanvas, ReactSketchCanvasRef } from "react-sketch-canvas";

interface InpaintingProps {
  userUploadedImage: File | null;
  onDraw: (data: string) => void;
}

const Inpainting: React.FC<InpaintingProps> = ({
  userUploadedImage,
  onDraw,
}) => {
  const canvasRef = useRef<ReactSketchCanvasRef>(null);

  const handleChange = useCallback(async () => {
    try {
      const paths = await canvasRef.current?.exportPaths();

      if (paths && paths.length) {
        const data = await canvasRef.current?.exportImage("jpeg");
        if (data) {
          console.log("");
          onDraw(data);
        }
      }
    } catch (error) {
      console.error("Error exporting image:", error);
    }
  }, [onDraw]);

  useEffect(() => {
    if (userUploadedImage) {
      handleChange();
    }
  }, [userUploadedImage, handleChange]);

  return (
    <div className="w-[400px] h-[400px]">
      {userUploadedImage && (
        <ReactSketchCanvas
          ref={canvasRef}
          strokeWidth={80}
          strokeColor="white"
          canvasColor="transparent"
          onChange={handleChange}
        />
      )}
    </div>
  );
};

export default Inpainting;
