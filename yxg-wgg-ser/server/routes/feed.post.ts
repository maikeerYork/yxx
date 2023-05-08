import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
    const body = await readBody(event)
    const reqRes = body.values
    const feed = {
        username: reqRes.username,
        phone: reqRes.phone,
        msg: reqRes.msg,
        in_time: parseInt((Number(Date.now())/1000).toFixed())
    }
    const postRes = await prisma.web_feedback.create({ data: feed })
    if (null != postRes && postRes.id > 0)
        return 1
    else
        return 0
})