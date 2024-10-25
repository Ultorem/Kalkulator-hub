import { useEffect, useRef, useState } from 'react';
import { Pencil, Eraser, RotateCcw, Download, Square } from 'lucide-react';

interface Tool {
  id: 'pencil' | 'eraser';
  icon: React.ReactNode;
  label: string;
  size: number;
}

const TOOLS: Tool[] = [
  { id: 'pencil', icon: <Pencil className="w-5 h-5" />, label: 'Blyant', size: 2 },
  { id: 'eraser', icon: <Eraser className="w-5 h-5" />, label: 'Viskelær', size: 20 }
];

const COLORS = [
  '#000000', // Black
  '#ffffff', // White
  '#ff0000', // Red
  '#00ff00', // Green
  '#0000ff', // Blue
  '#ffff00', // Yellow
  '#ff00ff', // Magenta
  '#00ffff', // Cyan
];

export function DrawingPad() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [selectedTool, setSelectedTool] = useState<Tool>(TOOLS[0]);
  const [selectedColor, setSelectedColor] = useState(COLORS[0]);
  const [prevPos, setPrevPos] = useState<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set initial canvas color
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }, []);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    const pos = getMousePos(e);
    setPrevPos(pos);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    setPrevPos(null);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !prevPos) return;

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    const currentPos = getMousePos(e);

    ctx.beginPath();
    ctx.moveTo(prevPos.x, prevPos.y);
    ctx.lineTo(currentPos.x, currentPos.y);
    ctx.strokeStyle = selectedTool.id === 'eraser' ? '#ffffff' : selectedColor;
    ctx.lineWidth = selectedTool.size;
    ctx.lineCap = 'round';
    ctx.stroke();

    setPrevPos(currentPos);
  };

  const getMousePos = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };

    const rect = canvas.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  };

  const downloadCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const link = document.createElement('a');
    link.download = 'tegning.png';
    link.href = canvas.toDataURL();
    link.click();
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-4 flex-wrap">
        <div className="flex gap-2">
          {TOOLS.map(tool => (
            <button
              key={tool.id}
              onClick={() => setSelectedTool(tool)}
              className={`p-2 rounded-lg transition-all ${
                selectedTool.id === tool.id
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200'
              }`}
              title={tool.label}
            >
              {tool.icon}
            </button>
          ))}
        </div>

        <div className="flex gap-2">
          {COLORS.map(color => (
            <button
              key={color}
              onClick={() => setSelectedColor(color)}
              className={`w-8 h-8 rounded-lg transition-all ${
                selectedColor === color ? 'ring-2 ring-blue-500' : ''
              }`}
              style={{
                backgroundColor: color,
                border: color === '#ffffff' ? '1px solid #e5e7eb' : 'none'
              }}
            />
          ))}
        </div>

        <div className="flex gap-2 ml-auto">
          <button
            onClick={clearCanvas}
            className="p-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 rounded-lg transition-all"
            title="Tøm tegneflate"
          >
            <RotateCcw className="w-5 h-5" />
          </button>
          <button
            onClick={downloadCanvas}
            className="p-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 rounded-lg transition-all"
            title="Last ned tegning"
          >
            <Download className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="relative bg-white rounded-lg overflow-hidden">
        <canvas
          ref={canvasRef}
          width={800}
          height={600}
          onMouseDown={startDrawing}
          onMouseUp={stopDrawing}
          onMouseOut={stopDrawing}
          onMouseMove={draw}
          className="w-full h-full cursor-crosshair border border-gray-200 dark:border-gray-700"
        />
      </div>
    </div>
  );
}