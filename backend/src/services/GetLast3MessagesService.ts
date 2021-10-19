import prismaclient from "../Prisma";

class GetLast3MessagesService {
    async execute() {
        const messages = await prismaclient.message.findMany({
            take: 3,
            orderBy: {
                created_at: "desc",
            },
            include: {
                user: true,
            }
        })

        return messages;
    }
}

export { GetLast3MessagesService };