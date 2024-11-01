import { FunctionComponent, HTMLAttributes, PropsWithChildren } from "react";
import { Popover, PopoverAnchor, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Label } from "../ui/label";
import { InfoCircledIcon } from "@radix-ui/react-icons";
import { cn } from "@/lib/utils";

export type FormElementProps = {
    title: string,
    infoText?: string,
    required?: boolean,
}

export const FormElement: FunctionComponent<PropsWithChildren & FormElementProps & HTMLAttributes<HTMLDivElement>> = ({ title, required, infoText = undefined, children, className }) => {
    return <Popover>
        <div className={cn("flex flex-col", className)}>
            <Label className="inline-flex gap-2 justify-center">{required && "* "} {title} {infoText && <PopoverTrigger asChild><InfoCircledIcon /></PopoverTrigger>}</Label>
            <PopoverAnchor>
                {children}
            </PopoverAnchor>
            <PopoverContent>
                {infoText}
            </PopoverContent>
        </div>
    </Popover>
}