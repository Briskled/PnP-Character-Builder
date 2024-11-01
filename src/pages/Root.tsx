import { StatusValue } from "@/components/feature/StatusValue"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { DownloadIcon, InfoCircledIcon, ResetIcon } from "@radix-ui/react-icons"
import { useMemo, useState } from "react"
import { pdf } from '@react-pdf/renderer';
import { Stats } from "@/lib/types/StatsType"
import { CharacterSheetPdf } from "./CharacterSheetPdf"
import { z } from 'zod'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { saveAs } from 'file-saver'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { getFullCost } from "@/lib/cost"
import { cn } from "@/lib/utils"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { FormElement } from "@/components/feature/FormElement"

const defaultState: Stats = {
    strength: -2,
    agility: -2,
    spirit: -2,
    wisdom: -2,
    name: "",
    age: 24,
    size: 180,
    job: "",
    story: "",
    phobia: "",
}

const MAX_TOKENS = 20

const formSchema = z.object({
    strength: z.coerce.number().min(-2).max(5),
    agility: z.coerce.number().min(-2).max(5),
    spirit: z.coerce.number().min(-2).max(5),
    wisdom: z.coerce.number().min(-2).max(5),
    name: z.string().min(3, { message: "Name muss mindestens 3 Zeichen lang sein" }).max(30, { message: "Name darf höchstens 30 Zeichen lang sein." }),
    age: z.coerce.number().min(18, { message: "Wir sind hier jugendfrei, ok?" }).max(99, { message: "Du solltest schon noch laufen können. Höchstens 99 Jahre" }),
    size: z.coerce.number().min(100, { message: "U too smol!" }).max(210, { message: "Es ist ratsam, durch Türen zu passen. Darf höchstens 210cm sein" }),
    job: z.string().min(3, { message: "Job muss mindestens 3 Zeichen lang sein" }).max(30, { message: "Job darf höchstens 30 Zeichen lang sein." }),
    story: z.string().min(1, { message: "Gib bitte wenigstens etwas kurzes an." }),
    phobia: z.string().min(1, { message: "Gib mindestens eine Phobie an." }),
})



type CharacterForm = z.infer<typeof formSchema>

export const Root: React.FunctionComponent = () => {
    const [stupidCounter, setStupidCounter] = useState(0)

    const form = useForm<CharacterForm>({
        resolver: zodResolver(formSchema),
        defaultValues: defaultState,
    })

    const download = async (stats: Stats) => {
        const blob = await pdf(<CharacterSheetPdf stats={stats} />).toBlob()
        saveAs(blob, `Character-Sheet: ${stats.name}`)
    }

    const onSubmit = (values: CharacterForm) => {
        const stats: Stats = { ...values }
        download(stats)
    }

    const resetState = () => {
        form.reset()
    }

    const tokens = useMemo(() => {
        const values = form.getValues()
        const currents = [values.strength, values.agility, values.spirit, values.wisdom]
        const cost = currents.map((c) => getFullCost(c))
        const sum = cost.reduce((a, b) => a + b, 0)
        const remaining = MAX_TOKENS - sum
        return remaining
    }, [stupidCounter])

    return (
        <>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <div className="bg-white flex flex-col p-8 lg:container lg:rounded-xl shadow-lg lg:mt-16">
                        <div className="flex flex-col">
                            <Label className="text-2xl mb-6">Charakterbogen</Label>
                            <div id="header" className="flex flex-col lg:flex-row gap-4 border-b-[1px] border-grey pb-2">
                                <FormElement className="grow" title="Name" infoText="Der Name deines Charakters">
                                    <FormField
                                        control={form.control}
                                        name="name"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormControl>
                                                    <Input className="grow" placeholder="Name" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </FormElement>

                                <FormElement title="Alter" infoText="Wie alt ist dein Charakter? In Jahren">
                                    <FormField
                                        control={form.control}
                                        name="age"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormControl>
                                                    <Input placeholder="Alter" {...field} className="lg:max-w-14 text-right" inputMode="numeric" />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </FormElement>

                                <FormElement title="Größe" infoText="Wie groß ist dein Charakter? In cm.">
                                    <FormField
                                        control={form.control}
                                        name="size"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormControl>
                                                    <Input placeholder="Größe" {...field} className="lg:max-w-20 text-right" inputMode="numeric" />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </FormElement>

                                <FormElement className="grow" title="Beruf">
                                    <FormField
                                        control={form.control}
                                        name="job"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormControl>
                                                    <Input placeholder="Beruf" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </FormElement>
                            </div>
                            <div className="flex flex-col lg:flex-row gap-4">
                                <div className="flex flex-col gap-4 pt-4 border-b-[1px] lg:border-b-[0px] lg:border-r-[1px] border-grey pr-2">
                                    <Label className={cn("sticky top-3 p-3 rounded-lg lg:relative lg:top-0 bg-white", tokens > 0 && "bg-red-50 font-bold")}>Zu verteilen: {tokens}</Label>

                                    <FormElement title="Stärke" infoText="Stärke bestimmt die körperliche Kraft deines Charakters. Sie ermöglicht es, schwere Gegenstände zu heben und in einer Kampfsituation ordentlich auszuteilen!">
                                        <FormField
                                            control={form.control}
                                            name="strength"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormControl>
                                                        <StatusValue remainingTokens={tokens} value={field.value} onValueChanged={(val) => {
                                                            field.onChange(val)
                                                            setStupidCounter(stupidCounter + 1)
                                                        }
                                                        } />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </FormElement>

                                    <FormElement title="Geschicklichkeit" infoText="Deine Geschicklichkeit beeinflusst dein Können in allem, was mit Fingerfertigkeit zu tun hat. Sie bietet dir außerdem einen Bonus auf Heimlichkeit">
                                        <FormField
                                            control={form.control}
                                            name="agility"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormControl>
                                                        <StatusValue remainingTokens={tokens} value={field.value} onValueChanged={(val) => {
                                                            field.onChange(val)
                                                            setStupidCounter(stupidCounter + 1)
                                                        }} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </FormElement>

                                    <FormElement title="Übernatürlicher Sinn" infoText="Deine Fähigkeit, übernatürliche Dinge wahrzunehmen, zu erahnen oder mit Wesen zu kommunizieren.">
                                        <FormField
                                            control={form.control}
                                            name="spirit"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormControl>
                                                        <StatusValue remainingTokens={tokens} value={field.value} onValueChanged={(val) => {
                                                            field.onChange(val)
                                                            setStupidCounter(stupidCounter + 1)
                                                        }} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </FormElement>

                                    <FormElement title="Geisteskraft" infoText="Deine Intelligenz! Aber auch deine Willenskraft und die Fähigkeit, dich und deine Gedanken zu kontrollieren">
                                        <FormField
                                            control={form.control}
                                            name="wisdom"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormControl>
                                                        <StatusValue remainingTokens={tokens} value={field.value} onValueChanged={(val) => {
                                                            field.onChange(val)
                                                            setStupidCounter(stupidCounter + 1)
                                                        }} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </FormElement>
                                </div>
                                <div id="self" className="flex flex-col grow gap-4 pt-4">
                                    <FormElement title="Phobie(n)" infoText="Wovor hat dein Charakter besonders viel Angst?">
                                        <FormField
                                            control={form.control}
                                            name="phobia"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormControl>
                                                        <Textarea title="Phobie(n)" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </FormElement>

                                    <FormElement className="flex flex-col gap-2 grow" title="Hintergrundgeschichte" infoText="Schreibe ein paar kurze Worte über deinen Charakter, seine Vegangenheit, was ihn geprägt hat und warum er in der aktuellen Situation ist">
                                        <FormField
                                            control={form.control}
                                            name="story"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormControl>
                                                        <Textarea title="Hintergrundgeschichte" {...field} className="min-h-[20rem] grow" />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </FormElement>
                                </div>
                            </div>



                        </div>

                        <div className="sticky bottom-0 pb-4 lg:pb-0 flex flex-row gap-2 justify-center mt-5 bg-white lg:relative">
                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <Button><ResetIcon /> Alles zurücksetzen</Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>Bist du sicher?</AlertDialogTitle>
                                        <AlertDialogDescription>
                                            Alle Daten werden zurückgesetzt und können nicht mehr wiederhergestellt werden. Bist du sicher, dass du das tun möchtest?
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel>Nein</AlertDialogCancel>
                                        <AlertDialogAction onClick={resetState}>Ja, alles löschen</AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                            <div className="relative">
                                <Button type="submit" disabled={tokens !== 0}><DownloadIcon />Als PDF speichern</Button>
                            </div>
                        </div>
                    </div>
                </form>
            </Form>
        </>
    )
}