import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AppSidebar from '../../../components/layout/AppSidebar';
import Topbar from '../../../components/layout/Topbar';
import ChatWindow from '../../../components/features/chat/ChatWindow';
import ChatInput from '../../../components/features/chat/ChatInput';
import RightPanel from '../../../components/layout/RightPanel';
import Icon from '../../../components/ui/Icon';
import { useChat } from '../../../hooks/useChat';
import { useUiStore } from '../../../stores/uiStore';

const CONTEXT = {
  primaryTopic: 'Property Law',
  acts: [
    { title: 'Karnataka Rent Control Act, 1999', active: true },
    { title: 'Indian Contract Act, 1872', active: false },
  ],
  sections: ['Section 12', 'Section 25'],
  documents: [{ name: 'Bangalore_Rental_2024.pdf', uploaded: 'Uploaded today', size: '1.2 MB' }],
  sources: [
    { title: 'Official Gazette', subtitle: 'Government of Karnataka' },
    { title: 'Model Tenancy Act, 2021', subtitle: 'Ministry of Housing' },
  ],
};

export default function ChatConversationPage() {
  const { chatId } = useParams();
  const navigate = useNavigate();
  const { sidebarCollapsed } = useUiStore();
  const { activeChat, messages, loadConversation, sendMessage } = useChat();

  useEffect(() => {
    if (chatId) {
      loadConversation(chatId);
    }
  }, [chatId, loadConversation]);

  const handleSend = async (text) => {
    await sendMessage(text);
  };

  return (
    <div className="bg-[#fafbfc] text-gray-900 font-sans h-screen w-full overflow-hidden flex">
      {/* Full-width fixed Topbar — same as Academy */}
      <Topbar variant="chat" />

      {/* Sidebar below Topbar */}
      <AppSidebar variant="chat" />

      {/* Main content — offset by topbar height (pt-16) and sidebar width */}
      <div
        className={`flex-1 flex flex-col h-screen pt-16 relative bg-[#fafbfc] transition-all duration-300 ease-in-out ${
          sidebarCollapsed ? 'md:ml-16' : 'md:ml-56'
        }`}
      >
        <main className="flex-1 flex w-full relative overflow-hidden">
          {/* Chat Column */}
          <div className="flex-1 flex flex-col relative max-w-[860px] mx-auto w-full border-r border-gray-200/90 bg-[#fafbfc] z-10">
            {/* Conversation Header */}
            <div className="flex items-center justify-between px-8 py-4 border-b border-gray-200/90 bg-white/80 backdrop-blur-sm sticky top-0 z-20 shrink-0">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => navigate('/chat')}
                  className="text-gray-400 hover:text-gray-700 transition-colors cursor-pointer mr-1"
                  title="Back to Chat"
                >
                  <Icon name="arrow_back" size={20} />
                </button>
                <h2 className="text-[17px] text-gray-950 font-bold tracking-tight truncate max-w-md">
                  {activeChat?.title ?? 'New Conversation'}
                </h2>
                <span className="border border-blue-200 text-[#0b57d0] rounded-full px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider bg-blue-50 shrink-0">
                  AI Legal Assistant
                </span>
              </div>
              <button className="text-gray-400 hover:text-gray-800 transition-colors cursor-pointer">
                <Icon name="more_vert" size={22} />
              </button>
            </div>

            <ChatWindow messages={messages} />

            <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-[#fafbfc] via-[#fafbfc] to-transparent pb-8">
              <ChatInput
                onSend={handleSend}
                placeholder="Ask a follow-up question or specify a clause..."
                attachments={[{ name: 'Bangalore_Rental_2024.pdf' }]}
              />
              <div className="text-center mt-3 text-[11px] text-gray-400">
                NyayaAI is grounded in Indian statutes and landmark precedents. Verify critical citations independently.
              </div>
            </div>
          </div>

          <RightPanel mode="context" context={CONTEXT} title="Case Context" />
        </main>
      </div>
    </div>
  );
}
