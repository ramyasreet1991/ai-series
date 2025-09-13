import React from "react";
export function Input({ className='', ...props }: any){
  return <input className={`w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-300 ${className}`} {...props} />;
}
