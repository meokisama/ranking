export default function Field({
  label,
  value,
  onChange,
  max,
  area,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  max: number;
  area?: boolean;
}) {
  const cls =
    "mt-2 w-full border-b border-ink/30 bg-transparent pb-2 font-[family-name:var(--font-display)] text-xl outline-none transition-colors duration-500 focus:border-shu";
  return (
    <label className="block">
      <span className="label flex justify-between text-mute">
        {label}
        <span>
          {value.length}/{max}
        </span>
      </span>
      {area ? (
        <textarea rows={5} maxLength={max} value={value} onChange={(e) => onChange(e.target.value)} className={`${cls} resize-y`} />
      ) : (
        <input maxLength={max} value={value} onChange={(e) => onChange(e.target.value)} className={cls} />
      )}
    </label>
  );
}
