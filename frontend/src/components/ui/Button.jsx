import React from "react";

const variants = {
  primary:
    "bg-white text-black hover:bg-gray-200",
  outline:
    "border border-white text-white hover:bg-white hover:text-black",
  ghost:
    "text-white hover:bg-white/10",
};

const sizes = {
  sm: "px-4 py-2 text-sm",
  md: "px-6 py-3 text-base",
  lg: "px-8 py-4 text-lg",
};

export default function Button({
  children,
  variant = "primary",
  size = "md",
  className = "",
  ...props
}) {
  return (
    <button
      className={`
        ${variants[variant]}
        ${sizes[size]}
        rounded-2xl
        font-medium
        transition
        duration-200
        ease-in-out
        focus:outline-none
        focus:ring-2
        focus:ring-white/50
        ${className}
      `}
      {...props}
    >
      {children}
    </button>
  );
}