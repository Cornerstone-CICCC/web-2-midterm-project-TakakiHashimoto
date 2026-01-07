function StatCard({ title, value }: { title: string; value: string | number }) {
  return (
    <div className="bg-zinc-900/80 border border-zinc-800 rounded-xl p-5">
      <p className="text-gray-400 text-sm">{title}</p>
      <p className="text-3xl font-bold mt-2">{value}</p>
    </div>
  );
}

export { StatCard };
