import { Link } from "react-router-dom";
import AuthSplitPanel from "../../components/features/auth/AuthSplitPanel";
import SocialAuthButtons from "../../components/features/auth/SocialAuthButtons";
import SignupForm from "../../components/features/auth/SignupForm";

export default function SignupPage() {
  return (
    <div className="bg-background text-on-background min-h-screen flex antialiased">
      <AuthSplitPanel />

      <div className="flex-1 flex items-center justify-center p-margin-mobile md:p-margin-desktop bg-surface relative">
        <div className="absolute inset-0 bg-surface z-0 pointer-events-none" />
        <div className="w-full max-w-[480px] bg-surface-container-lowest rounded-xl border border-surface-variant shadow-level-1 p-8 relative z-10">
          <div className="flex lg:hidden items-center gap-2 mb-8 justify-center">
            <span className="material-symbols-outlined text-primary text-[28px]">
              account_balance
            </span>
            <span className="font-h2 text-h2 text-primary">NyayaAI</span>
          </div>

          <div className="mb-2">
            <h2 className="font-h1-mobile text-h1-mobile md:font-h2 md:text-h2 text-primary mb-2">
              Create Account
            </h2>
            <p className="font-body-md text-body-md text-on-surface-variant">
              Start your journey in AI-assisted legal research.
            </p>
          </div>

          <SignupForm />

          <div className="mt-4 text-center">
            <p className="font-body-md text-body-md text-on-surface-variant">
              Already have an account?
              <Link
                to="/login"
                className="font-label-caps text-label-caps text-primary hover:text-secondary-container transition-colors ml-1 uppercase tracking-wide"
              >
                Log In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
