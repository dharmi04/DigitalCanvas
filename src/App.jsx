import { useState, useRef, useEffect } from 'react';
import ToolBar from './components/ToolBar';
import Canvas from './components/Canvas';
import ColorPicker from './components/ColorPicker';
import BrushSizeSlider from './components/BrushSizeSlider';
import Header from './components/Header';
import UndoRedo from './components/UndoRedo';
import ShapeTools from './components/ShapeTools';

export default function App() {
  const [tool, setTool] = useState('pencil');
  const [color, setColor] = useState('#3B82F6');
  const [brushSize, setBrushSize] = useState(5);
  const [isDrawing, setIsDrawing] = useState(false);
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [showGrid, setShowGrid] = useState(false);
  const [selectedShape, setSelectedShape] = useState(null);
  
  const canvasRef = useRef(null);
  const contextRef = useRef(null);
  
  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    context.fillStyle = 'white';
    context.fillRect(0, 0, canvas.width, canvas.height);
    
    // Save this state to history
    saveToHistory();
  };
  
  const saveToHistory = () => {
    const canvas = canvasRef.current;
    
    // If we're not at the end of the history, truncate it
    if (historyIndex !== history.length - 1) {
      setHistory(history.slice(0, historyIndex + 1));
    }
    
    // Add current state to history
    setHistory([...history.slice(0, historyIndex + 1), canvas.toDataURL()]);
    setHistoryIndex(historyIndex + 1);
  };
  
  const undo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
    }
  };
  
  const redo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
    }
  };
  
  const saveAsImage = () => {
    const canvas = canvasRef.current;
    const image = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.download = 'my-artwork.png';
    link.href = image;
    link.click();
  };
  
  // Load from history when history index changes
  useEffect(() => {
    if (historyIndex >= 0 && history[historyIndex]) {
      const img = new Image();
      img.onload = () => {
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.drawImage(img, 0, 0);
      };
      img.src = history[historyIndex];
    }
  }, [historyIndex, history]);
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fdfcfb] via-[#e2d1c3] to-[#a1c4fd] text-white">
      <Header />
      
      <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-6">
        <div className="bg-gray-800 bg-opacity-75 rounded-lg shadow-2xl backdrop-filter backdrop-blur-sm p-2 sm:p-4 mb-4 sm:mb-6">
          <div className="flex flex-col sm:flex-row flex-wrap gap-4 justify-between items-center mb-4">
            <ToolBar 
              tool={tool} 
              setTool={setTool} 
              showGrid={showGrid}
              setShowGrid={setShowGrid}
            />
            
            <ColorPicker 
              color={color} 
              setColor={setColor} 
            />
            
            <BrushSizeSlider 
              brushSize={brushSize} 
              setBrushSize={setBrushSize} 
            />
            
            <UndoRedo 
              undo={undo} 
              redo={redo}
              canUndo={historyIndex > 0}
              canRedo={historyIndex < history.length - 1}
            />
            
            <div className="flex space-x-2 w-full sm:w-auto justify-center">
              <button 
                onClick={clearCanvas}
                className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-md transition-all transform hover:scale-105"
              >
                Clear Canvas
              </button>
              
              <button 
                onClick={saveAsImage}
                className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-md transition-all transform hover:scale-105"
              >
                Save Image
              </button>
            </div>
          </div>
          
          <ShapeTools 
            selectedShape={selectedShape} 
            setSelectedShape={setSelectedShape}
            setTool={setTool}
          />
        </div>
        
        <Canvas 
          canvasRef={canvasRef} 
          contextRef={contextRef}
          tool={tool}
          color={color}
          brushSize={brushSize}
          isDrawing={isDrawing}
          setIsDrawing={setIsDrawing}
          saveToHistory={saveToHistory}
          showGrid={showGrid}
          selectedShape={selectedShape}
        />
      </div>
    </div>
  );
}