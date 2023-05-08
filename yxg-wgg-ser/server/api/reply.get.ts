import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
    const query = getQuery(event)
    //let id: number = parseInt(query.canteen_id);
    const allinfo = await prisma.web_reply.findMany({
       where: {
           feedback_time: query.create_time,
           feedback_phone: query.phone,
       }
    })
    return {
        code: 200,
        time: (Number(new Date()) / 1000).toFixed(0),
        data: allinfo
    }
})
