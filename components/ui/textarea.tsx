"use client";
import React from "react";
export function Textarea({ className='', ...props }: any){
  return <textarea className={`w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-300 ${className}`} {...props} />;
}
