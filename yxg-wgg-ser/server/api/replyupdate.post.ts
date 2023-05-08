import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
    const body = getQuery(event)
    //let id: number = parseInt(body.id);
    const postRes = await prisma.web_reply.updateMany({
        where: {
            feedback_time: body.feedback_time,
            feedback_phone: body.feedback_phone,
        },
        data: {
            content: body.content,
        }
    })
    if (null != postRes && postRes.id > 0)
        return 1
    else
        return 0
})
