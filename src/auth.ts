import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import bcrypt from "bcryptjs";
import { loginSchema } from "@/features/auth/schemas/auth.schema";
import { prisma } from "@/lib/prisma";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),

  session: {
    strategy: "jwt",
  },

  pages: {
    signIn: "/login",
  },

  providers: [
    Credentials({
      credentials: {
        email: {
          label: "Email",
          type: "email",
        },
        password: {
          label: "Password",
          type: "password",
        },
      },

      async authorize(credentials) {
        const parsedCredentials = loginSchema.safeParse(credentials);

        if (!parsedCredentials.success) {
          return null;
        }

        const { email, password } = parsedCredentials.data;

        const user = await prisma.user.findUnique({
          where: {
            email,
          },
        });

        if (!user || !user.passwordHash) {
          return null;
        }

        const isPasswordValid = await bcrypt.compare(
          password,
          user.passwordHash,
        );

        if (!isPasswordValid) {
          return null;
        }

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
        };
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user?.id) {
        token.sub = user.id;
      }

      // Avatars are loaded from the database; never put image data in the JWT cookie.
      delete token.picture;
      return token;
    },

    async session({ session, token }) {
      if (!session.user || !token.sub) {
        return session;
      }

      const databaseUser = await prisma.user.findUnique({
        where: {
          id: token.sub,
        },
        select: {
          name: true,
          image: true,
          plan: true,
          currency: true,
          theme: true,
          subscriptionStatus: true,
        },
      });

      if (databaseUser) {
        session.user.name = databaseUser.name;
        session.user.image = databaseUser.image;
      }

      session.user.id = token.sub;
      session.user.plan = databaseUser?.plan ?? "FREE";
      session.user.currency = databaseUser?.currency ?? "USD";
      session.user.theme = databaseUser?.theme ?? "LIGHT";
      session.user.subscriptionStatus =
        databaseUser?.subscriptionStatus ?? "NONE";

      return session;
    },
  },
});
