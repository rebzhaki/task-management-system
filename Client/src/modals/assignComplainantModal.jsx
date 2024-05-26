import { useEffect, useState } from "react";
import "../css/modal.css"
import axios from "axios";
import { useNavigate } from "react-router-dom";

export const AssignModal = ({ show, onClose, taskID }) => {
    const [complainant, setComplainant] = useState("")
    const [user, setUser] = useState("")
    const [userData, setUsersData] = useState([])
    const [task, setTask] = useState([])

    const navigate = useNavigate()

    useEffect(() => {
        const fetchData = async () => {
            const user = localStorage.getItem("jwtToken");
            if (!user) {
                console.error("No token found");
                return;
            }

            setUser(user)
            const headers = {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${user}`
            };

            try {
                const taskResponse = await axios.get(
                    `http://localhost:8000/v1/api/getTaskById/${taskID}`,
                    { headers }
                );

                if (taskResponse.data.success) {
                    setTask(taskResponse.data.data);
                }

                const usersResponse = await axios.get(
                    `http://localhost:8000/v1/api/getAllUsers`,
                    { headers }
                );

                if (usersResponse.data.success) {
                    setUsersData(usersResponse.data.data);
                }
            } catch (error) {
                console.error("Error fetching data", error);
            }
        };

        if (taskID) {
            fetchData();
        }
    }, [taskID]);

    if (!show) {
        return null;
    }

    const formData = new FormData();
    formData.append("complainant_id", complainant)

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.patch(
                `http://localhost:8000/v1/api/updateTaskComplainant/${complainant}`,
                formData,
                {
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${user}`
                    }
                }
            );
            if (response.data.success) {
                console.log("damn==>", response.data.data);
                alert('Successfully assigned task');
                window.open(response.data.data.preview, '_blank');
                window.location.reload()

            }
        } catch (error) {
            console.error(error.response.data);
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>Add New Task</h2>
                <form >
                    {task.map((data) => {
                        return (
                            <><label>Task Name:</label><br />
                                <span>{data.task_name}</span><br />
                                <label>Task Description:</label><br />
                                <span>{data.task_description}</span></>

                        )
                    })}

                    <div>
                        <label>Assign task:</label>
                        <select
                            name="complainant_id"
                            value={complainant}
                            onChange={(e) => setComplainant(e.target.value)}
                        >
                            <option value="">Choose ...</option>
                            {userData.map((data) => (
                                <option key={data.id} value={data.id}>
                                    {data.fullName}
                                </option>
                            ))}
                        </select>

                    </div>
                    <div style={{ position: "relative" }}>
                        <button style={{ width: "20%" }} onClick={handleSubmit}>Submit</button>
                        <button className="modalButton" onClick={onClose}>close</button>
                    </div>
                </form>
            </div>
        </div>
    );
};