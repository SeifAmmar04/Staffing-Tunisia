import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    // ✅ CHANGEMENT 1 : Ajouter account comme paramètre
    async signIn({ user, account }) {
      try {
        const res = await fetch("http://localhost:5000/auth/google", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: user.email,
            firstName: user.name?.split(" ")[0],
            lastName: user.name?.split(" ")[1] || "",
            image: user.image,
          }),
        });

        if (!res.ok) return false;

        const data = await res.json();
        if (data.user?.id) {
          user.id = data.user.id;
        }

        // ✅ CHANGEMENT 2 : Ajouter le provider
        (user as any).provider = "google";

        return true;
      } catch {
        return false;
      }
    },

    // ✅ CHANGEMENT 3 : Ajouter provider au token
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.provider = (user as any).provider; // ← AJOUTER CETTE LIGNE
      }
      return token;
    },

    // ✅ CHANGEMENT 4 : Ajouter provider à la session
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id;
        (session.user as any).provider = token.provider; // ← AJOUTER CETTE LIGNE
      }
      return session;
    },
  },
});

export { handler as GET, handler as POST };