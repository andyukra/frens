import NextAuth from "next-auth";
import Google from "next-auth/providers/google";

import { db } from "@/lib/db";
import User from "@/lib/models/users";
import blocked from "@/lib/blocked";

export const { handlers, auth, signIn, signOut } = NextAuth({
    providers: [
        Google({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        })
    ],

    callbacks: {
        async signIn({ profile }) {

            if (!profile?.email) return false;

            if (blocked.includes(profile.email)) {
                return false;
            }

            await db();

            const exists = await User.findOne({
                email: profile.email
            });

            if (exists) return true;

            await User.create({
                name: profile.name,
                image: profile.picture,
                email: profile.email
            });

            return true;
        },

        authorized({ auth, request }) {
            const isLoggedIn = !!auth?.user;

            const isProtectedRoute =
                request.nextUrl.pathname.startsWith("/dashboard") ||
                request.nextUrl.pathname.startsWith("/publicate");

            if (isProtectedRoute) {
                return isLoggedIn;
            }

            return true;
        }
    }
});