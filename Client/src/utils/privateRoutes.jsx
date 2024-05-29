import { useContext } from 'react'
import { Outlet, Navigate } from 'react-router-dom'
import AuthContext from './authContext'

const PrivateRoutes = () => {
    let { auth, loading } = useContext(AuthContext)

    if (loading) {
        return <div>loading ...</div>
    }
    return (
        auth === true ? <Outlet /> : <Navigate to="/" />
    )
}

export default PrivateRoutes
