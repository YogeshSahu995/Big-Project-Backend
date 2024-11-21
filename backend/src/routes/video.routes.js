import { Router } from "express";
import { getAllVideos, getVideoById, updateVideo, deleteVideo, publishAVideo, togglePublishStatus, addVideoInHistory } from "../controllers/video.controller.js"
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js"

const router = Router()

router.use(verifyJWT)

router.route("/")
    .get(getAllVideos)
    .post(
        upload.fields([
            {
                name: "videoFile",
                maxCount: 1,
            },
            {
                name: "thumbnail",
                maxCount: 1,
            }
        ]), publishAVideo)

router.route("/:videoId")
    .get(getVideoById)
    .delete(deleteVideo)
    .patch(upload.single("thumbnail"), updateVideo)

router.route("/add/history/:videoId").patch(addVideoInHistory)

router.route("/toggle/publish/:videoId")
    .patch(togglePublishStatus)

export default router