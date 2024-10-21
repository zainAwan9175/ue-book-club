import UserModel from "../Model/Usermodel.js";

export const createUser = async (req, res) => {
    const { userId, username, imageUrl } = req.body;
    console.log(req.body);

  

    try {
        const newUser = await UserModel.create({ userId, username, imageUrl });
        console.log('New User Created:', newUser); // Log the created user
        return res.status(201).json({ message: 'User created successfully', user: newUser });
    } catch (error) {
        console.error('Error during user creation:', error);
        return res.status(500).json({ error: 'Internal server error', details: error.message });
    }
    
};
