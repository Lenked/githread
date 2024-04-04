import { getUser } from '@/src/query/user.query'
import React from 'react'
import { createPost } from '@/app/write/write-post-action'
import WriteModal from '@/app/@modal/(.)write/WriteModal'
import { createReply } from '@/app/posts/[postId]/reply/write-reply.action'
import ReplyModal from './ReplyModal'

export default async function page({
  params
} : {
  params: {
    postId: string
  }
}) {
  const user = await getUser()
  return <ReplyModal user={user} createReply={ async (values) => {
    "use server"

    const reply = await createReply(params.postId, values)
    return reply
  }} />
}
