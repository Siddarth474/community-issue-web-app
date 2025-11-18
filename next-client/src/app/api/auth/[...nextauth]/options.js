import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import User from "@/models/userModel";
import { connectDB } from "@/db/dbConfig";

const authOptions = {
    providers: [
        CredentialsProvider({
            id: 'credentials',
            name: 'credentials',
            credentials: {
                email: { label: "Email", type: "text" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                await connectDB();
                try {
                    const user = await User.findOne({
                        $or: [
                            {email: credentials.email},
                            {username: credentials.username}
                        ]
                    });
                    
                    if(!user) {
                        throw new Error('No user found with this email')
                    }

                    if(!user.isVerified) {
                        throw new Error('Please verify your email first');
                    }

                    const validatePassword = await user.isPasswordCorrect(credentials.password);

                    if(validatePassword) {
                        return {
                            id: user._id.toString(),
                            email: user.email,
                            username: user.username,
                            provider: 'credentials',
                            isVerified: user.isVerified,
                        }
                    } else {
                        throw new Error('Incorrect password');
                    }

                } catch (error) {
                    throw new Error(error.message || "Login failed");
                }
            }
        }),
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET
        })
    ],
    callbacks:{
       async signIn({user, account}) {
            await connectDB();
            const existingUser = await User.findOne({email: user.email});

            if(existingUser) {
                if (account?.provider === 'credentials' && !existingUser.isVerified) {
                    throw new Error('Please verify your email before login.');
                }
                return true;
            }

            if(!existingUser && account?.provider === 'google') {
                await User.create({
                    username: user.name,
                    email: user.email,
                    isVerified: true,
                    provider: 'google'
                });
                return true;
            }

            return false;
        },
        async session({ session, token }) {
            if(token) {
                session.user.id = token.id;
                session.user.isVerified = token.isVerified;
                session.user.username = token.username;
                session.user.provider = token.provider;
            }

            return session;
        },
        async jwt({ token, user, account }) {
            if(user) {
                const dbUser = await User.findOne({email: user.email});
                
                token.id = dbUser._id.toString();
                token.email = dbUser.email;
                token.username = dbUser.username;
                token.provider = dbUser.provider;
            }
            else {
                token.provider = account?.provider;
            }

            return token;
        }
    },
    pages: {
        signIn: '/login'
    },
    session: {
        strategy: 'jwt'
    },
    secret: process.env.NEXTAUTH_SECRET,
}

export default authOptions;