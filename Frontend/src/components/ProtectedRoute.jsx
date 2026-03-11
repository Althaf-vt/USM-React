import React from 'react'
import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom';


const ProtectedRoute = ({children, adminOnly = false}) => {
    const {user,admin} = useSelector((state) => state.auth);

    if(adminOnly){
        if(!admin){
            return <Navigate to="/admin/login" replace/>
        }
        return children
    }

    if(!user){
        return <Navigate to="/login" replace/>
    }

    return children
}

export default ProtectedRoute;