import { Building2, Droplets, FileText, ShowerHead, Thermometer, Toilet, WashingMachine, Wrench } from 'lucide-react';
import { Settings } from '@/lib/types';

const TASK_ICONS = {
  'Toilet': Toilet,
  'Armatur': Droplets,
  'Bruser': ShowerHead,
  'Radiator': Thermometer,
  'Vaskemaskine / opvaskemaskine': WashingMachine,
  'Afløb / vandlås': Droplets,
  'Lækage / problem': Wrench,
  'Varmtvandsbeholder / pumpe': Building2,
  'Andet': FileText
} as const;

export function TaskGrid({ tasks, onSelect, settings }: { tasks: readonly string[]; onSelect: (value: string) => void; settings: Settings }) {
  return (
    <div className="grid gap-2 sm:grid-cols-2">
      {tasks.map((task) => {
        const Icon = TASK_ICONS[task as keyof typeof TASK_ICONS] ?? Wrench;
        return (
          <button
            key={task}
            type="button"
            className="rounded-2xl border border-slate-200 bg-white px-4 py-4 text-left transition hover:border-slate-300 hover:bg-slate-50"
            onClick={() => onSelect(task)}
          >
            <div className="flex items-center gap-3">
              <div className="rounded-xl p-2" style={{ backgroundColor: settings.accentSoft, color: settings.accentDeep }}>
                <Icon className="h-4 w-4" />
              </div>
              <span className="text-sm text-slate-900">{task}</span>
            </div>
          </button>
        );
      })}
    </div>
  );
}
