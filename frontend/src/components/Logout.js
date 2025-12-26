import { useNavigate } from "react-router-dom";
import utilityService from "../services/UtilityService"

const Logout=()=>{
    const navigate = useNavigate();
   console.log('dfdfsdfsdf');
    utilityService.clearInformation();
    localStorage.removeItem("auth_token");
    localStorage.removeItem("logged_in_user");
    window.location.href="/login";  
    
    return <>
      {/* navigate("/login"); */}
    </>

}

export default Logout;
