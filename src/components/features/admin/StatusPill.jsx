import Badge from '../../ui/Badge';
import { PUBLISH_STATUS } from '../../../types/admin';

export default function StatusPill({ status }) {
  const published = status === PUBLISH_STATUS.PUBLISHED;
  return <Badge tone={published ? 'published' : 'draft'} dot>{published ? 'Published' : 'Draft'}</Badge>;
}
