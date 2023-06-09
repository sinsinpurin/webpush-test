// pages/api/unsubscribe.js
import { NextApiRequest, NextApiResponse } from "next";

import { deleteSubscription } from "@/lib/db";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse,
) {
    if (req.method === "DELETE") {
        const subscription = req.body;
        await deleteSubscription(subscription);
        res.status(200).json({ message: "Unsubscribed successfully." });
    } else {
        res.status(405).json({ message: "Method not allowed." });
    }
}
