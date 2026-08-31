import { useContext } from "react";

import { TrackingContext } from "../context/TrackingContext";
import useIsMobile from "../hooks/useIsMobile";

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
  Cell,
  Legend,
  BarChart,
  Bar
} from "recharts";


// ======================================================
// TRACKING DASHBOARD
// ======================================================

function TrackingDashboard() {

  const {
    trackingData = {},
    getTimeOnTask,
    resetTracking
  } = useContext(TrackingContext);

  const isMobile = useIsMobile();


  // ======================================================
  // SAFE TRACKING DATA
  // ======================================================

  const totalClicks =
    Number(trackingData.totalClicks) || 0;

  const errors =
    Number(trackingData.errors) || 0;

  const backClicks =
    Number(trackingData.backClicks) || 0;

  const hesitationCount =
    Number(trackingData.hesitationCount) || 0;

  const hesitationTimes =
    Array.isArray(trackingData.hesitationTimes)
      ? trackingData.hesitationTimes
      : [];

  const interactionLog =
    Array.isArray(trackingData.interactionLog)
      ? trackingData.interactionLog
      : [];

  const pagesVisited =
    Array.isArray(trackingData.pagesVisited)
      ? trackingData.pagesVisited
      : [];

  // ======================================================
// DECISION TRACKING DATA
// ======================================================

const decisionCount =
  Number(trackingData.decisionCount) || 0;

const decisionTimes =
  Array.isArray(trackingData.decisionTimes)
    ? trackingData.decisionTimes
    : [];

const averageDecisionTime =
  Number(trackingData.averageDecisionTime) || 0;


  // ======================================================
  // BASIC METRICS
  // ======================================================

  const time =
    Number(getTimeOnTask?.()) || 0;


  // Clicks per second
  const clickRate =
    time > 0
      ? totalClicks / time
      : 0;


  // Errors per click
  const errorRate =
    totalClicks > 0
      ? errors / totalClicks
      : 0;


  // Back clicks per click
  const backClickRate =
    totalClicks > 0
      ? backClicks / totalClicks
      : 0;


  // ======================================================
  // AVERAGE HESITATION
  // ======================================================

  const avgHesitation =
    hesitationTimes.length > 0
      ? (
          hesitationTimes.reduce(
            (sum, value) =>
              sum + Number(value || 0),
            0
          ) /
          hesitationTimes.length
        ).toFixed(2)
      : "0.00";


      // ======================================================
// AVERAGE DECISION TIME
// ======================================================

const avgDecision =
  decisionTimes.length > 0
    ? (
        decisionTimes.reduce(
          (sum, value) =>
            sum + Number(value || 0),
          0
        ) /
        decisionTimes.length
      ).toFixed(2)
    : "0.00";


  // ======================================================
  // HESITATION DATA
  // ======================================================

  const hesitationData =
    hesitationTimes.map(
      (seconds, index) => ({
        event: index + 1,
        seconds: Number(seconds) || 0
      })
    );


    // ======================================================
// DECISION TIME TREND
// ======================================================

const decisionData =
  decisionTimes.map(
    (seconds, index) => ({
      event: index + 1,
      seconds: Number(seconds) || 0
    })
  );



  // ======================================================
  // INTERACTION COUNTS
  // ======================================================

  const interactionCounts = {};

  interactionLog.forEach((log) => {

    const type =
      log?.type || "UNKNOWN";

    interactionCounts[type] =
      (interactionCounts[type] || 0) + 1;

  });

  // ======================================================
// FLOW INFORMATION
// ======================================================

const flowName =
  trackingData.flow ||
  "unknown";


// ======================================================
// FLOW JOURNEY
// ======================================================

const flowStages =
  getFlowStages(
    flowName,
    trackingData.flowBranch
  );

    // ======================================================
// ORDER PAGES ACCORDING TO FLOW
// ======================================================

const orderedPages = [
  "HomePage",
  ...flowStages.filter(
    (stage) => stage !== "HomePage"
  )
];


  const pieData =
    Object.entries(
      interactionCounts
    ).map(
      ([name, value]) => ({
        name: formatInteractionName(name),
        value
      })
    );


  const COLORS = [
    "#2563EB",
    "#22C55E",
    "#F59E0B",
    "#EF4444",
    "#8B5CF6",
    "#06B6D4",
    "#EC4899",
    "#14B8A6"
  ];


  // ======================================================
  // PAGE CLICK COUNTS
  // ======================================================

  const pageClickCounts = {};


  // Create pages from actual page visits
  pagesVisited.forEach((page) => {

    if (!page) {
      return;
    }

    if (!pageClickCounts[page]) {

      pageClickCounts[page] = {
        page,
        clicks: 0
      };

    }

  });


  // Count clicks based on the page stored
  // inside each CLICK interaction.
  interactionLog.forEach((log) => {

    if (log?.type !== "CLICK") {
      return;
    }

    const page =
      log.page ||
      log.pageName ||
      log.data?.page ||
      null;


    if (!page) {
      return;
    }


    if (!pageClickCounts[page]) {

      pageClickCounts[page] = {
        page,
        clicks: 0
      };

    }


    pageClickCounts[page].clicks += 1;

  });


  


  const clicksPerPageData =
  orderedPages
    .filter((page) =>
      pageClickCounts[page]
    )
    .map((page) => ({
      page: formatPageName(page),
      clicks: pageClickCounts[page].clicks
    }));

     // ======================================================
// DECISION TIME PER PAGE
// ======================================================

const decisionByPage = {};

interactionLog.forEach((log) => {

  if (log?.type !== "DECISION_TIME") {
    return;
  }

  const page =
    log.page ||
    "unknown";

  const seconds =
    Number(log.seconds) || 0;

  if (!decisionByPage[page]) {

    decisionByPage[page] = {
      page,
      total: 0,
      count: 0
    };

  }

  decisionByPage[page].total += seconds;
  decisionByPage[page].count += 1;

});


const decisionPerPageData =
  orderedPages
    .filter((page) =>
      decisionByPage[page]
    )
    .map((page) => {

      const item = decisionByPage[page];

      return {
        page: formatPageName(page),

        average:
          item.count > 0
            ? Number(
                (
                  item.total /
                  item.count
                ).toFixed(2)
              )
            : 0,

        decisions: item.count
      };

    });


  // ======================================================
  // PAGE VISIT COUNTS
  // ======================================================

  const pageVisitCounts = {};

  interactionLog.forEach((log) => {

    if (log?.type !== "PAGE_VISIT") {
      return;
    }

    const page =
      log.page ||
      log.pageName ||
      null;

    if (!page) {
      return;
    }

    pageVisitCounts[page] =
      (pageVisitCounts[page] || 0) + 1;

  });


  const pageVisitData =
  orderedPages
    .filter((page) =>
      pageVisitCounts[page]
    )
    .map((page) => ({
      page: formatPageName(page),
      visits: pageVisitCounts[page]
    }));

  



  const completedStages =
    flowStages.filter(
      (stage) =>
        pagesVisited.includes(stage)
    ).length;


  const completionPercentage =
    flowStages.length > 0
      ? Math.round(
          (
            completedStages /
            flowStages.length
          ) * 100
        )
      : 0;


  // ======================================================
  // UNIQUE PAGES
  // ======================================================

  const uniquePages = [
  ...orderedPages.filter((page) =>
    pagesVisited.includes(page)
  ),

  // Keep any pages that are not part of
  // the defined flow at the end
  ...[
    ...new Set(
      pagesVisited.filter(Boolean)
    )
  ].filter(
    (page) =>
      !orderedPages.includes(page)
  )
];

  // ======================================================
  // TASK STATUS
  // ======================================================

  const taskCompleted =
    trackingData.success === true;


  // ======================================================
  // RENDER
  // ======================================================

  return (

    <div
      style={{
        minHeight: "100vh",
        background: "#F8FAFC",
        padding: isMobile
          ? "15px"
          : "30px",
        fontFamily:
          "Inter, sans-serif"
      }}
    >

      {/* ==================================================
          HEADER
      ================================================== */}

      <div
        style={{
          background:
            "linear-gradient(135deg,#2563EB,#06B6D4)",
          color: "white",
          padding: isMobile
            ? "22px"
            : "30px",
          borderRadius: 20,
          marginBottom: 25,
          boxShadow:
            "0 10px 30px rgba(0,0,0,0.12)"
        }}
      >

        <h1
          style={{
            margin: 0,
            fontSize: isMobile
              ? 26
              : 36,
            lineHeight: 1.2
          }}
        >
          Optimized UI
          <br />

          {isMobile
            ? "UX Analytics"
            : "UX Analytics Dashboard"}
        </h1>


        <p
          style={{
            marginTop: 10,
            marginBottom: 0,
            opacity: 0.9,
            fontSize: isMobile
              ? 14
              : 16
          }}
        >
          User interaction and
          cognitive-load tracking
        </p>


        {/* FLOW BADGE */}

        <div
          style={{
            marginTop: 18,
            display: "inline-block",
            padding: "8px 14px",
            borderRadius: 20,
            background:
              "rgba(255,255,255,0.2)",
            fontSize: 14,
            fontWeight: 600
          }}
        >
          Flow: {formatFlowName(flowName)}
        </div>

      <button
    onClick={() => {
      const confirmed = window.confirm(
        "Are you sure you want to clear all recorded tracking data?"
      );

      if (confirmed) {
        resetTracking();
      }
    }}
    style={{
      padding: "9px 16px",
      borderRadius: 10,
      border: "1px solid rgba(255,255,255,0.4)",
      background: "rgba(255,255,255,0.15)",
      color: "white",
      fontWeight: 600,
      cursor: "pointer",
      fontSize: 13
    }}
  >
    Clear Tracking Data
  </button>
</div>


      {/* ==================================================
          PRIMARY METRICS
      ================================================== */}

      <div
        style={{
          display: "grid",

          gridTemplateColumns:
            isMobile
              ? "repeat(2, minmax(0, 1fr))"
              : "repeat(5, minmax(0, 1fr))",

          gap: isMobile
            ? 12
            : 18,

          marginBottom: 25
        }}
      >

        <MetricCard
          title="Time on Task"
          value={`${time.toFixed(1)}s`}
          color="#22C55E"
        />


        <MetricCard
          title="Total Clicks"
          value={totalClicks}
          color="#2563EB"
        />


        <MetricCard
          title="Errors"
          value={errors}
          color="#EF4444"
        />


        <MetricCard
          title="Back Clicks"
          value={backClicks}
          color="#F59E0B"
        />


        <MetricCard
          title="Hesitations"
          value={hesitationCount}
          color="#8B5CF6"
        />

      </div>


      {/* ==================================================
          SECONDARY METRICS
      ================================================== */}

      <div
        style={{
          display: "grid",

          gridTemplateColumns:
            isMobile
              ? "repeat(2, minmax(0, 1fr))"
              : "repeat(6, minmax(0, 1fr))",

          gap: isMobile
            ? 12
            : 18,

          marginBottom: 25
        }}
      >

        <MetricCard
          title="Click Rate"
          value={`${clickRate.toFixed(2)}/s`}
          color="#6366F1"
        />


        <MetricCard
          title="Error Rate"
          value={`${(
            errorRate * 100
          ).toFixed(1)}%`}
          color="#EF4444"
        />


        <MetricCard
          title="Back Click Rate"
          value={`${(
            backClickRate * 100
          ).toFixed(1)}%`}
          color="#F59E0B"
        />

        <MetricCard
          title="Decision Count"
          value={decisionCount}
          color="#7C3AED"
        />

        <MetricCard
          title="Avg Decision Time"
          value={`${avgDecision}s`}
          color="#A855F7"
        />


        <MetricCard
          title="Avg Hesitation"
          value={`${avgHesitation}s`}
          color="#8B5CF6"
        />

      </div>


      {/* ==================================================
          TASK STATUS
      ================================================== */}

      <div
        style={{
          background: "white",
          borderRadius: 18,
          padding: isMobile
            ? 20
            : 25,
          marginBottom: 25,

          boxShadow:
            "0 4px 15px rgba(0,0,0,0.06)",

          borderLeft:
            `6px solid ${
              taskCompleted
                ? "#22C55E"
                : "#EF4444"
            }`
        }}
      >

        <div
          style={{
            fontSize: 14,
            color: "#64748B",
            marginBottom: 8
          }}
        >
          Task Status
        </div>


        <div
          style={{
            fontSize: isMobile
              ? 24
              : 30,
            fontWeight: "bold",

            color:
              taskCompleted
                ? "#16A34A"
                : "#DC2626"
          }}
        >
          {taskCompleted
            ? "✓ SUCCESSFUL"
            : "✕ NOT COMPLETED"}
        </div>

      </div>


      {/* ==================================================
          HESITATION + CLICKS
      ================================================== */}

      <div
        style={{
          display: "grid",

          gridTemplateColumns:
            isMobile
              ? "1fr"
              : "1fr 1fr",

          gap: 20,

          marginBottom: 5
        }}
      >

        {/* HESITATION TREND */}

        <Section title="Hesitation Trend">

          {hesitationData.length === 0 ? (

            <EmptyMessage
              text="No hesitation events recorded."
            />

          ) : (

            <ResponsiveContainer
              width="100%"
              height={300}
            >

              <LineChart
                data={hesitationData}
                margin={{
                  top: 10,
                  right: 10,
                  left: 0,
                  bottom: 10
                }}
              >

                <CartesianGrid
                  strokeDasharray="3 3"
                />

                <XAxis
                  dataKey="event"
                  label={{
                    value:
                      "Hesitation Event",
                    position:
                      "insideBottom",
                    offset: -5
                  }}
                />

                <YAxis
                  label={{
                    value:
                      "Seconds",
                    angle: -90,
                    position:
                      "insideLeft"
                  }}
                />

                <Tooltip
                  formatter={(value) =>
                    `${value} seconds`
                  }
                />

                <Line
                  type="monotone"
                  dataKey="seconds"
                  stroke="#8B5CF6"
                  strokeWidth={3}
                  dot={{
                    r: 4
                  }}
                  activeDot={{
                    r: 6
                  }}
                />

              </LineChart>

            </ResponsiveContainer>

          )}

        </Section>


        {/* CLICKS PER PAGE */}

        <Section title="Clicks Per Page">

          {clicksPerPageData.length === 0 ? (

            <EmptyMessage
              text="No page click data recorded."
            />

          ) : (

            <ResponsiveContainer
              width="100%"
              height={300}
            >

              <BarChart
                data={clicksPerPageData}
                margin={{
                  top: 10,
                  right: 10,
                  left: 0,
                  bottom: 35
                }}
              >

                <CartesianGrid
                  strokeDasharray="3 3"
                />

                <XAxis
                  dataKey="page"
                  angle={
                    isMobile
                      ? -35
                      : -20
                  }
                  textAnchor="end"
                  interval={0}
                  height={70}
                  tick={{
                    fontSize:
                      isMobile
                        ? 9
                        : 11
                  }}
                />

                <YAxis />

                <Tooltip />

                <Bar
                  dataKey="clicks"
                  fill="#2563EB"
                  radius={[
                    8,
                    8,
                    0,
                    0
                  ]}
                />

              </BarChart>

            </ResponsiveContainer>

          )}

        </Section>

      </div>



      {/* ==================================================
    DECISION TIME ANALYTICS
================================================== */}

<div
  style={{
    display: "grid",

    gridTemplateColumns:
      isMobile
        ? "1fr"
        : "1fr 1fr",

    gap: 20,

    marginBottom: 25
  }}
>

  {/* DECISION TIME TREND */}

  <Section title="Decision Time Trend">

    {decisionData.length === 0 ? (

      <EmptyMessage
        text="No decision events recorded."
      />

    ) : (

      <ResponsiveContainer
        width="100%"
        height={300}
      >

        <LineChart
          data={decisionData}
          margin={{
            top: 10,
            right: 10,
            left: 0,
            bottom: 10
          }}
        >

          <CartesianGrid
            strokeDasharray="3 3"
          />

          <XAxis
            dataKey="event"
            label={{
              value:
                "Decision Event",
              position:
                "insideBottom",
              offset: -5
            }}
          />

          <YAxis
            label={{
              value:
                "Seconds",
              angle: -90,
              position:
                "insideLeft"
            }}
          />

          <Tooltip
            formatter={(value) =>
              `${value} seconds`
            }
          />

          <Line
            type="monotone"
            dataKey="seconds"
            stroke="#7C3AED"
            strokeWidth={3}
            dot={{
              r: 4
            }}
            activeDot={{
              r: 6
            }}
          />

        </LineChart>

      </ResponsiveContainer>

    )}

  </Section>


  {/* DECISION TIME PER PAGE */}

  <Section title="Average Decision Time Per Page">

    {decisionPerPageData.length === 0 ? (

      <EmptyMessage
        text="No page decision data recorded."
      />

    ) : (

      <ResponsiveContainer
        width="100%"
        height={300}
      >

        <BarChart
          data={decisionPerPageData}
          margin={{
            top: 10,
            right: 10,
            left: 0,
            bottom: 35
          }}
        >

          <CartesianGrid
            strokeDasharray="3 3"
          />

          <XAxis
            dataKey="page"
            angle={
              isMobile
                ? -35
                : -20
            }
            textAnchor="end"
            interval={0}
            height={70}
            tick={{
              fontSize:
                isMobile
                  ? 9
                  : 11
            }}
          />

          <YAxis />

          <Tooltip
            formatter={(value) =>
              `${value} seconds`
            }
          />

          <Bar
            dataKey="average"
            fill="#7C3AED"
            radius={[
              8,
              8,
              0,
              0
            ]}
          />

        </BarChart>

      </ResponsiveContainer>

    )}

  </Section>

</div>


      {/* ==================================================
          PAGE VISITS
      ================================================== */}

      <Section title="Page Visits">

        {pageVisitData.length === 0 ? (

          <EmptyMessage
            text="No page visit data recorded."
          />

        ) : (

          <ResponsiveContainer
            width="100%"
            height={300}
          >

            <BarChart
              data={pageVisitData}
              margin={{
                top: 10,
                right: 10,
                left: 0,
                bottom: 35
              }}
            >

              <CartesianGrid
                strokeDasharray="3 3"
              />

              <XAxis
                dataKey="page"
                angle={
                  isMobile
                    ? -35
                    : -20
                }
                textAnchor="end"
                interval={0}
                height={70}
                tick={{
                  fontSize:
                    isMobile
                      ? 9
                      : 11
                }}
              />

              <YAxis
                allowDecimals={false}
              />

              <Tooltip />

              <Bar
                dataKey="visits"
                fill="#06B6D4"
                radius={[
                  8,
                  8,
                  0,
                  0
                ]}
              />

            </BarChart>

          </ResponsiveContainer>

        )}

      </Section>


      {/* ==================================================
          INTERACTION DISTRIBUTION
      ================================================== */}

      <Section title="Interaction Distribution">

        {pieData.length === 0 ? (

          <EmptyMessage
            text="No interactions recorded."
          />

        ) : (

          <div
            style={{
              width: "100%",
              height: isMobile
                ? 340
                : 380
            }}
          >

            <ResponsiveContainer
              width="100%"
              height="100%"
            >

              <PieChart>

                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="45%"
                  outerRadius={
                    isMobile
                      ? 90
                      : 120
                  }
                  label={
                    !isMobile
                  }
                >

                  {pieData.map(
                    (entry, index) => (

                      <Cell
                        key={`cell-${index}`}
                        fill={
                          COLORS[
                            index %
                              COLORS.length
                          ]
                        }
                      />

                    )
                  )}

                </Pie>


                <Tooltip />


                <Legend
                  verticalAlign="bottom"
                  height={40}
                />

              </PieChart>

            </ResponsiveContainer>

          </div>

        )}

      </Section>


      {/* ==================================================
          TASK JOURNEY
      ================================================== */}

      <Section title="Optimized Flow Journey">

        <div
          style={{
            marginBottom: 25,
            padding: isMobile
              ? 16
              : 20,
            borderRadius: 12,
            background: "#EFF6FF",
            border:
              "1px solid #BFDBFE"
          }}
        >

          <div
            style={{
              display: "flex",
              justifyContent:
                "space-between",
              alignItems:
                "center",
              marginBottom: 12,
              gap: 10
            }}
          >

            <strong
              style={{
                color: "#0F172A"
              }}
            >
              Journey Progress
            </strong>


            <strong
              style={{
                color: "#2563EB"
              }}
            >
              {completionPercentage}%
            </strong>

          </div>


          <div
            style={{
              width: "100%",
              height: 12,
              background: "#DBEAFE",
              borderRadius: 20,
              overflow: "hidden"
            }}
          >

            <div
              style={{
                width:
                  `${completionPercentage}%`,
                height: "100%",
                background:
                  "linear-gradient(90deg,#22C55E,#16A34A)",
                transition:
                  "width 0.3s ease"
              }}
            />

          </div>


          <p
            style={{
              marginBottom: 0,
              color: "#475569",
              fontSize: 14
            }}
          >
            {completedStages} of{" "}
            {flowStages.length}{" "}
            stages completed
          </p>

        </div>


        {/* JOURNEY STAGES */}

        <div
          style={{
            display: "flex",

            flexDirection:
              isMobile
                ? "column"
                : "row",

            alignItems:
              isMobile
                ? "stretch"
                : "center",

            justifyContent:
              "center",

            gap: isMobile
              ? 8
              : 0,

            overflowX:
              isMobile
                ? "visible"
                : "auto",

            paddingBottom: 5
          }}
        >

          {flowStages.map(
            (stage, index) => {

              const completed =
                pagesVisited.includes(
                  stage
                );


              return (

                <div
                  key={stage}
                  style={{
                    display: "flex",

                    flexDirection:
                      isMobile
                        ? "column"
                        : "row",

                    alignItems:
                      "center",

                    flexShrink: 0
                  }}
                >

                  {/* STAGE */}

                  <div
                    style={{
                      width:
                        isMobile
                          ? "100%"
                          : 150,

                      textAlign:
                        "center",

                      padding: 15,

                      borderRadius: 14,

                      background:
                        completed
                          ? "#DCFCE7"
                          : "#F1F5F9",

                      border:
                        completed
                          ? "2px solid #22C55E"
                          : "2px solid #CBD5E1"
                    }}
                  >

                    <div
                      style={{
                        fontSize: 24
                      }}
                    >
                      {completed
                        ? "✓"
                        : index + 1}
                    </div>


                    <div
                      style={{
                        marginTop: 6,
                        fontWeight:
                          "bold",
                        fontSize: 13,
                        color:
                          "#0F172A"
                      }}
                    >
                      {formatPageName(
                        stage
                      )}
                    </div>

                  </div>


                  {/* CONNECTOR */}

                  {index <
                    flowStages.length - 1 && (

                    <div
                      style={{
                        fontSize: 25,
                        color:
                          completed
                            ? "#22C55E"
                            : "#94A3B8",

                        margin:
                          isMobile
                            ? "2px 0"
                            : "0 8px",

                        transform:
                          isMobile
                            ? "rotate(90deg)"
                            : "none"
                      }}
                    >
                      →
                    </div>

                  )}

                </div>

              );

            }
          )}

        </div>

      </Section>


      {/* ==================================================
          PAGES VISITED
      ================================================== */}

      <Section title="Pages Visited">

        {uniquePages.length === 0 ? (

          <EmptyMessage
            text="No pages visited yet."
          />

        ) : (

          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 10
            }}
          >

            {uniquePages.map(
              (page, index) => (

                <div
                  key={`${page}-${index}`}
                  style={{
                    padding:
                      "10px 14px",
                    borderRadius: 10,
                    background:
                      "#EFF6FF",
                    border:
                      "1px solid #BFDBFE",
                    color:
                      "#1D4ED8",
                    fontSize: 14,
                    fontWeight: 600
                  }}
                >
                  {index + 1}.{" "}
                  {formatPageName(
                    page
                  )}
                </div>

              )
            )}

          </div>

        )}

      </Section>


      {/* ==================================================
          INTERACTION LOG
      ================================================== */}

      <Section title="Interaction Log">

        <div
          style={{
            maxHeight: 450,
            overflowY: "auto"
          }}
        >

          {interactionLog.length === 0 ? (

            <EmptyMessage
              text="No interactions recorded."
            />

          ) : (

            interactionLog.map(
              (log, index) => (

                <div
                  key={
                    `${log.time || "event"}-${index}`
                  }
                  style={{
                    padding:
                      isMobile
                        ? 10
                        : 14,

                    borderBottom:
                      "1px solid #E2E8F0",

                    color:
                      "#0F172A"
                  }}
                >

                  <div
                    style={{
                      display: "flex",
                      justifyContent:
                        "space-between",
                      alignItems:
                        "center",
                      gap: 10,
                      flexWrap:
                        "wrap"
                    }}
                  >

                    <strong>
                      {formatInteractionName(
                        log.type
                      )}
                    </strong>


                    <span
                      style={{
                        fontSize: 12,
                        color:
                          "#64748B"
                      }}
                    >
                      {log.time
                        ? new Date(
                            log.time
                          ).toLocaleTimeString()
                        : "No time"}
                    </span>

                  </div>


                  <pre
                    style={{
                      background:
                        "#F8FAFC",

                      padding: 10,

                      borderRadius: 8,

                      overflowX:
                        "auto",

                      fontSize:
                        isMobile
                          ? 11
                          : 12,

                      marginTop: 8,

                      marginBottom: 0
                    }}
                  >
                    {JSON.stringify(
                      log,
                      null,
                      2
                    )}
                  </pre>

                </div>

              )

            )

          )}

        </div>

      </Section>

    </div>
  );
}


// ======================================================
// METRIC CARD
// ======================================================

function MetricCard({
  title,
  value,
  color
}) {

  return (

    <div
      style={{
        background: "white",
        borderRadius: 16,

        padding: 18,

        borderTop:
          `5px solid ${color}`,

        boxShadow:
          "0 5px 15px rgba(0,0,0,0.06)",

        minWidth: 0
      }}
    >

      <div
        style={{
          color: "#64748B",
          marginBottom: 8,
          fontSize: 13
        }}
      >
        {title}
      </div>


      <div
        style={{
          fontSize: 26,
          fontWeight: "bold",
          color,

          wordBreak:
            "break-word"
        }}
      >
        {value}
      </div>

    </div>

  );
}


// ======================================================
// SECTION
// ======================================================

function Section({
  title,
  children
}) {

  return (

    <div
      style={{
        background: "white",

        padding:
          "clamp(18px, 3vw, 25px)",

        borderRadius: 16,

        marginBottom: 25,

        boxShadow:
          "0 2px 10px rgba(0,0,0,0.06)",

        minWidth: 0
      }}
    >

      <h2
        style={{
          marginTop: 0,
          marginBottom: 20,

          color: "#0F172A",

          fontSize: 20
        }}
      >
        {title}
      </h2>


      {children}

    </div>

  );
}


// ======================================================
// EMPTY MESSAGE
// ======================================================

function EmptyMessage({
  text
}) {

  return (

    <div
      style={{
        padding: 30,
        textAlign: "center",
        color: "#64748B"
      }}
    >
      {text}
    </div>

  );

}


// ======================================================
// FLOW STAGES
// ======================================================

function getFlowStages(flow, branch) {

  switch (flow) {

    case "health_problem":

      // Near Me flow
      if (branch === "near_me") {

        return [
          "HomePage",
          "SymptomSelectionPage",
          "DoctorPreferencePage",
          "LocationMethodPage",
          "ConfirmLocationPage",
          "DetectedLocationRecommendedDoctorsPage",
          "AppointmentDateTimePage"
        ];

      }


      // Hospital selection flow
      if (branch === "hospital") {

        return [
          "SymptomSelectionPage",
          "DoctorPreferencePage",
          "LocationMethodPage",
          "ConfirmHospitalSelectionPage",
          "ConfirmedHospitalRecommendedDoctorsPage",
          "AppointmentDateTimePage"
        ];

      }


      // Town selection flow
      if (branch === "town") {

        return [
          "SymptomSelectionPage",
          "DoctorPreferencePage",
          "LocationMethodPage",
          "ConfirmTownSelectionPage",
          "ConfirmedTownRecommendedDoctorsPage",
          "AppointmentDateTimePage"
        ];

      }


      return [];



 


    case "doctor_name":

      return [
        "DoctorSearchPage",
        "DoctorHospitalsPage",
        "AppointmentDateTimePage",
        "ConfirmationPage"
      ];


    case "hospital_name":

      return [
        "HospitalSelectionPage",
        "HospitalSymptomsPage",
        "HospitalDoctorPreferencePage",
        "HospitalRecommendedDoctorsPage",
        "AppointmentDateTimePage"
      ];


    case "nearest_doctor":

      return [
        "FindNearestLocationPage",
        "NearestSymptomSelectionPage",
        "NearestDoctorPreferencePage",
        "NearestFastestDoctorsPage",
        "AppointmentDateTimePage"
      ];


    case "help_choose":

      return [
        "HelpChooseProblemPage",
        "HelpConfirmLocationPage",
        "HelpDoctorPreferencePage",
        "HelpUrgencyPage",
        "HelpRecommendedDoctorsPage",
        "AppointmentDateTimePage"
      ];


    default:

      return [];

  }
}


// ======================================================
// FORMAT FLOW NAME
// ======================================================

function formatFlowName(flow) {

  const flowNames = {

    I_KNOW_MY_HEALTH_PROBLEM:
      "I Know My Health Problem",

    health_problem:
      "I Know My Health Problem",

    doctor_name:
      "I Know the Doctor Name",

    hospital_name:
      "I Know the Hospital Name",

    nearest_doctor:
      "Nearest Available Doctor",

    help_choose:
      "Help Me Choose"

  };


  return (
    flowNames[flow] ||
    flow ||
    "Unknown"
  );

}


// ======================================================
// FORMAT PAGE NAME
// ======================================================

function formatPageName(page) {

  if (!page) {
    return "Unknown";
  }


  return String(page)
    .replace(/Page$/, "")
    .replace(/([A-Z])/g, " $1")
    .replace(/[_-]/g, " ")
    .replace(/\s+/g, " ")
    .replace(
      /^./,
      (str) =>
        str.toUpperCase()
    )
    .trim();

}


// ======================================================
// FORMAT INTERACTION NAME
// ======================================================

function formatInteractionName(type) {

  if (!type) {
    return "Unknown";
  }


  return String(type)
    .replace(/_/g, " ")
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .toLowerCase()
    .replace(
      /^./,
      (str) =>
        str.toUpperCase()
    );

}


export default TrackingDashboard;