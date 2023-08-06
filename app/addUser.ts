"use server"

import { db } from "@/lib/db"
import { IUserAuth } from "@/lib/validations/auth"
import { hash } from "argon2"

export async function addUser(data: IUserAuth) {
  const { email, password } = data

  try {
    const exists = await db.user.findFirst({
      where: { email },
    })

    if (exists) {
      return `User already exists with email ${email}`
    }

    const hashedPassword = await hash(password)

    const result = await db.user.create({
      data: { email, password: hashedPassword },
    })

    return { result }
  } catch (err) {
    return "Error creating user"
  }
}
