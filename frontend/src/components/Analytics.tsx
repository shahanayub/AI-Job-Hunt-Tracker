import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

import { API_BASE_URL } from "./config";

interface IndustryStat {
  industry: string;
  total: number;
  responses: number;
  responseRate: number;
}

interface StatsData {
  totalJobs: number;
  avgMatchScore: number;
  responseRate: number;
  chartData: { name: string; value: number; fill: string }[];
  industryStats: IndustryStat[];
}

export const Analytics: React.FC = () => {
  const [stats, setStats] = useState<StatsData | null>(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await fetch("${API_BASE_URL}/jobs/stats");
      const data = await res.json();
      setStats(data);
    } catch (err) {
      console.error("Failed to load stats", err);
    }
  };

  if (!stats) return null;

  return (
    <div
      style={{
        backgroundColor: "#ffffff",
        borderRadius: "12px",
        padding: "20px",
        marginBottom: "24px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
        border: "1px solid #e2e8f0",
      }}
    >
      <h2 style={{ marginTop: 0, marginBottom: "16px", color: "#1e293b" }}>
        📊 Application Analytics
      </h2>

      {/* Metric Cards Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          gap: "16px",
          marginBottom: "24px",
        }}
      >
        <div
          style={{
            backgroundColor: "#f8fafc",
            padding: "16px",
            borderRadius: "8px",
            border: "1px solid #e2e8f0",
          }}
        >
          <span style={{ fontSize: "14px", color: "#64748b" }}>
            Total Applications
          </span>
          <h3 style={{ margin: "4px 0 0 0", fontSize: "24px", color: "#0f172a" }}>
            {stats.totalJobs}
          </h3>
        </div>

        <div
          style={{
            backgroundColor: "#f8fafc",
            padding: "16px",
            borderRadius: "8px",
            border: "1px solid #e2e8f0",
          }}
        >
          <span style={{ fontSize: "14px", color: "#64748b" }}>
            Avg ATS Match
          </span>
          <h3 style={{ margin: "4px 0 0 0", fontSize: "24px", color: "#3b82f6" }}>
            {stats.avgMatchScore}%
          </h3>
        </div>

        <div
          style={{
            backgroundColor: "#f8fafc",
            padding: "16px",
            borderRadius: "8px",
            border: "1px solid #e2e8f0",
          }}
        >
          <span style={{ fontSize: "14px", color: "#64748b" }}>
            Response Rate
          </span>
          <h3 style={{ margin: "4px 0 0 0", fontSize: "24px", color: "#22c55e" }}>
            {stats.responseRate}%
          </h3>
        </div>
      </div>

      {/* Bar Chart Container */}
      <div style={{ width: "100%", height: 220 }}>
        <h4 style={{ margin: "0 0 12px 0", color: "#475569" }}>
          Applications by Stage
        </h4>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={stats.chartData}>
            <XAxis dataKey="name" stroke="#64748b" fontSize={12} />
            <YAxis allowDecimals={false} stroke="#64748b" fontSize={12} />
            <Tooltip />
            <Bar dataKey="value" radius={[4, 4, 0, 0]}>
              {stats.chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Response Rate by Industry */}
      {stats.industryStats?.length > 0 && (
        <div style={{ marginTop: "24px" }}>
          <h4 style={{ margin: "0 0 12px 0", color: "#475569" }}>
            Response Rate by Industry
          </h4>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "8px",
            }}
          >
            {stats.industryStats.map((item) => (
              <div
                key={item.industry}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  backgroundColor: "#f8fafc",
                  padding: "10px 14px",
                  borderRadius: "8px",
                  border: "1px solid #e2e8f0",
                  fontSize: "14px",
                }}
              >
                <span style={{ color: "#0f172a" }}>{item.industry}</span>
                <span style={{ color: "#64748b" }}>
                  {item.responseRate}%{" "}
                  <span style={{ color: "#94a3b8" }}>
                    ({item.responses}/{item.total})
                  </span>
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};