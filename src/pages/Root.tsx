import { NumberInput } from "@/components/feature/NumberInput"
import { StatusValue } from "@/components/feature/StatusValue"
import { WritableArea } from "@/components/feature/WritableArea"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { DownloadIcon, ResetIcon } from "@radix-ui/react-icons"
import { useEffect, useMemo, useState } from "react"
import { PDFViewer, pdf } from '@react-pdf/renderer';
import { Stats } from "@/lib/types/StatsType"
import { CharacterSheetPdf } from "./CharacterSheetPdf"
import { z } from 'zod'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { LoadingSpinner } from "@/components/util/LoadingSpinner"
import { saveAs } from 'file-saver'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { FastFormField } from "@/components/util/FastFormField"
import { Card } from "@/components/ui/card"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { Popover } from "@/components/ui/popover"
import { PopoverContent } from "@radix-ui/react-popover"
import { Label } from "@radix-ui/react-label"

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
    remainingTokens: z.coerce.number().max(0).min(0),
})

const costMap = [0, 1, 2, 3, 4, 6, 8, 11,]


type CharacterForm = z.infer<typeof formSchema>

export const Root: React.FunctionComponent = () => {
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
        const cost = currents.map((c) => costMap[c + 2])
        const sum = cost.reduce((a, b) => a + b, 0)
        const remaining = MAX_TOKENS - sum
        form.setValue("remainingTokens", remaining)
        return remaining
    }, [form, form.getValues()])

    return (
        <>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <Card className="container flex flex-col p-4 min-w-[70rem]">
                        <div className="flex flex-col">
                            <div>Charakterbogen</div>
                            <div id="header" className="flex flex-row gap-4 border-b-[1px] border-grey pb-2">
                                <FormField
                                    control={form.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem className="grow">
                                            <FormLabel>Name</FormLabel>
                                            <FormControl>
                                                <Input className="grow" placeholder="Name" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="age"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Alter</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Alter" {...field} className="max-w-14 text-right" />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="size"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Größe</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Größe" {...field} className="max-w-20 text-right" />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="job"
                                    render={({ field }) => (
                                        <FormItem className="grow">
                                            <FormLabel>Beruf</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Beruf" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <div className="flex flex-row gap-4">
                                <div className="flex flex-col gap-4 pt-4 border-r-[1px] border-grey pr-2">
                                    <FormField
                                        control={form.control}
                                        name="remainingTokens"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="mr-2">Zu verteilen:</FormLabel>
                                                <Label>{field.value}</Label>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="strength"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Stärke</FormLabel>
                                                <FormControl>
                                                    <StatusValue value={field.value} onValueChanged={(val) => field.onChange(val)} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="agility"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Geschicklichkeit</FormLabel>
                                                <FormControl>
                                                    <StatusValue value={field.value} onValueChanged={(val) => field.onChange(val)} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="spirit"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Übernatürlicher Sinn</FormLabel>
                                                <FormControl>
                                                    <StatusValue value={field.value} onValueChanged={(val) => field.onChange(val)} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="wisdom"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Geisteskraft</FormLabel>
                                                <FormControl>
                                                    <StatusValue value={field.value} onValueChanged={(val) => field.onChange(val)} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                <div id="self" className="flex flex-col grow gap-4 pt-4">
                                    <FormField
                                        control={form.control}
                                        name="phobia"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Phobie(n)</FormLabel>
                                                <FormControl>
                                                    <Textarea title="Phobie(n)" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="story"
                                        render={({ field }) => (
                                            <FormItem className="flex flex-col gap-2 grow">
                                                <FormLabel>Hintergrundgeschichte</FormLabel>
                                                <FormControl>
                                                    <Textarea title="Hintergrundgeschichte" {...field} className="grow" />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </div>



                        </div>

                        <div className="flex flex-row gap-2 justify-center mt-5">
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

                            <Button type="submit"><DownloadIcon /> Download</Button>
                        </div>
                    </Card>
                </form>
            </Form>
        </>
    )
}