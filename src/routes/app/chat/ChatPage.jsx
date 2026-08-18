import { useNavigate } from 'react-router-dom';
import AppSidebar from '../../../components/layout/AppSidebar';
import RightPanel from '../../../components/layout/RightPanel';
import SuggestedPrompts from '../../../components/features/chat/SuggestedPrompts';

import ChatInput from '../../../components/features/chat/ChatInput';
import DisclaimerBanner from '../../../components/shared/DisclaimerBanner';
import Icon from '../../../components/ui/Icon';
import { SUGGESTED_PROMPTS } from '../../../types/chat';
import { useChat } from '../../../hooks/useChat';
import { useUiStore } from '../../../stores/uiStore';


export default function ChatPage() {
  const { newChat } = useChat();
  const navigate = useNavigate();
  const { sidebarCollapsed } = useUiStore();

  const handlePrompt = async (text) => {
    const chat = await newChat(text);
    navigate(`/chat/${chat.id}`);
  };

  const handleComposerSend = async (text) => {
    const chat = await newChat(text);
    navigate(`/chat/${chat.id}`);
  };

  return (
    <div className="flex h-screen w-full bg-[#fafbfc] text-gray-900 font-sans overflow-hidden">
      <AppSidebar variant="chat" />
      <main
        className={`flex-1 flex flex-col relative bg-[#fafbfc] h-screen transition-all duration-300 ease-in-out ${
          sidebarCollapsed ? 'md:ml-16' : 'md:ml-64'
        }`}
      >
        <div className="flex-1 overflow-y-auto px-6 md:px-12 pt-12 pb-40 flex flex-col items-center min-h-0">

          <div className="w-full max-w-[800px] flex flex-col items-center animate-fade-in my-auto">
            <div className="w-20 h-20 mb-6 rounded-2xl bg-[#eaf1fc] flex items-center justify-center shadow-xs">
              <Icon name="account_balance" size={44} className="text-[#0b57d0]" />
            </div>
            <h1 className="text-[28px] md:text-[34px] font-bold text-gray-950 text-center mb-3 tracking-tight">
              How can I help you with Indian law?
            </h1>
            <p className="text-[15px] text-gray-600 text-center max-w-2xl mb-10 leading-relaxed">
              Ask questions, explore constitutional articles, analyze case precedents, or verify sections under BNS, BNSS, and Indian jurisprudence.
            </p>
            <SuggestedPrompts prompts={SUGGESTED_PROMPTS} onSelect={handlePrompt} />
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

