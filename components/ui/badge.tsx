"use client";
import React from "react";
export function Badge({ children, variant='default', className='' }: any){
  const variants: any = {
    default: "bg-black text-white",
    outline: "border border-slate-300 text-slate-700",
    secondary: "bg-slate-100 text-slate-900"
  };
  return <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium ${variants[variant]} ${className}`}>{children}</span>;
}
