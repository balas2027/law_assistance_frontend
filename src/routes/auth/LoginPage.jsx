import { Link } from 'react-router-dom';
import Icon from '../../components/ui/Icon';
import LoginForm from '../../components/features/auth/LoginForm';

export default function LoginPage() {
  return (
    <div className="bg-background min-h-screen flex items-center justify-center p-margin-mobile md:p-margin-desktop font-body-md text-on-surface antialiased">
      <main className="w-full max-w-[440px] flex flex-col items-center">
        <header className="mb-8 flex flex-col items-center text-center">
          <div className="w-12 h-12 mb-4 bg-primary-container rounded-full flex items-center justify-center shadow-sm">
            <Icon name="account_balance" size={24} fill className="text-on-primary" />
          </div>
          <Link to="/" className="font-h1-mobile md:font-h1 text-h1-mobile md:text-h1 text-primary">
            NyayaAI&nbsp;
          </Link>
          <p className="font-body-md text-body-md text-on-surface-variant mt-2">Institutional Grade Legal Assistant</p>
        </header>

        <div className="w-full bg-surface-container-lowest rounded-xl shadow-level-1 border border-[#E7E5DE] p-8">
          <LoginForm />
        </div>

        <footer className="mt-8 text-center flex flex-col items-center">
          <p className="font-label-caps text-[11px] text-on-surface-variant">Protected by Institutional Grade Security</p>
        </footer>
      </main>
    </div>
  );
}
