import { useEffect, useState } from "react";
import {v4 as uuidv4} from "uuid";
import Task from "./Task";
import axios from "axios";

interface SlotProps{
    slotId: string
    title: string
    is_firstEditing: boolean
    onTitleEdit: (slotId: string, newTitle: string) => void;
    onSlotDelete: () => void;
}

interface TaskType{
    task_id: string;
    content: string;
    slot_id: string
    originSlotId: string;
    is_first_editing_task: boolean;
    positionIndex: number
}

function Slot({slotId, title, is_firstEditing, onTitleEdit, onSlotDelete}: SlotProps) {
    const [isEditing, setIsEditing] = useState<boolean>(is_firstEditing); //gère l'état de la modification du tire
    const [newTitle, setNewTitle] = useState<string>(title); //gère le nouveau titre
    const [tasks, setTasks] = useState<TaskType[]>([]); //crée un tableu d'obket de type TaskType

    //permet d'autoriser la modification du titre
    function handleTitleEdit(){
        setIsEditing(true);
    }

    //sauvegarde la modification du titre
    async function handleSave(){
        const response = await axios.get("http://localhost:3000/api/get-slot", {
            params: {
                char_id: slotId
            }
        });

        if(response.data.success){
            const oldTitle = response.data.slot.title;
            if(newTitle === ""){ //empêche d'avoir un nom de slot vide
                onTitleEdit(slotId, oldTitle);
                setIsEditing(false);
                return
            } else {
                const changeResponse = await axios.patch("http://localhost:3000/api/update-slot-name", {
                    data: {
                        char_id: slotId,
                        title: newTitle
                    }
                });

                if(changeResponse.data.success){
                    onTitleEdit(slotId, newTitle);
                    setIsEditing(false);
                }
                
            }
        } else {
            console.error("something went horribly wrong!!");
        }
    }

    //permet de modifier le titre
    function handleChange(event: React.ChangeEvent<HTMLInputElement>){
        setNewTitle(event.target.value);
    }

    //permet d'ajouter un objet de type TaqkType au tableau défini juste en haut
    async function addTask(){
        const newPosIndex = tasks.length;
        const newTask = {task_id: uuidv4(), content: "tache à faire", slot_id: slotId, originSlotId: slotId, is_first_editing_task: true, positionIndex: newPosIndex}; //le slotId est passé dans les props

        const response = await axios.post("http://localhost:3000/api/create-task", {
            data:{
                task_id: newTask.task_id,
                content: newTask.content,
                positionIndex: newTask.positionIndex,
                slot_id: newTask.originSlotId
            }
        });

        if(response.data.success){
            setTasks([...tasks, newTask]);
        } else {
            const message = response.request.response;
            console.error("Couldn't add new task", message);
        }
        
    }

    //permet de supprimer une tâche grâce à son id
    async function deleteTask(taskId: string, slot_id: string){
        const response = await axios.delete("http://localhost:3000/api/delete-task", {
            data: {
                task_id: taskId,
                slot_id: slot_id
            }
        });
        if(response.data.success){
            setTasks(tasks.filter((task) => task.task_id !== taskId));
        } else {
            console.error("Couldn't delete task");
        }
        
    }

    async function updateTask(task_id: string, slot_id: string, content: string, positionIndex: number){
        const response = await axios.put("http://localhost:3000/api/update-task", {
            data: {
                task_id: task_id,
                slot_id: slot_id,
                content: content,
                positionIndex: positionIndex
            }
        });

        if(response.data.success){
            return true;
        } else {
            return false
        }
    }

    async function updateTasksPositions(updatedTasks: TaskType[]){
        updatedTasks.forEach(async (task, index) => {
            await updateTask(task.task_id, task.slot_id, task.content, index);
        })
    }

    //met à jour le tableau de tâche avec la tâche modifié
    async function editTask(taskId: string, newContent: string){
        const task = tasks.find((task) => task.task_id === taskId);
        if(task !== undefined){
            const response = await updateTask(task.task_id, task.slot_id, newContent, task.positionIndex );
            if(response){
                setTasks(tasks.map((task) =>
                    task.task_id === taskId ? { ...task, content: newContent, is_first_editing_task: false } : task
                ));
            }
        } else {
            console.error("task not found");
        }
        
    }

    /*Cette section sur la fonctionnalité du drag and drop des tâches */

    //pour bouger une tâche au sein d'un même slot
    function handleOnDragStart(e: React.DragEvent, task: TaskType){
        e.dataTransfer.effectAllowed = "move";
        e.dataTransfer.setData("task", JSON.stringify(task));
    }


    async function handleOnDrop(e: React.DragEvent, position: number){
        e.preventDefault();
        const droppedTask: TaskType = JSON.parse(e.dataTransfer.getData("task"));

        const newPositionIndex = position;

        const updatedTask = {
            ...droppedTask,
            slot_id: slotId,
            positionIndex: newPositionIndex
        }

        const reorderedTasks = tasks.filter((task) => task.task_id !== updatedTask.task_id);
        reorderedTasks.splice(position, 0, updatedTask);
        for (let i = 0; i < reorderedTasks.length; i++) {
            reorderedTasks[i].positionIndex = i;
        }

        setTasks(reorderedTasks);
        await updateTasksPositions(reorderedTasks);

        if(droppedTask.originSlotId !== slotId){

            const event = new CustomEvent("deleteTask", { detail: { taskId: droppedTask.task_id, slotId: droppedTask.originSlotId } });
            window.dispatchEvent(event);
            updatedTask.originSlotId = slotId; // met à jour l'originSlotId
        }
        
    }
   
    // Listen for the custom event to delete the task
    window.addEventListener("deleteTask", async (e: Event) => {
        
        const customEvent = e as CustomEvent<{ taskId: string; slotId: string }>; // Type assertion
        if (customEvent.detail.slotId === slotId) {
            setTasks((prevTasks) => prevTasks.filter((task) => task.task_id !== customEvent.detail.taskId));
        }
    });

    useEffect(() => {
        //fetch all tasks
        async function getTasks(){
			try{
				const response = await axios.get("http://localhost:3000/api/get-tasks", {
					params: {
						slot_id: slotId
					}
				});

				if(response.data.success){
					const fetchedTasks = response.data.tasks;
					setTasks((prevTasks) => {
						const updatedTasks = [...prevTasks];
						fetchedTasks.forEach((task: TaskType) => {
							// Ensure no duplicates are added
							if (!updatedTasks.some((t) => t.task_id === task.task_id)) {
								updatedTasks.push({...task, is_first_editing_task: false, originSlotId: slotId});
							}
						});
						return updatedTasks;
					})
				}
			} catch (err){
				console.error("Something wrong happened when fetching tasks", err);
			}
		}

        getTasks();
    }, [slotId]);

    return (
        <div
        slot-id={slotId}
        // onDrop={(e) => handleDropOnSlot(e)}
        onDragOver={(e) => e.preventDefault()}
        className="shrink-0 w-72 h-fit bg-gray-200 p-3 rounded-md shadow-md">
            <div className="slot-header flex justify-between items-center">
                <p onClick={handleTitleEdit} className="font-medium text-[20px] mb-2">
                    {
                        isEditing ? //vérifie l'autorisation de modifier
                        (
                            <input 
                            type="text"
                            value={newTitle}
                            onChange={handleChange}
                            onBlur={async () => await handleSave()}
                            autoFocus
                            className="w-full px-1 border border-gray-300 rounded-md"
                        />
                        ) : (
                            <span className="text-gray-800">{title}</span> //affiche simplement le titre si pas en cours de modification
                        )
                    }
                </p>
                <div onClick={onSlotDelete} className="cursor-pointer w-6 h-6">
                    <img src="../../close-icon.svg" alt="supprimer" className="w-full"/>
                </div>
            </div>
            
            <div className="tasks-container">
                {
                    (tasks.length === 0 &&
                        <div
                            
                            // onDragOver={(e) => handleDragOver(e, index)}
                            onDrop={(e) => handleOnDrop(e, 0)}
                            className="w-full h-5"
                        
                        ></div>
                    ) ||

                    tasks.map((task, index) => (
                        <div
                            key={index}
                            // onDragOver={(e) => handleDragOver(e, index)}
                            onDrop={(e) => handleOnDrop(e, index)}
                            
                        >
                            <Task 
                                key={index} 
                                id={task.task_id} 
                                content={task.content}
                                isFirstEditingTask={task.is_first_editing_task}
                                onDelete={async () => await deleteTask(task.task_id, task.slot_id)} 
                                onEdit={editTask} 
                                handleDrag={(e) => handleOnDragStart(e, task)}
                                // handleDragEnd={() => setDraggedTask(null)}
                            />
                        </div>
                    ))
                }
            </div>
            <div className="button-container flex justify-center">
                <button onClick={async () => await addTask()} className=" text-gray-600 font-medium px-3 py-2 rounded-md mt-3 hover:bg-gray-300 transition-all">+ Ajouter une tâche</button>
            </div>
        </div>
    )
}

export default Slot