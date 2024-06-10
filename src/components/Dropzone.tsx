import { useCallback } from "react";
import { useDropzone } from "react-dropzone";

interface DropzoneProps {
  onImageDropped: (file: File) => void;
  userUploadedImage: File | null;
}

const Dropzone: React.FC<DropzoneProps> = ({
  onImageDropped,
  userUploadedImage,
}) => {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      onImageDropped(acceptedFiles[0]);
    },
    [onImageDropped]
  );
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <div
      {...getRootProps()}
      className="text-center text-xl z-30
       absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
    >
      <input {...getInputProps()} />
      {isDragActive ? (
        <button className="bg-red-500 py-1 px-2 rounded-3xl ">
          Drop the image here ...
        </button>
      ) : (
        <button className="bg-red-500 py-1 px-2 rounded-3xl">
          Optional: Drag and drop a starting image here
        </button>
      )}
    </div>
  );
};

export default Dropzone;
