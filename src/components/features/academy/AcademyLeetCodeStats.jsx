import { useState, useMemo } from "react";
import Icon from "../../ui/Icon";

export default function AcademyLeetCodeStats({ stats = {}, calendar = [] }) {
  const [hoveredDay, setHoveredDay] = useState(null);

  const currentStreak = stats?.currentStreak || 0;
  const longestStreak = stats?.longestStreak || currentStreak || 0;
  const completedLessons = stats?.completedLessons || 0;
  const totalLessons = stats?.totalLessons || 0;

  const countByDate = useMemo(() => {
    const map = {};
    if (Array.isArray(calendar)) {
      for (const entry of calendar) {
        map[entry.date] = entry.count || 0;
      }
    }
    return map;
  }, [calendar]);

  // Build the last-365-days grid (Sunday-first columns) from real completion data.
  const { weeks, activeDays, totalCount } = useMemo(() => {
    const today = new Date();
    const start = new Date(today);
    start.setDate(start.getDate() - 364);
    start.setDate(start.getDate() - start.getDay());

    const dateKey = (dt) =>
      `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, "0")}-${String(dt.getDate()).padStart(2, "0")}`;

    const out = [];
    let cursor = new Date(start);
    let active = 0;
    let countTotal = 0;
    while (cursor <= today) {
      const days = [];
      for (let d = 0; d < 7; d++) {
        const key = dateKey(cursor);
        const count = countByDate[key] || 0;
        if (count > 0) {
          active += 1;
          countTotal += count;
        }
        days.push({
          date: key,
          count,
          dateStr: cursor.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          }),
        });
        cursor.setDate(cursor.getDate() + 1);
      }
      out.push(days);
    }
    return { weeks: out, activeDays: active, totalCount: countTotal };
  }, [countByDate]);

  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
  ];

  // Bluish color scale for the completion heatmap
  function getCellColor(count) {
    if (count === 0) return "bg-[#eaf0f8] hover:bg-gray-300";
    if (count === 1) return "bg-[#93c5fd] hover:bg-[#60a5fa]";
    if (count === 2) return "bg-[#60a5fa] hover:bg-[#3b82f6]";
    if (count === 3) return "bg-[#2563eb] hover:bg-[#1d4ed8]";
    return "bg-[#1e3a8a] hover:bg-[#172554]";
  }

  return (
    <div className="space-y-5 mb-14">

      {/* ── 365 Days Lesson Completion Activity Heatmap (Bluish Scheme) ── */}
      <div className="bg-white border border-gray-200/90 rounded-sm p-6 shadow-[0_1px_2px_rgba(0,0,0,0.02)]">

        {/* Heatmap Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-2">
            <h3 className="text-[16px] font-bold text-gray-950">
              {totalCount > 0
                ? `${totalCount} ${totalCount === 1 ? "lesson" : "lessons"} completed in the past one year`
                : "No lessons completed in the past one year"}
            </h3>
            <span
              className="text-gray-400 cursor-help"
              title="Each day you mark a lesson as completed is highlighted here"
            >
              <Icon name="info" size={15} />
            </span>
          </div>

          <div className="flex items-center gap-4 text-[13px] text-gray-600">
            <div>
              Active days: <span className="font-bold text-gray-900">{activeDays || 0}</span>
            </div>
            <div className="h-3.5 w-px bg-gray-200" />
            <div>
              Longest streak: <span className="font-bold text-gray-900">{longestStreak || 0}</span>
            </div>
            <div className="h-3.5 w-px bg-gray-200" />
            <div>
              Completed: <span className="font-bold text-gray-900">{completedLessons || 0} / {totalLessons || 0}</span>
            </div>

            <span className="bg-gray-50 border border-gray-200 rounded px-2.5 py-1 text-[12.5px] font-medium text-gray-700">
              Last 365 days
            </span>
          </div>
        </div>

        {/* 52-Week Contribution Matrix in Bluish palette */}
        <div className="overflow-x-auto pb-2 scrollbar-hide">
          <div className="min-w-[760px]">

            {/* Heatmap Grid: 52 columns, 7 rows */}
            <div className="grid grid-flow-col grid-rows-7 gap-[3px]">
              {weeks.map((week, wIdx) =>
                week.map((day, dIdx) => (
                  <div
                    key={`${wIdx}-${dIdx}`}
                    onMouseEnter={() => setHoveredDay(day)}
                    onMouseLeave={() => setHoveredDay(null)}
                    className={`w-[11.5px] h-[11.5px] rounded-[2px] cursor-pointer transition-colors duration-100 ${getCellColor(
                      day.count
                    )}`}
                  />
                ))
              )}
            </div>

            {/* Months row */}
            <div className="flex justify-between text-[11px] text-gray-400 font-medium mt-3 px-1">
              {months.map((m) => (
                <span key={m}>{m}</span>
              ))}
            </div>

          </div>
        </div>

        {/* Hovered Day Status Tooltip Bar */}
        <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-[12px] text-gray-500">
          <div>
            {hoveredDay ? (
              <span>
                <strong className="text-gray-900">{hoveredDay.count} {hoveredDay.count === 1 ? "lesson" : "lessons"} completed</strong> on {hoveredDay.dateStr}
              </span>
            ) : (
              <span>Hover over any day to see how many lessons you completed</span>
            )}
          </div>

          {/* Color Legend (Bluish Scheme) */}
          <div className="flex items-center gap-1.5 text-[11.5px] text-gray-400">
            <span>Less</span>
            <div className="w-[10px] h-[10px] rounded-[2px] bg-[#eaf0f8]" />
            <div className="w-[10px] h-[10px] rounded-[2px] bg-[#93c5fd]" />
            <div className="w-[10px] h-[10px] rounded-[2px] bg-[#60a5fa]" />
            <div className="w-[10px] h-[10px] rounded-[2px] bg-[#2563eb]" />
            <div className="w-[10px] h-[10px] rounded-[2px] bg-[#1e3a8a]" />
            <span>More</span>
          </div>
        </div>

      </div>

    </div>
  );
}
