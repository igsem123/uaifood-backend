import {container} from "tsyringe";
import {Router} from "express";
import {AddressController} from "../controllers/addressController";
import passport from "../auth/passport";

const router = Router();
const addressController = container.resolve(AddressController);

router.post('/', passport.authenticate("jwt", { session: false }), addressController.createAddress);
router.patch('/', passport.authenticate("jwt", { session: false }), addressController.updateAddress);
router.delete('/:id', passport.authenticate("jwt", { session: false }), addressController.deleteAddress);

export default router;