import axios from "axios";
import "../css/dash.css";
import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import prof from "../assets/user.png"
import jobfeed from "../assets/jobfeed.png"
import { feed, notification, profile, history, settings, arrow, active } from "../icons"
import { NewTaskModal } from "../modals/newTaskModal";
import { LogOutModal } from "../modals/logoutmodal";

const DashboardPage = () => {
    const navigate = useNavigate()
    const today = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

    const [isCreateTaskModalOpen, setIsCreateTaskModalOpen] = useState(false);
    const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);


    const createTaskModal = () => {
        setIsCreateTaskModalOpen(!isCreateTaskModalOpen);
    };
    const logoutModal = () => {
        setIsLogoutModalOpen(!isLogoutModalOpen);
    };


    useEffect(() => {
        const user = localStorage.getItem("jwtToken");

    }, [])
    return (
        <>
            <div className='main'>
                <div className='left'>
                    <div className="profile-container">
                        <img src={prof} alt="" />
                        <h4 className="username">Hello Amanda</h4><br />
                        <span>amandasimons@gmail.com</span>
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
                    <h1 className="mainHeader">Tiabidii Management</h1>
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
                        <div className='list-gig-table-body'>
                            <div className='name'><div className='job-feed-image'><img src={jobfeed} /></div><p>Gabriella <br /> Commercial model</p></div>
                            <div className='gig'><p>Gabriella <br /> Commercial model</p></div>
                            <div className='status'><button>pending</button></div>
                            <div className='stage'> <button className="taskButton">Assign</button> </div>
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
                                <h5>You posted a task</h5>
                            </div>
                            <div className="right-main-data">
                                <p>{today}</p>
                                <button>Expires today</button>
                            </div>
                        </div>
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
                                <h5>You posted a task</h5>
                            </div>
                            <div className="right-main-data">
                                <p>{today}</p>
                                <button>Expires today</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default DashboardPage;