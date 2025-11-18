import { getToken } from "next-auth/jwt";

export const getDataFromToken = async (request) => {
    try {
        const token = await getToken({req: request});
        return token?.id || null;

    } catch (error) {
        console.error("getDataFromToken error:", error.message);
        throw new Error(error.message);
    }
}