const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const sharp = require('sharp');

class ImageService {

  async saveBase64Image(base64) {

    const matches = base64.match(/^data:(image\/\w+);base64,(.+)$/);

    if (!matches) {
      throw new Error('Invalid base64 image');
    }

    const mimeType = matches[1];
    const base64Data = matches[2];

    const buffer = Buffer.from(base64Data, 'base64');

    const fileName = `${uuidv4()}.jpg`; // normalize to jpg
    const uploadPath = path.join(process.cwd(), 'uploads');

    // create folder if not exists
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }

    const filePath = path.join(uploadPath, fileName);

    // compress + resize image
    const compressedBuffer = await sharp(buffer)
      .resize({ width: 1024, withoutEnlargement: true })
      .jpeg({ quality: 75 })
      .toBuffer();

    await fs.promises.writeFile(filePath, compressedBuffer);

    return fileName;
  }
}

module.exports = new ImageService();