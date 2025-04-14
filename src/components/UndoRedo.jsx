import { Undo2, Redo2 } from 'lucide-react';

export default function UndoRedo({ undo, redo, canUndo, canRedo }) {
  return (
    <div className="flex space-x-2">
      <button
        onClick={undo}
        disabled={!canUndo}
        className={`p-2 rounded-md transition-all ${
          canUndo
            ? 'bg-gray-700 hover:bg-gray-600 text-gray-200'
            : 'bg-gray-800 text-gray-500 cursor-not-allowed'
        }`}
        title="Undo"
      >
        <Undo2 size={24} />
      </button>
      <button
        onClick={redo}
        disabled={!canRedo}
        className={`p-2 rounded-md transition-all ${
          canRedo
            ? 'bg-gray-700 hover:bg-gray-600 text-gray-200'
            : 'bg-gray-800 text-gray-500 cursor-not-allowed'
        }`}
        title="Redo"
      >
        <Redo2 size={24} />
      </button>
    </div>
  );
}