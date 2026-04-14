'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Settings2 } from 'lucide-react';
import { ChatWindow } from '@/components/chat/ChatWindow';
import { LogoBadge } from '@/components/ui/LogoBadge';
import { DEFAULT_SETTINGS, INITIAL_FORM } from '@/lib/config';
import { loadStoredSettings, saveStoredSettings } from '@/lib/settings-storage';

export default function HomePage() {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [form, setForm] = useState(INITIAL_FORM);

  useEffect(() => {
    setSettings(loadStoredSettings());
  }, []);

  useEffect(() => {
    saveStoredSettings(settings);
  }, [settings]);

  return (
    <div className="min-h-screen p-4 md:p-6">
      <div className="mx-auto max-w-[1600px]">
        <div className="mb-6 flex flex-col gap-4 rounded-[28px] border border-white/60 bg-white/70 p-5 shadow-[0_10px_40px_rgba(15,23,42,0.08)] backdrop-blur xl:flex-row xl:items-center xl:justify-between">
          <LogoBadge settings={settings} />
          <div className="flex flex-wrap items-center gap-3 text-sm text-slate-600">
            <span className="rounded-full px-3 py-1" style={{ backgroundColor: settings.accentSoft, color: settings.accentDeep }}>White-label klar</span>
            <span className="rounded-full border border-slate-200 px-3 py-1">Logo spots indbygget</span>
            <span className="rounded-full border border-slate-200 px-3 py-1">Mail kan sendes automatisk</span>
            <Link href="/admin" className="rounded-full border border-slate-200 bg-white px-3 py-1">
              <Settings2 className="mr-2 inline h-4 w-4" /> Gå til admin
            </Link>
          </div>
        </div>

        <ChatWindow form={form} setForm={setForm} settings={settings} />
      </div>
    </div>
  );
}
