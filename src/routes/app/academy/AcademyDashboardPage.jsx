import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AppSidebar from "../../../components/layout/AppSidebar";
import Topbar from "../../../components/layout/Topbar";
import Icon from "../../../components/ui/Icon";
import { useUiStore } from "../../../stores/uiStore";
import { useUserStats } from "../../../hooks/useUserStats";
import { fetchCoursesApi, fetchLessonsApi } from "../../../lib/api/academy";

export default function AcademyDashboardPage() {
  const navigate = useNavigate();
  const { sidebarCollapsed } = useUiStore();
  const { currentStreak, totalXp, level } = useUserStats();

  const [courses, setCourses] = useState([]);
  const [allLessons, setAllLessons] = useState([]);
  const [totalLessons, setTotalLessons] = useState(0);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    setLoading(true);
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
          
          {/* Top Header / Stats Row */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
            <div className="bg-white border border-gray-200/90 rounded-sm p-5 shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
              <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Courses</p>
              <p className="text-[24px] font-bold text-gray-950 mt-0.5">{courses.length}</p>
            </div>

            <div className="bg-white border border-gray-200/90 rounded-sm p-5 shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
              <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Total Lessons</p>
              <p className="text-[24px] font-bold text-gray-950 mt-0.5">{totalLessons}</p>
            </div>

            <div className="bg-white border border-gray-200/90 rounded-sm p-5 shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
              <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Daily Streak</p>
              <p className="text-[24px] font-bold text-gray-950 mt-0.5">
                {currentStreak > 0 ? `${currentStreak} Days 🔥` : "—"}
              </p>
            </div>

            <div className="bg-white border border-gray-200/90 rounded-sm p-5 shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
              <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Experience</p>
              <p className="text-[24px] font-bold text-gray-950 mt-0.5">
                {totalXp > 0 ? `Level ${level} • ${totalXp} XP` : "—"}
              </p>
            </div>
          </div>

          {searchQuery ? (
            /* Search Results in Editorial Card Grid */
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
            /* Standard Editorial Dashboard View */
            <div className="space-y-16">
              
              {/* Section 1: Courses Grid */}
              <div>
                <div className="mb-8">
                  <p className="text-[12px] md:text-[13px] font-bold text-gray-700 tracking-[0.12em] uppercase mb-2">
                    ACADEMY COURSES
                  </p>
                  <h1 className="text-[28px] md:text-[34px] font-bold text-gray-950 tracking-tight">
                    From the NyayaAI Editorial Desk
                  </h1>
                  <p className="text-[15px] text-gray-600 mt-1">
                    Deep dives on Indian law, constitutional rights, legal drafting, and real-world case simulations
                  </p>
                </div>

                {loading ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="h-56 bg-white border border-gray-200/90 rounded-sm animate-pulse p-6" />
                    ))}
                  </div>
                ) : courses.length === 0 ? (
                  <div className="text-center py-12 bg-white border border-gray-200/90 rounded-sm p-6">
                    <p className="text-[15px] font-semibold text-gray-900">No courses available yet</p>
                    <p className="text-[13px] text-gray-500 mt-1">Check back soon for new modules.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {courses.map((course) => (
                      <div
                        key={course.id}
                        onClick={() => navigate(`/academy/path/${course.id}`)}
                        className="bg-white border border-gray-200/90 rounded-sm p-6 flex flex-col justify-between hover:border-gray-300 transition-all hover:shadow-xs group cursor-pointer shadow-[0_1px_2px_rgba(0,0,0,0.02)]"
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

              {/* Section 2: Featured Lessons */}
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