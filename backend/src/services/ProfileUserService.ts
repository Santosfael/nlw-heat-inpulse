import prismaclient from "../Prisma";

class ProfileUserService {
    async execute(user_id: string) {
        const user = await prismaclient.user.findFirst({
            where: {
                id: user_id,
            }
        });
        return user;
    }
}

export { ProfileUserService };