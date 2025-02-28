import type { AuthOptions } from "next-auth";

export const authConfig: AuthOptions = {
  session: {
    strategy: "jwt",
  },
  pages: {
    error: "/",
    signIn: "/",
    signOut: "/",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
      }
      return session;
    },
  },
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const user = { id: "1", name: "User", email: credentials?.email };
        return user ?? null;
      },
    }),
  ],
};

function CredentialsProvider(arg0: { name: string; credentials: { email: { label: string; type: string; }; password: { label: string; type: string; }; }; authorize(credentials: any): Promise<{ id: string; name: string; email: any; }>; }): import("next-auth/providers/index").Provider {
    throw new Error("Function not implemented.");
}
