import React, { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";
import { NumberInput, NumberInputProps } from "./NumberInput";

export type StatusValueProps = {
    title: string
}

export const StatusValue: React.FunctionComponent<StatusValueProps & NumberInputProps & HTMLAttributes<HTMLDivElement>> = ({ title, className, ...props}) => {
    return <div className={cn("flex flex-col items-stretch justify-stretch", className)}>
        <div className="text-ellipsis overflow-hidden">{title}</div>
        <NumberInput {...props}/>
    </div>
}