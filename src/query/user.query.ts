import { getAuthSession } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { Prisma } from "@prisma/client"
import { postSelectQuery } from "./post.query"
import { cache } from "react"

const userQuery = {
  id: true,
  name: true,
  username: true,
  image: true,
  bio: true,
  createAt: true,
  link: true,
} satisfies Prisma.UserSelect

export const  getUser = async () => {
  const session = await getAuthSession()

  if (!session?.user.id) {
    throw new Error("User not found")
  }

  const user = await prisma.user.findFirstOrThrow({
    where: {
      id: session.user.id,
    }
  })

  return user
}

export const getUserProfile =  cache( async (userId: string) => {
  console.log('FETCH getUserProfile')
  return prisma.user.findFirst({
    where: {
      OR: [
        {
          username: userId
        },
        {
          id: userId,
        }
      ],
    },
    select: {
      ...userQuery,
      _count: {
        select: {
          followeds: true,
          likes: true
        }
      },
      posts: {
        select: postSelectQuery(userId),
        take: 10,
        orderBy: {
          createAt: "desc"
        },
      },
      followeds: {
        select: {
          follower: {
            select: {
              id: true,
              image: true,
              username: true
            }
          }
        },
        take: 3,
        orderBy: {
          createdAt: "desc"
        }
      }
    }
  })
})

export const getUserEdit = async () => {
  const session = await getAuthSession()

  if (!session) {
    throw new Error("No session")
  }

  return prisma.user.findUniqueOrThrow({
    where: {
      id: session.user.id,
    },
    select: userQuery
  })
}

export type UserProfile =  NonNullable<Prisma.PromiseReturnType<typeof getUserProfile>>

export type UserEdit = NonNullable<Prisma.PromiseReturnType<typeof getUserEdit>>