import { Paintbrush, Eraser, Grid, Pencil, Droplet } from 'lucide-react';

export default function ToolBar({ tool, setTool, showGrid, setShowGrid }) {
  const tools = [
    { id: 'pencil', label: 'Pencil', icon: <Pencil size={24} /> },
    { id: 'pen', label: 'Pen', icon: <Paintbrush size={24} /> },
    { id: 'eraser', label: 'Eraser', icon: <Eraser size={24} /> },
    { id: 'shape', label: 'Shape', icon: '◯▢' },
    { id: 'fill', label: 'Fill', icon: <Droplet size={24} /> }
  ];

  const baseClasses =
    'p-2 rounded-md transition-all duration-150 ease-in-out relative overflow-hidden group';

  const activeClasses =
    'bg-pink-300 hover:bg-pink-400 text-white shadow-lg scale-110';

  const inactiveClasses =
    'bg-teal-400 hover:bg-teal-500 text-white';

  const iconClasses =
    'transition-transform duration-200 group-hover:scale-110 group-hover:drop-shadow-glow';

  return (
    <div className="flex items-center justify-center sm:justify-start flex-wrap gap-2 w-full sm:w-auto">
      {tools.map((t) => (
        <button
          key={t.id}
          onClick={() => setTool(t.id)}
          className={`${baseClasses} ${
            tool === t.id ? activeClasses : inactiveClasses
          }`}
          title={t.label}
        >
          <span className="absolute inset-0 bg-current opacity-20 rounded-full scale-0 group-active:scale-150 transition-transform duration-300" />
          <span className={`${iconClasses} ${tool === t.id ? 'animate-bounceTool' : ''}`}>
  {t.icon}
</span>

        </button>
      ))}

      {/* Grid Toggle Button */}
      <button
        onClick={() => setShowGrid(!showGrid)}
        className={`${baseClasses} ${
          showGrid ? activeClasses : inactiveClasses
        }`}
        title="Toggle Grid"
      >
        <span className="absolute inset-0 bg-current opacity-20 rounded-full scale-0 group-active:scale-150 transition-transform duration-300" />
        <span className={iconClasses}>
          <Grid size={24} />
        </span>
      </button>
    </div>
  );
}
