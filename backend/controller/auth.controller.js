import bcrypt from "bcryptjs";
import User from "../models/user.module.js";
import generateToken from "../utility/token.js";

const signup = async (request, response) => {
  console.log("Signup route hit");
  console.log("Request headers:", request.headers);
  console.log("Request body:", request.body);
  console.log("Request body type:", typeof request.body);
  
  try {
    // Check if request.body exists
    if (!request.body) {
      return response.status(400).json({
        status: false,
        message: "Request body is missing. Please send data as JSON with Content-Type: application/json"
      });
    }
    
    const { name, email, password, profile_url, gender, address, username } = request.body;
    
    // Check if name is present in body
    if (!name) {
      return response.status(400).json({
        status: false,
        message: "Name is required"
      });
    }
    
    // Check if email is present in body
    if (!email) {
      return response.status(400).json({
        status: false,
        message: "Email is required"
      });
    }
    
    // Check if password is present in body
    if (!password) {
      return response.status(400).json({
        status: false,
        message: "Password is required"
      });
    }
    
    // Check if profile_url is present in body
    if (!profile_url) {
      return response.status(400).json({
        status: false,
        message: "Profile URL is required"
      });
    }
    
    // Check if username is present in body
    if (!username) {
      return response.status(400).json({
        status: false,
        message: "Username is required"
      });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return response.status(400).json({
        status: false,
        message: "Please provide a valid email address"
      });
    }

    // Password strength validation
    if (password.length < 6) {
      return response.status(400).json({
        status: false,
        message: "Password must be at least 6 characters long"
      });
    }

    // Gender validation
    if (!["male", "female"].includes(gender)) {
      return response.status(400).json({
        status: false,
        message: "Gender must be either 'male' or 'female'"
      });
    }

    // Username validation (alphanumeric and underscore only)
    const usernameRegex = /^[a-zA-Z0-9_]+$/;
    if (!usernameRegex.test(username)) {
      return response.status(400).json({
        status: false,
        message: "Username can only contain letters, numbers, and underscores"
      });
    }

    if (username.length < 3 || username.length > 20) {
      return response.status(400).json({
        status: false,
        message: "Username must be between 3 and 20 characters"
      });
    }

    // Profile URL validation (basic URL check)
    try {
      new URL(profile_url);
    } catch (error) {
      return response.status(400).json({
        status: false,
        message: "Please provide a valid profile URL"
      });
    }


    // Check if user already exists
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return response.status(400).json({ 
        status: false, 
        message: "User with this email or username already exists" 
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      profile_url,
      gender,
      address,
      username
    });

    const savedUser = await newUser.save();

    // Generate token
    const token = generateToken(savedUser._id);

    // Return user data (without password) and token with status 201
    const userResponse = {
      _id: savedUser._id,
      name: savedUser.name,
      email: savedUser.email,
      profile_url: savedUser.profile_url,
      gender: savedUser.gender,
      address: savedUser.address,
      username: savedUser.username
    };

    response.status(201).json({
      status: true,
      message: "User created successfully",
      data: userResponse,
      token
    });

  } catch (error) {
    console.error("Signup error:", error);
    
    // Handle JWT secret error specifically
    if (error.message.includes("JWT_SECRETKEY")) {
      return response.status(500).json({
        status: false,
        message: "Server configuration error: JWT secret not configured"
      });
    }
    
    response.status(500).json({
      status: false,
      message: error.message
    });
  }
};

const login = async (request, response) => {
  console.log("Login route hit");
  console.log("Request headers:", request.headers);
  console.log("Request body:", request.body);
  console.log("Request body type:", typeof request.body);
  
  try {
    // Check if request.body exists
    if (!request.body) {
      return response.status(400).json({
        status: false,
        message: "Request body is missing. Please send data as JSON with Content-Type: application/json"
      });
    }
    
    const { email, password } = request.body;

    // Check if email is present in body
    if (!email) {
      return response.status(400).json({
        status: false,
        message: "Email is required"
      });
    }

    // Check if password is present in body
    if (!password) {
      return response.status(400).json({
        status: false,
        message: "Password is required"
      });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return response.status(400).json({
        status: false,
        message: "Please provide a valid email address"
      });
    }

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return response.status(401).json({
        status: false,
        message: "Invalid email or password"
      });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return response.status(401).json({
        status: false,
        message: "Invalid email or password"
      });
    }

    // Generate token
    const token = generateToken(user._id);

    // Return user data (without password) and token with status 201
    const userResponse = {
      _id: user._id,
      name: user.name,
      email: user.email,
      profile_url: user.profile_url,
      gender: user.gender,
      address: user.address,
      username: user.username
    };

    response.status(201).json({
      status: true,
      message: "Login successful",
      data: userResponse,
      token
    });

  } catch (error) {
    console.error("Login error:", error);
    
    // Handle JWT secret error specifically
    if (error.message.includes("JWT_SECRETKEY")) {
      return response.status(500).json({
        status: false,
        message: "Server configuration error: JWT secret not configured"
      });
    }
    
    response.status(500).json({
      status: false,
      message: "Internal server error"
    });
  }
};

export { signup, login }; 