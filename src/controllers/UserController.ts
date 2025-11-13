import {inject, injectable} from "tsyringe";
import {UserService} from "../services/UserService";
import {Request, Response} from "express";
import { z } from "zod";
import { ReasonPhrases, StatusCodes, getReasonPhrase, getStatusCode } from "http-status-codes";
import {UserType} from "@prisma/client";

@injectable()
export class UserController {
    constructor(@inject(UserService) private userService: UserService) {}

    registerUser = async (req: Request, res: Response) => {
        try {
            const user = {...req.body, type: UserType.CLIENT};
            const newUser = await this.userService.registerUser(user);

            res
                .status(StatusCodes.OK)
                .json({ message: getReasonPhrase(ReasonPhrases.CREATED), newUser });
        } catch (error) {
            if(error instanceof z.ZodError) {
                return res
                    .status(StatusCodes.BAD_REQUEST)
                    .json({ errors: error.issues });
            } else if (error instanceof Error) {
                return res
                    .status(StatusCodes.BAD_REQUEST)
                    .json({ error: error.message });
            }
            res
                .status(StatusCodes.INTERNAL_SERVER_ERROR)
                .json({ error: getReasonPhrase(ReasonPhrases.INTERNAL_SERVER_ERROR) });
        }
    }

    getUserById = async (req: Request, res: Response) => {
        try {
            const id = Number(req.params.id);
            const user = await this.userService.findUserById(id);

            if (!user) {
                return res
                    .status(StatusCodes.NOT_FOUND)
                    .json({ error: 'User not found' });
            }

            res
                .status(StatusCodes.OK)
                .json({ user });
        } catch (error) {
            res
                .status(StatusCodes.INTERNAL_SERVER_ERROR)
                .json({ error: getReasonPhrase(ReasonPhrases.INTERNAL_SERVER_ERROR) });
        }
    }

    updateUser = async (req: Request, res: Response) => {
        try {
            const id = Number(req.params.id);
            const data = {...req.body};
            const updatedUser = await this.userService.updateUser(id, data);

            res
                .status(StatusCodes.OK)
                .json({ message: getReasonPhrase(ReasonPhrases.OK), updatedUser });
        } catch (error) {
            if(error instanceof z.ZodError) {
                return res
                    .status(StatusCodes.BAD_REQUEST)
                    .json({ errors: error.issues });
            } else if (error instanceof Error) {
                return res
                    .status(StatusCodes.BAD_REQUEST)
                    .json({ error: error.message });
            }
            res
                .status(StatusCodes.INTERNAL_SERVER_ERROR)
                .json({ error: getReasonPhrase(ReasonPhrases.INTERNAL_SERVER_ERROR) });
        }
    }

    deleteUser = async (req: Request, res: Response) => {
        try {
            const id = Number(req.params.id);
            const deletedUser = await this.userService.deleteUser(id);

            res
                .status(StatusCodes.OK)
                .json({message: getReasonPhrase(ReasonPhrases.OK), deletedUser});
        } catch (error) {
            if (error instanceof Error) {
                return res
                    .status(StatusCodes.BAD_REQUEST)
                    .json({error: error.message});
            }
            res
                .status(StatusCodes.INTERNAL_SERVER_ERROR)
                .json({error: getReasonPhrase(ReasonPhrases.INTERNAL_SERVER_ERROR)});
        }
    }

    getUserWithAddresses = async (req: Request, res: Response) => {
        try {
            const id = Number(req.params.id);
            const user = await this.userService.findUserWithAddresses(id);

            if (!user) {
                return res
                    .status(StatusCodes.NOT_FOUND)
                    .json({ error: 'User not found' });
            }

            res
                .status(StatusCodes.OK)
                .json({ user });
        } catch (error) {
            res
                .status(StatusCodes.INTERNAL_SERVER_ERROR)
                .json({ error: getReasonPhrase(ReasonPhrases.INTERNAL_SERVER_ERROR) });
        }
    }
}