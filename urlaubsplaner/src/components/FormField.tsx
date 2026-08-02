export function Field({
  label,
  ...props
}: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="block">
      <span className="text-label uppercase text-ink-faint">{label}</span>
      <input
        {...props}
        className="mt-1.5 w-full rounded-md border border-white/75 bg-white/42 px-4 py-3 text-body text-ink placeholder:text-ink-faint backdrop-blur-[14px] outline-none transition-colors focus:border-coral"
      />
    </label>
  );
}

export function SelectField({
  label,
  children,
  ...props
}: { label: string } & React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <label className="block">
      <span className="text-label uppercase text-ink-faint">{label}</span>
      <select
        {...props}
        className="mt-1.5 w-full rounded-md border border-white/75 bg-white/42 px-4 py-3 text-body text-ink backdrop-blur-[14px] outline-none transition-colors focus:border-coral"
      >
        {children}
      </select>
    </label>
  );
}
