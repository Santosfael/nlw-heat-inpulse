import axios from "axios";
import prismaclient from "../Prisma";
import { sign } from 'jsonwebtoken';

/**
 * Receber o code
 * Recuperar o access_token no github
 * Recuperar info do user github
 * Verificar se o usuário existe no DB
 * ----- SIM = Gera um token
 * ----- NÂO = Criar no DB, gera um token
 * Retornar o token com as infos do user
 */

type PropsAccessTokenResponse = {
    access_token: string;
}

type PropsUserResponse = {
    avatar_url: string;
    login: string;
    id: number;
    name: string;
}

class AuthenticateUserService {
    async execute(code: string) {
        const url = "https://github.com/login/oauth/access_token";

        const { data: accessTokenResponse } = await axios.post<PropsAccessTokenResponse>(url, null, {
            params: {
                client_id: process.env.GITHUB_CLIENT_ID,
                client_secret: process.env.GITHUB_CLIENT_SECRET,
                code,
            },
            headers: {
                "Accept": "application/json"
            }
        });

        const response = await axios.get<PropsUserResponse>("https://api.github.com/user", {
            headers: {
                authorization: `Bearer ${accessTokenResponse.access_token}`
            }
        });

        const { login, id, avatar_url, name } = response.data;

        let user = await prismaclient.user.findFirst({
            where: {
                github_id: id
            }
        });

        if (!user) {
            user = await prismaclient.user.create({
                data: {
                    github_id: id,
                    login,
                    avatar_url,
                    name
                }
            });
        }

        const token = sign({
            user: {
                name: user.name,
                avatar_url: user.avatar_url,
                id: user.id
            }
        },
            process.env.JWT_SECRET,
            {
                subject: user.id,
                expiresIn: "1d"
            }
        )

        return { token, user };
    }
}

export { AuthenticateUserService };