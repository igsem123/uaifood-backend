import {Request, Response} from "express";
import {inject, injectable} from "tsyringe";
import {AddressService} from "../services/AddressService";
import {getReasonPhrase, StatusCodes, ReasonPhrases, getStatusCode} from "http-status-codes";

@injectable()
export class AddressController {
    constructor(@inject(AddressService) private addressService: AddressService) {}

    createAddress = async (req: Request, res: Response) => {
        try {
            const address = await this.addressService.createAddress(req.body);
            res
                .status(StatusCodes.CREATED)
                .json({ message: getReasonPhrase(ReasonPhrases.CREATED), address });
        } catch (error) {
            res
                .status(StatusCodes.INTERNAL_SERVER_ERROR)
                .json({error: getReasonPhrase(ReasonPhrases.INTERNAL_SERVER_ERROR)});
        }
    }

    updateAddress = async (req: Request, res: Response) => {
        try {
            const address = await this.addressService.updateAddress(req.body);
            res
                .status(StatusCodes.OK)
                .json({ message: getReasonPhrase(ReasonPhrases.OK), address });
        } catch (error) {
            res
                .status(StatusCodes.INTERNAL_SERVER_ERROR)
                .json({error: getReasonPhrase(ReasonPhrases.INTERNAL_SERVER_ERROR)});
        }
    }

    deleteAddress = async (req: Request, res: Response) => {
        try {
            const id = Number(req.params.id);
            const address = await this.addressService.deleteAddress(id);
            res
                .status(StatusCodes.OK)
                .json({ message: getReasonPhrase(ReasonPhrases.OK), address });
        } catch (error) {
            res
                .status(StatusCodes.INTERNAL_SERVER_ERROR)
                .json({error: getReasonPhrase(ReasonPhrases.INTERNAL_SERVER_ERROR)});
        }
    }
}