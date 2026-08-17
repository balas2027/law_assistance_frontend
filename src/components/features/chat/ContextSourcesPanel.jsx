import RightPanel from '../../layout/RightPanel';

export default function ContextSourcesPanel({ context = null, title = null }) {
  return <RightPanel mode={context ? 'context' : 'empty'} context={context} title={title} />;
}
