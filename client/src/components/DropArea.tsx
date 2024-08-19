import { useState } from "react"

interface DropAreaProps{
    onDrop: (e: React.DragEvent, index: number) => Promise<void>;
    position: number;
}

function DropArea({ onDrop, position }: DropAreaProps) {
    const [showDrop, setShowDrop] = useState<boolean>(false);
  return (

    <div 
        onDragEnter={() => setShowDrop(true)} 
        onDragLeave={() => setShowDrop(false)}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
            onDrop(e, position)
            setShowDrop(false);
        }}
        className={showDrop ? "w-full bg-gray-400 rounded-md min-h-3 p-2 mb-2 relative z-10 opacity-100" : "opacity-0 min-h-1"}
    >
        
    </div>
    
  )
}

export default DropArea