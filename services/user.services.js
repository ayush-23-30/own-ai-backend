import User from "../modals/user.modal.js";


 export const createUser = async ({
  email , password , fullName , phoneNumber
 }) => {

  if(!email || !password ){
    throw new Error ("Email and password are required")
  }

  if(!fullName ){
    throw new Error ("Full Name is required")
  }

  const hashedPassword = await User.hashPassword(password); 

  const user = await User.create({
    fullName,
    phoneNumber,
    email, 
    password : hashedPassword
  })

  return user;
}

