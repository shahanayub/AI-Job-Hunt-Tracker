import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface KanbanCardProps {
  job: any;
  onEdit: (job: any) => void;
  onDelete: (id: string) => void;
  onAnalyze: (job: any) => void;
  loadingAnalysis: boolean;
}

export const KanbanCard: React.FC<KanbanCardProps> = ({
  job,
  onEdit,
  onDelete,
  onAnalyze,
  loadingAnalysis,
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: job._id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
    marginBottom: "12px",
    padding: "16px",
    backgroundColor: "#ffffff",
    borderRadius: "8px",
    boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
    border: "1px solid #e2e8f0",
  };

  // Helper for color-coded ATS Score Progress Bar
  const getScoreColor = (score: number) => {
    if (score >= 70) return "#22c55e"; // Green
    if (score >= 40) return "#eab308"; // Yellow
    return "#ef4444"; // Red
  };

  return (
    <div ref={setNodeRef} style={style}>
      {/* Drag Handle Header */}
      <div
        {...attributes}
        {...listeners}
        style={{
          cursor: "grab",
          fontWeight: "bold",
          marginBottom: "8px",
          color: "#1e293b",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <span>{job.company}</span>
        <span style={{ fontSize: "12px", color: "#64748b" }}>⣿⣿</span>
      </div>

      <p style={{ margin: "0 0 8px 0", color: "#475569", fontSize: "14px" }}>
        {job.position}
      </p>

      {/* Visual ATS Progress Bar */}
      {job.matchScore > 0 && (
        <div style={{ margin: "8px 0" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontSize: "12px",
              fontWeight: "bold",
              marginBottom: "4px",
            }}
          >
            <span>🎯 ATS Match</span>
            <span style={{ color: getScoreColor(job.matchScore) }}>
              {job.matchScore}%
            </span>
          </div>
          <div
            style={{
              width: "100%",
              height: "6px",
              backgroundColor: "#e2e8f0",
              borderRadius: "3px",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                width: `${job.matchScore}%`,
                height: "100%",
                backgroundColor: getScoreColor(job.matchScore),
                transition: "width 0.3s ease",
              }}
            />
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div
        style={{
          display: "flex",
          gap: "6px",
          marginTop: "12px",
          flexWrap: "wrap",
        }}
      >
        <button
          onClick={() => onAnalyze(job)}
          disabled={loadingAnalysis}
          style={{
            fontSize: "12px",
            padding: "4px 8px",
            backgroundColor: "#3b82f6",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          {loadingAnalysis ? "..." : "Analyze"}
        </button>
        <button
          onClick={() => onEdit(job)}
          style={{
            fontSize: "12px",
            padding: "4px 8px",
            backgroundColor: "#f59e0b",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Edit
        </button>
        <button
          onClick={() => onDelete(job._id)}
          style={{
            fontSize: "12px",
            padding: "4px 8px",
            backgroundColor: "#ef4444",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Delete
        </button>
      </div>

      {/* Saved Analysis Drawer */}
      {job.matchScore > 0 && (
        <details style={{ marginTop: "10px", fontSize: "12px" }}>
          <summary style={{ cursor: "pointer", color: "#3b82f6" }}>
            View Details
          </summary>
          {job.strengths?.length > 0 && (
            <div style={{ marginTop: "6px" }}>
              <strong>Strengths:</strong>
              <ul style={{ paddingLeft: "16px", margin: "4px 0" }}>
                {job.strengths.map((s: string, i: number) => (
                  <li key={i}>{s}</li>
                ))}
              </ul>
            </div>
          )}
          {job.missingSkills?.length > 0 && (
            <div style={{ marginTop: "6px" }}>
              <strong>Missing Skills:</strong>
              <ul style={{ paddingLeft: "16px", margin: "4px 0" }}>
                {job.missingSkills.map((m: string, i: number) => (
                  <li key={i}>{m}</li>
                ))}
              </ul>
            </div>
          )}
        </details>
      )}
    </div>
  );
};