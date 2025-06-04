"use client";

import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";

export default function UserPage() {
    
    const { data: session } = useSession();
    const user = session?.user;
    const params = useParams();

   

    return (
        <div>
            <h1>User Page</h1>
            <p>{user?.id}</p>
            <p>{user?.name}</p>
            <p>{user?.email}</p>
            <p>{user?.image}</p>
        </div>
    );
}