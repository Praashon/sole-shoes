"use client";

import { useState } from "react";
import { PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface StripePaymentFormProps {
    total: number;
    onSuccess: (paymentIntentId: string) => Promise<void>;
}

export function StripePaymentForm({ total, onSuccess }: StripePaymentFormProps) {
    const stripe = useStripe();
    const elements = useElements();
    const [message, setMessage] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!stripe || !elements) {
            return;
        }

        setIsLoading(true);

        const { error, paymentIntent } = await stripe.confirmPayment({
            elements,
            confirmParams: {
                // Return URL not used for PaymentElement handling internally usually 
                // but required by Stripe. We will handle redirect manually after success if needed 
                // or let Stripe redirect.
                return_url: `${window.location.origin}/checkout/success`,
            },
            redirect: "if_required",
        });

        if (error) {
            setMessage(error.message || "An unexpected error occurred.");
            setIsLoading(false);
        } else if (paymentIntent && paymentIntent.status === "succeeded") {
            await onSuccess(paymentIntent.id);
            // onSuccess handles navigation
        } else {
             setMessage("Payment status: " + (paymentIntent?.status || "unknown"));
             setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
             <div className="p-4 bg-white/50 dark:bg-black/20 rounded-xl border border-border">
                <PaymentElement id="payment-element" options={{ layout: "tabs" }} />
             </div>
             
             {message && <div className="text-red-500 text-sm">{message}</div>}

            <Button 
                disabled={isLoading || !stripe || !elements} 
                className="w-full mt-8 h-12 rounded-full font-semibold text-base"
            >
                {isLoading ? <Loader2 className="animate-spin mr-2" /> : `Pay $${total}`}
            </Button>
            
            <p className="text-center text-xs text-muted-foreground mt-4">
                Payments are secure and encrypted.
            </p>
        </form>
    );
}
