import { Search } from "lucide-react";

/**
 * The pill search box. Height, width and type size come from `className`; `children` sit at its end
 * (a clear button, a count).
 */
export default function SearchField({
  value,
  onChange,
  placeholder,
  className = "",
  children,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  className?: string;
  children?: React.ReactNode;
}) {
  return (
    <label className={`flex w-full items-center gap-3 rounded-full border border-ink/25 px-4 transition-colors focus-within:border-ink ${className}`}>
      <Search className="size-4 shrink-0 text-mute" aria-hidden />
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label={placeholder}
        className="w-full bg-transparent outline-none placeholder:text-mute"
      />
      {children}
    </label>
  );
}
