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
    <div className="flex h-screen w-full bg-background text-on-surface font-body-md overflow-hidden">
      <AppSidebar variant="chat" />
      <main
        className={`flex-1 flex flex-col relative bg-surface h-screen transition-all duration-300 ease-in-out ${
          sidebarCollapsed ? 'md:ml-16' : 'md:ml-64'
        }`}
      >
        <div className="flex-1 overflow-y-auto px-margin-desktop pt-12 pb-40 flex flex-col items-center min-h-0">

          <div className="w-full max-w-[800px] flex flex-col items-center animate-fade-in-up my-auto">
            <div className="w-24 h-24 mb-8 rounded-3xl bg-primary-container flex items-center justify-center shadow-level-2">
              <Icon name="account_balance" size={56} fill className="text-secondary-container" />
            </div>
            <h1 className="font-h2 text-h2 text-primary-container text-center mb-4 tracking-tight">
              How can I help you with Indian law?
            </h1>
            <p className="font-body-lg text-body-lg text-on-surface-variant text-center max-w-2xl mb-12">
              Ask questions, upload legal documents, or describe your situation in simple language. Our AI is trained on Indian penal codes, constitutional law, and civil procedures.
            </p>
            <SuggestedPrompts prompts={SUGGESTED_PROMPTS} onSelect={handlePrompt} />
          </div>
        </div>

        <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-surface via-surface to-transparent pt-10 pb-6 px-margin-desktop z-10">
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
