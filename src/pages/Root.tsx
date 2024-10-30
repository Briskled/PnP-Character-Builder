import { NumberInput } from "@/components/feature/NumberInput"
import { StatusValue } from "@/components/feature/StatusValue"
import { WritableArea } from "@/components/feature/WritableArea"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { DownloadIcon, ResetIcon } from "@radix-ui/react-icons"
import { Label } from "@radix-ui/react-label"
import { useEffect, useRef, useState } from "react"
import generatePDF, { Margin, Options, Resolution } from "react-to-pdf"

const LOCAL_STORAGE_KEY = "char_builder_state"

const pdfOptions: Options = {
    method: 'open',
    resolution: Resolution.HIGH,
    page: {
        margin: Margin.SMALL
    }
}

type Stats = {
    strength: number,
    agility: number,
    spirit: number,
    wisdom: number,
    name: string,
    age: number,
    size: number,
    job: string,
    story: string,
    bad: string,
    phobia: string,
}

const defaultState: Stats = {
    strength: -2,
    agility: -2,
    spirit: -2,
    wisdom: -2,
    name: "",
    age: 0,
    size: 0,
    job: "",
    story: "",
    bad: "",
    phobia: "",
}

export const Root: React.FunctionComponent = () => {
    const [state, setState] = useState<Stats>(defaultState)
    const [isInitialized, setIsInitialized] = useState(false)
    const targetRef = useRef<HTMLDivElement>(null)


    useEffect(() => {
        if (isInitialized)
            return;
        const existingState = localStorage.getItem(LOCAL_STORAGE_KEY)
        if (!existingState) return

        console.log("Storage!!!", existingState)
        setState({
            ...state,
            ...JSON.parse(existingState)
        })
        setIsInitialized(true)
    }, [])

    useEffect(() => {
        if (!isInitialized)
            return
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(state))
    }, [state])

    const resetState = () => {
        setState(defaultState)
    }

    return (
        <>
            <div className="container grid grid-cols-9 gap-4 p-4">
                <div className="col-span-9">Charakterbogen</div>
                <Textarea className="col-span-4" placeholder="Name" value={state.name} onInput={(e) => setState({ ...state, name: e.currentTarget.value })} rows={1} />
                <NumberInput placeholder="Alter" value={state.age} onValueChanged={(value) => setState({ ...state, age: value })} showButtons={false} />
                <NumberInput placeholder="Größe" value={state.size} onValueChanged={(value) => setState({ ...state, size: value })} showButtons={false} />
                <Textarea className="col-span-3" placeholder="Beruf" value={state.job} onInput={(e) => setState({ ...state, job: e.currentTarget.value })} rows={1} />
                <div className="flex flex-col gap-4 row-span-4">
                    <StatusValue value={state.strength} onValueChanged={(next) => setState({ ...state, strength: next })} className="row-start-4" title="Stärke" />
                    <StatusValue value={state.agility} onValueChanged={(next) => setState({ ...state, agility: next })} className="row-start-5" title="Geschicklichkeit" />
                    <StatusValue value={state.spirit} onValueChanged={(next) => setState({ ...state, spirit: next })} className="row-start-6" title="Übernatürlicher Sinn" />
                    <StatusValue value={state.wisdom} onValueChanged={(next) => setState({ ...state, wisdom: next })} className="row-start-7" title="Geisteskraft" />

                </div>
                <WritableArea className="col-span-8 row-span-1" title="Phobie(n)" value={state.phobia} onInput={(e) => setState({ ...state, phobia: e.currentTarget.value })} />
                <WritableArea className="col-span-4 row-span-3" title="Hintergrundgeschichte" value={state.story} onInput={(e) => setState({ ...state, story: e.currentTarget.value })} />
                <WritableArea className="col-span-4 row-span-3" title="Laster" value={state.bad} onInput={(e) => setState({ ...state, bad: e.currentTarget.value })} />
            </div>
            <div className="flex flex-row gap-2 justify-center mt-5">
                <Button onClick={() => generatePDF(targetRef, { ...pdfOptions, filename: "Charakterbogen NAME" })}><DownloadIcon /> PDF erstellen</Button>
                <Button onClick={resetState}><ResetIcon /> Alles zurücksetzen</Button>
            </div>

            {/** BEGIN HIDDEN */}
            <div className="absolute left-[5000px] min-w-[1000px] grid grid-cols-9 gap-4 p-4" ref={targetRef} style={{}}>
                <div className="col-span-9">Charakterbogen</div>
                <div className="col-span-4 flex flex-col">
                    <Label>Name</Label>
                    <Label className="grow">{state.name}</Label>
                </div>
                <div className="flex flex-col">
                    <Label>Alter</Label>
                    <Label className="grow">{state.age}</Label>
                </div>
                <div className="flex flex-col">
                    <Label>Größe</Label>
                    <Label className="grow">{state.size}</Label>
                </div>
                <div className="col-span-3 flex flex-col">
                    <Label>Job</Label>
                    <Label className="grow">{state.job}</Label>
                </div>
                <div className="flex flex-col gap-4 row-span-4">
                    <div className="flex flex-col">
                        <Label>Stärke</Label>
                        <Label className="grow min-h-20"></Label>
                    </div>
                    <div className="flex flex-col">
                        <Label>Stärke</Label>
                        <Label className="grow min-h-20 inline-flex justify-center items-center">{state.strength}</Label>
                    </div>
                    <div className="flex flex-col">
                        <Label>Geschicklichkeit</Label>
                        <Label className="grow min-h-20 inline-flex justify-center items-center">{state.agility}</Label>
                    </div>
                    <div className="flex flex-col">
                        <Label>Übernatürlicher</Label>
                        <Label className="grow min-h-20 inline-flex justify-center items-center">{state.spirit}</Label>
                    </div>
                    <div className="flex flex-col">
                        <Label>Geisteskraft</Label>
                        <Label className="grow min-h-20 inline-flex justify-center items-center">{state.wisdom}</Label>
                    </div>
                </div>
                <div className="col-span-8 row-span-1 flex flex-col">
                    <Label>Phobie(n)</Label>
                    <Label className="grow">{state.phobia}</Label>
                </div>
                <div className="col-span-4 row-span-3 flex flex-col">
                    <Label>Hintergrundgeschichte</Label>
                    <Label className="grow">{state.story}</Label>
                </div>
                <div className="col-span-4 row-span-3 flex flex-col">
                    <Label>Laster</Label>
                    <Label className="grow">{state.bad}</Label>
                </div>
            </div>
        </>
    )
}