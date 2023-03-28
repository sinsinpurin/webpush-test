// pages/api/sendNotification.js
import { getSubscriptions } from "@/lib/db";
import { NextApiRequest, NextApiResponse } from "next";
import webpush from "web-push";

const publicKey = process.env.VAPID_PUBLIC_KEY as string;
const privateKey = process.env.VAPID_PRIVATE_KEY as string;

webpush.setVapidDetails("mailto:example@example.com", publicKey, privateKey);

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse,
) {
    if (req.method === "POST") {
        const notificationPayload = {
            notification: {
                title: "Sample notification",
                body: "This is a sample notification",
                icon: "https://example.com/icon.png",
                badge: "https://example.com/badge.png",
                vibrate: [100, 50, 100],
                data: {
                    url: "https://example.com",
                },
                actions: [
                    {
                        action: "view",
                        title: "View",
                    },
                ],
            },
        };

        const subscriptions = await getSubscriptions();

        subscriptions?.map((subscription) => {
            console.log(subscription.subscribe_data);
            webpush
                .sendNotification(
                    subscription.subscribe_data,
                    JSON.stringify(notificationPayload),
                )
                .catch((err) =>
                    console.error("Failed to send notification:", err),
                );
        });

        res.status(200).json({ message: "Notification sent successfully." });
    } else {
        res.status(405).json({ message: "Method not allowed." });
    }
}
