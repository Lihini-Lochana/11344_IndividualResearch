import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { TrackingContext } from "../context/TrackingContext";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  BarChart,
  Bar,
  Cell,
  Legend,
} from "recharts";

function TrackingDashboard() {
  const navigate = useNavigate();

  const { trackingData, getTimeOnTask, resetTracking } =
    useContext(TrackingContext);

  const time = getTimeOnTask();

  const safeClicks = trackingData.totalClicks || 1;

  const clickRate = time > 0 ? trackingData.totalClicks / time : 0;

  const errorRate = trackingData.errors / safeClicks;

  const backClickRate = trackingData.backClicks / safeClicks;

  const avgHesitation =
    trackingData.hesitationTimes.length > 0
      ? (
          trackingData.hesitationTimes.reduce((a, b) => a + b, 0) /
          trackingData.hesitationTimes.length
        ).toFixed(2)
      : 0;

  const hesitationData = trackingData.hesitationTimes.map((time, index) => ({
    event: index + 1,
    seconds: time,
  }));

  const interactionCounts = {};

  trackingData.interactionLog.forEach((log) => {
    interactionCounts[log.type] = (interactionCounts[log.type] || 0) + 1;
  });

  const pieData = Object.entries(interactionCounts).map(([name, value]) => ({
    name,
    value,
  }));

  const COLORS = [
    "#2563eb",
    "#22c55e",
    "#f59e0b",
    "#ef4444",
    "#8b5cf6",
    "#06b6d4",
  ];

  const taskStages = [
    "HomePage",
    "SearchResultsPage",
    "DoctorProfilePage",
    "BookingPage",
    "BookingFormPage",
  ];

  const reachedStages = taskStages.filter((stage) =>
    trackingData.pagesVisited.includes(stage),
  );

  const journeyStages = [
    "HomePage",
    "SearchResultsPage",
    "BookingPage",
    "BookingFormPage",
    "Success",
  ];

  const completedStages = journeyStages.filter((stage) =>
    trackingData.pagesVisited.includes(stage),
  ).length;

  const completionPercentage = Math.round(
    (completedStages / journeyStages.length) * 100,
  );

  const taskPages = [
    "HomePage",
    "SearchResultsPage",
    "DoctorProfilePage",
    "BookingPage",
    "BookingFormPage",
  ];

  const pageClickCounts = {};

  taskPages.forEach((page) => {
    pageClickCounts[page] = {
      page,
      clicks: 0,
    };
  });

  let currentPage = null;

  trackingData.interactionLog.forEach((log) => {
    if (log.type === "PAGE_VISIT" && log.page) {
      currentPage = log.page;
    }

    if (log.type === "CLICK") {
      if (currentPage && pageClickCounts[currentPage]) {
        pageClickCounts[currentPage].clicks += 1;
      }
    }
  });

  const pageLabelMap = {
    HomePage: "Home",
    SearchResultsPage: "Search",
    DoctorProfilePage: "Doctor",
    BookingPage: "Booking",
    BookingFormPage: "Form",
  };

  const clicksPerPageData = Object.values(pageClickCounts).map((item) => ({
    page: pageLabelMap[item.page] || item.page,
    clicks: item.clicks,
  }));

  const handleClearTracking = () => {
    const confirmed = window.confirm(
      "Are you sure you want to clear all previous tracking data?",
    );

    if (confirmed) {
      resetTracking();
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f8fafc",
        padding: "20px",
      }}
    >
      <button
        onClick={() => navigate("/")}
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 8,

          marginBottom: 15,

          padding: "10px 18px",

          background: "white",
          color: "#1e293b",

          border: "1px solid #cbd5e1",
          borderRadius: 10,

          fontSize: 14,
          fontWeight: 600,

          cursor: "pointer",

          boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
        }}
      >
        ← Home
      </button>

      <div
        style={{
          background: "linear-gradient(135deg,#2563eb,#06b6d4)",
          color: "white",
          padding: "30px",
          borderRadius: 20,
          marginBottom: 30,
          boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 15,
            flexWrap: "wrap",
          }}
        >
          <div>
            <h1
              style={{
                margin: 0,
                fontSize: 36,
              }}
            >
              UX Analytics Dashboard
            </h1>

            <p
              style={{
                marginTop: 10,
                marginBottom: 0,
                opacity: 0.9,
              }}
            >
              User Tracking
            </p>
          </div>

          <button
            onClick={handleClearTracking}
            style={{
              background: "#ffffff",
              color: "#dc2626",
              border: "none",
              padding: "12px 20px",
              borderRadius: 10,
              fontWeight: "bold",
              fontSize: 14,
              cursor: "pointer",
              boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
            }}
          >
            Clear Tracking Data
          </button>
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
          gap: 20,
          marginBottom: 30,
        }}
      >
        <MetricCard
          title="Total Clicks"
          value={trackingData.totalClicks}
          color="#2563eb"
        />

        <MetricCard
          title="Click Rate (per sec)"
          value={clickRate.toFixed(2)}
          color="#6366f1"
        />

        <MetricCard
          title="Errors"
          value={trackingData.errors}
          color="#ef4444"
        />

        <MetricCard
          title="Error Rate"
          value={errorRate.toFixed(2)}
          color="#ef4444"
        />

        <MetricCard
          title="Back Clicks"
          value={trackingData.backClicks}
          color="#f59e0b"
        />

        <MetricCard
          title="Back Click Rate"
          value={backClickRate.toFixed(2)}
          color="#f59e0b"
        />

        <MetricCard
          title="Hesitations"
          value={trackingData.hesitationCount}
          color="#8b5cf6"
        />

        <MetricCard
          title="Avg Hesitation"
          value={`${avgHesitation}s`}
          color="#06b6d4"
        />

        <MetricCard title="Time On Task" value={`${time}s`} color="#22c55e" />

        <MetricCard
          title="Success"
          value={trackingData.success ? "SUCCESS" : "FAILED"}
          color={trackingData.success ? "#22c55e" : "#ef4444"}
        />
      </div>

      <div
        style={{
          display: "flex",
          gap: 20,
          flexWrap: "wrap",
          marginBottom: 30,
        }}
      >
        <div style={{ flex: 1, minWidth: 320 }}>
          <Section title="Hesitation Trend">
            <ResponsiveContainer width="100%" height={350}>
              <LineChart data={hesitationData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="event" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="seconds"
                  stroke="#8b5cf6"
                  strokeWidth={3}
                />
              </LineChart>
            </ResponsiveContainer>
          </Section>
        </div>

        <div style={{ flex: 1, minWidth: 320 }}>
          <Section title="Clicks Per Page">
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={clicksPerPageData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="page" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="clicks" fill="#2563eb" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Section>
        </div>
      </div>

      <Section title="Task Journey">
        <div
          style={{
            marginBottom: 25,
            padding: 20,
            borderRadius: 12,
            background: "#eff6ff",
            border: "1px solid #bfdbfe",
          }}
        >
          <p
            style={{
              marginTop: 10,
              fontSize: 18,
              fontWeight: "bold",
              color: "black",
            }}
          >
            {completedStages} / {journeyStages.length} Stages Completed (
            {completionPercentage}%)
          </p>

          <div
            style={{
              width: "100%",
              height: 12,
              background: "#dbeafe",
              borderRadius: 20,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                width: `${completionPercentage}%`,
                height: "100%",
                background: "linear-gradient(90deg,#22c55e,#16a34a)",
              }}
            />
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 10,
          }}
        >
          {journeyStages.map((stage, index) => {
            const completed = trackingData.pagesVisited.includes(stage);

            return (
              <div
                key={stage}
                style={{
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <div
                  style={{
                    minWidth: 170,
                    textAlign: "center",
                    padding: 15,
                    borderRadius: 14,
                    background: completed ? "#dcfce7" : "#fee2e2",
                    border: completed
                      ? "2px solid #22c55e"
                      : "2px solid #ef4444",
                  }}
                >
                  <div
                    style={{
                      fontSize: 28,
                    }}
                  ></div>

                  <div
                    style={{
                      fontWeight: "bold",
                      marginTop: 8,
                      color: "black",
                    }}
                  >
                    {stage
                      .replace("Page", "")
                      .replace("Results", " Results")
                      .replace("Form", " Form")}
                  </div>
                </div>

                {index < journeyStages.length - 1 && (
                  <div
                    style={{
                      fontSize: 30,
                      margin: "0 12px",
                      color: "#64748b",
                    }}
                  >
                    →
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </Section>

      <Section title="Interaction Log">
        <div
          style={{
            maxHeight: 400,
            overflowY: "auto",
          }}
        >
          {trackingData.interactionLog.map((log, index) => (
            <div
              key={index}
              style={{
                padding: 12,
                borderBottom: "1px solid #ddd",
                color: "black",
              }}
            >
              <strong>{log.type}</strong>

              <div>{new Date(log.time).toLocaleString()}</div>

              <pre
                style={{
                  background: "#f1f5f9",
                  padding: 10,
                  borderRadius: 8,
                  overflowX: "auto",
                }}
              >
                {JSON.stringify(log, null, 2)}
              </pre>
            </div>
          ))}
        </div>
      </Section>
    </div>
  );
}

function MetricCard({ title, value, color }) {
  return (
    <div
      style={{
        background: "white",
        borderRadius: 18,
        padding: 24,
        borderTop: `5px solid ${color}`,
        boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
      }}
    >
      <div
        style={{
          color: "#64748b",
          marginBottom: 10,
          fontSize: 14,
        }}
      >
        {title}
      </div>

      <div
        style={{
          fontSize: 32,
          fontWeight: "bold",
          color,
        }}
      >
        {value}
      </div>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div
      style={{
        background: "white",
        padding: 25,
        borderRadius: 12,
        marginBottom: 25,
        boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
      }}
    >
      <h2
        style={{
          marginBottom: 20,
          color: "#0f172a",
        }}
      >
        {title}
      </h2>

      {children}
    </div>
  );
}

export default TrackingDashboard;
