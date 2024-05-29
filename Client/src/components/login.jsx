import axios from "axios";
import React, { useContext, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { URL } from "../config";
const LoginPage = () => {
    const [emailAddress, setEmailAddress] = useState("")
    const [passWord, setPassword] = useState("")
    const navigate = useNavigate()


    const formData = new FormData();
    formData.append("email", emailAddress)
    formData.append("password", passWord)

    const handleSubmit = async (e) => {
        e.preventDefault();
        await axios({
            method: 'POST',
            url: `${URL}/login`,
            headers: {
                "Content-Type": "application/json"
            },
            data: formData
        })
            .then(res => {
                if (res.data.success) {
                    localStorage.setItem('jwtToken', res.data?.token);
                    navigate("/dashboard")
                }
            })

            .catch((err) => {
                return err;
            })
    }
    return (
        <div className="formInput">
            <h3 style={{ textAlign: "center", fontSize: "20px" }}>Tiabidii Management</h3>

            <h3 style={{ textAlign: "center", fontSize: "17px" }}>Login</h3>
            <form onSubmit={handleSubmit}>
                <label>Email Adress:</label>
                <input type="text" placeholder="email" name="email" onChange={(e) => {
                    setEmailAddress(e.target.value)
                }}></input>
                <label>Password:</label>
                <input type="password" placeholder="****" name='password' onChange={(e) => {
                    setPassword(e.target.value)
                }}></input>
                <button>Submit</button>
            </form>
            <div className="registerBit">
                <p>Don't have an account?</p>
                <a href="/register">Register</a>
            </div>
        </div>
    )
}
export default LoginPage;