import React, { useState } from "react";
import "../styles/styles.css";
import { useDropzone } from "react-dropzone";
import axios from "axios";
import { Link } from "react-router-dom";

const projects = [
  { id: 1, name: "Design Initiative" },
  { id: 2, name: "Development Task" },
  { id: 3, name: "Analytics Project" },
  { id: 4, name: "Innovation Hub" },
  { id: 5, name: "Research Study" },
  { id: 6, name: "Solutions Series" },
  { id: 7, name: "Strategy Plan" },
  { id: 8, name: "Insights Report" },
  { id: 9, name: "Expansion Effort" },
];

const Dashboard = () => {
  const [selectedProject, setSelectedProject] = useState(null);
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);

  const handleProjectClick = (project) => {
    setSelectedProject(project);
  };

  const { getRootProps, getInputProps } = useDropzone({
    accept: "image/*,application/pdf",
    onDrop: (acceptedFiles) => {
      setFiles(
        acceptedFiles.map((file) =>
          Object.assign(file, {
            preview: URL.createObjectURL(file),
          })
        )
      );
    },
  });

  const handleUpload = async () => {
    if (!selectedProject) {
      alert("Please select a project first");
      return;
    }

    setUploading(true);

    try {
      const formData = new FormData();
      files.forEach((file) => {
        formData.append("file", file);
      });
      formData.append("projectId", selectedProject.id.toString());

      const response = await axios.post(
        "http://localhost:8080/api/files",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log(response.data);
      alert("Files uploaded successfully!");
    } catch (error) {
      console.error("Error uploading files:", error);
      alert("Error uploading files.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="dashboard">
      <aside className="sidebar">
        <h1>Projects</h1>
        <ul>
          {projects.map((project) => (
            <li
              key={project.id}
              onClick={() => handleProjectClick(project)}
              className={selectedProject?.id === project.id ? "active" : ""}
            >
              {project.name}
            </li>
          ))}
        </ul>
      </aside>
      <main className="main-content">
        <section className="project-info">
          {selectedProject ? (
            <div>
              <h2>{selectedProject.name}</h2>
              <p>Details about {selectedProject.name}</p>
              <Link to={`/project-details/${selectedProject.id}`}>
                View Project Details
              </Link>
            </div>
          ) : (
            <p>Select a project to view details</p>
          )}
        </section>
        <section className="file-upload">
          <div className="drop-files" {...getRootProps()}>
            <input {...getInputProps()} />
            <h3>Drag and drop files here, or click to select files</h3>
            <div className="file-previews">
              {files.map((file) => (
                <div key={file.name} className="file-preview">
                  {file.type.startsWith("image/") ? (
                    <img
                      src={file.preview}
                      alt={file.name}
                      style={{ width: 100, height: 100 }}
                    />
                  ) : (
                    <div>{file.name}</div>
                  )}
                </div>
              ))}
            </div>
          </div>
          <div className="upload-button-container">
            <button onClick={handleUpload} disabled={uploading}>
              {uploading ? "Uploading..." : "Upload Files"}
            </button>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Dashboard;
