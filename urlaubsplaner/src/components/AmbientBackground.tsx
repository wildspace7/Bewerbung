export function AmbientBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-gradient-to-br from-sky via-blush to-dawn">
      <div className="absolute -left-24 -top-20 h-80 w-80 rounded-full bg-blob-blue opacity-55 blur-[60px]" />
      <div className="absolute -right-24 -bottom-16 h-72 w-72 rounded-full bg-blob-peach opacity-55 blur-[60px]" />
      <div className="absolute -left-16 top-1/2 h-56 w-56 rounded-full bg-blob-pink opacity-55 blur-[60px]" />
    </div>
  );
}
