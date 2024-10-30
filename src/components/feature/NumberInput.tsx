import { HTMLAttributes } from "react"
import { Textarea } from "../ui/textarea"
import { cn } from "@/lib/utils"
import { InputProps } from "../ui/input"

const re = /[0-9]*/

export type NumberInputProps = {
    value: number,
    onValueChanged?: (number: number) => void,
    showButtons?: boolean,
}

export const NumberInput: React.FunctionComponent<InputProps & NumberInputProps & HTMLAttributes<HTMLInputElement>> = ({ value, onValueChanged = () => {}, className , showButtons = true}) => {
    const changeValue = (nextValue: string) => {
        const isNumeric = re.test(nextValue)
        if (!isNumeric)
            return

        const parsed = Number.parseInt(nextValue)
        const valueToSet = nextValue === "" ? 0 : Math.min(5, Math.max(-2, parsed))
        onValueChanged(valueToSet)
    }

    return <div className={cn("flex flex-row items-stretch justify-stretch", className)}>
        <Textarea placeholder="Hier eingeben..." value={value} onChange={(e) => changeValue(e.target.value)} style={{resize: "none"}}/>
        {showButtons && 
        <div className="flex flex-col items-stretch justify-center">
            <div className="cursor-pointer p-1" onClick={() => changeValue(`${value + 1}`)}>+</div>
            <div className="cursor-pointer p-1" onClick={() => changeValue(`${value - 1}`)}>-</div>
        </div>}
    </div>
}