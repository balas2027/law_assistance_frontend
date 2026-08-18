import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import AppSidebar from "../../../components/layout/AppSidebar";
import Topbar from "../../../components/layout/Topbar";
import Icon from "../../../components/ui/Icon";
import { useUiStore } from "../../../stores/uiStore";
import { useUserStats } from "../../../hooks/useUserStats";
import { fetchCoursesApi, fetchLessonsApi } from "../../../lib/api/academy";
import { fetchAcademyStatsApi } from "../../../lib/api/progress";
import AcademyLeetCodeStats from "../../../components/features/academy/AcademyLeetCodeStats";

export default function AcademyDashboardPage() {
  const navigate = useNavigate();
  const { sidebarCollapsed } = useUiStore();
  const userStats = useUserStats();
  const { currentStreak, totalXp, level } = userStats;

  const [courses, setCourses] = useState([]);
  const [allLessons, setAllLessons] = useState([]);
  const [totalLessons, setTotalLessons] = useState(0);
  const [academyStats, setAcademyStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const coursesScrollRef = useRef(null);

  useEffect(() => {
    setLoading(true);

    fetchAcademyStatsApi()
      .then((data) => setAcademyStats(data))
      .catch(() => {});

    fetchCoursesApi()
      .then(async (allCourses) => {
        const list = Array.isArray(allCourses) ? allCourses : [];
        setCourses(list);

        let lessonsList = [];
        let count = 0;
        for (const c of list) {
          const ls = await fetchLessonsApi({ courseId: c.id }).catch(() => []);
          const valid = (Array.isArray(ls) ? ls : []).filter(
            (l) => l.status === "published" || !l.status
          );
          count += valid.length;
          valid.forEach((l) => {
            lessonsList.push({
              ...l,
              courseTitle: c.title,
              courseId: c.id,
            });
          });
        }
        setTotalLessons(count);
        setAllLessons(lessonsList);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  function scrollCourses(direction) {
    if (coursesScrollRef.current) {
      const scrollAmount = direction === "left" ? -340 : 340;
      coursesScrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  }

  const filteredCourses = courses.filter(
    (c) =>
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredLessons = allLessons.filter(
    (l) =>
      l.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (l.content && l.content.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (l.courseTitle && l.courseTitle.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="flex h-screen overflow-hidden antialiased bg-[#fafbfc] font-sans">
      <AppSidebar variant="academy" />

      <div
        className={`flex-1 flex flex-col bg-[#fafbfc] transition-all duration-300 ease-in-out ${
          sidebarCollapsed ? "md:ml-16" : "md:ml-64"
        }`}
      >
        <Topbar variant="academy" onSearch={setSearchQuery} searchValue={searchQuery} />

        <main className="flex-1 overflow-y-auto px-6 md:px-12 py-10 w-full pb-24">
          
          {/* Top Section: 365-day Lesson Completion Tracking */}
          {!searchQuery && (
            <AcademyLeetCodeStats
              stats={academyStats || userStats}
              calendar={academyStats?.calendar || []}
            />
          )}

          {searchQuery ? (
            /* Search Results View */
            <div className="space-y-12 animate-fade-in">
              <div>
                <p className="text-[12px] md:text-[13px] font-bold text-gray-700 tracking-[0.12em] uppercase mb-2">
                  SEARCH RESULTS
                </p>
                <h1 className="text-[28px] md:text-[34px] font-bold text-gray-950 tracking-tight">
                  Matches for &ldquo;{searchQuery}&rdquo;
                </h1>
                <p className="text-[15px] text-gray-600 mt-1">
                  Showing {filteredCourses.length} courses and {filteredLessons.length} lessons.
                </p>
              </div>

              {filteredCourses.length === 0 && filteredLessons.length === 0 ? (
                <div className="text-center py-16 bg-white border border-gray-200/90 rounded-sm p-8">
                  <Icon name="search_off" size={44} className="text-gray-400 mb-3 mx-auto" />
                  <h3 className="text-[17px] font-bold text-gray-900">No results found</h3>
                  <p className="text-[13.5px] text-gray-600 mt-1 max-w-md mx-auto">
                    We could not find any courses or lessons matching &ldquo;{searchQuery}&rdquo;. Try another topic like IPC, Constitution, or Contract Law.
                  </p>
                </div>
              ) : (
                <>
                  {filteredCourses.length > 0 && (
                    <div>
                      <h2 className="text-[18px] font-bold text-gray-900 mb-5">Courses</h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredCourses.map((c) => (
                          <div
                            key={c.id}
                            onClick={() => navigate(`/academy/path/${c.id}`)}
                            className="bg-white border border-gray-200/90 rounded-sm p-6 flex flex-col justify-between hover:border-gray-300 transition-all hover:shadow-xs group cursor-pointer shadow-[0_1px_2px_rgba(0,0,0,0.02)]"
                          >
                            <div>
                              <h3 className="text-[17px] font-bold text-gray-950 leading-snug group-hover:text-[#0b57d0] transition-colors mb-2.5 line-clamp-2">
                                {c.title}
                              </h3>
                              <p className="text-[13.5px] text-gray-600 leading-relaxed mb-6 line-clamp-3">
                                {c.description || "Comprehensive curriculum covering key jurisprudence, practical case analyses, and statutes."}
                              </p>
                            </div>

                            <div className="flex items-center justify-between pt-4 border-t border-gray-100 text-[13px] text-gray-500">
                              <span className="font-medium text-gray-700">Team NyayaAI</span>
                              <span>{c.lessons?.length || 0} Lessons</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {filteredLessons.length > 0 && (
                    <div>
                      <h2 className="text-[18px] font-bold text-gray-900 mb-5">Lessons</h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredLessons.map((l) => (
                          <div
                            key={l.id}
                            onClick={() => navigate(`/academy/lesson/${l.id}`)}
                            className="bg-white border border-gray-200/90 rounded-sm p-6 flex flex-col justify-between hover:border-gray-300 transition-all hover:shadow-xs group cursor-pointer shadow-[0_1px_2px_rgba(0,0,0,0.02)]"
                          >
                            <div>
                              <p className="text-[11px] font-bold text-[#0b57d0] uppercase tracking-wider mb-2">
                                {l.courseTitle}
                              </p>
                              <h3 className="text-[17px] font-bold text-gray-950 leading-snug group-hover:text-[#0b57d0] transition-colors mb-2.5 line-clamp-2">
                                {l.title}
                              </h3>
                              <p className="text-[13.5px] text-gray-600 leading-relaxed mb-6 line-clamp-3">
                                {l.content?.replace(/<[^>]*>/g, "") || "Structured lesson module exploring case studies and legal principles."}
                              </p>
                            </div>

                            <div className="flex items-center justify-between pt-4 border-t border-gray-100 text-[13px] text-gray-500">
                              <span className="font-medium text-gray-700">Team NyayaAI</span>
                              <span className="font-semibold text-[#0b57d0] group-hover:underline">Start Lesson &rarr;</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          ) : (
            /* Standard Dashboard View */
            <div className="space-y-16">
              
              {/* Section 1: Horizontally Scrollable Courses + Side Stats Panel */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                
                {/* Left Side: Courses Section with Horizontal Scroll */}
                <div className="lg:col-span-8 space-y-6">
                  <div className="flex items-end justify-between">
                    <div>
                      <p className="text-[12px] md:text-[13px] font-bold text-gray-700 tracking-[0.12em] uppercase mb-1.5">
                        ACADEMY COURSES
                      </p>
                      <h2 className="text-[26px] md:text-[30px] font-bold text-gray-950 tracking-tight">
                        From the NyayaAI Editorial Desk
                      </h2>
                      <p className="text-[14.5px] text-gray-600 mt-1">
                        Deep dives on Indian law, constitutional rights, legal drafting, and real-world cases
                      </p>
                    </div>

                    {/* Scroll buttons */}
                    <div className="hidden sm:flex items-center gap-2 shrink-0 pb-1">
                      <button
                        onClick={() => scrollCourses("left")}
                        className="w-8 h-8 rounded-full border border-gray-300 bg-white hover:bg-gray-100 flex items-center justify-center text-gray-600 transition-colors shadow-2xs cursor-pointer"
                        aria-label="Scroll left"
                      >
                        <Icon name="arrow_back" size={16} />
                      </button>
                      <button
                        onClick={() => scrollCourses("right")}
                        className="w-8 h-8 rounded-full border border-gray-300 bg-white hover:bg-gray-100 flex items-center justify-center text-gray-600 transition-colors shadow-2xs cursor-pointer"
                        aria-label="Scroll right"
                      >
                        <Icon name="arrow_forward" size={16} />
                      </button>
                    </div>
                  </div>

                  {/* Horizontal Scrollable Courses Container */}
                  {loading ? (
                    <div className="flex gap-5 overflow-hidden">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="min-w-[300px] h-52 bg-white border border-gray-200/90 rounded-sm animate-pulse p-6 shrink-0" />
                      ))}
                    </div>
                  ) : courses.length === 0 ? (
                    <div className="text-center py-12 bg-white border border-gray-200/90 rounded-sm p-6">
                      <p className="text-[15px] font-semibold text-gray-900">No courses available yet</p>
                      <p className="text-[13px] text-gray-500 mt-1">Check back soon for new modules.</p>
                    </div>
                  ) : (
                    <div
                      ref={coursesScrollRef}
                      className="flex gap-5 overflow-x-auto pb-4 pt-1 scroll-smooth scrollbar-thin"
                      style={{ scrollSnapType: "x mandatory" }}
                    >
                      {courses.map((course) => (
                        <div
                          key={course.id}
                          onClick={() => navigate(`/academy/path/${course.id}`)}
                          style={{ scrollSnapAlign: "start" }}
                          className="min-w-[290px] md:min-w-[320px] max-w-[340px] bg-white border border-gray-200/90 rounded-sm p-6 flex flex-col justify-between hover:border-gray-300 transition-all hover:shadow-xs group cursor-pointer shadow-[0_1px_2px_rgba(0,0,0,0.02)] shrink-0"
                        >
                          <div>
                            <h3 className="text-[17px] font-bold text-gray-950 leading-snug group-hover:text-[#0b57d0] transition-colors mb-3 line-clamp-2">
                              {course.title}
                            </h3>
                            <p className="text-[13.5px] text-gray-600 leading-relaxed mb-6 line-clamp-3">
                              {course.description || "A structured curriculum designed to build foundational mastery in legal research, reasoning, and procedures."}
                            </p>
                          </div>

                          <div className="flex items-center justify-between pt-4 border-t border-gray-100 text-[13px] text-gray-500">
                            <span className="font-medium text-gray-700">Team NyayaAI</span>
                            <span>{course.lessons?.length || 0} Lessons</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Right Side: Learning Progress Panel */}
                <div className="lg:col-span-4 bg-white border border-gray-200/90 rounded-sm p-6 shadow-[0_1px_2px_rgba(0,0,0,0.02)] space-y-5">
                  <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                    <h3 className="font-bold text-[16px] text-gray-950">Your Learning Progress</h3>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#0b57d0] bg-blue-50 px-2 py-0.5 rounded">
                      Live Stats
                    </span>
                  </div>

                  {/* 2x2 Grid of the 4 stats */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3.5 bg-[#f8fafc] border border-gray-100 rounded-sm">
                      <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Courses</p>
                      <p className="text-[20px] font-bold text-gray-950 mt-0.5">{academyStats?.total_courses ?? courses.length}</p>
                    </div>

                    <div className="p-3.5 bg-[#f8fafc] border border-gray-100 rounded-sm">
                      <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Lessons Completed</p>
                      <p className="text-[20px] font-bold text-gray-950 mt-0.5">
                        {academyStats ? `${academyStats.completed_lessons} / ${academyStats.total_lessons}` : totalLessons}
                      </p>
                    </div>

                    <div className="p-3.5 bg-[#f8fafc] border border-gray-100 rounded-sm">
                      <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Daily Streak</p>
                      <p className="text-[18px] font-bold text-gray-950 mt-0.5">
                        {currentStreak > 0 ? `${currentStreak} Days` : "—"}
                      </p>
                    </div>

                    <div className="p-3.5 bg-[#f8fafc] border border-gray-100 rounded-sm">
                      <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Experience</p>
                      <p className="text-[18px] font-bold text-gray-950 mt-0.5 truncate">
                        {totalXp > 0 ? `Level ${level} • ${totalXp} XP` : "—"}
                      </p>
                    </div>
                  </div>

                  {academyStats && academyStats.total_lessons > 0 && (
                    <div>
                      <div className="flex items-center justify-between text-[12px] text-gray-500 mb-1.5">
                        <span>Overall course completion</span>
                        <span className="font-bold text-gray-900">{academyStats.completion_pct}%</span>
                      </div>
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[#0b57d0] rounded-full transition-all duration-500"
                          style={{ width: `${Math.min(100, academyStats.completion_pct)}%` }}
                        />
                      </div>
                    </div>
                  )}

                  {academyStats && academyStats.quizzes_taken > 0 && (
                    <div className="flex items-center justify-between text-[12px] text-gray-500">
                      <span>Mock tests attempted</span>
                      <span className="font-bold text-gray-900">
                        {academyStats.quizzes_passed} passed of {academyStats.quizzes_taken}
                      </span>
                    </div>
                  )}

                  {/* Action button */}
                  <button
                    onClick={() => {
                      if (courses.length > 0) {
                        navigate(`/academy/path/${courses[0].id}`);
                      } else {
                        navigate('/chat');
                      }
                    }}
                    className="w-full py-2.5 bg-[#0b57d0] hover:bg-[#0842a0] text-white font-bold text-[13px] tracking-wider uppercase rounded-sm transition-colors cursor-pointer flex items-center justify-center gap-2 shadow-xs"
                  >
                    <span>Continue Learning</span>
                    <Icon name="arrow_forward" size={16} />
                  </button>
                </div>

              </div>

              {/* Section 2: Featured Individual Modules */}
              {allLessons.length > 0 && (
                <div>
                  <div className="mb-8">
                    <p className="text-[12px] md:text-[13px] font-bold text-gray-700 tracking-[0.12em] uppercase mb-2">
                      FEATURED MODULES
                    </p>
                    <h2 className="text-[26px] md:text-[30px] font-bold text-gray-950 tracking-tight">
                      Explore Individual Lessons & Case Studies
                    </h2>
                    <p className="text-[15px] text-gray-600 mt-1">
                      Step-by-step guides covering legal procedures, statutory sections, and landmark precedents
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {allLessons.slice(0, 6).map((lesson) => (
                      <div
                        key={lesson.id}
                        onClick={() => navigate(`/academy/lesson/${lesson.id}`)}
                        className="bg-white border border-gray-200/90 rounded-sm p-6 flex flex-col justify-between hover:border-gray-300 transition-all hover:shadow-xs group cursor-pointer shadow-[0_1px_2px_rgba(0,0,0,0.02)]"
                      >
                        <div>
                          <p className="text-[11px] font-bold text-[#0b57d0] uppercase tracking-wider mb-2">
                            {lesson.courseTitle}
                          </p>
                          <h3 className="text-[17px] font-bold text-gray-950 leading-snug group-hover:text-[#0b57d0] transition-colors mb-3 line-clamp-2">
                            {lesson.title}
                          </h3>
                          <p className="text-[13.5px] text-gray-600 leading-relaxed mb-6 line-clamp-3">
                            {lesson.content?.replace(/<[^>]*>/g, "") || "In-depth study with real-world case breakdowns, practical illustrations, and quizzes."}
                          </p>
                        </div>

                        <div className="flex items-center justify-between pt-4 border-t border-gray-100 text-[13px] text-gray-500">
                          <span className="font-medium text-gray-700">Team NyayaAI</span>
                          <span className="font-semibold text-[#0b57d0] group-hover:underline">Start Lesson &rarr;</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>
          )}

        </main>
      </div>
    </div>
  );
}