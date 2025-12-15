import { Minus, Plus } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, updateQuantity } from "../Redux/features/cart/cartSlice";

export default function ProductCard({ product }) {
  const dispatch = useDispatch();
  const cartItem = useSelector((state) =>
    state.cart.items.find((item) => item.id === product.id)
  );
  const quantity = cartItem ? cartItem.quantity : 0;

  const handleDecrease = () => {
    if (quantity > 0) {
      dispatch(updateQuantity({ id: product.id, quantity: quantity - 1 }));
    }
  };

  const handleIncrease = () => {
    if (quantity === 0) {
      dispatch(
        addToCart({
          id: product.id,
          name: product.name,
          size: product.size,
          image: product.image,
          quantity: 1,
        })
      );
    } else {
      dispatch(updateQuantity({ id: product.id, quantity: quantity + 1 }));
    }
  };

  const handleQuantityChange = (e) => {
    const newQuantity = Number.parseInt(e.target.value) || 0;
    if (newQuantity > 0 && !cartItem) {
      
      dispatch(
        addToCart({
          id: product.id,
          name: product.name,
          size: product.size,
          image: product.image,
          quantity: newQuantity,
        })
      );
    } else {
      dispatch(updateQuantity({ id: product.id, quantity: newQuantity }));
    }
  };

  return (
    <div className="bg-[#FBFFFC] rounded-lg border border-gray-200 overflow-hidden min-h-80 hover:shadow-lg transition-shadow">
      {/* Product Image */}
      <div className="relative border-b-2 h-72 md:h-60  overflow-hidden flex items-center justify-center">
        <img
          src={product.image}
          alt={product.name}
          className="h-full w-full object-contain"
        />
      </div>

      {/* Product Info */}
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 mb-1">{product.name}</h3>
        <p className="text-sm text-gray-600 mb-4">{product.size}</p>

        {/* Quantity Selector */}
        <div className="flex items-center justify-start gap-2">
          <button
            onClick={handleDecrease}
            className="w-8 h-8 rounded border border-gray-200 text-black hover:bg-green-50 flex items-center justify-center"
          >
            <Minus className="w-4 h-4" />
          </button>
          <input
            type="number"
            value={quantity}
            onChange={handleQuantityChange}
            className={`w-12 h-8 text-center border ${
              quantity && "border-green-500"
            }  rounded`}
            min="0"
          />
          <button
            onClick={handleIncrease}
            className="w-8 h-8 rounded border border-gray-200 text-black hover:bg-green-50 flex items-center justify-center"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
