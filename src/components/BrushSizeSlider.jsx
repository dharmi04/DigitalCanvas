export default function BrushSizeSlider({ brushSize, setBrushSize }) {
    return (
      <div className="flex flex-col items-center">
        <label className="mb-1 text-sm">Brush Size: {brushSize}px</label>
        <input
          type="range"
          min="1"
          max="50"
          value={brushSize}
          onChange={(e) => setBrushSize(parseInt(e.target.value))}
          className="w-40 accent-blue-500"
        />
      </div>
    );
  }