// pages/api/subscribe.js
import { NextApiRequest, NextApiResponse } from "next";
import webpush from "web-push";

const publicKey = process.env.VAPID_PUBLIC_KEY as string;
const privateKey = process.env.VAPID_PRIVATE_KEY as string;

webpush.setVapidDetails("mailto:example@example.com", publicKey, privateKey);

const subscriptions = new Set();

type Data = {
    message: string;
};

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data>,
) {
    if (req.method === "POST") {
        const subscription = req.body;
        subscriptions.add(JSON.stringify(subscription));
        res.status(201).json({ message: "Subscribed successfully." });
    } else {
        res.status(405).json({ message: "Method not allowed." });
    }
}
