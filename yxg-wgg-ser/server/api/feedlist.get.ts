import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
    let pgIndex = 1
    let pgCount = 10
    const query = getQuery(event)
    if (typeof (query.pgIndex) != "undefined" && !isNaN(query.pgIndex)) {
        pgIndex = parseInt(query.pgIndex)
    }
    if (typeof (query.pgIndex) != "undefined" && !isNaN(query.pgCount)) {
        pgCount = parseInt(query.pgCount)
    }
    let offsetCount = (pgIndex - 1) * pgCount
    const resCount = await prisma.web_feedback.count()
    const allinfo = await prisma.web_feedback.findMany({
        skip: offsetCount,
        take: pgCount,
        orderBy: [
            {
                id: 'desc',
            }]
    })
    return {
        code: 200,
        time: (Number(new Date()) / 1000).toFixed(0),
        data: allinfo,
        pgIndex: pgIndex,
        pgCount: pgCount,
        totalCount: resCount
    }
})