"use server"

import { IUserAuth } from "@/lib/validations/auth"
import { Auth } from "aws-amplify"

export async function addUser(data: IUserAuth) {
  const { email, password } = data

  try {
    const result = await Auth.signUp({
      username: email,
      password,
      attributes: {
        email: email,
        "custom:owner": "1",
        "custom:manager": "1",
        "custom:employee": "1",
        // given_name: name,
        // family_name: surname,
      },
    })
    return { result }
  } catch (err) {
    return "Error creating user"
  }
}
