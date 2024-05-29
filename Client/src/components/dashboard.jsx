import axios from "axios";
import "../css/dash.css";
import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import prof from "../assets/user.png"
import jobfeed from "../assets/jobfeed.png"
import { feed, notification, profile, history, settings, arrow, active } from "../icons"
import { NewTaskModal } from "../modals/newTaskModal";
import { LogOutModal } from "../modals/logoutmodal";
import { AssignModal } from "../modals/assignComplainantModal";

const DashboardPage = () => {
    const navigate = useNavigate()
    const today = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

    const [isCreateTaskModalOpen, setIsCreateTaskModalOpen] = useState(false);
    const [isAssignTaskModalOpen, setIsAssignTaskModalOpen] = useState(false);
    const [currentTaskId, setCurrentTaskId] = useState(null);
    const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
    const [userName, setUserName] = useState("")
    const [userEmail, setUserEmail] = useState("")
    const [tasks, setTasks] = useState([])



    const createTaskModal = () => {
        setIsCreateTaskModalOpen(!isCreateTaskModalOpen);
    };


    const assignTaskModal = (taskID) => {
        setCurrentTaskId(taskID);
        setIsAssignTaskModalOpen(!isAssignTaskModalOpen);
    };
    const logoutModal = () => {
        setIsLogoutModalOpen(!isLogoutModalOpen);
    };

    const fetchData = async () => {
        const user = localStorage.getItem("jwtToken");
        if (!user) {
            console.error("No token found");
            return;
        }

        const headers = {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${user}`
        };

        try {
            const getUser = async () => {
                try {
                    const response = await axios.get('http://localhost:8000/v1/api/user', { headers });
                    setUserName(response.data.data.fullName);
                    setUserEmail(response.data.data.userEmail);
                    return response.data.data;
                } catch (error) {
                    console.error('Error fetching user data:', error);
                    throw error;
                }
            };

            const getAllTasks = async () => {
                try {
                    const response = await axios.get('http://localhost:8000/v1/api/getAllTasks', { headers });
                    setTasks(response.data.data);
                    return response.data.data;
                } catch (error) {
                    console.error('Error fetching tasks:', error);
                    throw error;
                }
            };

            await getUser();
            await getAllTasks();
        } catch (error) {
            console.error('Error in fetchData:', error);
        }
    };
    useEffect(() => {
        fetchData();
    }, []);

    return (
        <>
            <div className='main'>
                <div className='left'>
                    <div className="profile-container">
                        <img src={prof} alt="" />
                        <h4 className="username">{userName}</h4><br />
                        <span>{userEmail}</span>
                    </div>
                    <div className='profile-links-container'>
                        <div className='profile-container-section' onClick={() => navigate("/dashboard")}>
                            {feed} Tasks {arrow}
                        </div>
                        <div className='profile-container-section'>{profile} Profile {arrow}</div>
                        <div className='profile-container-section'>{settings} Settings {arrow}</div>
                        <div className='profile-container-section'>{notification} Notifications {arrow}</div>
                        <div className='profile-container-section' style={{ color: "red" }} onClick={logoutModal} >{history} Logout {arrow}</div>
                        <LogOutModal show={isLogoutModalOpen} onClose={logoutModal} />

                    </div>
                </div>
                <div className='mid'>
                    <h1 className="mainHeader">Tiabidii Management System</h1>
                    <div className="list">
                        <div className='list-gig-header'>
                            <p>Listed Tasks<br /> <span style={{ fontSize: "small", color: "gray" }}>Tasks posted so far</span></p>
                            <button onClick={createTaskModal}>Add New Task</button>
                            <NewTaskModal show={isCreateTaskModalOpen} onClose={createTaskModal} />
                        </div>
                        <div className='list-gig-table-header'>
                            <div className='name'>NAME</div>
                            <div className='gig'>NUMBER</div>
                            <div className='status'>STATUS</div>
                        </div>
                        <div className='' style={{ textAlign: "left" }}>
                            {tasks.map((data) => {
                                return (
                                    <div key={data.id} className="task">
                                        < div className='name' > <p>{data.task_name}</p></div>
                                        <div className='gig'><p>{data.tracking_number}</p></div>
                                        <div className='status'><button className="taskPriority">{data.task_priority}</button></div>
                                        <div className='stage'> <button className="taskButton" onClick={() => assignTaskModal(data.id)} >Assign</button> </div>
                                    </div>
                                )
                            })}
                            <AssignModal show={isAssignTaskModalOpen} onClose={assignTaskModal} taskID={currentTaskId} />
                        </div>

                    </div>
                </div>
                <div className='right'>
                    <div className="right-main">
                        <h5>Notifications</h5>
                        <div className='right-main-item'>
                            <div className="right-main-title">
                                <h5>You posted a task</h5>
                            </div>
                            <div className="right-main-data">
                                <p>{today}</p>
                                <button>Expires today</button>
                            </div>
                        </div>
                        <div className='right-main-item'>
                            <div className="right-main-title">
                                <h5>You are assigned a task</h5>
                            </div>
                            <div className="right-main-data">
                                <p>{today}</p>
                                <button>Expires today</button>
                            </div>
                        </div>
                        <div className='right-main-item'>
                            <div className="right-main-title">
                                <h5>Your task is Completed</h5>
                            </div>
                            <div className="right-main-data">
                                <p>{today}</p>
                                <button>Expires today</button>
                            </div>
                        </div>
                        <div className='right-main-item'>
                            <div className="right-main-title">
                                <h5>Your task is being reviews</h5>
                            </div>
                            <div className="right-main-data">
                                <p>{today}</p>
                                <button>Expires today</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div >
        </>
    )
}

export default DashboardPage;