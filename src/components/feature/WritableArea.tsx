import React, { HTMLAttributes } from "react";
import { Textarea } from "../ui/textarea";
import { cn } from "@/lib/utils";

export type WritableAreaProps = {
    title: string,
    value: string,
}

export const WritableArea: React.FunctionComponent<WritableAreaProps & HTMLAttributes<HTMLTextAreaElement>> = ({ title, value, className, ...props }) => {
    return <div className={cn("flex flex-col justify-start", className)}>
        {title}
        <Textarea
            value={value}
            className="grow "
            placeholder={"Hier eingeben..."}
            style={{ resize: 'none' }}
            {...props} />
    </div>
}