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
async signIn({ user }) {
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
    return res.ok;
  } catch {
    return false;
  }
},
  },
});

export { handler as GET, handler as POST };