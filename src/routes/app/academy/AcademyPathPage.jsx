import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import AppSidebar from '../../../components/layout/AppSidebar';
import Topbar from '../../../components/layout/Topbar';
import CourseProgressCard from '../../../components/features/academy/CourseProgressCard';
import LessonListItem from '../../../components/features/academy/LessonListItem';
import SubTopicList from '../../../components/features/academy/SubTopicList';
import KeyCaseCallout from '../../../components/features/academy/KeyCaseCallout';
import Icon from '../../../components/ui/Icon';
import { useCourseProgress } from '../../../hooks/useCourseProgress';

function ModuleOverviewPanel({ course }) {
  return (
    <aside className="w-80 bg-surface-container-low border-l border-outline-variant flex flex-col shrink-0">
      <div className="p-6 border-b border-outline-variant">
        <h3 className="font-h2 text-[20px] leading-[28px] text-primary-container mb-1">Module Overview</h3>
        <p className="font-label-caps text-label-caps text-on-surface-variant">{course.currentModule}</p>
      </div>
      <div className="p-6 flex-1 overflow-y-auto">
        <div className="mb-6">
          <div className="aspect-video bg-surface-container-lowest rounded-lg border border-outline-variant mb-4 flex items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 bg-primary-container/10" />
            <div className="w-12 h-12 rounded-full bg-surface-container-lowest/80 backdrop-blur shadow-sm flex items-center justify-center z-10">
              <Icon name="play_arrow" size={24} className="text-primary-container" />
            </div>
          </div>
          <h4 className="font-label-caps text-label-caps text-on-surface-variant mb-3 uppercase tracking-wider">Sub-topics</h4>
          <SubTopicList subTopics={course.overview.subTopics} />
        </div>
        <KeyCaseCallout title={course.overview.keyCase.title} description={course.overview.keyCase.description} />
      </div>
      <div className="p-6 border-t border-outline-variant bg-surface">
        <button className="w-full py-3 bg-secondary-container text-on-secondary-container rounded-full font-label-caps text-label-caps font-bold hover:opacity-90 transition-opacity flex items-center justify-center gap-2 shadow-level-1">
          Continue Learning
          <Icon name="arrow_forward" size={18} />
        </button>
      </div>
    </aside>
  );
}

export default function AcademyPathPage() {
  const { courseId } = useParams();
  const { course, loadCourse } = useCourseProgress();

  useEffect(() => {
    if (courseId && courseId !== course.id) {
      loadCourse(courseId);
    }
  }, [courseId, course.id, loadCourse]);

  return (
    <div className="flex h-screen overflow-hidden antialiased font-body-md text-body-md">
      <AppSidebar variant="academy" />
      <div className="flex-1 flex flex-col ml-64 bg-background">
        <Topbar variant="academy" />
        <main className="flex-1 flex overflow-hidden">
          <div className="flex-1 overflow-y-auto px-margin-desktop py-8">
            <div className="mb-12">
              <h1 className="font-h1 text-h1 text-primary-container mb-2">{course.title}</h1>
              <p className="font-body-lg text-body-lg text-on-surface-variant mb-6">{course.subtitle}</p>
              <CourseProgressCard course={course} />
            </div>
            <div className="relative max-w-3xl ml-4">
              {course.lessons.map((lesson, index) => (
                <LessonListItem key={lesson.id} lesson={lesson} index={index} />
              ))}
            </div>
          </div>
          <ModuleOverviewPanel course={course} />
        </main>
      </div>
    </div>
  );
}