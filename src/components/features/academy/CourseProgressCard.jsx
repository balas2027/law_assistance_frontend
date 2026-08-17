import ProgressCircle from '../../ui/ProgressCircle';
import ProgressBar from '../../ui/ProgressBar';

export default function CourseProgressCard({ course }) {
  return (
    <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 shadow-level-1 flex items-center gap-6">
      <ProgressCircle
        value={course.progress}
        size={64}
        strokeWidth={5}
        label={
          <span className="font-label-caps text-label-caps font-bold text-primary-container">{course.progress}%</span>
        }
      />
      <div className="flex-1">
        <div className="flex justify-between items-end mb-2">
          <span className="font-label-caps text-label-caps text-on-surface-variant">Course Progress</span>
          <span className="font-citation text-citation text-primary-container">
            {course.completedModules}/{course.totalModules} Modules
          </span>
        </div>
        <ProgressBar value={course.progress} />
      </div>
    </div>
  );
}
