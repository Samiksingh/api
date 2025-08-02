import User from "../models/user.module.js";


const getUser = async (request , response ) =>{
    const loggedInUserId = request.user._id;
    const filteredUsers = await User.find({
      _id: { $ne: loggedInUserId },
    }).select("-password");
    response
      .status(200)
      .json({ status: true, message: "Feteched success", data: filteredUsers });
}

export default getUser;