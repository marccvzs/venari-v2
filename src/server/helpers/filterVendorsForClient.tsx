import type { User } from "@clerk/nextjs/server";

export const filterVendorsForClient = ( vendor: User ) => {
    return {
        id: vendor.id,
        username: vendor.username,
        profilePicture: vendor.profileImageUrl,
    };
};