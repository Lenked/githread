import { getAuthSession } from '@/lib/auth';
import { getUserProfile } from '@/src/query/user.query';
import React from 'react'
import { Profile } from './Profile';
import { notFound, redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { Button } from '@/components/ui/button';
import { followUser } from './follow.action';
import { Post } from '@/src/features/post/Post';
import { string } from 'zod';
import { Metadata } from 'next';

export const generateMetadata = async ({params}: PageParams): Promise<Metadata> => {
  const user = await getUserProfile(params.userId)

  if (!user) {
    throw new Error("User not found")
  }

  return ({
    title: `${user.name} (${user.username})`
  })
}

type PageParams = {
  params: {
    userId: string
  }
}

export default async function UserPage({params}: PageParams) {
  const session = await getAuthSession()
  const user = await getUserProfile(params.userId)

  if(!user){
    notFound()
  }

  const isFollowing = session?.user.id ? await prisma.follow.findFirst({
    where: {
      followerId: user.id,
      followingId: user.id
    },
    select: {
      id: true
    },  
  }) : false

  const isCurrentUser = params.userId === session?.user.id

  if (isCurrentUser) {
    redirect("/profile")
  }
  
  return (
    <div>
      <Profile user={user}>
       <form className='mt-4'>
        <Button 
        variant={"outline"}
          formAction={async () =>{
          "use server"
          if (!session?.user.id) {
            return
          }

          followUser(params.userId)
        }}>
            {isFollowing ? 'Unfollow' : 'Follow'}
          </Button>
       </form>
      </Profile>
      <div className='divide-y divide-accent border-t border-accent mt-4'>
        {user.posts.map((post) => (
          <Post key={post.id} post={post} />
        ))}
      </div>
    </div>
  )
}
