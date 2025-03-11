"use client";

import { useEffect, useState } from "react";

// Declare Razorpay on the window object
declare global {
  interface Window {
    Razorpay: any;
  }
}
import { useRouter } from "next/navigation";
import Image from "next/image";

interface Params {
  id: string;
}

export default function BookTicket({ params }: { params: Params }) {
  const [orderId, setOrderId] = useState(null);
  const [loading, setLoading] = useState(true);
  interface EventDetails {
    title: string;
    coverImage: string;
    date: string;
    time?: string;
    venue?: string;
  }

  const [eventDetails, setEventDetails] = useState<EventDetails | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedTicketType, setSelectedTicketType] = useState<keyof typeof ticketTypes>("regular");
  const router = useRouter();

  const ticketTypes = {
    regular: { price: 500, name: "Regular", description: "Standard admission" },
    vip: { price: 1200, name: "VIP", description: "Priority seating + Welcome drink" },
    premium: { price: 2000, name: "Premium", description: "Front row + Welcome drink + Meet & Greet" }
  };

  // Calculate total price based on quantity and ticket type
  const calculateTotal = () => {
    return ticketTypes[selectedTicketType].price * quantity;
  };

  // Calculate final amount with taxes and fees
  const calculateFinalAmount = () => {
    const subtotal = calculateTotal();
    const platformFee = 49;
    const gst = Math.round((subtotal + platformFee) * 0.18);
    return subtotal + platformFee + gst;
  };

  useEffect(() => {
    // Fetch event details
    async function fetchEventDetails() {
      try {
        const res = await fetch(`/api/events/${params.id}`);
        const data = await res.json();
        setEventDetails(data);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch event details:", error);
        setLoading(false);
      }
    }

    fetchEventDetails();
  }, [params.id]);

  useEffect(() => {
    // Create order when ticket type or quantity changes
    async function createOrder() {
      if (!eventDetails) return;
      
      setLoading(true);
      try {
        const res = await fetch("/api/payment", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            eventId: params.id,
            amount: calculateTotal(),
            ticketType: selectedTicketType,
            quantity: quantity
          }),
        });
        
        const data = await res.json();
        setOrderId(data.orderId);
        setLoading(false);
      } catch (error) {
        console.error("Failed to create order:", error);
        setLoading(false);
      }
    }
    
    if (eventDetails) {
      createOrder();
    }
  }, [params.id, selectedTicketType, quantity, eventDetails]);

  const handlePayment = async () => {
    if (!orderId) return alert("Failed to create order. Please try again.");

    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      amount: calculateFinalAmount() * 100,
      currency: "INR",
      name: eventDetails?.title || "Event Ticket",
      description: `${ticketTypes[selectedTicketType].name} Ticket for ${eventDetails?.title || "the event"}`,
      order_id: orderId,
      prefill: {
        name: "",
        email: "",
        contact: ""
      },
      theme: {
        color: "#3B82F6",
      },
      modal: {
        ondismiss: function() {
          console.log("Payment dismissed");
        }
      },
      handler: async function (response: any) {
        setLoading(true);
        try {
          const verifyRes = await fetch("/api/payment/verify", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              orderId: orderId,
              paymentId: response.razorpay_payment_id,
              signature: response.razorpay_signature,
              ticketType: selectedTicketType,
              quantity: quantity,
              eventId: params.id
            }),
          });

          const verifyData = await verifyRes.json();
          if (verifyData.success) {
            router.push(`/events/${params.id}/confirm?ticketId=${verifyData.ticketId}`);
          } else {
            alert("Payment verification failed. Please contact support.");
          }
        } catch (error) {
          console.error("Payment verification error:", error);
          alert("An error occurred during payment verification");
        } finally {
          setLoading(false);
        }
      },
    };

    const razorpay = new window.Razorpay(options);
    razorpay.open();
  };

  if (loading && !eventDetails) {
    return (
      <div className="min-h-screen flex items-center justify-center dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600 dark:border-blue-400"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6 pb-16 dark:bg-gray-900 dark:text-gray-100 my-8 rounded-3xl">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden mb-8 transition-colors">
        {/* Event Header */}
        {eventDetails?.coverImage && (
          <div className="relative h-80 w-full">
            <Image
              src={eventDetails.coverImage}
              alt={eventDetails.title}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
            <div className="absolute bottom-0 left-0 p-6">
              <h1 className="text-3xl font-bold text-white">{eventDetails.title}</h1>
              <p className="text-white/90 flex items-center mt-2">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                </svg>
                {new Date(eventDetails.date).toLocaleDateString('en-US', {
                  weekday: 'long',
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric'
                })}
                {eventDetails.time && ` • ${eventDetails.time}`}
              </p>
              {eventDetails.venue && (
                <p className="text-white/90 flex items-center mt-1">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                  </svg>
                  {eventDetails.venue}
                </p>
              )}
            </div>
          </div>
        )}

        {/* Ticket Selection */}
        <div className="p-6 transition-colors">
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4 dark:text-gray-100 flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"></path>
              </svg>
              Select Ticket Type
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {Object.entries(ticketTypes).map(([type, details]) => (
                <div 
                  key={type}
                  onClick={() => setSelectedTicketType(type as keyof typeof ticketTypes)}
                  className={`border rounded-lg p-4 cursor-pointer transition-all duration-200 ${
                    selectedTicketType === type 
                      ? 'border-blue-600 bg-blue-50 dark:border-blue-500 dark:bg-blue-900/30' 
                      : 'border-gray-200 hover:border-gray-300 dark:border-gray-700 dark:hover:border-gray-600'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <h3 className="font-medium dark:text-gray-100">{details.name}</h3>
                    <div className={`h-5 w-5 rounded-full border flex items-center justify-center ${
                      selectedTicketType === type 
                        ? 'border-blue-600 bg-blue-600 dark:border-blue-500 dark:bg-blue-500' 
                        : 'border-gray-300 dark:border-gray-600'
                    }`}>
                      {selectedTicketType === type && (
                        <div className="h-2 w-2 rounded-full bg-white"></div>
                      )}
                    </div>
                  </div>
                  <p className="text-xl font-bold mt-2 dark:text-gray-100">₹{details.price.toLocaleString()}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{details.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Quantity Selector */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4 dark:text-gray-100 flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
              </svg>
              Quantity
            </h2>
            <div className="flex items-center">
              <button 
                onClick={() => quantity > 1 && setQuantity(quantity - 1)}
                className="h-10 w-10 rounded-l-md bg-gray-100 dark:bg-gray-700 flex items-center justify-center border border-gray-300 dark:border-gray-600 transition-colors"
                disabled={quantity <= 1}
              >
                <span className="text-xl">-</span>
              </button>
              <div className="h-10 w-16 border-t border-b border-gray-300 dark:border-gray-600 flex items-center justify-center transition-colors">
                {quantity}
              </div>
              <button 
                onClick={() => quantity < 10 && setQuantity(quantity + 1)}
                className="h-10 w-10 rounded-r-md bg-gray-100 dark:bg-gray-700 flex items-center justify-center border border-gray-300 dark:border-gray-600 transition-colors"
                disabled={quantity >= 10}
              >
                <span className="text-xl">+</span>
              </button>
              <div className="ml-4 flex items-center text-gray-600 dark:text-gray-400">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                Maximum 10 tickets per transaction
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="bg-gray-50 dark:bg-gray-700/50 p-5 rounded-lg mb-6 transition-colors">
            <h2 className="text-xl font-semibold mb-4 dark:text-gray-100 flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
              </svg>
              Order Summary
            </h2>
            <div className="space-y-3">
              <div className="flex justify-between mb-1">
                <span className="dark:text-gray-300">{ticketTypes[selectedTicketType].name} Ticket × {quantity}</span>
                <span className="font-medium dark:text-gray-200">₹{(ticketTypes[selectedTicketType].price * quantity).toLocaleString()}</span>
              </div>
              <div className="flex justify-between mb-1">
                <span className="dark:text-gray-300">Platform Fee</span>
                <span className="font-medium dark:text-gray-200">₹49</span>
              </div>
              <div className="flex justify-between mb-1">
                <span className="dark:text-gray-300">GST (18%)</span>
                <span className="font-medium dark:text-gray-200">₹{Math.round((ticketTypes[selectedTicketType].price * quantity + 49) * 0.18).toLocaleString()}</span>
              </div>
              <div className="border-t border-gray-300 dark:border-gray-600 my-3"></div>
              <div className="flex justify-between font-bold text-lg dark:text-white">
                <span>Total</span>
                <span>₹{calculateFinalAmount().toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
        <button 
          onClick={() => router.back()}
          className="w-full md:w-auto px-6 py-3 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors flex items-center justify-center"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
          </svg>
          Go Back
        </button>
        <button 
          onClick={handlePayment} 
          disabled={loading || !orderId}
          className="w-full md:w-auto bg-blue-600 dark:bg-blue-500 text-white px-8 py-3 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors flex items-center justify-center disabled:bg-blue-400 dark:disabled:bg-blue-400 disabled:cursor-not-allowed shadow-md"
        >
          {loading ? (
            <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></div>
          ) : (
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"></path>
            </svg>
          )}
          Pay ₹{calculateFinalAmount().toLocaleString()}
        </button>
      </div>

      {/* Additional Information */}
      <div className="mt-8 text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
        <h3 className="font-semibold mb-3 dark:text-gray-300 flex items-center">
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          Important Information:
        </h3>
        <ul className="list-disc pl-5 space-y-2">
          <li>Tickets are non-refundable once purchased</li>
          <li>Please arrive 30 minutes before the event starts</li>
          <li>Ticket confirmation will be sent to your email</li>
          <li>For any queries, contact support@eventname.com</li>
        </ul>
      </div>
    </div>
  );
}