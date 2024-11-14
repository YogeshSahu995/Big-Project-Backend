import {Schema, model} from "mongoose";

const playlistSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
            lowercase: true,
            trim: true,
        },

        description: {
            type: String,
            required: true,
        },

        videos: [
            {
                type: Schema.Types.ObjectId,
                ref: "Video"
            }
        ],

        owner: {
            type: Schema.Types.ObjectId,
            ref: "User"
        }
    },
    {
        timestamps: true,
    }
)

export const Playlist = model("Playlist", playlistSchema)