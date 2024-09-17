import mongoose from "mongoose";


const VideoSchema = new mongoose.Schema({
    Videoname: {
        type: String,
        required: [true, "Please enter the video name"],
    },
    VideoFile: {
        type: String,
        required: [true, "link is mandatory"],
    },
    Likes: {
        type: Number,
        default: 0
    },
    Tags: {
        type: [String],
        required: [true, "Please enter atleast one tag"],
        default: []
    },
    CommentsEnglish: {
        type: Array,
        default: []
    },
    CommentsHindi: {
        type: Array,
        default: []
    },
    UserId: {
        type: String,
    },



})

const Video = mongoose.models.videos || mongoose.model("videos", VideoSchema)
export default Video

// at the end the name of the collection is all lowercase letters so in code, keep the variable name slightly different so as to keep the code look cleaner...