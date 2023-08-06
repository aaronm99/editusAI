import type { NextAuthOptions } from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { verify } from "argon2"
import { userAuthSchema } from "./validations/auth"
import { db } from "@/lib/db"

export const authOptions: NextAuthOptions = {
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "jsmith@gmail.com",
        },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        try {
          const { email, password } = await userAuthSchema.parseAsync(
            credentials
          )

          const result = await db.user.findFirst({
            where: { email },
          })

          if (!result) return null

          const isValidPassword = await verify(result.password, password)

          if (!isValidPassword) return null

          return {
            id: result.id,
            email,
          }
        } catch {
          return null
        }
      },
    }),
  ],
  callbacks: {
    async session({ token, session }) {
      if (token) {
        session.user.id = token.id
        session.user.name = token.name
        session.user.email = token.email
        session.user.image = token.picture
      }

      return session
    },
    async jwt({ token, user }) {
      const dbUser = await db.user.findFirst({
        where: {
          email: token.email,
        },
      })

      if (!dbUser) {
        if (user) {
          token.id = user?.id
        }
        return token
      }

      return {
        id: dbUser.id,
        name: dbUser.name,
        email: dbUser.email,
        picture: dbUser.image,
      }
    },
  },
  jwt: {
    maxAge: 15 * 24 * 30 * 60, // 15 days
  },
  pages: {
    signIn: "/",
    newUser: "/sign-up",
  },
  secret: process.env.NEXTAUTH_SECRET,
}
