import React, { useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { API_BASE_URL } from "../config";

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

  const [showEmailModal, setShowEmailModal] = useState(false);
  const [emailDraft, setEmailDraft] = useState<{ subject: string; body: string } | null>(null);
  const [generatingEmail, setGeneratingEmail] = useState(false);

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

  const getScoreColor = (score: number) => {
    if (score >= 70) return "#22c55e";
    if (score >= 40) return "#eab308";
    return "#ef4444";
  };

  // Check if follow-up is due today or in the past
  const isFollowUpDue = () => {
    if (!job.followUpDate) return false;
    const due = new Date(job.followUpDate);
    const today = new Date();
    due.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);
    return due <= today;
  };

  // Generate Email using Gemini API
  const handleGenerateEmail = async () => {
    setGeneratingEmail(true);
    setShowEmailModal(true);
    try {
      const res = await fetch(`${API_BASE_URL}/jobs/generate-email`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          company: job.company,
          position: job.position,  
          notes: job.notes,
        }),
      });
      const data = await res.json();
      setEmailDraft(data);
    } catch (err) {
      console.error(err);
      alert("Failed to draft follow-up email.");
    } finally {
      setGeneratingEmail(false);
    }
  };

 const handleSendEmailViaApi = async () => {
  if (!emailDraft) return;

  try {
    const res = await fetch(`${API_BASE_URL}/api/send-email`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        to: job.companyEmail || "recruiter@example.com",
        subject: emailDraft.subject,
        body: emailDraft.body,
      }),
    });

    const data = await res.json();

    if (res.status === 401) {
      // Prompt user to authenticate if tokens aren't set
      const authRes = await fetch(`${API_BASE_URL}/api/auth/google`);
      const { url } = await authRes.json();
      window.open(url, "_blank");
    } else if (data.success) {
      alert("🚀 Email dispatched successfully via Gmail API!");
      setShowEmailModal(false);
    }
  } catch (err) {
    console.error("Email dispatch error:", err);
    alert("Failed to send email.");
  }
};

  return (
    <div ref={setNodeRef} style={style}>
      {/* Drag Handle */}
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

      {/* Follow Up Alert Badge */}
      {isFollowUpDue() && (
        <div
          style={{
            backgroundColor: "#fef2f2",
            border: "1px solid #fca5a5",
            color: "#991b1b",
            padding: "4px 8px",
            borderRadius: "4px",
            fontSize: "12px",
            fontWeight: "bold",
            marginBottom: "8px",
            display: "inline-block",
          }}
        >
          ⏰ Follow-up Due!
        </div>
      )}

      {/* ATS Progress Bar */}
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
          onClick={handleGenerateEmail}
          style={{
            fontSize: "12px",
            padding: "4px 8px",
            backgroundColor: "#8b5cf6",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Email
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

      {/* Analysis Details */}
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
          
          {job.suggestions?.length > 0 && (
            <div style={{ marginTop: "6px" }}>
              <strong>Suggestions:</strong>
              <ul style={{ paddingLeft: "16px", margin: "4px 0" }}>
                {job.suggestions.map((sug: string, i: number) => (
                  <li key={i}>{sug}</li>
                 ))}
              </ul>
            </div>
          )}
        </details>
      )}

      {/* Generated Email Modal */}
      {showEmailModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              backgroundColor: "#ffffff",
              borderRadius: "8px",
              padding: "24px",
              width: "90%",
              maxWidth: "500px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
            }}
          >
            <h3 style={{ marginTop: 0 }}>✨ AI Follow-up Draft</h3>

            {generatingEmail ? (
              <p>Gemini is drafting your email...</p>
            ) : (
              emailDraft && (
                <div>
                  <div style={{ marginBottom: "12px" }}>
                    <strong>Subject:</strong>
                    <input
                      type="text"
                      value={emailDraft.subject}
                      onChange={(e) =>
                        setEmailDraft({ ...emailDraft, subject: e.target.value })
                      }
                      style={{
                        width: "100%",
                        padding: "6px",
                        marginTop: "4px",
                        borderRadius: "4px",
                        border: "1px solid #cbd5e1",
                      }}
                    />
                  </div>

                  <div style={{ marginBottom: "16px" }}>
                    <strong>Body:</strong>
                    <textarea
                      rows={8}
                      value={emailDraft.body}
                      onChange={(e) =>
                        setEmailDraft({ ...emailDraft, body: e.target.value })
                      }
                      style={{
                        width: "100%",
                        padding: "6px",
                        marginTop: "4px",
                        borderRadius: "4px",
                        border: "1px solid #cbd5e1",
                      }}
                    />
                  </div>

                  <div
                    style={{
                      display: "flex",
                      justifyContent: "flex-end",
                      gap: "8px",
                    }}
                  >
                    <button
                      onClick={() => setShowEmailModal(false)}
                      style={{
                        padding: "6px 12px",
                        borderRadius: "4px",
                        border: "1px solid #cbd5e1",
                        background: "#fff",
                        cursor: "pointer",
                      }}
                    >
                      Close
                    </button>
                    <button
                      onClick={handleSendEmailViaApi}
                      style={{
                        padding: "6px 12px",
                        borderRadius: "4px",
                        border: "none",
                        background: "#22c55e",
                        color: "#fff",
                        cursor: "pointer",
                      }}
                    >
                      Send via Mail Client / Gmail 🚀
                    </button>
                  </div>
                </div>
              )
            )}
          </div>
        </div>
      )}
    </div>
  );
};