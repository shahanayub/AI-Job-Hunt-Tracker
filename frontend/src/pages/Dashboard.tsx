import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import JobForm from "../components/JobForm";
import ResumeUpload from "../components/ResumeUpload";
import { KanbanColumn } from "../components/KanbanColumn";
import {
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
  closestCenter,
} from "@dnd-kit/core";
import type { DragEndEvent } from "@dnd-kit/core";
import { Analytics } from "../components/Analytics";

const COLUMNS = [
  { id: "Saved", title: "📑 Saved" },
  { id: "Applied", title: "🟦 Applied" },
  { id: "Interview", title: "🟧 Interview" },
  { id: "Offer", title: "🟩 Offer" },
  { id: "Rejected", title: "🟥 Rejected" },
];

function Dashboard() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [editingJob, setEditingJob] = useState<any>(null);
  const [loadingAnalysis, setLoadingAnalysis] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    })
  );

  useEffect(() => {
    loadJobs();
  }, []);

  async function loadJobs() {
    try {
      const response = await fetch("http://localhost:5000/jobs");
      const data = await response.json();
      setJobs(data);
    } catch (err) {
      console.error("Failed to load jobs", err);
    }
  }

  async function addJob(job: any) {
    if (editingJob) {
      await fetch(`http://localhost:5000/jobs/${editingJob._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(job),
      });
      setEditingJob(null);
    } else {
      await fetch("http://localhost:5000/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(job),
      });
    }
    loadJobs();
  }

  async function deleteJob(jobId: string) {
    await fetch(`http://localhost:5000/jobs/${jobId}`, {
      method: "DELETE",
    });
    loadJobs();
  }

  async function analyzeJob(job: any) {
    setLoadingAnalysis(true);
    try {
      const resumeResponse = await fetch(
        "http://localhost:5000/resume/latest"
      );
      const resume = await resumeResponse.json();

      if (!resume.text) {
        alert("Please upload a resume first!");
        return;
      }

      const response = await fetch("http://localhost:5000/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jobId: job._id,
          resumeText: resume.text,
          jobDescription: job.description,
        }),
      });

      const updatedJob = await response.json();

      if (!response.ok) {
        alert(updatedJob.message);
        return;
      }

      loadJobs();
    } catch (err) {
      console.error(err);
      alert("Analysis failed.");
    } finally {
      setLoadingAnalysis(false);
    }
  }

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over) return;

    const activeJobId = active.id.toString();
    const overId = over.id.toString();

    const activeJob = jobs.find((j) => j._id === activeJobId);
    if (!activeJob) return;

    let targetStatus = overId;
    const overJob = jobs.find((j) => j._id === overId);
    if (overJob) {
      targetStatus = overJob.status;
    }

    if (activeJob.status === targetStatus) return;

    setJobs((prevJobs) =>
      prevJobs.map((j) =>
        j._id === activeJobId ? { ...j, status: targetStatus } : j
      )
    );

    try {
      await fetch(`http://localhost:5000/jobs/${activeJobId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...activeJob, status: targetStatus }),
      });
      loadJobs();
    } catch (err) {
      console.error("Failed to save drag move", err);
      loadJobs();
    }
  }

  return (
    <div style={{ padding: "24px", maxWidth: "1400px", margin: "0 auto" }}>
      <h1>Dashboard</h1>
      <p style={{ color: "#64748b" }}>
        Track your job applications across the hiring pipeline.
      </p>

      <ResumeUpload />

      {/* Analytics Dashboard Component */}
      <Analytics />

      <JobForm onAddJob={addJob} editingJob={editingJob} />

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <div
          style={{
            display: "flex",
            gap: "16px",
            overflowX: "auto",
            paddingBottom: "16px",
            marginTop: "24px",
          }}
        >
          {COLUMNS.map((col) => (
            <KanbanColumn
              key={col.id}
              id={col.id}
              title={col.title}
              jobs={jobs.filter((j) => (j.status || "Saved") === col.id)}
              onEdit={setEditingJob}
              onDelete={deleteJob}
              onAnalyze={analyzeJob}
              loadingAnalysis={loadingAnalysis}
            />
          ))}
        </div>
      </DndContext>

      <div style={{ marginTop: "24px" }}>
        <Link to="/" style={{ textDecoration: "none", color: "#3b82f6" }}>
          ← Back to Home
        </Link>
      </div>
    </div>
  );
}

export default Dashboard;