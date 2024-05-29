import { useEffect, useState } from "react";
import "../css/modal.css"
import axios from "axios";
import { URL } from "../config";

export const LogOutModal = ({ show, onClose }) => {
    const [user, setUser] = useState("")

    useEffect(() => {
        const user = localStorage.getItem("jwtToken");
        setUser(user)
    }, [])
    if (!show) {
        return null;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(
                `${URL}/logout`,
                {},
                {
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${user}`
                    }
                }
            );
            if (response.data.success) {
                alert('Successfully logged out')

                window.location.href = "/"
            }
        } catch (error) {
            console.error(error.response.data);
        }
    };



    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>Log out</h2>
                <form >
                    <p className="modalContent">Clocking out for the day?</p>
                    <div style={{ position: "relative" }}>
                        <button className="modalButton" onClick={onClose}>No</button>
                        <button style={{ width: "20%" }} onClick={handleSubmit}>Yes</button>
                    </div>
                </form>
            </div>
        </div>
    );
};