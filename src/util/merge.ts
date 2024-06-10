import { createCanvas, loadImage } from "canvas";

export async function mergeImages(
  blackImagePath: string,
  targetImagePath: string
) {
  // Load the black image with white marker and the target image
  const blackImage = await loadImage(blackImagePath);
  const targetImage = await loadImage(targetImagePath);

  // Ensure the images are the same size by creating a canvas
  const width = targetImage.width;
  const height = targetImage.height;

  const canvas = createCanvas(width, height);
  const context = canvas.getContext("2d");

  // Draw the target image on the canvas
  context.drawImage(targetImage, 0, 0, width, height);

  // Create an ImageData object for the black image
  const blackCanvas = createCanvas(blackImage.width, blackImage.height);
  const blackContext = blackCanvas.getContext("2d");
  blackContext.drawImage(blackImage, 0, 0);
  const blackImageData = blackContext.getImageData(
    0,
    0,
    blackImage.width,
    blackImage.height
  );

  // Loop through the pixels and blend the images
  const targetImageData = context.getImageData(0, 0, width, height);
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const index = (y * width + x) * 4;

      // If the pixel in the black image is white, copy it to the target image
      if (
        blackImageData.data[index] === 255 &&
        blackImageData.data[index + 1] === 255 &&
        blackImageData.data[index + 2] === 255
      ) {
        targetImageData.data[index] = 255;
        targetImageData.data[index + 1] = 255;
        targetImageData.data[index + 2] = 255;
        targetImageData.data[index + 3] = 255; // full opacity
      }
    }
  }

  // Put the modified image data back onto the canvas
  context.putImageData(targetImageData, 0, 0);
  // Write the output image to a file
  const buffer = canvas.toBuffer("image/png");
  console.log(context);
}

// Paths to your images
const blackImagePath = "";
const targetImagePath = "";

// Merge the images
mergeImages(blackImagePath, targetImagePath)
  .then(() => console.log("Images merged successfully"))
  .catch((error) => console.error("Error merging images:", error));
