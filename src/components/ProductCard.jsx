import { Minus, Plus, Heart } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, updateQuantity } from "../Redux/features/cart/cartSlice";
import { toggleFavorite } from "../Redux/features/favorites/favoritesSlice";

export default function ProductCard({ product, product_segment_id, currency }) {
  const currentLanguage = useSelector((state) => {
    return state.language.currentLanguage;
  });
  const dispatch = useDispatch();
  const cartItem = useSelector((state) =>
    state.cart.items.find((item) => item.id === product.id)
  );
  const quantity = cartItem ? cartItem.quantity : 0;

  const isFavorite = useSelector((state) =>
    state.favorites.items.some((item) => item.id === product.id)
  );

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
          price: parseFloat(
            product.price_excl?.[product_segment_id]
              ? product.price_excl?.[product_segment_id]
              : product.price_excl?._
          ),
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
          price: parseFloat(
            product.price_excl?.[product_segment_id]
              ? product.price_excl?.[product_segment_id]
              : product.price_excl?._
          ),
        })
      );
    } else {
      dispatch(updateQuantity({ id: product.id, quantity: newQuantity }));
    }
  };

  const handleToggleFavorite = () => {
    console.log(product.image)
    dispatch(
      toggleFavorite({
        id: product.id,
        name: product.name,
        size: product.size,
        image: product.image,
        price_excl: product.price_excl,
      })
    );
  };

  return (
    <div className="bg-[#FBFFFC] rounded-lg border border-gray-200 overflow-hidden min-h-80 hover:shadow-lg transition-shadow">
      {/* Product Image */}
      <div className="relative border-b-2 h-72 md:h-60  overflow-hidden flex items-center justify-center">
        <img
          src={product.image}
          // alt={
          //   currentLanguage === "eng" && product.name?.eng?.length > 0
          //     ? product.name?.eng
          //     : currentLanguage === "fr" && product.name?.fra?.length > 0
          //     ? product.name?.fra
          //     : currentLanguage === "nl" && product.name?.nld?.length > 0
          //     ? product.name?.nld
          //     : product.name._
          // }
          className="h-full w-full object-contain"
        />
        {/* Favorite Button */}
        <button
          onClick={handleToggleFavorite}
          className="absolute top-2 right-2 w-8 h-8 bg-white bg-opacity-80 rounded-full flex items-center justify-center hover:bg-opacity-100 transition-opacity"
        >
          <Heart
            className={`w-5 h-5 ${
              isFavorite ? "fill-red-500 text-red-500" : "text-gray-400"
            }`}
          />
        </button>
      </div>

      {/* Product Info */}
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 mb-1  whitespace-normal break-words">
          {currentLanguage === "eng" && product.name?.eng?.length > 0
            ? product.name?.eng
            : currentLanguage === "fr" && product.name?.fra?.length > 0
            ? product.name?.fra
            : currentLanguage === "nl" && product.name?.nld?.length > 0
            ? product.name?.nld
            : product.name._}
          {/* {product.name._} */}
        </h3>
        <span>
          {currency || "€"}{" "}
          {product.price_excl?.[product_segment_id]
            ? product.price_excl?.[product_segment_id]
            : product.price_excl?._}
        </span>
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
