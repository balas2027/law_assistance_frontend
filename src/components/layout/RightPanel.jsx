import Icon from '../ui/Icon';
import Tag from '../ui/Tag';
import { cx } from '../../lib/utils';

function EmptyState() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8 text-center opacity-60">
      <Icon name="find_in_page" size={40} className="text-outline mb-4" />
      <p className="font-body-md text-on-surface-variant font-medium">No active context</p>
      <p className="font-body-md text-sm text-outline mt-2">
        Documents you upload and specific legal citations will appear here for reference during your chat.
      </p>
    </div>
  );
}

function CaseContext({ context }) {
  return (
    <div className="p-6 flex flex-col gap-8">
      <section>
        <h4 className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-3">Primary Topic</h4>
        <span className="inline-flex items-center px-3 py-1 rounded-full bg-secondary-container/10 text-secondary-container border border-secondary-container/20 text-sm font-medium">
          {context.primaryTopic}
        </span>
      </section>

      <section>
        <h4 className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-3">Statutes &amp; Acts</h4>
        <ul className="space-y-2">
          {context.acts.map((act) => (
            <li key={act.title} className={cx('flex items-start gap-2', !act.active && 'opacity-60')}>
              <Icon name="gavel" size={16} className="text-primary mt-0.5" />
              <span className="font-citation text-sm text-primary-container leading-tight">{act.title}</span>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h4 className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-3">Relevant Sections</h4>
        <div className="flex flex-wrap gap-2">
          {context.sections.map((section) => (
            <Tag key={section} className="text-xs px-2 py-1 bg-surface-container border border-outline-variant rounded">
              {section}
            </Tag>
          ))}
        </div>
      </section>

      <section>
        <h4 className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-3">Active Documents</h4>
        {context.documents.map((doc) => (
          <div
            key={doc.name}
            className="bg-surface-container-lowest border border-outline-variant rounded-lg p-3 shadow-sm hover:border-primary-container transition-colors cursor-pointer group mb-2"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 rounded bg-error/10 text-error flex items-center justify-center">
                <Icon name="description" size={18} />
              </div>
              <span className="font-body-md text-sm font-medium text-primary-container truncate group-hover:text-primary transition-colors">
                {doc.name}
              </span>
            </div>
            <div className="text-[11px] text-outline flex justify-between">
              <span>{doc.uploaded}</span>
              <span>{doc.size}</span>
            </div>
          </div>
        ))}
      </section>

      <section>
        <h4 className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-3">Authority Sources</h4>
        {context.sources.map((source) => (
          <a
            key={source.title}
            className="flex items-center gap-3 p-2 -mx-2 rounded-lg hover:bg-surface-container transition-colors group cursor-pointer"
          >
            <div className="w-6 h-6 rounded bg-primary/5 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-on-primary transition-colors">
              <Icon name="account_balance" size={14} />
            </div>
            <div className="flex-1">
              <div className="text-sm font-medium text-primary-container">{source.title}</div>
              <div className="text-[11px] text-on-surface-variant">{source.subtitle}</div>
            </div>
            <Icon name="open_in_new" size={16} className="text-outline group-hover:text-primary" />
          </a>
        ))}
      </section>
    </div>
  );
}

export default function RightPanel({ mode = 'empty', context = null, title = null }) {
  return (
    <aside className="w-80 border-l border-outline-variant bg-surface-container-lowest hidden xl:flex flex-col relative z-20">
      <div className="h-16 border-b border-outline-variant/50 flex items-center px-6">
        <h2 className="font-body-md font-semibold text-primary-container">{title ?? 'Context & Sources'}</h2>
      </div>
      {mode === 'empty' || !context ? <EmptyState /> : <CaseContext context={context} />}
    </aside>
  );
}
