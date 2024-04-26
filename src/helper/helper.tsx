import axios from "axios";


// axios.defaults.baseURL= 'http://localhost:5000';
//  process.env.REACT_APP_SERVER_DOMAIN;

/* Make API Requests */

/* authenticate function */
export async function authenticate(username) {

    try {
        return await axios.post('https://ec2-13-232-169-249.ap-south-1.compute.amazonaws.com/api/authenticate', {username})
    } catch (error) {
        return {error:"Username doesn't exist...!"}
    }
    
}

/* get User details */
export async function getUser({username}) {
    try {
      const {data} = await axios.get(`https://ec2-13-232-169-249.ap-south-1.compute.amazonaws.com/api/user/${username}`);
      return {data};
    } catch (error) {
        return {error: "Password doesn't Match...!"}
    }
}

/* register user function */
export async function registerUser( credentials) {
    try {
      const { data : {msg} , status } =  await axios.post(`https://ec2-13-232-169-249.ap-south-1.compute.amazonaws.com/api/register`, credentials );
      const {username, email} = credentials;

      /* send email */
        if(status===200){
            console.log('ok');
            
            await axios.post('https://ec2-13-232-169-249.ap-south-1.compute.amazonaws.com/api/registerMail',{ username , userEmail: email ,text : msg })
        }

        return Promise.resolve(msg)

    } catch (error) {
        return Promise.reject({error})
    }
    
}


/* register admin function */
export async function registerAdmin( credentials) {
    try {
      const { data : {msg} , status } =  await axios.post(`https://ec2-13-232-169-249.ap-south-1.compute.amazonaws.com/api/admin/register`, credentials );
      const {name, email} = credentials;

      /* send email */
        if(status===200){
            console.log('ok');
            
            await axios.post('https://ec2-13-232-169-249.ap-south-1.compute.amazonaws.com/api/registerMail',{ name , userEmail: email ,text : msg })
        }

        return Promise.resolve(msg)

    } catch (error) {
        return Promise.reject({error})
    }
    
}

/* admin login function */
export async function adminVerifyPassword({email, password }) {
    try {

        if(email){
           const {data}= await axios.post(`https://ec2-13-232-169-249.ap-south-1.compute.amazonaws.com/api/admin/login`, {email,password});
           return Promise.resolve({data});
        }
        
    } catch (error) {
        console.log(error , 'this is the error')
        return Promise.reject({error:"Password doesn't Match...! "})
    }
    
}

/* login function */
export async function verifyPassword({username, password }) {
    try {

        if(username){
           const {data}= await axios.post(`https://ec2-13-232-169-249.ap-south-1.compute.amazonaws.com/api/login`, {username,password});
           return Promise.resolve({data});
        }
        
    } catch (error) {
        return Promise.reject({error:"Password doesn't Match...! "})
    }
    
}

// export async function getCustomers(){

//   try {

//     const {data} = await axios.get(`https://ec2-13-232-169-249.ap-south-1.compute.amazonaws.com/api/admin/customers`);
//       return {data};
    
//   } catch (error) {
//     return Promise.reject({error:"Couldn't find the Customers "})
//   }
// }


export async function getCustomers() {
  try {
    const response = await axios.get('https://ec2-13-232-169-249.ap-south-1.compute.amazonaws.com/api/admin/customers');

    // Check if the response status is in the success range (2xx)
    if (response.status >= 200 && response.status < 300) {
      return response.data;
    } else {
      // If the status is outside the success range, handle the error
      return Promise.reject({ error: `Failed to fetch customers. Server responded with status ${response.status}` });
    }
  } catch (error) {
    // Handle unexpected errors, such as network issues
    console.error('Error fetching customers:', error);

    // Return a generic error message
    return Promise.reject({ error: 'An unexpected error occurred while fetching customers' });
  }
}




/* update user profile function  */

export async function updateUser(response){
    try {

        const token = await localStorage.getItem('token');
        const data = await axios.put('https://ec2-13-232-169-249.ap-south-1.compute.amazonaws.com/api/updateuser',response,{headers: {"Authorization": `Bearer ${token}`}});
        return Promise.resolve({data})
    } catch (error) {
        return Promise.reject({error:"Couldn't Update Profile...!"})
        
    }

}


/* generate OTP */
export async function generateOTP(username){
    try {
      const {data : {code},status}=  await axios.get('https://ec2-13-232-169-249.ap-south-1.compute.amazonaws.com/api/generateOTP',{params:{username}});
      
      // send mail with the OTP
      if(status===201){
       const {data:{email}} = await getUser({username});
       const text = `Your Password Recovery OTP is ${code}. Verify and recover your password.`;
       await axios.post('https://ec2-13-232-169-249.ap-south-1.compute.amazonaws.com/api/registerMail',{username,userEmail:email,text,subject:"Password Recovery OTP"})
      }
      return Promise.resolve(code)
    } catch (error) {
        return Promise.reject({error})
    }
}

/* verify OTP */
export async function verifyOTP({username,code}) {

    try {
      const {data,status} =  await axios.get('https://ec2-13-232-169-249.ap-south-1.compute.amazonaws.com/api/verifyOTP',{params:{username,code}});
      return {data,status}
    } catch (error) {
        return Promise.reject(error)
        
    }
    
}

/* reset password */
export async function resetPassword({username,password}) {
    try {
        const {data,status} = await axios.put('https://ec2-13-232-169-249.ap-south-1.compute.amazonaws.com/api/resetPassword',{username,password});
        return Promise.resolve({data,status})
    } catch (error) {
        return Promise.reject({error})
    }
    
}


/* Add Category function */
// export async function addCategory( credentials) {
//     try {
//       const { data : {msg} , status } =  await axios.post(`https://ec2-13-232-169-249.ap-south-1.compute.amazonaws.com/api/admin/category/add`, credentials );
      

      
//         if(status===201){
//             console.log('ok');
            
            
//         }
//         return Promise.resolve(msg)


//     } catch (error) {
//         return Promise.reject({error})
//     }
    
// }

export async function addCategory(credentials) {
    try {
      const { data: { msg }, status } = await axios.post(`https://ec2-13-232-169-249.ap-south-1.compute.amazonaws.com/api/admin/category/add`, credentials);
  
      if (status >= 200 && status < 300) {
        console.log('Request successful');
      }
  
      return msg;
    } catch (error) {
      return Promise.reject({
        status: error.response?.status,
        message: error.response?.data?.error || 'Something went wrong',
      });
    }
  }

  export async function addCategory2(credentials) {
    try {
      const { data: { msg }, status } = await axios.post(`https://ec2-13-232-169-249.ap-south-1.compute.amazonaws.com/api/admin/category/add`, credentials);
  
      if (status >= 200 && status < 300) {
        console.log('Request successful');
      }
  
      return msg;
    } catch (error) {
      return Promise.reject({
        status: error.response?.status,
        message: error.response?.data?.error || 'Something went wrong',
      });
    }
  }