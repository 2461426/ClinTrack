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
        localStorage.removeItem('auth_token');
        localStorage.removeItem('logged_in_user');
    }

    /**
     * Calculate trail progress based on first phase start date and last phase end date
     * @param {Object} phaseDates - Object with phase numbers as keys and dates as values
     * @returns {number} - Progress percentage (0-100)
     */
    calculateTrailProgress(phaseDates) {
        if (!phaseDates || typeof phaseDates !== 'object') {
            return 0;
        }

        const phases = Object.keys(phaseDates).sort((a, b) => parseInt(a) - parseInt(b));
        
        if (phases.length === 0) {
            return 0;
        }

        const firstPhaseDate = phaseDates[phases[0]];
        const lastPhaseDate = phaseDates[phases[phases.length - 1]];

        if (!firstPhaseDate || !lastPhaseDate) {
            return 0;
        }

        const startDate = new Date(firstPhaseDate);
        const endDate = new Date(lastPhaseDate);
        const currentDate = new Date();

        // If trail hasn't started yet
        if (currentDate < startDate) {
            return 0;
        }

        // If trail has completed
        if (currentDate >= endDate) {
            return 100;
        }

        // Calculate progress as percentage of time elapsed
        const totalDuration = endDate.getTime() - startDate.getTime();
        const elapsedDuration = currentDate.getTime() - startDate.getTime();
        const progress = (elapsedDuration / totalDuration) * 100;

        return Math.round(Math.max(0, Math.min(100, progress)));
    }

}

const utilityService=  new UtilityService();
export default utilityService;




