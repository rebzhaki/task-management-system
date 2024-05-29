import { useEffect, useState } from "react";
import "../css/modal.css"
import axios from "axios";
import { URL } from "../config";

export const AssignModal = ({ show, onClose, taskID }) => {
    const [complainant, setComplainant] = useState("")
    const [user, setUser] = useState("")
    const [userData, setUsersData] = useState([])
    const [task, setTask] = useState([])
    const [isLoading, setIsLoading] = useState(false);



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
                    `${URL}/getTaskById/${taskID}`,
                    { headers }
                );

                if (taskResponse.data.success) {
                    setTask(taskResponse.data.data);
                }

                const usersResponse = await axios.get(
                    `${URL}/getAllUsers`,
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
        setIsLoading(true);
        e.preventDefault();
        try {
            const response = await axios.patch(
                `${URL}/updateTaskComplainant/${taskID}`,
                formData,
                {
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${user}`
                    }
                }
            );
            if (response.data.success) {
                alert('Successfully assigned task! You will be redirected to your email account to access your tracking number');
                window.open(response.data.data.preview, '_blank');
                window.location.reload()

            }
        } catch (error) {
            console.error(error.response.data);
        } finally {
            setIsLoading(false); // Hide loader
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>Assign Task</h2>
                <form >
                    {task.map((data) => {
                        return (
                            <><label className="assignLabel">Task Name:</label><br /><br />
                                <span className="assignSpan">{data.task_name}</span><br /><br />
                                <label className="assignLabel">Task Description:</label><br /><br />
                                <span className="assignSpan">{data.task_description.length > 50 ? `${data.task_description.substring(0, 150)}...` : data.task_description}
                                </span></>

                        )
                    })}

                    <div>
                        <br /> <label className="assignLabel" >Assign task:</label>
                        <select
                            name="complainant_id"
                            value={complainant}
                            onChange={(e) => setComplainant(e.target.value)}
                        >
                            <option value="">Choose complainant ...</option>
                            {userData.map((data) => (
                                <option key={data.id} value={data.id}>
                                    {data.fullName}
                                </option>
                            ))}
                        </select>

                    </div>
                    <div style={{ position: "relative" }}>
                        <button
                            style={{ width: "20%", position: "relative" }}
                            onClick={handleSubmit}
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <span>
                                    Loading...
                                </span>
                            ) : <span >
                                Submit
                            </span>}

                        </button>
                        <button className="modalButton" onClick={onClose}>close</button>
                    </div>
                </form>
            </div>
        </div>
    );
};