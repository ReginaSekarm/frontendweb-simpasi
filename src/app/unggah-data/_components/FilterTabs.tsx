'use client';

type Props<T extends string> = {
  options: readonly T[];
  value: T;
  onChange: (v: T) => void;
  labels?: Partial<Record<T, string>>;
  className?: string;
};

export default function FilterTabs<T extends string>({
  options,
  value,
  onChange,
  labels,
  className = '',
}: Props<T>) {
  return (
    <div className={`flex flex-wrap items-center gap-[12px] ${className}`}>
      {options.map((opt) => (
        <button
          key={opt}
          type="button"
          onClick={() => onChange(opt)}
          className={`h-[42px] px-[20px] rounded-[9px] font-semibold text-[22.5px] leading-[27px] transition-colors cursor-pointer ${
            value === opt
              ? 'bg-[#D45060] text-white'
              : 'bg-[#D9D9D9]/50 text-[#AAA6A6]/50 hover:bg-[#D9D9D9]/70'
          }`}
        >
          {labels?.[opt] ?? opt}
        </button>
      ))}
    </div>
  );
}