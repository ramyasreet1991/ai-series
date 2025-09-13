import React from "react";
export function Card({ className = "", children }: any){ return <div className={`rounded-2xl border border-slate-200 bg-white ${className}`}>{children}</div>; }
export function CardHeader({ children }: any){ return <div className="p-4 border-b border-slate-100">{children}</div>; }
export function CardTitle({ className="", children }: any){ return <h3 className={`font-semibold ${className}`}>{children}</h3>; }
export function CardDescription({ className="", children }: any){ return <p className={`text-sm text-slate-600 ${className}`}>{children}</p>; }
export function CardContent({ children, className="" }: any){ return <div className={`p-4 ${className}`}>{children}</div>; }
