'use client';

import { useRef } from 'react';
import { Image as ImageIcon, Settings2 } from 'lucide-react';
import { Settings } from '@/lib/types';

function Hint({ children }: { children: React.ReactNode }) {
  return <div className="text-xs text-slate-500">{children}</div>;
}

function Field({ label, hint, children }: { label: string; hint: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-slate-700">{label}</label>
      <Hint>{hint}</Hint>
      {children}
    </div>
  );
}

export function DashboardPanel({ settings, setSettings }: { settings: Settings; setSettings: React.Dispatch<React.SetStateAction<Settings>> }) {
  const logoInputRef = useRef<HTMLInputElement>(null);

  function updateSetting<K extends keyof Settings>(key: K, value: Settings[K]) {
    setSettings((prev) => ({ ...prev, [key]: value }));
  }

  function handleLogoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    updateSetting('logoUrl', URL.createObjectURL(file));
  }

  return (
    <div className="space-y-6">
      <div className="rounded-[32px] border border-slate-200 bg-white shadow-soft">
        <div className="space-y-6 p-6">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl p-2" style={{ backgroundColor: settings.accentSoft, color: settings.accentDeep }}>
              <Settings2 className="h-5 w-5" />
            </div>
            <div>
              <div className="text-lg font-semibold text-slate-900">Virksomheds-dashboard</div>
              <div className="text-sm text-slate-500">Tilpas branding, priser, mail og opsætning</div>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Virksomhedsnavn" hint="Vises for kunden i chatten og i opsummeringen.">
              <input value={settings.companyName} onChange={(e) => updateSetting('companyName', e.target.value)} className="w-full rounded-2xl border border-slate-200 px-4 py-3" />
            </Field>
            <Field label="Produktnavn" hint="Navnet på jeres AI-assistent eller flow.">
              <input value={settings.productName} onChange={(e) => updateSetting('productName', e.target.value)} className="w-full rounded-2xl border border-slate-200 px-4 py-3" />
            </Field>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Virksomhedens mail" hint="Forespørgsler sendes hertil, når kunden trykker send til sidst.">
              <input type="email" value={settings.businessEmail} onChange={(e) => updateSetting('businessEmail', e.target.value)} placeholder="kontakt@firma.dk" className="w-full rounded-2xl border border-slate-200 px-4 py-3" />
            </Field>
            <Field label="Google Maps API key" hint="Bruges til rigtig Google Places-autosuggest.">
              <input value={settings.googleMapsApiKey} onChange={(e) => updateSetting('googleMapsApiKey', e.target.value)} placeholder="Tilslut Places senere" className="w-full rounded-2xl border border-slate-200 px-4 py-3" />
            </Field>
          </div>

          <div className="grid gap-4 md:grid-cols-4">
            <Field label="Accent" hint="Primær farve til knapper og highlights.">
              <input type="color" value={settings.accent} onChange={(e) => updateSetting('accent', e.target.value)} className="h-12 w-full rounded-2xl border border-slate-200 p-2" />
            </Field>
            <Field label="Accent soft" hint="Baggrundsfarve til ikoner og badges.">
              <input type="color" value={settings.accentSoft} onChange={(e) => updateSetting('accentSoft', e.target.value)} className="h-12 w-full rounded-2xl border border-slate-200 p-2" />
            </Field>
            <Field label="Accent deep" hint="Mørk variant til gradients og hover states.">
              <input type="color" value={settings.accentDeep} onChange={(e) => updateSetting('accentDeep', e.target.value)} className="h-12 w-full rounded-2xl border border-slate-200 p-2" />
            </Field>
            <Field label="Logo tekst" hint="Fallback hvis der ikke er uploadet logo.">
              <input value={settings.logoText} onChange={(e) => updateSetting('logoText', e.target.value)} className="w-full rounded-2xl border border-slate-200 px-4 py-3" />
            </Field>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Logo" hint="Upload jeres logo. Det vises flere steder i flowet.">
              <div className="flex items-center gap-3">
                <button type="button" className="rounded-2xl border border-slate-200 px-4 py-3 text-sm" onClick={() => logoInputRef.current?.click()}>
                  <ImageIcon className="mr-2 inline h-4 w-4" /> Upload logo
                </button>
                <input ref={logoInputRef} type="file" accept="image/*" className="hidden" onChange={handleLogoUpload} />
                {settings.logoUrl && <img src={settings.logoUrl} alt="Logo" className="h-11 w-11 rounded-2xl object-cover" />}
              </div>
            </Field>
            <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
              Indstillingerne gemmes lokalt i browseren i denne prototype. Når løsningen flyttes i produktion, bør de gemmes i database.
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <Field label="Timepris" hint="Grundpris pr. time. Klar til at blive koblet dybere ind i beregningerne.">
              <input type="number" value={settings.hourlyRate} onChange={(e) => updateSetting('hourlyRate', Number(e.target.value || 0))} className="w-full rounded-2xl border border-slate-200 px-4 py-3" />
            </Field>
            <Field label="Akut tillæg min" hint="Minimum ekstra pris ved akutte opgaver.">
              <input type="number" value={settings.acuteMin} onChange={(e) => updateSetting('acuteMin', Number(e.target.value || 0))} className="w-full rounded-2xl border border-slate-200 px-4 py-3" />
            </Field>
            <Field label="Akut tillæg max" hint="Maksimum ekstra pris ved akutte opgaver.">
              <input type="number" value={settings.acuteMax} onChange={(e) => updateSetting('acuteMax', Number(e.target.value || 0))} className="w-full rounded-2xl border border-slate-200 px-4 py-3" />
            </Field>
          </div>

          <div className="grid gap-4 md:grid-cols-4">
            <Field label="Hurtig min" hint="Tillæg hvis opgaven skal udføres inden for få dage.">
              <input type="number" value={settings.fastMin} onChange={(e) => updateSetting('fastMin', Number(e.target.value || 0))} className="w-full rounded-2xl border border-slate-200 px-4 py-3" />
            </Field>
            <Field label="Hurtig max" hint="Øvre grænse for hurtig-tillæg.">
              <input type="number" value={settings.fastMax} onChange={(e) => updateSetting('fastMax', Number(e.target.value || 0))} className="w-full rounded-2xl border border-slate-200 px-4 py-3" />
            </Field>
            <Field label="Zone min" hint="Kørselstillæg uden for primært område.">
              <input type="number" value={settings.zoneMin} onChange={(e) => updateSetting('zoneMin', Number(e.target.value || 0))} className="w-full rounded-2xl border border-slate-200 px-4 py-3" />
            </Field>
            <Field label="Zone max" hint="Øvre grænse for kørselstillæg.">
              <input type="number" value={settings.zoneMax} onChange={(e) => updateSetting('zoneMax', Number(e.target.value || 0))} className="w-full rounded-2xl border border-slate-200 px-4 py-3" />
            </Field>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Svær adgang min" hint="Ekstra pris ved trange eller besværlige forhold.">
              <input type="number" value={settings.difficultAccessMin} onChange={(e) => updateSetting('difficultAccessMin', Number(e.target.value || 0))} className="w-full rounded-2xl border border-slate-200 px-4 py-3" />
            </Field>
            <Field label="Svær adgang max" hint="Øvre estimat for adgangsrelateret tillæg.">
              <input type="number" value={settings.difficultAccessMax} onChange={(e) => updateSetting('difficultAccessMax', Number(e.target.value || 0))} className="w-full rounded-2xl border border-slate-200 px-4 py-3" />
            </Field>
          </div>
        </div>
      </div>
    </div>
  );
}
