"use client";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  updateQuantity,
  removeFromCart,
  clearCart,
} from "../Redux/features/cart/cartSlice";
import {
  placeOrder,
  clearCurrentOrder,
} from "../Redux/features/orders/ordersSlice";

import { ArrowLeft, Trash2, CalendarDays } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";

export default function OrderPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.items);
  const totalItems = useSelector((state) => state.cart.totalItems);

  const currentHour = new Date().getHours();
  const isBetween3and5 = currentHour >= 15 && currentHour < 17;

  const [deliveryData, setDeliveryData] = useState({
    deliveryDate: "",
    deliveryAddress: "Din Ena City\nCity Mall 1221\n5154 Road",
    instructions: "",
  });

  const [date, setDate] = useState();

  useEffect(() => {
    if (date) {
      setDeliveryData((prev) => ({
        ...prev,
        deliveryDate: format(date, "MM/dd/yyyy"),
      }));
    }
  }, [date]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDeliveryData((prev) => ({ ...prev, [name]: value }));
  };

  const handleQuantityChange = (id, quantity) => {
    dispatch(updateQuantity({ id, quantity }));
  };

  const handleRemoveItem = (id) => {
    dispatch(removeFromCart(id));
  };

  const handleSubmitOrder = (e) => {
    e.preventDefault();
    if (cartItems.length > 0) {
      dispatch(placeOrder({ cartItems, deliveryData }));
      dispatch(clearCart());
      navigate("/"); // Or navigate to order confirmation page
    }
  };

  return (
    <main className="max-w-7xl mx-auto px-4 py-8">
      {/* Back Button */}
      <button
        onClick={() => navigate("/")}
        className="flex items-center gap-2 text-gray-700 mb-8 hover:text-gray-900"
      >
        <ArrowLeft className="w-5 h-5" />
        <span>Back</span>
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Summary */}
        <div className="lg:col-span-1">
          <div className="border border-gray-200 rounded-lg p-4 bg-[#F9F9F9] ">
            <h2 className="text-xl font-bold mb-6">Cart Summary</h2>
            <div className=" border rounded bg-white border-gray-200">
              {cartItems.length === 0 ? (
                <p className="p-4 text-center text-gray-500">
                  Your cart is empty
                </p>
              ) : (
                cartItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex gap-4 mb-4 pb-4 p-4 border-b last:border-0 items-center"
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 object-cover bg-gray-50 m-2 rounded "
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold text-sm mb-1">
                        {item.name}
                      </h3>
                      <p className="text-xs text-gray-600 mb-3">{item.size}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() =>
                              handleQuantityChange(item.id, item.quantity - 1)
                            }
                            className="px-2 py-1 text-gray-500 border rounded hover:text-gray-700"
                          >
                            −
                          </button>
                          <span className="border border-primary px-3 py-1 text-sm rounded text-primary font-medium">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              handleQuantityChange(item.id, item.quantity + 1)
                            }
                            className="px-2 py-1 text-gray-500 hover:text-gray-700 border rounded"
                          >
                            +
                          </button>
                        </div>
                        <button
                          onClick={() => handleRemoveItem(item.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex justify-between items-center">
                <span className="text-gray-700 font-medium">Total items:</span>
                <span className="font-bold">{totalItems}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Delivery Details */}
        <div className="lg:col-span-2 bg-[#F9F9F9] p-6 rounded-lg border border-gray-200">
          <h2 className="text-xl font-bold mb-6">Delivery Details</h2>
          <form onSubmit={handleSubmitOrder} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Delivery Date
              </label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    <CalendarDays className="mr-2 h-4 w-4" />
                    {date ? (
                      format(date, "MM/dd/yyyy")
                    ) : (
                      <span>Pick a date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto h-48 p-0" align="start">
                  <div className="relative">
                    {!isBetween3and5 && (
                      <div className="flex justify-center items-center mr-auto w-full h-full bg-white/20 rounded-2xl shadow-[0_4px_30px_rgba(0,0,0,0.1)] backdrop-blur-[5px] border border-white/30 p-6  m-auto  absolute top-0 left-0 z-10">
                        Orders after 5 PM cannot be delivered the next day
                      </div>
                    )}
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      className={"focus-visible:ring-primary border-primary"}
                      initialFocus
                    />
                  </div>
                </PopoverContent>
              </Popover>
              <p className="text-xs text-gray-600 mt-2">
                Orders after 5 PM cannot be delivered the next day
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Delivery Address
              </label>
              <textarea
                name="deliveryAddress"
                value={deliveryData.deliveryAddress}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary focus:ring-opacity-10 min-h-24 resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Additional Instructions
              </label>
              <textarea
                name="instructions"
                value={deliveryData.instructions}
                onChange={handleChange}
                placeholder="eg.,Din Ena City, gate code 1504"
                className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary focus:ring-opacity-10 min-h-32 resize-none"
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-primary hover:bg-green-400 text-white py-3 font-medium"
            >
              Submit Order
            </Button>
          </form>
        </div>
      </div>
    </main>
  );
}
