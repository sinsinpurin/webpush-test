// pages/notifications.tsx
import { useState, useEffect } from "react";

const publicVapidKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY as string;

async function subscribeUser() {
    const registration = await navigator.serviceWorker.ready;
    const existingSubscription =
        await registration.pushManager.getSubscription();

    if (existingSubscription) {
        console.log("Already subscribed");
        return;
    }

    const subscribeOptions = {
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(publicVapidKey),
    };

    const subscription = await registration.pushManager.subscribe(
        subscribeOptions,
    );
    console.log("User is subscribed.");

    const response = await fetch("/api/subscribe", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(subscription),
    });

    if (!response.ok) {
        throw new Error("Failed to subscribe the user.");
    }
}

async function unsubscribeUser() {
    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.getSubscription();

    if (!subscription) {
        console.log("User is not subscribed.");
        return;
    }

    await subscription.unsubscribe();

    const response = await fetch("/api/unsubscribe", {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(subscription),
    });

    if (!response.ok) {
        throw new Error("Failed to unsubscribe the user.");
    }
    console.log("User is unsubscribed.");
}

function urlBase64ToUint8Array(base64String: string) {
    const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding)
        .replace(/-/g, "+")
        .replace(/_/g, "/");
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}

export default function Notifications() {
    const [isSubscribed, setIsSubscribed] = useState(false);

    useEffect(() => {
        if ("serviceWorker" in navigator) {
            const checkSubscription = async () => {
                const registration = await navigator.serviceWorker.ready;
                const subscription =
                    await registration.pushManager.getSubscription();
                setIsSubscribed(!!subscription);
            };
            checkSubscription();
        }
    }, []);

    const handleClick = async () => {
        if (isSubscribed) {
            await unsubscribeUser();
        } else {
            await subscribeUser();
        }
        setIsSubscribed(!isSubscribed);
    };

    const handleSendNotificationClick = async () => {
        const response = await fetch("/api/sendNotification", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (response.ok) {
            console.log("Notification sent successfully");
        } else {
            console.error("Failed to send notification");
        }
    };

    return (
        <div>
            <h1>Push Notifications</h1>
            <button onClick={handleClick}>
                {isSubscribed ? "Unsubscribe" : "Subscribe"}
            </button>
            <button onClick={handleSendNotificationClick}>
                Send notification
            </button>
        </div>
    );
}
