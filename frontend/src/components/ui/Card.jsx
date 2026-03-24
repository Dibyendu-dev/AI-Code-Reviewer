import React from "react";

export function Card({ children, className = "", ...props }) {
  return (
    <div
      className={`
        group
        relative
        overflow-hidden
        rounded-2xl
        border border-white/10
        bg-gradient-to-b from-white/[0.06] to-white/[0.02]
        shadow-[0_0_0_1px_rgba(255,255,255,0.02),0_20px_60px_rgba(0,0,0,0.55)]
        transition
        duration-200
        hover:border-white/15
        hover:shadow-[0_0_0_1px_rgba(255,255,255,0.03),0_24px_80px_rgba(0,0,0,0.65)]
        ${className}
      `}
      {...props}
    >
      <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
        <div className="absolute -inset-24 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.10),transparent_55%)]" />
      </div>
      {children}
    </div>
  );
}

export function CardContent({ children, className = "", ...props }) {
  return (
    <div
      className={`
        p-6
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
}
