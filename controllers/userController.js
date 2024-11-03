const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/users');
require('dotenv').config();

// Register new user
const registerUser = async (req, res) => {
    const { username, email, password, contactNo } = req.body; 
    const role = "User";  // Set default to normal user 

    console.log(req.body); // Log to see the request body

    try {
        const existingUser = await User.getUserByEmail(email);
        if (existingUser) {
            return res.status(400).json({ message: 'Email already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User(null, username, email, hashedPassword, role, contactNo, new Date(), new Date());
        const createdUser = await User.registerUser(newUser);
        const token = jwt.sign({ id: createdUser.userID, role }, process.env.JWT_SECRET, { expiresIn: '200s' });
        
        res.status(201).json({ message: 'User created successfully', token });
    } 
    catch (err) {
        console.error('Error during registration:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.getUserByEmail(email); 
        if (!user) {
            console.log('User not found:', email); 
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            console.log('Password does not match for user:', email); 
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        
        const payload = { userID: user.userID, role: user.role }; 
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "36000s" });

        return res.status(200).json({ message: 'Successful Login', token }); 
    }
    catch (err) {
        console.error('Error during login:', err);
        res.status(500).json({ message: "Internal server error" });
    }
};

module.exports = {
    registerUser,
    loginUser
};
