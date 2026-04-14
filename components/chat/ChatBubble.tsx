import { Settings } from '@/lib/types';

export function ChatBubble({ role, children, settings }: { role: 'bot' | 'user'; children: React.ReactNode; settings: Settings }) {
  const isBot = role === 'bot';
  return (
    <div className={`flex w-full ${isBot ? 'justify-start' : 'justify-end'}`}>
      <div
        className={`max-w-[88%] rounded-3xl px-4 py-3 text-sm leading-6 shadow-sm ${isBot ? 'border border-slate-200 bg-white text-slate-900' : 'text-white'}`}
        style={isBot ? undefined : { background: `linear-gradient(135deg, ${settings.accent}, ${settings.accentDeep})` }}
      >
        {children}
      </div>
    </div>
  );
}
