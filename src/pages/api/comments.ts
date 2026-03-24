// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth'
import prisma from '@/db'
import { CommentInterface, CommentApiResponse } from '@/interface'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'

interface ResponseType {
    id?: string;
    page?: string;
    limit?: string;
    storeId?: string;
    user?: boolean;
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<CommentApiResponse | CommentInterface>
) {
    const session = await getServerSession(req, res, authOptions)
    const { id = "", page = "1", limit = "10", storeId = "", user = false }: ResponseType = req.query
    
    if(req.method === "POST") {
        // User가 존재하지 않는 경우에는 401 Error를 전달한다
        if(!session?.user) 
            return res.status(401)
        
        const { storeId, body }: { storeId: number, body: string } = req.body
        const comment = await prisma.comment.create({
            data: {
                body,
                storeId,
                userId: session?.user?.id
            }
        })
    
        return res.status(200).json(comment)

    } else if(req.method === "DELETE") {
        // Comment 삭제 로직
        // id가 존재하지 않거나 로그인하지 않은 사용자라면, 401 Error를 전달한다
        if(!session?.user || !id) {
            return res.status(401)
        }

        const comment = await prisma.comment.delete({
            where: {
                id: parseInt(id)
            }
        })

        return res.status(200).json(comment)

    } else {
        // Comment 목록 조회 로직 req.method === "GET"
        const skipPage = parseInt(page) - 1
        const count = await prisma.comment.count({
            where: {
                storeId: storeId ? parseInt(storeId) : {},
                userId: user ? session?.user?.id : {}
            }
        })
        
        const comments = await prisma.comment.findMany({
            orderBy: { createdAt: "desc" },
            where: {
                storeId: storeId ? parseInt(storeId) : {},
                userId: user ? session?.user?.id : {}
            },
            skip: skipPage * parseInt(limit),
            take: parseInt(limit),
            include: {
                user: true,
                store: true
            }
        })

        return res.status(200).json({
            data: comments,
            page: parseInt(page),
            totalPage: Math.ceil(count / parseInt(limit))
        })
    }
    // res.status(200).json({ name: 'John Doe' })
}
