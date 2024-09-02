import { useEffect, useState } from "react";

interface TaskProps{
	id: string;
	content: string;
	isFirstEditingTask: boolean
	onDelete: () => void;
	onEdit: (id: string, newContent: string) => void
	handleDrag: (e: React.DragEvent, task: {id: string, content: string}) => void
	// handleDragEnd: () => void
}

function Task({id, content, isFirstEditingTask, onDelete, onEdit, handleDrag}: TaskProps) {
	const [isEditing, setIsEditing] = useState<boolean>(isFirstEditingTask); //autorise par défaut la modification d'une tâche
	const [newContent, setNewContent] = useState<string>(content);// initialise le contenu d'une tâche
	const [isDraggable, setIsDraggable] = useState<boolean>(true);

	useEffect(() => {
        setNewContent(content);
		if(isEditing){
			setIsDraggable(false);
		}
    }, [content, isEditing]);
	

	function handleEdit(){ //gère l'état de l'autorisation pour modifier une tâche
		setIsEditing(true);
		setIsDraggable(false)
	}

	function handleSave(){
		if(newContent === ""){ //empêche d'avoir une tâche vide
			onEdit(id, "nouvelle tâche");
			setIsEditing(false);
			isFirstEditingTask = false;
			setIsDraggable(true)
			return
		}
		onEdit(id, newContent);
		setIsEditing(false);
		isFirstEditingTask = false;
		setIsDraggable(true);
	}

	function handleChange(event: React.ChangeEvent<HTMLInputElement>){
		setNewContent(event.target.value);
	}

	function drag(e: React.DragEvent){
		handleDrag(e, {id, content});
	}

	return (
		<div task-id={id}
		draggable={isDraggable}
		onDragStart={drag}
		// onDragEnd={handleDragEnd}
		className="w-full bg-white rounded-md h-fit p-2 mb-2 flex justify-between items-start cursor-grab">
			{
				isEditing ? (
					<input 
						type="text"
						value={newContent}
						onChange={handleChange}
						onBlur={handleSave}
						autoFocus
						className="w-full px-1 border border-gray-300 rounded-md"
					/>
				) : (
					<p>{content}</p>
				)
			}
			
			<div className="actions flex gap-1">
				<div onClick={handleEdit} className="modify w-6 h-6 p-1 rounded-md hover:border transition-all">
					<img className="w-full" src="../../pen.png" alt="modifier" />
				</div>
				<div onClick={onDelete} className="delete w-6 h-6 p-1 rounded-md hover:border transition-all">
					<img className="w-full" src="../../trash.png" alt="supprimer" />
				</div>
			</div>
		</div>
	)
}

export default Task