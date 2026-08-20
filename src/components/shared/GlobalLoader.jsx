import { useUiStore } from '../../stores/uiStore';
import Icon from '../ui/Icon';

export default function GlobalLoader() {
  const { isLoading, loadingMessage } = useUiStore();

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/20 backdrop-blur-[2px] transition-opacity duration-300">
      <div className="bg-white px-6 py-5 rounded-2xl shadow-2xl flex items-center gap-4 animate-fade-in-up border border-gray-100 min-w-[200px]">
        <div className="w-10 h-10 rounded-full bg-[#eaf1fc] flex items-center justify-center shrink-0">
          <Icon name="sync" size={24} className="text-[#0b57d0] animate-spin" />
        </div>
        <div>
          <p className="text-[14px] font-bold text-gray-900 tracking-tight">
            {loadingMessage || 'Processing...'}
          </p>
          <p className="text-[12px] text-gray-500 mt-0.5">Please wait a moment.</p>
        </div>
      </div>
    </div>
  );
}
