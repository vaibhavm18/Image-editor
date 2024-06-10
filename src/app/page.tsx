"use client";
import Dropzone from "@/components/Dropzone";
import EditImage from "@/components/EditImage";
import Image from "next/image";
import { useState } from "react";
const Home: React.FC = () => {
  const [userUploadedImage, setUserUploadedImage] = useState<File | null>(null);

  return (
    <main className=" max-w-5xl mx-auto">
      {!userUploadedImage && (
        <Dropzone
          onImageDropped={setUserUploadedImage}
          userUploadedImage={userUploadedImage}
        />
      )}
      {userUploadedImage && (
        <EditImage removeFile={setUserUploadedImage} file={userUploadedImage} />
      )}

      <div className="absolute top-0">
        {userUploadedImage && (
          <Image
            src={URL.createObjectURL(userUploadedImage)}
            alt="preview image"
            width={400}
            height={400}
            objectFit="contain"
            className="relative "
          />
        )}
      </div>
    </main>
  );
};

export default Home;
