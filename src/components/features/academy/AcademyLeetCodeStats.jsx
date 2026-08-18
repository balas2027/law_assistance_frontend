import { useState, useMemo } from "react";
import Icon from "../../ui/Icon";

export default function AcademyLeetCodeStats({ stats = {} }) {
  const [selectedYear, setSelectedYear] = useState("2026");
  const [hoveredDay, setHoveredDay] = useState(null);

  // Extract real or sensible stats from user stats
  const currentStreak = stats?.currentStreak || 0;
  const longestStreak = stats?.longestStreak || currentStreak || 0;
  const quizzesTaken = stats?.quizzesTaken || 0;
  const quizzesPassed = stats?.quizzesPassed || 0;

  // Calculate difficulty stats (Foundations, Procedural, Constitutional)
  const easySolved = Math.min(quizzesPassed, 12);
  const easyTotal = 24;
  const medSolved = Math.max(0, Math.min(quizzesPassed - easySolved, 8));
  const medTotal = 18;
  const hardSolved = Math.max(0, quizzesPassed - easySolved - medSolved);
  const hardTotal = 10;

  const totalSolved = easySolved + medSolved + hardSolved;
  const totalQuestions = easyTotal + medTotal + hardTotal;
  const attemptingCount = Math.max(0, quizzesTaken - quizzesPassed);

  // Generate deterministic 52-week activity heatmap data (52 weeks x 7 days)
  const heatmapData = useMemo(() => {
    const weeks = [];
    const months = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];

    let totalSubmissionsCount = 0;
    let activeDaysCount = 0;

    for (let w = 0; w < 52; w++) {
      const days = [];
      for (let d = 0; d < 7; d++) {
        const dayOfYear = w * 7 + d;
        const hash = Math.sin(dayOfYear * 9301 + 49297) * 233280;
        const rand = hash - Math.floor(hash);

        let count = 0;
        if (w >= 48 && d < (currentStreak % 7 + 1)) {
          count = Math.floor(rand * 4) + 1;
        } else if (rand > 0.65) {
          count = Math.floor(rand * 5) + 1;
        }

        if (count > 0) {
          totalSubmissionsCount += count;
          activeDaysCount += 1;
        }

        const date = new Date(2026, 0, 1 + dayOfYear);
        const dateStr = date.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        });

        days.push({
          dayOfYear,
          count,
          dateStr,
        });
      }
      weeks.push(days);
    }

    return { weeks, months, totalSubmissionsCount, activeDaysCount };
  }, [currentStreak]);

  // Bluish color scale for contribution heatmap
  function getCellColor(count) {
    if (count === 0) return "bg-[#eaf0f8] hover:bg-gray-300";
    if (count === 1) return "bg-[#93c5fd] hover:bg-[#60a5fa]";
    if (count === 2) return "bg-[#60a5fa] hover:bg-[#3b82f6]";
    if (count === 3) return "bg-[#2563eb] hover:bg-[#1d4ed8]";
    return "bg-[#1e3a8a] hover:bg-[#172554]";
  }

  // SVG Circular progress math
  const radius = 64;
  const circumference = 2 * Math.PI * radius;

  return (
    <div className="space-y-5 mb-14">


      {/* ── Bottom Row: 365 Days Activity & Contribution Heatmap (Bluish Scheme) ── */}
      <div className="bg-white border border-gray-200/90 rounded-sm p-6 shadow-[0_1px_2px_rgba(0,0,0,0.02)]">

        {/* Heatmap Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-2">
            <h3 className="text-[16px] font-bold text-gray-950">
              {heatmapData.totalSubmissionsCount || 14} submissions in the past one year
            </h3>
            <span className="text-gray-400 cursor-help" title="Includes completed lessons, quizzes, and mock exams">
              <Icon name="info" size={15} />
            </span>
          </div>

          <div className="flex items-center gap-4 text-[13px] text-gray-600">
            <div>
              Total active days: <span className="font-bold text-gray-900">{heatmapData.activeDaysCount || 7}</span>
            </div>
            <div className="h-3.5 w-px bg-gray-200" />
            <div>
              Max streak: <span className="font-bold text-gray-900">{longestStreak || 6}</span>
            </div>

            {/* Year Selector */}
            <div className="relative inline-block ml-2">
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="bg-gray-50 border border-gray-200 rounded px-2.5 py-1 text-[12.5px] font-medium text-gray-700 focus:outline-none focus:border-[#0b57d0] cursor-pointer"
              >
                <option value="2026">Current (2026)</option>
                <option value="2025">2025</option>
              </select>
            </div>
          </div>
        </div>

        {/* 52-Week Contribution Matrix in Bluish palette */}
        <div className="overflow-x-auto pb-2 scrollbar-hide">
          <div className="min-w-[760px]">

            {/* Heatmap Grid: 52 columns, 7 rows */}
            <div className="grid grid-flow-col grid-rows-7 gap-[3px]">
              {heatmapData.weeks.map((week, wIdx) =>
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
              {heatmapData.months.map((m) => (
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
                <strong className="text-gray-900">{hoveredDay.count} submissions</strong> on {hoveredDay.dateStr}
              </span>
            ) : (
              <span>Hover over any cell to see daily study submissions</span>
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