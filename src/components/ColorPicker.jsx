import { useState } from 'react';

export default function ColorPicker({ color, setColor }) {
  const [showCustomPicker, setShowCustomPicker] = useState(false);
  
  const colorOptions = [
    '#000000', // Black
    '#FFFFFF', // White
    '#FF0000', // Red
    '#FF8800', // Orange
    '#FFFF00', // Yellow
    '#00FF00', // Green
    '#0000FF', // Blue
    '#8800FF', // Purple
  ];
  
  const handleColorChange = (e) => {
    setColor(e.target.value);
  };
  
  const toggleCustomPicker = () => {
    setShowCustomPicker(!showCustomPicker);
  };
  
  return (
    <div className="flex flex-col items-center">
      <label className="mb-1 text-sm">Color</label>
      <div className="flex flex-wrap justify-center gap-1 mb-1">
        {colorOptions.map((c) => (
          <button
            key={c}
            onClick={() => setColor(c)}
            className={`w-8 h-8 rounded-full transition-transform ${
              color === c ? 'transform scale-110 ring-2 ring-white' : ''
            }`}
            style={{ backgroundColor: c }}
            title={c}
          />
        ))}
        <button
          onClick={toggleCustomPicker}
          className={`w-8 h-8 rounded-full overflow-hidden transition-transform ${
            !colorOptions.includes(color) ? 'transform scale-110 ring-2 ring-white' : ''
          }`}
          style={{ 
            background: 'conic-gradient(red, yellow, lime, aqua, blue, magenta, red)'
          }}
          title="Custom Color"
        />
      </div>
      
      {showCustomPicker && (
        <div className="p-2 bg-gray-900 rounded-lg shadow-lg">
          <div className="flex items-center space-x-2">
            <input
              type="color"
              value={color}
              onChange={handleColorChange}
              className="w-8 h-8 rounded cursor-pointer"
            />
            <span className="text-sm">{color}</span>
          </div>
          
          <div className="mt-2 grid grid-cols-5 gap-1">
            {[
              '#E57373', '#F06292', '#BA68C8', '#9575CD', '#7986CB',
              '#64B5F6', '#4FC3F7', '#4DD0E1', '#4DB6AC', '#81C784',
              '#AED581', '#DCE775', '#FFF176', '#FFD54F', '#FFB74D',
              '#FF8A65', '#A1887F', '#E0E0E0', '#90A4AE', '#212121'
            ].map((c) => (
              <button
                key={c}
                onClick={() => setColor(c)}
                className="w-6 h-6 rounded-full transition-transform hover:scale-110"
                style={{ backgroundColor: c }}
                title={c}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}