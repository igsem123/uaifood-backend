import {container} from "tsyringe";
import {Router} from "express";
import {AddressController} from "../controllers/AddressController";

const router = Router();
const addressController = container.resolve(AddressController);

router.post('/', addressController.createAddress);
router.put('/', addressController.updateAddress);
router.delete('/:id', addressController.deleteAddress);

export default router;