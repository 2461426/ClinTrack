class UtilityService {

    isAdmin() {
        const role = localStorage.getItem('role');
        return role === 'ADMIN';
    }
    isUser() {
        const role = localStorage.getItem('role');
        return role === 'USER';
    }  
    isLoggedIn() {
        const userid = localStorage.getItem('userid');
        return !!userid;
    }   
    
    storeInforation(userid,email,role){
        localStorage.setItem('userid', userid); 
        localStorage.setItem('email', email); 
        localStorage.setItem('role', role); 
    }

    clearInformation(){
        localStorage.removeItem('userid'); 
        localStorage.removeItem('email'); 
        localStorage.removeItem('role'); 
    }   

}

const utilityService=  new UtilityService();
export default utilityService;




