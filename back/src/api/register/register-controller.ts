import { Request, Response, NextFunction } from "express";
import { IRegisterService } from "./register-service";
import { registerSchema } from "../../schemas/users/user-schemas";

export class RegisterController {
	constructor(private service: IRegisterService) {}

	async register (req: Request, res: Response, next: NextFunction) {
		try {
			const data = registerSchema.parse(req.body);
			await this.service.register(data);

			res.status(200).json({ msg: 'Conta criada com sucesso, ela será ativada em até 2 horas.' });

		} catch (err) {
			next(err);
		}
	}
}