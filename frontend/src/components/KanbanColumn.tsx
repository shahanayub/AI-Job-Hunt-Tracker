import React from "react";
import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { KanbanCard } from "./KanbanCard";

interface KanbanColumnProps {
  id: string;
  title: string;
  jobs: any[];
  onEdit: (job: any) => void;
  onDelete: (id: string) => void;
  onAnalyze: (job: any) => void;
  loadingAnalysis: boolean;
}

export const KanbanColumn: React.FC<KanbanColumnProps> = ({
  id,
  title,
  jobs,
  onEdit,
  onDelete,
  onAnalyze,
  loadingAnalysis,
}) => {
  const { setNodeRef } = useDroppable({ id });

  return (
    <div
      ref={setNodeRef}
      style={{
        flex: 1,
        minWidth: "220px",
        backgroundColor: "#f8fafc",
        borderRadius: "8px",
        padding: "12px",
        display: "flex",
        flexDirection: "column",
        border: "1px solid #e2e8f0",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "12px",
        }}
      >
        <h3 style={{ margin: 0, fontSize: "16px", color: "#334155" }}>
          {title}
        </h3>
        <span
          style={{
            backgroundColor: "#cbd5e1",
            borderRadius: "12px",
            padding: "2px 8px",
            fontSize: "12px",
            fontWeight: "bold",
            color: "#475569",
          }}
        >
          {jobs.length}
        </span>
      </div>

      <SortableContext
        items={jobs.map((j) => j._id)}
        strategy={verticalListSortingStrategy}
      >
        <div style={{ minHeight: "150px" }}>
          {jobs.map((job) => (
            <KanbanCard
              key={job._id}
              job={job}
              onEdit={onEdit}
              onDelete={onDelete}
              onAnalyze={onAnalyze}
              loadingAnalysis={loadingAnalysis}
            />
          ))}
        </div>
      </SortableContext>
    </div>
  );
};