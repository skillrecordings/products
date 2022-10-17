import {useFront} from '../context/front-context'
import * as React from 'react'
import FrontLink from './front-link'
import mockUser from '../data/mockBulkPurchase.json'
import Purchases from './purchase-list'

const EggheadUser = () => {
  const {eggheadUser} = useFront()
  const user = process.env.NODE_ENV === 'development' ? mockUser : eggheadUser
  const rowStyle =
    'flex justify-between flex-wrap bg-gray-200 mb-1 py-1 px-2 text-sm'

  if (!user || !user.id) return null

  return (
    <div key={user.id} className="my-2 w-full">
      <div className="flex flex-wrap justify-between">
        <div className="self-center px-2">
          {user.full_name && (
            <div className="text-gray-600">{user.full_name}</div>
          )}
        </div>
        <div className="self-center px-2">
          <img
            src={user.avatar_url}
            style={{
              maxWidth: '100px',
              margin: '.5em 0',
              border: '2px solid black',
              borderRadius: '50%',
            }}
          />
        </div>
      </div>
      <div className={rowStyle}>
        <span className="text-gray-900">Country</span>
        <span className="text-gray-600">{user.country || 'unknown'}</span>
      </div>
      {user.is_instructor ? (
        <div className={rowStyle}>
          <span className="text-gray-900">Status</span>
          <span className="text-gray-600">Instructor</span>
        </div>
      ) : (
        <div className={rowStyle}>
          <span className="text-gray-900">Status</span>
          {user.is_banned ? (
            <span style={{color: 'red'}}>Banned</span>
          ) : (
            <span className="text-gray-600">
              {user.is_pro && !user.is_instructor ? 'member' : 'non-member'}
            </span>
          )}
        </div>
      )}
      {user.accounts && (
        <div>
          <div className={rowStyle}>
            <span className="text-gray-900">Account type</span>
            <span className="text-gray-600">
              {user.accounts[0] && user.accounts[0].account_capacity}
            </span>
          </div>
          <div className={rowStyle}>
            <span className="text-gray-900">Role</span>
            <span className="text-gray-600">
              {user.accounts[0] && user.accounts[0].role}
            </span>
          </div>
        </div>
      )}
      {user.ban_reason && (
        <div className={rowStyle}>
          <span className="text-gray-900">Banned Reason</span>
          <span className="text-gray-600">{user.ban_reason}</span>
        </div>
      )}
      {user.favorite_topic && (
        <div className={rowStyle}>
          <span className="text-gray-900">Loves</span>
          <span className="text-gray-600">{user.favorite_topic}</span>
        </div>
      )}

      <div className="mb-2 px-2">
        <div>
          <FrontLink href={`https://app.egghead.io/admin?q=${user.email}`}>
            View User in Admin
          </FrontLink>
        </div>

        {user.view_egghead_apex_as_user_url && (
          <div>
            <FrontLink href={user.view_egghead_apex_as_user_url}>
              View egghead as User
            </FrontLink>
          </div>
        )}

        <div>
          <FrontLink href={`https://app.egghead.io/users/${user.id}`}>
            User Profile
          </FrontLink>
        </div>
      </div>
      <Purchases user={user} />
    </div>
  )
}

export default EggheadUser
