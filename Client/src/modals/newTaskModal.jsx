import { useEffect, useState } from "react";
import "../css/modal.css"
import axios from "axios";

export const NewTaskModal = ({ show, onClose }) => {
    const [taskName, setTaskName] = useState("")
    const [taskDescription, setTaskDescription] = useState("")
    const [dueDate, setDueDate] = useState("")
    const [taskPriority, setTaskPriority] = useState("Pending")
    const [user, setUser] = useState("")

    useEffect(() => {
        const user = localStorage.getItem("jwtToken");
        setUser(user)
    }, [])
    if (!show) {
        return null;
    }

    const formData = new FormData();
    formData.append("task_name", taskName)
    formData.append("task_description", taskDescription)
    formData.append("due_date", dueDate)
    formData.append("task_priority", taskPriority)

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post(
                'http://localhost:8000/v1/api/createNewTask',
                formData,
                {
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${user}`
                    }
                }
            );

            if (response.data.success) {
                alert('Successfully created task');
                window.location.reload()
            }
        } catch (error) {
            console.error(error.response.data);
        }
    };



    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h4>Add New Task</h4>
                <form >
                    <label>Task Name:</label>
                    <input type="text" placeholder="name" name="task_name" onChange={(e) => {
                        setTaskName(e.target.value)
                    }}></input>
                    <div className="inputDisplay">

                        <div>
                            <label>Task Priority:</label>
                            <select name="task_priority" value={taskPriority} onChange={(e) => {
                                setTaskPriority(e.target.value)
                            }} >
                                <option value="">Choose ...</option>
                                <option value="Pending">Pending</option>
                                <option value="In Progress">In Progress</option>
                                <option value="In Review">In Review</option>
                                <option value="Completed">Completed</option>

                            </select>
                        </div>
                        <div>
                            <label>Due Date:</label>
                            <input type="date" placeholder="name" name="due_date" value={dueDate} onChange={(e) => {
                                setDueDate(e.target.value)
                            }}></input>
                        </div>
                    </div>
                    <label>Task Description:</label>
                    <textarea rows={3} type="text" name='task_description' onChange={(e) => {
                        setTaskDescription(e.target.value)
                    }}></textarea>
                    <div style={{ position: "relative" }}>
                        <button onClick={handleSubmit}>Submit</button>
                        <button className="modalButton" onClick={onClose}>Close</button>
                    </div>
                </form>
            </div>
        </div>
    );
};