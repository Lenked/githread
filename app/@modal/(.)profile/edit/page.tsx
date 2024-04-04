import { getUserEdit } from '@/src/query/user.query'
import { notFound } from 'next/navigation'
import React from 'react'
import { EditProfileModal } from './EditProfileModal'
import { editProfile } from '@/app/profile/edit/edit-profile.action'

export default async function page() {
  const user = await getUserEdit()

  if(!user){
    notFound()
  }

  return <div className='w-full container flex items-center'>
    <div className='bg-card border rounded-md border-border p-4 flex-1'>
      <EditProfileModal user={user} editProfile={editProfile} />
    </div>
  </div>
}
