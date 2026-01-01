"use client";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import {
  updateQuantity,
  removeFromCart,
  clearCart,
} from "../Redux/features/cart/cartSlice";

import { useCheckoutMutation } from "../Redux/services/checkoutApi";

import { ArrowLeft, Trash2, CalendarDays } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format, addDays } from "date-fns";
import Swal from "sweetalert2";
import { useGetProfileQuery } from "@/Redux/services/ordersApi";

export default function OrderPage() {
  const currentLanguage = useSelector((state) => {
    return state.language.currentLanguage;
  });
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const cartItems = useSelector((state) => state.cart.items);

  const totalItems = useSelector((state) => state.cart.totalItems);
  const { data: profile } = useGetProfileQuery();
  console.log("🚀 ~ OrderPage ~ profile:", profile);

  const [checkout, { isLoading, error }] = useCheckoutMutation();

  const currentHour = new Date().getHours();
  const isAfter5PM = currentHour >= 17;

  const minDate = isAfter5PM ? addDays(new Date(), 1) : addDays(new Date(), 0);

  const [deliveryData, setDeliveryData] = useState({
    deliveryDate: "",
    deliveryAddress: `${profile?.street || ""} , ${
      profile?.streetnumber || ""
    }, ${profile?.city || ""} ,${profile?.citycode || ""}`,
    instructions: "",
  });
  useEffect(() => {
    setDeliveryData((prev) => ({
      ...prev,
      deliveryAddress: `${profile?.street || ""} , ${
        profile?.streetnumber || ""
      }, ${profile?.city || ""} ,${profile?.citycode || ""}`,
    }));
  }, [profile]);

  const [date, setDate] = useState(addDays(minDate, 1));

  const [errors, setErrors] = useState({});

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
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleQuantityChange = (id, quantity) => {
    dispatch(updateQuantity({ id, quantity }));
  };

  const handleRemoveItem = (id) => {
    dispatch(removeFromCart(id));
  };

  const handleSubmitOrder = async (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!date) {
      newErrors.deliveryDate = "Please select a delivery date.";
    }

    if (!deliveryData.deliveryAddress.trim()) {
      newErrors.deliveryAddress = "Please enter a delivery address.";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    if (cartItems.length > 0) {
      const body = {
        delivery_date: date ? format(date, "yyyy-MM-dd") : "",
        delivery_address: deliveryData.deliveryAddress,
        extra_instructions: deliveryData.instructions,
        status: "pending",
        items: cartItems.map((item) => ({
          id: item.id,
          quantity: item.quantity,
        })),
      };
      try {
        const result = await checkout(body).unwrap();
        Swal.fire({
          icon: "success",
          title: "Order Placed Successfully!",
          text: "Your order has been submitted.",
          confirmButtonText: "OK",
        }).then(() => {
          dispatch(clearCart());
          navigate("/");
        });
      } catch (err) {
        Swal.fire({
          icon: "error",
          title: "Order Failed",
          text:
            err.data?.message ||
            err.message ||
            "An error occurred while placing the order.",
          confirmButtonText: "OK",
        });
      }
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
        <span>{t("common.back")}</span>
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Summary */}
        <div className="lg:col-span-1">
          <div className="border border-gray-200 rounded-lg p-4 bg-[#F9F9F9] ">
            <h2 className="text-xl font-bold mb-6">
              {t("orderPage.cartSummary")}
            </h2>
            <div className=" border rounded bg-white border-gray-200">
              {cartItems.length === 0 ? (
                <p className="p-4 text-center text-gray-500">
                  {t("orderPage.yourCartIsEmpty")}
                </p>
              ) : (
                cartItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex gap-4 mb-4 pb-4 p-4 border-b last:border-0 items-center"
                  >
                    <img
                      src={item.image}
                      alt={
                        currentLanguage === "eng" && item.name?.eng?.length > 0
                          ? item.name?.eng
                          : currentLanguage === "fr" &&
                            item.name?.fra?.length > 0
                          ? item.name?.fra
                          : currentLanguage === "nl" &&
                            item.name?.nld?.length > 0
                          ? item.name?.nld
                          : item.name._
                      }
                      className="w-16 h-16 object-cover bg-gray-50 m-2 rounded "
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold text-sm mb-1">
                        {currentLanguage === "eng" && item.name?.eng?.length > 0
                          ? item.name?.eng
                          : currentLanguage === "fr" &&
                            item.name?.fra?.length > 0
                          ? item.name?.fra
                          : currentLanguage === "nl" &&
                            item.name?.nld?.length > 0
                          ? item.name?.nld
                          : item.name._}
                      </h3>
                      <span>
                        {profile?.currency?.sign || "€"}
                        {item.price}
                      </span>
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
                        <div className="text-right">
                          <p className="text-sm font-medium">
                            {profile?.currency?.sign || "€"}{" "}
                            {(item.price * item.quantity).toFixed(2)}
                          </p>
                          <button
                            onClick={() => handleRemoveItem(item.id)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-700 font-medium">
                  {t("orderPage.totalItems")}
                </span>
                <span className="font-bold">{totalItems}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-700 font-medium">Total Amount</span>
                <span className="font-bold">
                  {profile?.currency?.sign || "€"}{" "}
                  {cartItems
                    .reduce((sum, item) => sum + item.price * item.quantity, 0)
                    .toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Delivery Details */}
        <div className="lg:col-span-2 bg-[#F9F9F9] p-6 rounded-lg border border-gray-200">
          <h2 className="text-xl font-bold mb-6">
            {t("orderPage.deliveryDetails")}
          </h2>
          <form onSubmit={handleSubmitOrder} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                {t("orderPage.deliveryDate")}
              </label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={`w-full justify-start text-left font-normal ${
                      errors.deliveryDate ? "border-red-500" : ""
                    }`}
                  >
                    <CalendarDays className="mr-2 h-4 w-4" />
                    {date ? (
                      format(date, "MM/dd/yyyy")
                    ) : (
                      <span>{t("orderPage.pickADate")}</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto h-48 p-0" align="start">
                  <div className="relative">
                    {/* {!isBetween3and5 && (
                      <div className="flex justify-center items-center mr-auto w-full h-full bg-white/20 rounded-2xl shadow-[0_4px_30px_rgba(0,0,0,0.1)] backdrop-blur-[5px] border border-white/30 p-6  m-auto  absolute top-0 left-0 z-10">
                        {t("orderPage.ordersAfter5PM")}
                      </div>
                    )} */}
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      disabled={(date) => date < minDate}
                      className={"focus-visible:ring-primary border-primary"}
                      initialFocus
                    />
                  </div>
                </PopoverContent>
              </Popover>
              {errors.deliveryDate && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.deliveryDate}
                </p>
              )}
              <p className="text-xs text-gray-600 mt-2">
                {t("orderPage.ordersAfter5PM")}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                {t("orderPage.deliveryAddress")}
              </label>
              <textarea
                name="deliveryAddress"
                value={deliveryData.deliveryAddress}
                onChange={handleChange}
                className={`w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-opacity-10 min-h-24 resize-none ${
                  errors.deliveryAddress
                    ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:border-primary focus:ring-primary"
                }`}
              />
              {errors.deliveryAddress && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.deliveryAddress}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                {t("orderPage.additionalInstructions")}
              </label>
              <textarea
                name="instructions"
                value={deliveryData.instructions}
                onChange={handleChange}
                placeholder={t("orderPage.instructionsPlaceholder")}
                className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary focus:ring-opacity-10 min-h-32 resize-none"
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-primary hover:bg-green-400 text-white py-3 font-medium"
              disabled={isLoading}
            >
              {isLoading ? "Placing Order..." : t("orderPage.submitOrder")}
            </Button>
          </form>
        </div>
      </div>
    </main>
  );
}
