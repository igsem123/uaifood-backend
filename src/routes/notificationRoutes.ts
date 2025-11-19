import {Router} from "express";
import {container} from "tsyringe";
import {NotificationController} from "../controllers/notificationController";
import passport from "../auth/passport";

const router = Router();
const notificationController = container.resolve(NotificationController);

router.get('/', passport.authenticate("jwt", { session: false }), notificationController.getNotifications);
router.post('/:id/read', passport.authenticate("jwt", { session: false }), notificationController.markAsRead);
router.post('/read-all', passport.authenticate("jwt", { session: false }), notificationController.markAllAsRead);

export default router;