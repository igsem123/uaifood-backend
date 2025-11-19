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
     * components:
     *   schemas:
     *     Address:
     *       type: object
     *       properties:
     *         id:
     *           type: integer
     *         street:
     *           type: string
     *         city:
     *           type: string
     *         state:
     *           type: string
     *         zipCode:
     *           type: string
     *         userId:
     *           type: integer
     */


    /**
     * @swagger
     * /addresses:
     *   post:
     *     summary: Cria um novo endereço
     *     tags: [Addresses]
     *     security:
     *       - bearerAuth: []
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             required:
     *               - street
     *               - city
     *               - state
     *               - zipCode
     *           example:
     *             street: "Rua A"
     *             city: "São Paulo"
     *             state: "SP"
     *             zipCode: "12345-678"
     *     responses:
     *       201:
     *         description: Endereço criado com sucesso
     *       400:
     *         description: Dados inválidos
     *       401:
     *         description: Não autenticado
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
            if (error instanceof ZodError) {
                return res
                    .status(StatusCodes.BAD_REQUEST)
                    .json({ errors: error.issues });
            }
            if (error instanceof Error) {
                return res
                    .status(StatusCodes.BAD_REQUEST)
                    .json({ message: error.message });
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
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: integer
     *     responses:
     *       200:
     *         description: Endereço atualizado com sucesso
     *       400:
     *         description: Dados inválidos
     *       401:
     *         description: Não autenticado
     *       404:
     *         description: Endereço não encontrado
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
            if (error instanceof ZodError) {
                return res
                    .status(StatusCodes.BAD_REQUEST)
                    .json({ errors: error.issues });
            }
            if (error instanceof Error) {
                return res
                    .status(StatusCodes.BAD_REQUEST)
                    .json({ message: error.message });
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
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: integer
     *     responses:
     *       200:
     *         description: Endereço deletado com sucesso
     *       401:
     *         description: Não autenticado
     *       404:
     *         description: Endereço não encontrado
     *       500:
     *         description: Erro interno
     */
    deleteAddress = async (req: Request, res: Response) => {
        try {
            const addressId = BigInt(req.params.id);
            const userId = req.user?.id;

            if (!userId) {
                return res
                    .status(StatusCodes.UNAUTHORIZED)
                    .json({ message: ReasonPhrases.UNAUTHORIZED });
            }
            const address = await this.addressService.deleteAddress(addressId, userId);
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