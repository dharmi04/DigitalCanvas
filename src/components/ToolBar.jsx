import { Paintbrush, Eraser, Grid, Pencil, Droplet } from 'lucide-react';

export default function ToolBar({ tool, setTool, showGrid, setShowGrid }) {
  const tools = [
    { id: 'pencil', label: 'Pencil', icon: <Pencil size={24} /> },
    { id: 'pen', label: 'Pen', icon: <Paintbrush size={24} /> },
    { id: 'eraser', label: 'Eraser', icon: <Eraser size={24} /> },
    { id: 'shape', label: 'Shape', icon: '◯▢' },
    { id: 'fill', label: 'Fill', icon: <Droplet size={24} /> }

  ];
  
  return (
    <div className="flex items-center justify-center sm:justify-start flex-wrap gap-2 w-full sm:w-auto">
      {tools.map((t) => (
        <button
          key={t.id}
          onClick={() => setTool(t.id)}
          className={`p-2 rounded-md transition-all ${
            tool === t.id
              ? 'bg-blue-600 text-white shadow-lg transform scale-110'
              : 'bg-gray-700 hover:bg-gray-600 text-gray-200'
          }`}
          title={t.label}
        >
          {t.icon}
        </button>
      ))}
      
      <button
        onClick={() => setShowGrid(!showGrid)}
        className={`p-2 rounded-md transition-all ${
          showGrid
            ? 'bg-blue-600 text-white shadow-lg transform scale-110'
            : 'bg-gray-700 hover:bg-gray-600 text-gray-200'
        }`}
        title="Toggle Grid"
      >
        <Grid size={24} />
      </button>
    </div>
  );
}