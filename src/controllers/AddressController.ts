import {Request, Response} from "express";
import {inject, injectable} from "tsyringe";
import {AddressService} from "../services/AddressService";
import {getReasonPhrase, StatusCodes, ReasonPhrases, getStatusCode} from "http-status-codes";

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

    /**
     * @swagger
     * /addresses:
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
     *               id:
     *                 type: integer
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
                .json({ message: getReasonPhrase(ReasonPhrases.OK), address });
        } catch (error) {
            res
                .status(StatusCodes.INTERNAL_SERVER_ERROR)
                .json({error: getReasonPhrase(ReasonPhrases.INTERNAL_SERVER_ERROR)});
        }
    }
}