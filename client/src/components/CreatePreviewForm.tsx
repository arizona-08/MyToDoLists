import { useState } from "react";

interface CreatePreviewFormProps{
    createPreview: (previewName: string) => void;
}
function CreatePreviewForm({createPreview} : CreatePreviewFormProps) {
    const [previewName, setPreviewName] = useState<string>("");

    function handleOnChange(e: React.ChangeEvent<HTMLInputElement>){
        setPreviewName(e.target.value);
    }
    function handleCreatePreview(){
        createPreview(previewName);
    }
    return (
    <>
        <div className='w-[300px] rounded-md'>
            <h2>Nouvelle ToDoList</h2>
            <input 
                type="text" 
                placeholder='Nom de la ToDoList'
                onChange={(e) => handleOnChange(e)}
            />
            <button onClick={handleCreatePreview}>Créer</button>
        </div>
        
    </>
    )
}

export default CreatePreviewForm