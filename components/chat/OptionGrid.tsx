export function OptionGrid({ options, onSelect }: { options: string[]; onSelect: (value: string) => void }) {
  return (
    <div className="grid gap-2 sm:grid-cols-2">
      {options.map((option) => (
        <button
          key={option}
          type="button"
          className="h-auto rounded-2xl border border-slate-200 bg-white px-4 py-3 text-left text-sm text-slate-900 transition hover:border-slate-300 hover:bg-slate-50"
          onClick={() => onSelect(option)}
        >
          {option}
        </button>
      ))}
    </div>
  );
}
