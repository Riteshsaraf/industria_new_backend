const fs = require("fs");
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const Jimp = require("jimp");

class ImageService {
  async saveBase64Image(base64, resize = true) {
    const matches = base64.match(
      /^data:(image\/[a-zA-Z0-9.+-]+);base64,(.+)$/
    );

    if (!matches) {
      throw new Error("Invalid base64 image");
    }

    const mimeType = matches[1];
    const base64Data = matches[2];
    const buffer = Buffer.from(base64Data, "base64");

    const uploadPath = path.join(process.cwd(), "uploads");

    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }

    // SVG handling
    if (mimeType === "image/svg+xml") {
      const fileName = `${uuidv4()}.svg`;
      const filePath = path.join(uploadPath, fileName);

      fs.writeFileSync(filePath, buffer);

      return fileName;
    }

    // PNG/JPEG handling
    let extension = "jpg";

    if (mimeType === "image/png") {
      extension = "png";
    }

    const fileName = `${uuidv4()}.${extension}`;
    const filePath = path.join(uploadPath, fileName);

    if (resize) {
      const image = await Jimp.read(buffer);

      image.resize(1024, Jimp.AUTO);

      if (extension === "jpg") {
        image.quality(75);
      }

      await image.writeAsync(filePath);
    } else {
      fs.writeFileSync(filePath, buffer);
    }

    return fileName;
  }
}

module.exports = new ImageService();