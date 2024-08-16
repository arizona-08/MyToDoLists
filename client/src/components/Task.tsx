import { useState } from "react";

interface TaskProps{
	id: string;
	content: string;
	isFirstEditingTask: boolean
	onDelete: () => void;
	onEdit: (id: string, newContent: string) => void
	handleDrag: (e: React.DragEvent, task: {id: string, content: string}) => void
}

function Task({id, content, isFirstEditingTask, onDelete, onEdit, handleDrag}: TaskProps) {
	const [isEditing, setIsEditing] = useState<boolean>(isFirstEditingTask); //autorise par défaut la modification d'une tâche
	const [newContent, setNewContent] = useState<string>(content);// initialise le contenu d'une tâche
	const [isDraggable, setIsDraggable] = useState<boolean>(true);

	function handleEdit(){ //gère l'état de l'autorisation pour modifier une tâche
		setIsEditing(true);
		setIsDraggable(false)
	}

	function handleSave(){
		if(newContent === ""){ //empêche d'avoir une tâche vide
			onEdit(id, "nouvelle tâche");
			setIsEditing(false);
			setIsDraggable(true)
			return
		}
		onEdit(id, newContent);
		setIsEditing(false);
		setIsDraggable(true);
	}

	function handleChange(event: React.ChangeEvent<HTMLInputElement>){
		setNewContent(event.target.value);
	}

	function drag(e: React.DragEvent){
		handleDrag(e, {id, content});
	}

	return (
		<div task-id={id} draggable={isDraggable} onDragStart={drag} className="w-full bg-white rounded-md h-fit p-2 mb-2 flex justify-between items-start">
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
				<div onClick={handleEdit} className="modify bg-blue-500 hover:bg-blue-600 w-6 h-6 p-1 rounded-md">
					<img className="w-full" src="../../pen.png" alt="modifier" />
				</div>
				<div onClick={onDelete} className="delete bg-red-500 hover:bg-red-600 w-6 h-6 p-1 rounded-md">
					<img className="w-full" src="../../trash.png" alt="supprimer" />
				</div>
			</div>
		</div>
	)
}

export default Task