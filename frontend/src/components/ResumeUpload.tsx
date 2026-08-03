import { useState } from "react";

function ResumeUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [message, setMessage] = useState("");
  const [uploadedFileName, setUploadedFileName] = useState("");

  async function handleUpload() {
    if (!file) {
      alert("Please choose a PDF.");
      return;
    }

    const formData = new FormData();
    formData.append("resume", file);

    try {
      const response = await fetch("http://localhost:5000/resume/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message);
        return;
      }

      setUploadedFileName(file.name);
      setMessage("✅ Resume uploaded successfully!");
    } catch (err) {
      console.log(err);
      setMessage("Upload failed.");
    }
  }

  return (
    <div className="resume-upload">
      <h2>Upload Resume</h2>

      <input
        type="file"
        accept=".pdf"
        onChange={(e) =>
          setFile(e.target.files ? e.target.files[0] : null)
        }
      />

      <button onClick={handleUpload}>
        Upload Resume
      </button>

      {uploadedFileName && (
        <div className="resume-info">
          <p>
            📄 <strong>{uploadedFileName}</strong>
          </p>
          <p style={{ color: "green" }}>
            {message}
          </p>
        </div>
      )}
    </div>
  );
}

export default ResumeUpload;