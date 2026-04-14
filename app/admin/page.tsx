'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { DashboardPanel } from '@/components/dashboard/DashboardPanel';
import { LogoBadge } from '@/components/ui/LogoBadge';
import { DEFAULT_SETTINGS } from '@/lib/config';
import { loadStoredSettings, saveStoredSettings } from '@/lib/settings-storage';

export default function AdminPage() {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);

  useEffect(() => {
    setSettings(loadStoredSettings());
  }, []);

  useEffect(() => {
    saveStoredSettings(settings);
  }, [settings]);

  return (
    <div className="min-h-screen p-4 md:p-6">
      <div className="mx-auto max-w-[1200px] space-y-6">
        <div className="flex flex-col gap-4 rounded-[28px] border border-white/60 bg-white/70 p-5 shadow-[0_10px_40px_rgba(15,23,42,0.08)] backdrop-blur md:flex-row md:items-center md:justify-between">
          <LogoBadge settings={settings} />
          <Link href="/" className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700">
            <ArrowLeft className="mr-2 inline h-4 w-4" /> Tilbage til formularen
          </Link>
        </div>
        <DashboardPanel settings={settings} setSettings={setSettings} />
      </div>
    </div>
  );
}
