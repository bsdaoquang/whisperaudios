/** @format */

import React from 'react'
import { useSelector } from 'react-redux'
import { userSelector } from '../../redux/reducers/userReducer'
import LoginScreen from './LoginScreen'
import Profile from './Profile'

const HomeAuth = () => {
  const userData = useSelector(userSelector)

  return userData.uid ? <Profile /> : <LoginScreen />
}

export default HomeAuth
