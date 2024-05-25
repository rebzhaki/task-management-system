import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';

const DashboardPage = () => {

    useEffect(() => {
        const user = localStorage.getItem("jwtToken");

    }, [])
    return (
        <h1>welcome</h1>

    )
}

export default DashboardPage;