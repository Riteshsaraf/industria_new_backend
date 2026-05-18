const fs = require("fs");
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const Jimp = require("jimp");

class ImageService {
  async saveBase64Image(base64) {
    const matches = base64.match(
      /^data:(image\/\w+);base64,(.+)$/
    );

    if (!matches) {
      throw new Error("Invalid base64 image");
    }

    const base64Data = matches[2];

    const buffer = Buffer.from(base64Data, "base64");

    const fileName = `${uuidv4()}.jpg`;
    const uploadPath = path.join(process.cwd(), "uploads");

    // create folder if not exists
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }

    const filePath = path.join(uploadPath, fileName);

    // ---- JIMP PROCESSING ----
    const image = await Jimp.read(buffer);

    // resize (max width 1024, keep aspect ratio)
    image.resize(1024, Jimp.AUTO);

    // compress (quality 75%)
    image.quality(75);

    // force jpeg output
    await image.writeAsync(filePath);

    return fileName;
  }
}

module.exports = new ImageService();