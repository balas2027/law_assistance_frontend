import { Link } from 'react-router-dom';
import Icon from '../components/ui/Icon';

export default function ForbiddenPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4 p-8 text-center">
      <Icon name="gavel" size={48} className="text-primary" />
      <h1 className="font-h1-mobile md:font-h2 text-h1-mobile md:text-h2 text-primary">
        Access Denied
      </h1>
      <p className="font-body-md text-body-md text-on-surface-variant max-w-sm">
        Your account type does not have permission to view this page.
      </p>
      <Link
        to="/chat"
        className="font-label-caps text-label-caps text-on-primary bg-primary px-5 py-2.5 rounded-lg hover:opacity-90 transition-opacity"
      >
        Back to Chat
      </Link>
    </div>
  );
}