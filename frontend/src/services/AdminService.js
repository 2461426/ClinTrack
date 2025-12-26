import axios from 'axios';

class AdminService {
  constructor() {
    this.apiUrl = 'http://localhost:5000/admin';
  }

  async findByEmailAndPassword(email, password) {
    const normalizedEmail = (email || '').trim().toLowerCase();

    const { data } = await axios.get(
           `${this.apiUrl}?email=${encodeURIComponent(normalizedEmail)}`
    );

    if (!Array.isArray(data) || data.length === 0) return null;

    const user = data[0];

    if ((user.password || '') === password) {
      return user;
    }
    return null;
  }
}

const adminService = new AdminService();
export default adminService;