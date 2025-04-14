import { useEffect, useState, useRef } from 'react';

export default function Canvas({ 
  canvasRef, 
  contextRef, 
  tool, 
  color, 
  brushSize, 
  isDrawing, 
  setIsDrawing, 
  saveToHistory,
  showGrid,
  selectedShape
}) {
  const [startPoint, setStartPoint] = useState({ x: 0, y: 0 });
  const [lastPoint, setLastPoint] = useState({ x: 0, y: 0 });
  const tempCanvasRef = useRef(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    const tempCanvas = tempCanvasRef.current;
    
    // Set initial canvas dimensions
    const resizeCanvas = () => {
      const container = canvas.parentElement;
      const width = container.clientWidth;
      const height = container.clientHeight;
      
      canvas.width = width;
      canvas.height = height;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      
      tempCanvas.width = width;
      tempCanvas.height = height;
      tempCanvas.style.width = `${width}px`;
      tempCanvas.style.height = `${height}px`;
      
      const context = canvas.getContext('2d');
      const tempContext = tempCanvas.getContext('2d');
      
      // Set drawing settings
      context.lineCap = 'round';
      context.lineJoin = 'round';
      context.strokeStyle = color;
      context.lineWidth = brushSize;
      
      tempContext.lineCap = 'round';
      tempContext.lineJoin = 'round';
      tempContext.strokeStyle = color;
      tempContext.lineWidth = brushSize;
      
      contextRef.current = context;
      
      // Fill with white background initially if canvas is empty
      if (!canvas.hasAttribute('data-initialized')) {
        context.fillStyle = 'white';
        context.fillRect(0, 0, canvas.width, canvas.height);
        canvas.setAttribute('data-initialized', 'true');
        saveToHistory();
      }
    };
    
    resizeCanvas();
    
    // Handle window resize
    window.addEventListener('resize', resizeCanvas);
    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);
  
  useEffect(() => {
    if (contextRef.current) {
      contextRef.current.strokeStyle = color;
      if (tempCanvasRef.current) {
        const tempContext = tempCanvasRef.current.getContext('2d');
        tempContext.strokeStyle = color;
      }
    }
  }, [color]);
  
  useEffect(() => {
    if (contextRef.current) {
      contextRef.current.lineWidth = brushSize;
      if (tempCanvasRef.current) {
        const tempContext = tempCanvasRef.current.getContext('2d');
        tempContext.lineWidth = brushSize;
      }
    }
  }, [brushSize]);
  
  // Handle drawing and touch events
  const getCoordinates = (event) => {
    if (!canvasRef.current) return { x: 0, y: 0 };
    
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    
    // Check if touch event
    if (event.touches && event.touches[0]) {
      return {
        x: event.touches[0].clientX - rect.left,
        y: event.touches[0].clientY - rect.top
      };
    }
    
    // Mouse event
    return {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top
    };
  };

  function floodFill(ctx, x, y, fillColor) {
    const canvasWidth = ctx.canvas.width;
    const canvasHeight = ctx.canvas.height;
  
    const imgData = ctx.getImageData(0, 0, canvasWidth, canvasHeight);
    const data = imgData.data;
  
    const targetColor = [
      data[(y * canvasWidth + x) * 4],
      data[(y * canvasWidth + x) * 4 + 1],
      data[(y * canvasWidth + x) * 4 + 2],
      data[(y * canvasWidth + x) * 4 + 3],
    ];
  
    const toFill = [[x, y]];
    const matchColor = (i, target, tolerance = 32) =>
    Math.abs(data[i] - target[0]) <= tolerance &&
    Math.abs(data[i + 1] - target[1]) <= tolerance &&
    Math.abs(data[i + 2] - target[2]) <= tolerance &&
    Math.abs(data[i + 3] - target[3]) <= tolerance
  
    const setColor = (i) => {
      data[i] = fillColor[0];
      data[i + 1] = fillColor[1];
      data[i + 2] = fillColor[2];
      data[i + 3] = 255;
    };
  
    const visited = new Set();
  
    while (toFill.length) {
      const [cx, cy] = toFill.pop();
      const i = (cy * canvasWidth + cx) * 4;
  
      if (cx < 0 || cx >= canvasWidth || cy < 0 || cy >= canvasHeight) continue;
      if (!matchColor(i, targetColor))  continue;
  
      visited.add(i);
      setColor(i);
  
      toFill.push([cx + 1, cy], [cx - 1, cy], [cx, cy + 1], [cx, cy - 1]);
    }
  
    ctx.putImageData(imgData, 0, 0);
  }
  
  
  const startDrawing = (event) => {
    event.preventDefault();
    
    const coords = getCoordinates(event);
    const context = contextRef.current;
    const tempContext = tempCanvasRef.current.getContext('2d');
    
    setStartPoint(coords);
    setLastPoint(coords);
    
    if (tool === 'pencil' || tool === 'pen') {
      context.globalCompositeOperation = 'source-over';
      context.beginPath();
      context.moveTo(coords.x, coords.y);
      setIsDrawing(true);
    }
    if (tool === 'fill') {
        const coords = getCoordinates(event);
        const context = contextRef.current;
      
        // Convert hex color to RGBA
        const hex = color.replace('#', '');
        const r = parseInt(hex.slice(0, 2), 16);
        const g = parseInt(hex.slice(2, 4), 16);
        const b = parseInt(hex.slice(4, 6), 16);
      
        floodFill(context, Math.floor(coords.x), Math.floor(coords.y), [r, g, b, 255]);
        saveToHistory();
        return;
      }
       else if (tool === 'eraser') {
      context.globalCompositeOperation = 'destination-out';
      context.beginPath();
      context.moveTo(coords.x, coords.y);
      setIsDrawing(true);
    } else if (tool === 'shape' && selectedShape) {
      tempContext.clearRect(0, 0, tempCanvasRef.current.width, tempCanvasRef.current.height);
      tempContext.globalCompositeOperation = 'source-over';
      setIsDrawing(true);
    }
  };
  
  const draw = (event) => {
    if (!isDrawing) return;
    event.preventDefault();
    
    const coords = getCoordinates(event);
    const context = contextRef.current;
    const tempContext = tempCanvasRef.current.getContext('2d');
    
    if (tool === 'pencil') {
      // Pencil tool uses quadratic curves for smoother lines
      context.quadraticCurveTo(
        lastPoint.x, 
        lastPoint.y, 
        (coords.x + lastPoint.x) / 2, 
        (coords.y + lastPoint.y) / 2
      );
      context.stroke();
      setLastPoint(coords);
    } else if (tool === 'pen') {
      // Pen tool uses straight lines
      context.lineTo(coords.x, coords.y);
      context.stroke();
    } else if (tool === 'eraser') {
      context.lineTo(coords.x, coords.y);
      context.stroke();
    } else if (tool === 'shape' && selectedShape) {
      // Clear temp canvas and redraw shape
      tempContext.clearRect(0, 0, tempCanvasRef.current.width, tempCanvasRef.current.height);
      tempContext.beginPath();
      
      if (selectedShape === 'rectangle') {
        tempContext.rect(
          Math.min(startPoint.x, coords.x),
          Math.min(startPoint.y, coords.y),
          Math.abs(coords.x - startPoint.x),
          Math.abs(coords.y - startPoint.y)
        );
      } else if (selectedShape === 'circle') {
        const radius = Math.sqrt(
          Math.pow(coords.x - startPoint.x, 2) + 
          Math.pow(coords.y - startPoint.y, 2)
        );
        tempContext.arc(startPoint.x, startPoint.y, radius, 0, 2 * Math.PI);
      } else if (selectedShape === 'line') {
        tempContext.moveTo(startPoint.x, startPoint.y);
        tempContext.lineTo(coords.x, coords.y);
      }
      
      tempContext.stroke();
    }
  };
  
  const finishDrawing = (event) => {
    if (!isDrawing) return;
    event.preventDefault();
    
    const coords = getCoordinates(event);
    const context = contextRef.current;
    
    if (tool === 'pencil' || tool === 'pen') {
      context.closePath();
    } else if (tool === 'eraser') {
      context.closePath();
      context.globalCompositeOperation = 'source-over';
    } else if (tool === 'shape' && selectedShape) {
      context.globalCompositeOperation = 'source-over';
      context.beginPath();
      
      if (selectedShape === 'rectangle') {
        context.rect(
          Math.min(startPoint.x, coords.x),
          Math.min(startPoint.y, coords.y),
          Math.abs(coords.x - startPoint.x),
          Math.abs(coords.y - startPoint.y)
        );
      } else if (selectedShape === 'circle') {
        const radius = Math.sqrt(
          Math.pow(coords.x - startPoint.x, 2) + 
          Math.pow(coords.y - startPoint.y, 2)
        );
        context.arc(startPoint.x, startPoint.y, radius, 0, 2 * Math.PI);
      } else if (selectedShape === 'line') {
        context.moveTo(startPoint.x, startPoint.y);
        context.lineTo(coords.x, coords.y);
      }
      
      context.stroke();
      context.closePath();
      
      // Clear temp canvas
      const tempContext = tempCanvasRef.current.getContext('2d');
      tempContext.clearRect(0, 0, tempCanvasRef.current.width, tempCanvasRef.current.height);
    }
    
    setIsDrawing(false);
    saveToHistory();
  };
  
  // Render grid if enabled
  useEffect(() => {
    const canvas = canvasRef.current;
    const context = contextRef.current;
    
    if (!canvas || !context) return;
    
    // Get current image data
    const currentImage = canvas.toDataURL();
    
    // Redraw the canvas with or without grid
    const redraw = () => {
      const img = new Image();
      img.onload = () => {
        // Clear the canvas
        context.clearRect(0, 0, canvas.width, canvas.height);
        
        // Draw the saved image
        context.drawImage(img, 0, 0);
        
        // Draw grid if enabled
        if (showGrid) {
          const gridSize = 20;
          context.strokeStyle = 'rgba(200, 200, 200, 0.3)';
          context.lineWidth = 1;
          
          for (let x = 0; x <= canvas.width; x += gridSize) {
            context.beginPath();
            context.moveTo(x, 0);
            context.lineTo(x, canvas.height);
            context.stroke();
          }
          
          for (let y = 0; y <= canvas.height; y += gridSize) {
            context.beginPath();
            context.moveTo(0, y);
            context.lineTo(canvas.width, y);
            context.stroke();
          }
        }
        
        // Restore context settings
        context.strokeStyle = color;
        context.lineWidth = brushSize;
      };
      img.src = currentImage;
    };
    
    redraw();
  }, [showGrid, color, brushSize]);
  
  return (
    <div className="relative w-full h-64 sm:h-96 md:h-128 lg:h-144 touch-none">
      {/* Main Canvas */}
      <canvas
        ref={canvasRef}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={finishDrawing}
        onMouseLeave={finishDrawing}
        onTouchStart={startDrawing}
        onTouchMove={draw}
        onTouchEnd={finishDrawing}
        onTouchCancel={finishDrawing}
        className="absolute top-0 left-0 w-full h-full bg-white rounded-lg shadow-xl cursor-crosshair"
      />
      
      {/* Temporary Canvas for shape previews */}
      <canvas
        ref={tempCanvasRef}
        className="absolute top-0 left-0 w-full h-full rounded-lg pointer-events-none"
      />
    </div>
  );
}