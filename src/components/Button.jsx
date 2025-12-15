const Button = ({ active, className, children, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`flex-1 border border-white  py-2 px-4 rounded-full transition-colors ${
        (className, active ? "bg-orange-500" : "bg-white text-black")
      }`}
    >
      {children}
    </button>
  );
};
export default Button;
