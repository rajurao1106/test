import React, { useState } from "react";
import axios from "axios";

const UploadAndShow = () => {
  const [file, setFile] = useState(null);
  const [imageId, setImageId] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return alert("Please select an image!");

    const formData = new FormData();
    formData.append("photo", file);

    try {
      const res = await axios.post("http://localhost:5000/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setImageId(res.data.imageId);
      alert("✅ Image uploaded successfully!");
    } catch (err) {
      console.error(err);
      alert("❌ Upload failed!");
    }
  };

  const handleRetrieve = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/image/${imageId}`, {
        responseType: "blob",
      });

      const url = URL.createObjectURL(res.data);
      setImageUrl(url);
    } catch (err) {
      console.error(err);
      alert("❌ Failed to retrieve image");
    }
  };

  return (
    <div className="flex flex-col gap-4 items-start p-6">
      <form onSubmit={handleUpload} className="flex flex-col gap-2">
        <input type="file" accept="image/*" onChange={handleFileChange} />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Upload
        </button>
      </form>

      {imageId && (
        <button
          onClick={handleRetrieve}
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          Retrieve Image
        </button>
      )}

      {imageUrl && (
        <div className="mt-4">
          <h3 className="mb-2 text-lg font-semibold">Retrieved Image:</h3>
          <img src={imageUrl} alt="Uploaded" className="w-64 rounded shadow" />
        </div>
      )}
    </div>
  );
};

export default UploadAndShow;
