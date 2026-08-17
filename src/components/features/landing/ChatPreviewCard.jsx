import Icon from '../../ui/Icon';

export default function ChatPreviewCard() {
  return (
    <div className="relative z-10 w-full max-w-md bg-white rounded-card shadow-level-2 border border-surface-variant overflow-hidden flex flex-col h-[500px]">
      <div className="bg-surface-container-low border-b border-surface-variant px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white font-bold text-sm">N</div>
          <div>
            <h3 className="font-body-md text-sm font-semibold text-primary leading-tight">NyayaAI</h3>
            <p className="font-label-caps text-[10px] text-on-surface-variant">Legal Assistant</p>
          </div>
        </div>
        <Icon name="more_horiz" size={16} className="text-on-surface-variant" />
      </div>

      <div className="flex-grow p-4 overflow-y-auto flex flex-col gap-chat-gap bg-background">
        <div className="self-end max-w-[85%] bg-primary text-white p-3 rounded-2xl rounded-tr-sm shadow-sm">
          <p className="font-body-md text-sm">
            What are the key changes in the Bharatiya Nyaya Sanhita regarding cybercrime?
          </p>
        </div>
        <div className="self-start max-w-[90%] bg-white border border-surface-variant text-primary p-4 rounded-2xl rounded-tl-sm shadow-level-1">
          <p className="font-body-md text-sm mb-3">
            The BNS (2023) introduces several key provisions addressing digital and cybercrimes:
          </p>
          <ul className="list-disc pl-4 font-body-md text-sm space-y-2 mb-3 text-on-surface-variant">
            <li>Data theft and digital fraud are now explicitly defined under Section 111.</li>
            <li>Heavier penalties for unauthorized access to critical infrastructure.</li>
          </ul>
          <div className="bg-surface-container-low p-2 rounded-sm border border-surface-variant inline-block">
            <span className="font-citation text-xs text-primary">Source: BNS Sec 111(1)</span>
          </div>
        </div>
      </div>

      <div className="p-4 bg-white border-t border-surface-variant">
        <div className="bg-background border border-surface-variant rounded-xl p-2 flex items-center gap-2 focus-within:border-primary transition-colors">
          <Icon name="attach_file" size={20} className="text-on-surface-variant ml-2" />
          <input
            className="flex-grow bg-transparent border-none focus:ring-0 font-body-md text-sm text-primary py-1"
            placeholder="Ask a legal question..."
            type="text"
          />
          <button className="w-8 h-8 rounded-lg bg-primary text-white flex items-center justify-center shadow-sm">
            <Icon name="arrow_upward" size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
