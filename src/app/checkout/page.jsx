import CheckoutForm from "@/components/store/CheckoutForm";

export const metadata = {
  title: "Checkout | AVRONE",
  description: "Complete your AVRONE order with our local cash-on-delivery demo checkout.",
};

export default function CheckoutPage() {
  return <div className="min-h-[65vh] bg-[#F8F7F4]"><CheckoutForm /></div>;
}
