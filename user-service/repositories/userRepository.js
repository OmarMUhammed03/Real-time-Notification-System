const User = require("../models/User");

exports.findUserById = async (id) => {
    const user = await User.findById(id);
    return user;
};

exports.findUserByEmail = async (email) => {
    const user = await User.findOne({ email });
    return user;
};
    
exports.createUser = async (user) => {
    const createdUser = await User.create(user);
    return createdUser;
};

exports.updateUser = async (id, user) => {
    const updatedUser = await User.findByIdAndUpdate(id, user, { new: true });
    return updatedUser;
};



