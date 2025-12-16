import axios from 'axios';

class ParticipantService {
  constructor() {
    this.apiUrl = 'http://localhost:5000/participants';
  }
    getParticipantById(participantId){
        return axios.get(`${this.apiUrl}/${participantId}`);
    }
    getparticipantByemail(email){
        return axios.get(`${this.apiUrl}?email=${email}`);
    }
    postParticipant(participantData){
        return axios.post(this.apiUrl, participantData);
    }
}

const participantService = new ParticipantService();
export default participantService;