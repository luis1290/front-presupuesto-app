import { Outlet, Navigate } from "react-router-dom";

const ProtectedRoutes = () => {

    const token = localStorage.getItem("token")

    if(token) {
        return <Outlet />
    } else {
       return  <Navigate to="/loguin" />
    }
}
 
export default ProtectedRoutes;