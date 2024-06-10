import { useCallback, useEffect, useRef } from "react";
import { ReactSketchCanvas, ReactSketchCanvasRef } from "react-sketch-canvas";

interface Props {
  userUploadedImage: File | null;
  onDraw: (data: string) => void;
}
export default function Canvas({ onDraw, userUploadedImage }: Props) {
  const canvasRef = useRef<ReactSketchCanvasRef>(null);

  const handleChange = useCallback(async () => {
    try {
      const paths = await canvasRef.current?.exportPaths();

      if (paths && paths.length) {
        const data = await canvasRef.current?.exportImage("jpeg");
        if (data) {
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
    <ReactSketchCanvas
      ref={canvasRef}
      strokeWidth={80}
      strokeColor="white"
      canvasColor="transparent"
      onChange={handleChange}
    />
  );
}
