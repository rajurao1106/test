import express from "express";
import mongoose from "mongoose";
import multer from "multer";
import cors from "cors";
import fs from "fs";
import path from "path";

const app = express();
app.use(cors());
app.use(express.json());

// ✅ 1. MongoDB Connection
mongoose
  .connect(
    // "mongodb+srv://rajurao1107:raoraju13377@cluster0.zjucb.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0",
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// ✅ 2. Ensure uploads directory exists
const uploadDir = path.join(process.cwd(), "");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
  console.log("📁 'uploads' folder created");
}

// ✅ 3. Mongoose Schema
const ImageSchema = new mongoose.Schema({
  name: String,
  img: {
    data: Buffer,
    contentType: String,
  },
});
const Image = mongoose.model("TestImages", ImageSchema);

// ✅ 4. Multer Storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const safeName =
      Date.now() +
      "-" +
      path.basename(file.originalname).replace(/[^\w.-]/g, "_");
    cb(null, safeName);
  },
});
const upload = multer({ storage });

// ✅ 5. Upload Route
app.post("/upload", upload.single("photo"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    const newImage = new Image({
      name: req.file.originalname,
      img: {
        data: fs.readFileSync(req.file.path),
        contentType: req.file.mimetype,
      },
    });

    const savedImage = await newImage.save();
    fs.unlinkSync(req.file.path); // delete temp file after saving

    res.json({
      message: "✅ Image uploaded successfully!",
      imageId: savedImage._id,
    });
  } catch (err) {
    console.error("❌ Upload error:", err);
    res.status(500).json({ error: "Failed to upload image" });
  }
});

// ✅ 6. Retrieve Route
app.get("/image/:id", async (req, res) => {
  try {
    const image = await Image.findById(req.params.id);
    if (!image) return res.status(404).send("Image not found");

    res.contentType(image.img.contentType);
    res.send(image.img.data);
  } catch (err) {
    console.error("❌ Retrieve error:", err);
    res.status(500).send("Error retrieving image");
  }
});

// ✅ 7. Start Server
const PORT = 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
