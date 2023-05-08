import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
    const body = getQuery(event)
    //const reqRes = body.values
    //let id: number = parseInt(body.canteen_id);
    const feed = {
        feedback_time: body.feedback_time,
        feedback_phone: body.feedback_phone,
        content: body.content,
        add_user: body.username
    }
    const postRes = await prisma.web_reply.create({ data: feed })
    if (null != postRes && postRes.id > 0)
        return 1
    else
        return 0
})
