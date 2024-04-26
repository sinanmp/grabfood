import axios from 'axios';


const instance = axios.create({
  baseURL: 'https://ec2-13-232-169-249.ap-south-1.compute.amazonaws.com/api', 
//   timeout: 5000, 
//   headers: {
//     'Content-Type': 'application/json',
    
//   },
});

export default instance;