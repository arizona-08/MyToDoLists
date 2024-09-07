import { useState } from "react";

//permet de passer la fonction de création de preview depuis l'élément parent
interface CreatePreviewFormProps{
    createPreview: (previewName: string) => void;
    onClose: () => void;
}

function CreatePreviewForm({createPreview, onClose} : CreatePreviewFormProps) {
    const [previewName, setPreviewName] = useState<string>("");

    //permet la modification du nom de la preview
    function handleOnChange(e: React.ChangeEvent<HTMLInputElement>){
        const value = e.target.value;
        setPreviewName(value);
    }

    
    //appelle la fonction de création de preview dans l'élément parent
    function handleCreatePreview(){
        createPreview(previewName);
    }
    return (
    <>
        <div className="form-container absolute z-10 top-1/2 left-1/2 translate-x-[-50%] translate-y-[-50%] bg-[#00000071] w-screen h-screen">
            <div className='w-fit rounded-md border p-2 bg-white flex items-start absolute top-1/2 left-1/2 translate-x-[-50%] translate-y-[-50%] z-10'>
                <div>
                    <div id="input-container" className="mr-5">
                        <div className="top flex justify-between mb-3">
                            <h2>Nouvelle ToDoList</h2>
                            <p>{previewName.length}/20</p>
                        </div>
                    
                        <input 
                            type="text" 
                            placeholder='Nom de la ToDoList'
                            autoFocus
                            onInput={handleOnChange}
                            maxLength={20}
                            className="p-1 border rounded-md mr-5 w-full"
                        />
                        {/* utilisation de la fonction d'appel */}
                        
                    </div>
                    <button 
                            onClick={handleCreatePreview} 
                            disabled={previewName === ""}
                            className={previewName === "" ? "text-gray-400 float-right mr-5" : "text-black float-right mr-5"}
                    >Créer</button>
                </div>

                <div onClick={onClose} className="icon-container w-6 h-6">
                    <img src="../close-icon.svg" alt="" />
                </div>
                
            </div>
        </div>
        
    </>
    )
}

export default CreatePreviewForm