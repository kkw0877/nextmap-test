// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import prisma from '@/db'
import { LikeApiResponse, LikeInterface } from '@/interface'

interface ResponseType {
    page?: string;
    limit?: string;
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<LikeApiResponse | LikeInterface>
) {
    const session = await getServerSession(req, res, authOptions)

    // User가 존재하지 않는 경우에는 401 Error를 전달한다
    if(!session?.user) 
        return res.status(401)

    // User가 존재하는 경우라면, 찜하기 로직을 처리한다.
    if (req.method === "POST") {
        const { storeId }: { storeId: number } = req.body

        // Like 데이터가 존재하는지 확인
        let like = await prisma.like.findFirst({
            where: {
                storeId,
                userId: session?.user?.id
            }
        })

        // 이미 찜이 존재하는 경우라면, 삭제
        if (like) {
            like = await prisma.like.delete({
                where: {
                    id: like.id,
                }
            })

            return res.status(204).json(like)
        }
        else {
            // 사용자가 찜을 하지 않은 경우
            like = await prisma.like.create({
                data: {
                    storeId,
                    userId: session?.user?.id
                }
            })

            return res.status(201).json(like)
        }

    } else {
        // req.method === "GET"
        const count = await prisma.like.count({
            where: {
                userId: session?.user?.id
            }
        })
        const { page = "1", limit = "10" }: ResponseType = req.query
        const skipPage = parseInt(page) - 1
        
        const likes = await prisma.like.findMany({
            orderBy: { createdAt: "desc" },
            where: {
                userId: session?.user?.id
            },
            include: {
                store: true 
            },
            skip: skipPage * parseInt(limit),
            take: parseInt(limit),
        })

        return res.status(200).json({
            data: likes,
            page: parseInt(page),
            totalPage: Math.ceil(count / parseInt(limit))
        })
    }
}
