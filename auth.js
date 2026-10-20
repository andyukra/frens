import NextAuth from "next-auth";
import Google from "next-auth/providers/google";

import { db } from "@/lib/db";
import User from "@/lib/models/users";
import blocked from "@/lib/blocked";
import DbFactory from "@/lib/adapters/server/db/dbFactory";

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

            const dbFactory = DbFactory(process.env.DB_TYPE);

            try {
                const exists = await dbFactory.getUserAvatarAndPubsPerDay(profile.email);
                if(exists) return true;
                await dbFactory.createUser(profile.name, profile.picture, profile.email);
                return true;
            } catch (error) {
                return false;
            }
        },

        authorized({ auth, request }) {
            const isLoggedIn = !!auth?.user;

            const isProtectedRoute =
                request.nextUrl.pathname.startsWith("/dashboard") ||
                request.nextUrl.pathname.startsWith("/publicate") || 
                request.nextUrl.pathname.startsWith("/favourites"); 

            if (isProtectedRoute) {
                return isLoggedIn;
            }

            return true;
        }
    }
});