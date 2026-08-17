import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import AppSidebar from '../../../components/layout/AppSidebar';
import Topbar from '../../../components/layout/Topbar';
import BareActQuote from '../../../components/features/academy/BareActQuote';
import LessonContent from '../../../components/features/academy/LessonContent';
import KeyTermCard from '../../../components/features/academy/KeyTermCard';
import ModuleMasteryRing from '../../../components/features/academy/ModuleMasteryRing';
import ModuleMilestoneList from '../../../components/features/academy/ModuleMilestoneList';
import Icon from '../../../components/ui/Icon';
import { useCourseProgress } from '../../../hooks/useCourseProgress';

export default function LessonPage() {
  const { lessonId } = useParams();
  const { lesson, loadLesson } = useCourseProgress();

  useEffect(() => {
    if (lessonId && lessonId !== lesson.id) {
      loadLesson(lessonId);
    }
  }, [lessonId, lesson.id, loadLesson]);

  return (
    <div className="bg-background text-on-background font-body-md text-body-md overflow-hidden flex h-screen">
      <AppSidebar variant="curriculum" />
      <div className="flex-1 md:ml-64 flex flex-col h-screen relative">
        <Topbar variant="academy" />
        <main className="flex-1 overflow-y-auto flex">
          <div className="flex-1 max-w-[850px] w-full mx-auto px-4 sm:px-gutter py-8 lg:py-12 flex flex-col gap-10">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-label-caps font-label-caps text-on-surface-variant uppercase tracking-wider">
                {lesson.breadcrumbs.map((crumb) => (
                  <span key={crumb.label} className="flex items-center gap-2">
                    {crumb.to ? (
                      <a className="hover:text-primary transition-colors cursor-pointer">{crumb.label}</a>
                    ) : (
                      <span className="text-primary font-bold">{crumb.label}</span>
                    )}
                    {crumb !== lesson.breadcrumbs[lesson.breadcrumbs.length - 1] && (
                      <Icon name="chevron_right" size={14} />
                    )}
                  </span>
                ))}
              </div>
              <div className="flex items-center gap-3 flex-wrap">
                {lesson.tags.map((tag) => (
                  <span key={tag} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-surface-container-high text-on-surface">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <header>
              <h1 className="font-h1 text-h1-mobile md:text-h1 text-primary mb-4 text-balance">{lesson.title}</h1>
              <p className="font-body-lg text-body-lg text-on-surface-variant leading-relaxed">{lesson.intro}</p>
            </header>

            <BareActQuote>{lesson.bareAct}</BareActQuote>

            <LessonContent sections={lesson.body} />

            <section className="bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden shadow-level-1 grid grid-cols-1 md:grid-cols-3">
              <div className="bg-primary p-6 md:p-8 flex flex-col justify-center relative overflow-hidden">
                <div className="absolute -right-8 -top-8 w-32 h-32 border-[8px] border-secondary-container rounded-full opacity-20" />
                <Icon name="account_balance" size={32} fill className="text-secondary-container mb-4" />
                <h3 className="font-h2 text-[24px] text-white leading-tight mb-2">{lesson.landmarkCase.name}</h3>
                <p className="text-primary-fixed-dim font-label-caps text-label-caps uppercase tracking-wider">
                  {lesson.landmarkCase.vs}
                </p>
              </div>
              <div className="p-6 md:p-8 md:col-span-2 flex flex-col justify-center">
                <div className="flex items-start gap-3 mb-4">
                  <Icon name="lightbulb" size={20} className="text-secondary mt-1" />
                  <h4 className="font-bold text-on-surface">{lesson.landmarkCase.heading}</h4>
                </div>
                <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed mb-4">
                  {lesson.landmarkCase.description}
                </p>
                <a className="text-primary font-medium hover:underline inline-flex items-center gap-1 self-start cursor-pointer">
                  Read Full Case Analysis <Icon name="arrow_forward" size={16} />
                </a>
              </div>
            </section>

            <section className="pt-4 border-t border-outline-variant">
              <h2 className="font-h2 text-[24px] text-primary mb-6 flex items-center gap-2">
                <Icon name="menu_book" size={24} className="text-outline" /> Key Terms
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {lesson.keyTerms.map((term) => (
                  <KeyTermCard key={term.id} term={term} />
                ))}
              </div>
            </section>

            <div className="h-12" />
          </div>

          <aside className="hidden xl:block w-80 bg-surface-container-lowest border-l border-outline-variant sticky top-0 h-full overflow-y-auto p-6 shadow-[-4px_0_24px_rgba(23,37,84,0.02)]">
            <div className="mb-8 text-center">
              <h3 className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-widest mb-6">
                Module Mastery
              </h3>
              <ModuleMasteryRing percent={lesson.moduleProgress.percent} />
            </div>
            <ModuleMilestoneList lessons={lesson.moduleProgress.lessons} />
            <div className="mt-8 pt-6 border-t border-outline-variant">
              <button className="w-full bg-primary text-white font-label-caps text-label-caps px-4 py-3 rounded-lg hover:bg-primary-container transition-colors shadow-level-1">
                Mark as Complete
              </button>
            </div>
          </aside>
        </main>
      </div>
    </div>
  );
}