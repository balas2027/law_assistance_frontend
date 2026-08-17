import Icon from '../../ui/Icon';
import CurriculumRow from './CurriculumRow';

export default function CurriculumTable({ rows }) {
  return (
    <div className="lg:col-span-2 bg-surface-container-lowest border border-outline-variant rounded-xl shadow-level-1 overflow-hidden">
      <div className="px-6 py-5 border-b border-outline-variant flex justify-between items-center bg-surface-bright">
        <h3 className="font-h2 text-h2 text-primary text-[20px]">Active Curriculum</h3>
        <div className="flex gap-2">
          <button className="p-1.5 text-on-surface-variant hover:bg-surface-container rounded-md transition-colors">
            <Icon name="filter_list" size={20} />
          </button>
          <button className="p-1.5 text-on-surface-variant hover:bg-surface-container rounded-md transition-colors">
            <Icon name="search" size={20} />
          </button>
        </div>
      </div>
      <div className="overflow-x-auto w-full">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-surface border-b border-outline-variant">
              <th className="px-6 py-4 font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider">Lesson Title</th>
              <th className="px-6 py-4 font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider">Status</th>
              <th className="px-6 py-4 font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider hidden sm:table-cell">Author</th>
              <th className="px-6 py-4 font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider text-right">Last Updated</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant/50">
            {rows.map((row) => (
              <CurriculumRow key={row.id} row={row} />
            ))}
          </tbody>
        </table>
      </div>
      <div className="px-6 py-4 border-t border-outline-variant bg-surface flex justify-center">
        <button className="font-label-caps text-label-caps text-primary hover:text-primary-container transition-colors font-medium">
          View All Records
        </button>
      </div>
    </div>
  );
}
