import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://qkwwpryhzvlbbaoohbfn.supabase.co";
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey as string);

interface SubscriptionData {
    endpoint: string;
    expirataionTime: string;
    keys: {
        p256dh: string;
        auth: string;
    };
}

export const saveSubscription = async (subscribeData: SubscriptionData) => {
    const { data, error } = await supabase
        .from("subscriptions")
        .insert([
            { endpoint: subscribeData.endpoint, subscribe_data: subscribeData },
        ]);
};

export const deleteSubscription = async (subscribeData: SubscriptionData) => {
    const { data, error } = await supabase
        .from("subscriptions")
        .delete()
        .eq("endpoint", subscribeData.endpoint);
};

export const getSubscriptions = async () => {
    const { data, error } = await supabase
        .from("subscriptions")
        .select("subscribe_data");
    return data;
};
