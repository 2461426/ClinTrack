import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import utilityService from "../services/UtilityService"

const Logout = () => {
    const navigate = useNavigate();
   
    useEffect(() => {
        // Clear all user information
        utilityService.clearInformation();
        localStorage.removeItem("auth_token");
        localStorage.removeItem("logged_in_user");
        
        // Redirect to login page
        navigate("/login", { replace: true });
    }, [navigate]);
    
    return null;
}

export default Logout;
