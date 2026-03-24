import React from "react";

const variants = {
  default: "bg-gray-800 text-white",
  secondary: "bg-gray-700 text-gray-200",
  outline: "border border-gray-600 text-gray-300",
};

export function Badge({
  children,
  variant = "default",
  className = "",
  ...props
}) {
  return (
    <span
      className={`
        inline-flex
        items-center
        px-2.5
        py-0.5
        rounded-full
        text-xs
        font-medium
        ${variants[variant]}
        ${className}
      `}
      {...props}
    >
      {children}
    </span>
  );
}
