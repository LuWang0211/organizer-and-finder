import NextAuth from "next-auth"
import AzureADProvider from "next-auth/providers/microsoft-entra-id";
import { getOrCreateUser } from "./services/userService";
import { user } from "@prisma/client";

const MicrosoftProvider = AzureADProvider({
  clientId: process.env.AZURE_AD_CLIENT_ID!,
  clientSecret: process.env.AZURE_AD_CLIENT_SECRET!,
});

const providers =[
  MicrosoftProvider
]

type AuthConfig = Exclude<Parameters<typeof NextAuth>[0], Function>;
type SessionFunType = Exclude<Exclude<AuthConfig["callbacks"], undefined>["session"], undefined>;

export type SessionType = Parameters<SessionFunType>[0]["session"] & {
  id: string;
  provider: string;
  dbUser: user;
};

const jwtShared = ({token, user, account, profile, trigger}: any) => {
  if (trigger === "signIn") {
    token.provider = account?.provider
    token.id = user?.id
  }
  return token
}

export const { handlers, signIn, signOut, auth} = NextAuth({
    providers,
    callbacks: {
      jwt: jwtShared,

      async session({session, token}) {
        (session as SessionType).id = token?.id as string;
        (session as SessionType).provider = token?.provider as string;

        const dbUser = await getOrCreateUser((session as SessionType).provider, session.user.email, session.user.name!);
        (session as SessionType).dbUser = dbUser;
        return session;
      }
    }
})

export const getSession = auth as (() => Promise<SessionType | null>);


// Created a procedure speciallized for the middleware, which doesn't do Prisma operations
// in the session callback
export const { auth: middleware } = NextAuth({
  providers,
  callbacks: {
    jwt: jwtShared,
  }
})

