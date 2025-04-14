export default function ShapeTools({ selectedShape, setSelectedShape, setTool }) {
    const shapes = [
      { id: 'rectangle', label: 'Rectangle', icon: '▢' },
      { id: 'circle', label: 'Circle', icon: '◯' },
      { id: 'line', label: 'Line', icon: '/' }
    ];
    
    const handleShapeSelect = (shape) => {
      setTool('shape');
      setSelectedShape(shape === selectedShape ? null : shape);
    };
    
    return (
      <div className={`flex items-center space-x-2 mt-2 p-2 rounded-md bg-gray-700 bg-opacity-50 ${selectedShape ? 'border border-blue-500' : ''}`}>
        <span className="text-sm text-gray-300">Shapes:</span>
        {shapes.map((shape) => (
          <button
            key={shape.id}
            onClick={() => handleShapeSelect(shape.id)}
            className={`w-10 h-10 flex items-center justify-center rounded-md transition-all ${
              selectedShape === shape.id
                ? 'bg-blue-600 text-white shadow-lg transform scale-110'
                : 'bg-gray-700 hover:bg-gray-600 text-gray-200'
            }`}
            title={shape.label}
          >
            <span className="text-xl">{shape.icon}</span>
          </button>
        ))}
      </div>
    );
  }