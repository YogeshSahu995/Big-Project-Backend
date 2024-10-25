import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js"
import {User} from "../models/user.model.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"
import {ApiResponse} from '../utils/ApiResponse.js'

const registerUser = asyncHandler(async(req, res) => {
    const {fullname, email, username, password} = req.body
    console.log("email", email)

    //validation..
    if(
        [fullname, email, username, password].some((field) => field?.trim() === "") //some() return boolean value
    ){
        throw new ApiError(400, "All fields are compailsory and required")
    }

    //check user exist..
    const existedUser = User.findOne({
        $or: [{email}, {username}]
    })

    if(existedUser) {
        throw new ApiError(409, "User with email or username already exists")
    }

    //get local path of image..
    const avatarLocalPath = req.files?.avatar[0]?.path //serverpath
    const coverImageLocalPath = req.files?.coverImage[0]?.path

    if(!avatarLocalPath){
        throw new ApiError(400, "avatar Image is required")
    }

    //upload on cloudinary..
    const avatar = await uploadOnCloudinary(avatarLocalPath)
    const coverImage = await uploadOnCloudinary(coverImageLocalPath)

    //Check avatar image is upload on cloudinary..
    if(!avatar){
        throw new ApiError(400, "avatar Image is required")
    }

    //Create user object and insert in db
    const user = await User.create({
        fullname,
        avatar: avatar.url,
        coverImage: coverImage?.url || "", //check on coverImage
        email,
        password,
        username: username.toLowerCase()
    })

    //remove password and refresh token field from response 
    const createdUser = await User.findById(user._id).select("-password -refreshToken") //ye fields user ko nhi deni

    //User is created or not in mongodb
    if(!createdUser) {
        throw new ApiError(500, "Something went wrong while registering the user")
    }

    return res.status(201).json(
        new ApiResponse(200, createdUser, "User registered successfully")
    )
})

export {registerUser}

//get user details from frontend
//validation on details (not empty)
//check if user already exists:- username, email
//check for images, check for avatar
//upload them to cloudinary, avatar check
//create user object - create entry in db
//remove password and refresh token field from response
//check for user creation
//return response