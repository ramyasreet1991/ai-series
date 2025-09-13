import React from "react";
export function Tabs({ value, onValueChange, className='', children }: any){
  return <div className={className}>{React.Children.map(children, (child: any) => {
    if (child?.type?.displayName === 'TabsList') return React.cloneElement(child, { value, onValueChange });
    if (child?.type?.displayName === 'TabsContent') return React.cloneElement(child, { value });
    return child;
  })}</div>;
}
export function TabsList({ value, onValueChange, children, className='' }: any){
  return <div className={`flex flex-wrap gap-2 ${className}`}>{React.Children.map(children, (child: any) => React.cloneElement(child, { value, onValueChange }))}</div>;
}
TabsList.displayName = 'TabsList';
export function TabsTrigger({ value: tabValue, value: _vIgnored, onValueChange, valueProp, children, className='' }: any){
  return <button onClick={() => onValueChange(tabValue)} className={`px-3 py-1.5 rounded-lg border ${className}`}>{children}</button>;
}
export function TabsContent({ value, value: tabValue, children }: any){
  if (!tabValue || tabValue !== value) return null;
  return <div>{children}</div>;
}
TabsContent.displayName = 'TabsContent';
