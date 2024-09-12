import mongoose from "mongoose";


const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, "Please enter the Username"],
        unique: true
    },
    email: {
        type: String,
        required: [true, "Please enter the Email-id"],
        unique: true
    },
    password: {
        type: String,
        required: [true, "Please enter the Password"],

    },
    isVerified: {
        type: Boolean,
        default: false
    },
    uploadedVideos: {
        type: Array,
        default: []
    },
    likedVideos: {
        type: Array,
        default: []
    },
    favourites: {
        type: Array,
        default: []
    },


    forgotPasswordToken: String,
    forgotPasswordTokenExpiry: Date,
    verifyToken: String,
    verifyTokenExpiry: Date,

})

const User = mongoose.models.users || mongoose.model("users", UserSchema)
export default User

// at the end the name of the collection is all lowercase letters so in code, keep the variable name slightly different so as to keep the code look cleaner...