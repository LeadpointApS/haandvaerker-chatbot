import { Settings } from '@/lib/types';

export function LogoBadge({ settings, compact = false }: { settings: Settings; compact?: boolean }) {
  return (
    <div className="flex items-center gap-3">
      {settings.logoUrl ? (
        <img src={settings.logoUrl} alt="Logo" className={compact ? 'h-10 w-10 rounded-2xl object-cover' : 'h-11 w-11 rounded-2xl object-cover'} />
      ) : (
        <div
          className={compact ? 'flex h-10 w-10 items-center justify-center rounded-2xl text-sm font-semibold text-white' : 'flex h-11 w-11 items-center justify-center rounded-2xl text-sm font-semibold text-white'}
          style={{ background: `linear-gradient(135deg, ${settings.accent}, ${settings.accentDeep})` }}
        >
          {settings.logoText}
        </div>
      )}
      <div>
        <div className="text-sm font-medium text-slate-500">{settings.companyName}</div>
        <div className="text-base font-semibold text-slate-900">{settings.productName}</div>
      </div>
    </div>
  );
}
