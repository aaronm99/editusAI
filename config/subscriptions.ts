import { SubscriptionPlan } from "types"
import { env } from "@/env.mjs"

export const freePlan: SubscriptionPlan = {
  name: "Free",
  description:
    "The free plan is limited to 3 videos. Upgrade to the PRO plan for unlimited videos.",
  stripePriceId: "",
}

export const proPlan: SubscriptionPlan = {
  name: "PRO",
  description: "The PRO plan has unlimited videos.",
  stripePriceId: env.STRIPE_PRO_MONTHLY_PLAN_ID || "",
}
