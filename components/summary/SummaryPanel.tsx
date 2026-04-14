import { Calculator, CheckCircle2, FileText } from 'lucide-react';
import { LogoBadge } from '@/components/ui/LogoBadge';
import { EstimateResult, Settings, SummaryEntry } from '@/lib/types';
import { money } from '@/lib/pricing';

export function SummaryPanel({
  settings,
  summaryLog,
  lead,
  complete,
  result,
  images
}: {
  settings: Settings;
  summaryLog: SummaryEntry[];
  lead: { label: string; reason: string };
  complete: boolean;
  result: EstimateResult;
  images: { name: string; url: string }[];
}) {
  return (
    <div className="hidden h-full xl:block">
      <div className="sticky top-8 h-[calc(100vh-170px)] overflow-hidden">
        <div className="flex h-full flex-col overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-soft">
          <div className="border-b border-slate-200 px-6 py-5">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="rounded-2xl p-2" style={{ backgroundColor: settings.accentSoft, color: settings.accentDeep }}>
                  <FileText className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-xs uppercase tracking-[0.18em] text-slate-400">Live dokument</div>
                  <div className="text-lg font-semibold text-slate-900">Opsummeringsark</div>
                </div>
              </div>
              <LogoBadge settings={settings} compact />
            </div>
          </div>

          <div className="min-h-0 flex-1 space-y-5 overflow-y-auto p-6">
            <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-4">
              <div className="mb-4 text-sm font-semibold text-slate-900">Løbende log</div>
              <div className="space-y-3 text-sm">
                {summaryLog.length === 0 ? (
                  <div className="text-slate-500">Svarene vises løbende her som nye linjer.</div>
                ) : (
                  summaryLog.map((entry) => (
                    <div key={entry.id} className="rounded-2xl border border-slate-200 bg-white px-3 py-3">
                      <div className="text-xs uppercase tracking-[0.12em] text-slate-400">{entry.question}</div>
                      <div className="mt-1 font-medium text-slate-900">{entry.answer}</div>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="rounded-[24px] border border-slate-200 p-4">
              <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-900">
                <CheckCircle2 className="h-4 w-4" style={{ color: settings.accent }} />
                Lead score
              </div>
              <div className="flex items-center justify-between gap-4">
                <span className="rounded-full px-3 py-1 text-sm" style={{ backgroundColor: settings.accentSoft, color: settings.accentDeep }}>{lead.label}</span>
                <span className="text-sm text-slate-500">{lead.reason}</span>
              </div>
            </div>

            <div className="rounded-[24px] p-5 text-white" style={{ background: `linear-gradient(135deg, ${settings.accentDeep}, ${settings.accent})` }}>
              <div className="flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-white/70">
                <Calculator className="h-4 w-4" /> Estimat
              </div>
              <div className="mt-2 text-3xl font-semibold">{complete && !result.manual ? `${money(result.min)} – ${money(result.max)}` : 'Afventer'}</div>
              <div className="mt-3 text-sm text-white/80">{result.manual ? 'Kræver manuel vurdering' : 'Beregnet ud fra svar, tillæg og valgte præferencer'}</div>
            </div>

            <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-4">
              <div className="mb-3 text-sm font-semibold text-slate-900">Forbehold</div>
              <div className="space-y-2 text-sm text-slate-600">
                {result.disclaimers.map((item) => (
                  <div key={item} className="rounded-2xl bg-white p-3">{item}</div>
                ))}
              </div>
            </div>

            {images.length > 0 && (
              <div className="rounded-[24px] border border-slate-200 p-4">
                <div className="mb-3 text-sm font-semibold text-slate-900">Billeder</div>
                <div className="grid grid-cols-2 gap-3">
                  {images.map((img) => (
                    <div key={img.url} className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
                      <img src={img.url} alt={img.name} className="h-24 w-full object-cover" />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
