import React from "react";
export function Button({ children, variant='default', size='md', className='', ...props }: any){
  const base = "inline-flex items-center justify-center rounded-xl font-medium transition";
  const sizes: any = { sm: "px-3 py-1.5 text-sm", md: "px-4 py-2", lg: "px-5 py-2.5 text-base" };
  const variants: any = {
    default: "bg-black text-white hover:opacity-90",
    outline: "border border-slate-300 bg-white hover:bg-slate-50",
    secondary: "bg-slate-100 hover:bg-slate-200"
  };
  return <button className={`${base} ${sizes[size]} ${variants[variant]} ${className}`} {...props}>{children}</button>;
}
