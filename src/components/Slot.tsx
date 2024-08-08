import { useState } from "react";
import {v4 as uuidv4} from "uuid";
import Task from "./Task";

interface SlotProps{
    slotId: string
    title: string
    onTitleEdit: (slotId: string, newTitle: string) => void;
    onSlotDelete: () => void;
}

interface TaskType{
    id: string;
    content: string;
    originSlotId: string;
}

function Slot({slotId, title, onTitleEdit, onSlotDelete}: SlotProps) {
    const [isEditing, setIsEditing] = useState<boolean>(true); //gère l'état de la modification du tire
    const [newTitle, setNewTitle] = useState<string>(title); //gère le nouveau titre

    //permet d'autoriser la modification du titre
    function handleTitleEdit(){
        setIsEditing(true);
    }

    //sauvegarde la modification du titre
    function handleSave(){
        if(newTitle === ""){ //empêche d'avoir un nom de slot vide
            onTitleEdit(slotId, "Nom du slot");
            setIsEditing(false);
            return
        }
        onTitleEdit(slotId, newTitle);
        setIsEditing(false);
    }

    //permet de modifier le titre
    function handleChange(event: React.ChangeEvent<HTMLInputElement>){
        setNewTitle(event.target.value);
    }

    const [tasks, setTasks] = useState<TaskType[]>([]); //crée un tableu d'obket de type TaskType

    //permet d'ajouter un objet de type TaqkType au tableau défini juste en haut
    function addTask(){
        const newTask = {id: uuidv4(), content: "tache à faire", originSlotId: slotId}; //le slotId est passé dans les props
        setTasks([...tasks, newTask]);
    }

    //permet de supprimer une tâche grâce à son id
    function deleteTask(taskId: string){
        setTasks(tasks.filter((task) => task.id !== taskId));
    }

    //met à jour le tableau de tâche avec la tâche modifié
    function editTask(taskId: string, newContent: string){
        setTasks(tasks.map((task) =>
            task.id === taskId ? { ...task, content: newContent } : task
        ));
    }

    /*Cette section sur la fonctionnalité du drag and drop des tâches */

    function handleOnDrag(e: React.DragEvent, task: TaskType){
        e.dataTransfer.setData("task", JSON.stringify(task));
    }

    function handleOnDrop(e: React.DragEvent){
        const droppedTask: TaskType = JSON.parse(e.dataTransfer.getData("task"));
        
        if(droppedTask.originSlotId !== slotId){
            setTasks([...tasks, {...droppedTask, originSlotId: slotId}]);

            // Dispatch an event to delete the task from the original slot
            const event = new CustomEvent("deleteTask", { detail: { taskId: droppedTask.id, slotId: droppedTask.originSlotId } });
            window.dispatchEvent(event);
        }
        
    }

    function handleDragOver(e: React.DragEvent){
        e.preventDefault();
    }
   
    // Listen for the custom event to delete the task
    window.addEventListener("deleteTask", (e: Event) => {
        const customEvent = e as CustomEvent<{ taskId: string; slotId: string }>; // Type assertion
        if (customEvent.detail.slotId === slotId) {
            deleteTask(customEvent.detail.taskId);
        }
    });
    return (
        <div slot-id={slotId} onDrop={handleOnDrop} onDragOver={handleDragOver} className="w-72 h-fit bg-slate-300 p-3 rounded-md">
            <div className="slot-header flex justify-between items-center">
                <p onClick={handleTitleEdit} className="font-medium text-[20px] mb-2">
                    {
                        isEditing ? //vérifie l'autorisation de modifier
                        (
                            <input 
                            type="text"
                            value={newTitle}
                            onChange={handleChange}
                            onBlur={handleSave}
                            autoFocus
                            className="w-full px-1 border border-gray-300 rounded-md"
                        />
                        ) : (
                            <span>{title}</span> //affiche simplement le titre si pas en cours de modification
                        )
                    }
                </p>
                <div onClick={onSlotDelete} className="cursor-pointer w-6 h-6">
                    <img src="close-icon.svg" alt="supprimer" className="w-full"/>
                </div>
            </div>
            
            <div className="task-container">
            {tasks.map((task) => (
                <Task key={task.id} id={task.id} content={task.content} onDelete={() => deleteTask(task.id)} onEdit={editTask} handleDrag={(e) => handleOnDrag(e, task)} />
            ))}
            </div>
            <div className="button-container flex justify-center">
                <button onClick={() => addTask()} className="bg-green-500 text-white px-3 py-2 rounded-md mt-3 hover:bg-green-600">Ajouter une tâche +</button>
            </div>
        </div>
    )
}

export default Slot