'use server'

import { prisma } from "@/lib/prisma";
import { getUser } from "@/src/query/user.query";
import { WritePostFormValues } from "./WritePostForm";

export const createPost = async (values: WritePostFormValues) => {
  // Création d'un post
  const user = await getUser()

  const post = await prisma.post.create({
    data: {
      content: values.content,
      userId: user.id,
    }
  })

  return post.id
}