import {Request, Response} from "express";
import {inject, injectable} from "tsyringe";
import {AddressService} from "../services/addressService";
import {getReasonPhrase, StatusCodes, ReasonPhrases, getStatusCode} from "http-status-codes";
import {ZodError} from "zod";

@injectable()
export class AddressController {
    constructor(@inject(AddressService) private addressService: AddressService) {}

    /**
     * @swagger
     * tags:
     *   name: Addresses
     *   description: Endpoints relacionados aos endereços
     */

    /**
     * @swagger
     * /addresses:
     *   post:
     *     summary: Cria um novo endereço
     *     tags: [Addresses]
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               street:
     *                 type: string
     *               city:
     *                 type: string
     *               state:
     *                 type: string
     *               zipCode:
     *                 type: string
     *               userId:
     *                 type: integer
     *     responses:
     *       201:
     *         description: Endereço criado com sucesso
     *       500:
     *         description: Erro interno
     */
    createAddress = async (req: Request, res: Response) => {
        try {
            const userId = req.user?.id;

            if (!userId) {
                return res
                    .status(StatusCodes.UNAUTHORIZED)
                    .json({ message: ReasonPhrases.UNAUTHORIZED });
            }

            const addressData = { ...req.body, userId: userId };

            const address = await this.addressService.createAddress(addressData);
            res
                .status(StatusCodes.CREATED)
                .json({ message: getReasonPhrase(StatusCodes.CREATED), address });
        } catch (error) {
            console.log(error);
            if (error instanceof Error) {
                return res
                    .status(StatusCodes.BAD_REQUEST)
                    .json({ message: error.message });
            }
            if (error instanceof ZodError) {
                return res
                    .status(StatusCodes.BAD_REQUEST)
                    .json({ errors: error.issues });
            }
            res
                .status(StatusCodes.INTERNAL_SERVER_ERROR)
                .json({message: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR)});
        }
    }

    /**
     * @swagger
     * /addresses/{id}:
     *   patch:
     *     summary: Atualiza um endereço existente
     *     tags: [Addresses]
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               street:
     *                 type: string
     *               city:
     *                 type: string
     *               state:
     *                 type: string
     *               zipCode:
     *                 type: string
     *               userId:
     *                 type: integer
     *     responses:
     *       200:
     *         description: Endereço atualizado com sucesso
     *       500:
     *         description: Erro interno
     */
    updateAddress = async (req: Request, res: Response) => {
        try {
            const userId = req.user?.id;
            const addressId = BigInt(req.params.id);

            if (!userId) {
                return res
                    .status(StatusCodes.UNAUTHORIZED)
                    .json({ message: ReasonPhrases.UNAUTHORIZED });
            }

            const address = await this.addressService.updateAddress(userId, addressId, req.body);

            res
                .status(StatusCodes.OK)
                .json({ message: getReasonPhrase(StatusCodes.OK), address });
        } catch (error) {
            if (error instanceof Error) {
                return res
                    .status(StatusCodes.BAD_REQUEST)
                    .json({ message: error.message });
            }
            if (error instanceof ZodError) {
                return res
                    .status(StatusCodes.BAD_REQUEST)
                    .json({ errors: error.issues });
            }
            res
                .status(StatusCodes.INTERNAL_SERVER_ERROR)
                .json({message: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR)});
        }
    }

    /**
     * @swagger
     * /addresses/{id}:
     *   delete:
     *     summary: Deleta um endereço existente
     *     tags: [Addresses]
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: integer
     *         description: ID do endereço a ser deletado
     *     responses:
     *       200:
     *         description: Endereço deletado com sucesso
     *       500:
     *         description: Erro interno
     */
    deleteAddress = async (req: Request, res: Response) => {
        try {
            const id = Number(req.params.id);
            const address = await this.addressService.deleteAddress(id);
            res
                .status(StatusCodes.OK)
                .json({ message: getReasonPhrase(StatusCodes.OK), address });
        } catch (error) {
            res
                .status(StatusCodes.INTERNAL_SERVER_ERROR)
                .json({message: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR)});
        }
    }
}