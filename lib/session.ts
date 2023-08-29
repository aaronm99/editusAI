import { getWithSSRContext } from "@/app/(auth)/ssr"

export async function getCurrentUser() {
  const { Auth } = getWithSSRContext()
  const user = await Auth.currentAuthenticatedUser()

  return user
}
