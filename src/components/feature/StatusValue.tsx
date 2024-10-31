import React, { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";
import { Label } from "@radix-ui/react-label";
import { Button } from "../ui/button";
import { ChevronDownIcon, ChevronUpIcon } from "@radix-ui/react-icons";
import { getCostStep } from "@/lib/cost";

export type StatusValueProps = {
    value: number,
    remainingTokens: number,
    min?: number | undefined,
    max?: number | undefined,
    onValueChanged?: (number: number) => void,
}

export const StatusValue: React.FunctionComponent<StatusValueProps & HTMLAttributes<HTMLDivElement>> = ({ className, remainingTokens, min = -2, max = 5, value, onValueChanged = () => { } }) => {
    const changeValue = (nextValue: number) => {
        if(nextValue > value) {
            const cost = getCostStep(nextValue)
            if(cost > remainingTokens)
                return
        }        
        const valueToSet = Math.min(max || Number.MAX_VALUE, Math.max(min || Number.MIN_VALUE, nextValue))
        onValueChanged(valueToSet)
    }

    return <div className={cn("flex flex-row items-center justify-stretch flex rounded-md border border-neutral-200 bg-transparent transition-all", className)}>
        <Label className="grow">{value}</Label>
        <div className="flex flex-col items-stretch justify-center">
            <Button variant="naked" onClick={() => changeValue(value + 1)}><ChevronUpIcon /></Button>
            <Button variant="naked" onClick={() => changeValue(value - 1)}><ChevronDownIcon /></Button>
        </div>
    </div>
}