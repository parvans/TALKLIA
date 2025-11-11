export default function BorderAnimatedContainer({ children }) {
  return (
    <div className="flex h-full rounded-2xl overflow-hidden border border-slate-700 relative">
      {children}
    </div>
  );
}
