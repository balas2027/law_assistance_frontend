import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AppSidebar from '../../../components/layout/AppSidebar';
import Topbar from '../../../components/layout/Topbar';
import RightPanel from '../../../components/layout/RightPanel';
import SuggestedPrompts from '../../../components/features/chat/SuggestedPrompts';
import ChatInput from '../../../components/features/chat/ChatInput';
import DisclaimerBanner from '../../../components/shared/DisclaimerBanner';
import Icon from '../../../components/ui/Icon';
import { fetchChatConfigApi } from '../../../lib/api/chat';
import { useChat } from '../../../hooks/useChat';
import { useUiStore } from '../../../stores/uiStore';

export default function ChatPage() {
  const { newChat, sendMessage } = useChat();
  const navigate = useNavigate();
  const { sidebarCollapsed } = useUiStore();

  const [config, setConfig] = useState(null);
  const [configLoading, setConfigLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    fetchChatConfigApi()
      .then((data) => {
        if (!cancelled) setConfig(data);
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setConfigLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const handlePrompt = async (text) => {
    const chat = await newChat(text);
    navigate(`/chat/${chat.id}`);
    sendMessage(text);
  };

  const handleComposerSend = async (text) => {
    const chat = await newChat(text);
    navigate(`/chat/${chat.id}`);
    sendMessage(text);
  };


  return (
    <div className="flex h-screen w-full bg-[#fafbfc] text-gray-900 font-sans overflow-hidden">
      {/* Full-width fixed Topbar — same as Academy */}
      <Topbar variant="chat" />

      {/* Sidebar below Topbar */}
      <AppSidebar variant="chat" />

      {/* Main content — offset by topbar height (pt-16) and sidebar width */}
      <main
        className={`flex-1 flex flex-col relative bg-[#fafbfc] h-screen pt-16 transition-all duration-300 ease-in-out ${
          sidebarCollapsed ? 'md:ml-16' : 'md:ml-56'
        }`}
      >
        <div className="flex-1 overflow-y-auto px-6 md:px-12 pt-6 pb-40 flex flex-col items-center min-h-0">
          <div className="w-full max-w-[800px] flex flex-col items-center animate-fade-in my-auto">
            {configLoading ? (
              <div className="w-full flex flex-col items-center animate-pulse">
                <div className="h-9 w-2/3 bg-gray-200 rounded-md mb-4" />
                <div className="h-4 w-3/4 bg-gray-100 rounded mb-10" />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div key={i} className="h-24 bg-gray-100 rounded-sm" />
                  ))}
                </div>
              </div>
            ) : (
              <>
                <h1 className="text-[28px] md:text-[34px] font-bold text-gray-950 text-center mb-3 tracking-tight">
                  {config?.heading ?? 'How can I help you with Indian law?'}
                </h1>
                <p className="text-[15px] text-gray-600 text-center max-w-2xl mb-10 leading-relaxed">
                  {config?.description ??
                    'Ask questions, explore constitutional articles, analyze case precedents, or verify sections under BNS, BNSS, and Indian jurisprudence.'}
                </p>
                <SuggestedPrompts
                  prompts={config?.suggested_prompts ?? []}
                  onSelect={handlePrompt}
                />
              </>
            )}
          </div>
        </div>

        <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-[#fafbfc] via-[#fafbfc] to-transparent pt-10 pb-6 px-6 md:px-12 z-10">
          <div className="max-w-[800px] mx-auto w-full relative">
            <ChatInput onSend={handleComposerSend} />
            <DisclaimerBanner />
          </div>
        </div>
      </main>

      <RightPanel mode="empty" />
    </div>
  );
}
