import { AuthContext } from "../context/AuthContext"
import { useContext } from "react"

export const useAuthContext = () => {
  const context = useContext(AuthContext)

  // تأكد أنك تستخدم الـ Hook داخل الـ Provider
  if(!context) {
    throw Error('useAuthContext must be used inside an AuthContextProvider')
  }

  return context
}