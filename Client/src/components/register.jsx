import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Register = () => {
    const [fullName, setFullName] = useState("")
    const [phoneNumber, setPhoneNumber] = useState("")
    const [emailAddress, setEmailAddress] = useState("")
    const [passWord, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")

    const navigate = useNavigate()

    const formData = new FormData();
    formData.append("fullName", fullName)
    formData.append("phoneNumber", phoneNumber)
    formData.append("email", emailAddress)
    formData.append("password", passWord)
    formData.append("confrimPassword", confirmPassword)

    const formSubmit = async (e) => {
        e.preventDefault();
        await axios({
            method: 'post',
            url: 'http://localhost:8000/v1/api/register',
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            data: formData
        })
            .then((res) => {
                navigate('/dashboard')

            })
            .catch((err) => {
                return err.response.data;
            })
    }
    return (
        <div className="App">
            <div className="formInput">
                <h3 style={{ textAlign: "center", fontSize: "20px" }}>Tiabidii Management</h3>
                <h6 style={{ textAlign: "center", fontSize: "17px" }}>Register</h6>
                <form onSubmit={formSubmit}>
                    <label>Full Name:</label>
                    <input type="text" placeholder="full name" name='fullName' onChange={(e) => {
                        setFullName(e.target.value)
                    }}></input>
                    <label>Phone Number:</label>
                    <input type="text" placeholder="phone Number" name='phoneNumber' onChange={(e) => {
                        setPhoneNumber(e.target.value)
                    }}></input>
                    <label>Email:</label>
                    <input type="email" placeholder="email" name='email' onChange={(e) => {
                        setEmailAddress(e.target.value)
                    }}></input>
                    <label>Password:</label>
                    <input type="password" placeholder='*****' name='password' onChange={(e) => {
                        setPassword(e.target.value)
                    }}></input>
                    <label>Confirm Password:</label>
                    <input type="password" placeholder='*****' name='confirmPassword' onChange={(e) => {
                        setConfirmPassword(e.target.value)
                    }}></input>
                    <button>Submit</button>
                </form>
                <div className="registerBit">
                    <p>You have an account?</p>
                    <a href="/login">Login</a>
                </div>
            </div>
        </div>
    )
}
export default Register;