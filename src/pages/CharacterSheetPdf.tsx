import { Stats } from "@/lib/types/StatsType";
import { Document, Page, StyleSheet, Text, View, ViewProps } from "@react-pdf/renderer";
import { FunctionComponent } from "react";

type CharacterSheetPdfProps = {
    stats: Stats
}

type CardProps = {
    title: string,
}

type StatProps = {
    value: number,
}

type SpaceProps = {
    value: number,
    orientation?: 'horizonzal' | 'vertical'
}

const styles = StyleSheet.create({
    card: {
        borderRadius: 6,
        padding: 10,
        backgroundColor: 'white',
    },
    flexGrow: {
        flexGrow: 1
    },
    flexColumn: {
        display: 'flex',
        flexDirection: 'column',
        gap: 4,
    },
    flexRow: {
        display: 'flex',
        flexDirection: 'row',
        gap: 4,
    },
    title: {
        fontSize: 24,
    },
    ghost: {
        color: 'grey',
        fontSize: 8,
    },
    page: {
        padding: 16,
        fontSize: 12,
        backgroundColor: '#f0f0f0'
    }
})

const Card: FunctionComponent<CardProps & React.PropsWithChildren<ViewProps>> = ({ title, children, style, ...props }) => {
    return <View style={{ ...styles.card, ...styles.flexColumn, ...style }} {...props}>
        <Text style={{ ...styles.ghost, textOverflow: 'ellipsis', overflow: 'hidden' }}>
            {title}
        </Text>
        {children}
    </View>
}

const Stat: FunctionComponent<StatProps & CardProps & React.PropsWithChildren<ViewProps>> = ({ title, value, style, ...props }) => {
    const fontSize = 16 + value * 2
    const displayValue = (value < 0 ? "" : "+") + value
    return <Card id="stat-strength" title={title} style={style} {...props}>
        <View style={{ ...styles.flexColumn, justifyContent: 'center', alignItems: 'center', padding: 8, fontSize: fontSize, marginVertical: 4 }}>
            <Text>
                {displayValue}
            </Text>
        </View>
    </Card>
}

const Space: FunctionComponent<SpaceProps> = ({ value, orientation = 'horizonzal' }) => {
    return <View style={orientation === 'horizonzal' ? { height: value } : { width: value }} />
}

export const CharacterSheetPdf: FunctionComponent<CharacterSheetPdfProps> = ({ stats }) => {
    return <Document
        title={`Character-Sheet: ${stats.name}`}
        author="Automatically Generated"
        creator={stats.realName}
    >
        <Page style={{ ...styles.page, ...styles.flexColumn }}>
            <View id="title" style={styles.title}>
                <Text>Charakterbogen</Text>
            </View>
            <Space value={16} />
            <View id="content" style={{ ...styles.flexRow }}>
                <View id="stats" style={{ ...styles.flexColumn, maxWidth: 80 }}>
                    <Card id="hp" title={"Lebenspunkte"} >
                        <View style={{ minHeight: 40 }} />
                    </Card>
                    <Space value={24} />
                    <Stat id="stat-strength" title="Stärke" value={stats.strength} />
                    <Stat id="stat-agility" title="Geschick" value={stats.agility} />
                    <Stat id="stat-spirit" title="Sinn" value={stats.spirit} />
                    <Stat id="stat-wisdom" title="Geisteskraft" value={stats.wisdom} />
                </View>
                <View id="self" style={{ ...styles.flexColumn, ...styles.flexGrow }}>
                    <View id="header" style={{ ...styles.flexRow }}>
                        <Card title="Name" style={{ ...styles.flexGrow }}><Text>{stats.name}</Text></Card>
                        <Card title="Alter"><Text>{stats.age}</Text></Card>
                        <Card title="Größe"><Text>{stats.size} cm</Text></Card>
                    </View>
                    <View id="info" style={{ ...styles.flexRow, ...styles.flexGrow }}>
                        <Card id="image" title="Portrait" style={{ ...styles.flexGrow }}>
                        </Card>
                    </View>
                </View>
                <View id="properties" style={{ ...styles.flexColumn, maxWidth: 200 }}>
                    <Card title="Beruf"><Text>{stats.job}</Text></Card>
                    <Card id="phobia" title="Phobie(n)">
                        <Text>{stats.phobia}</Text>
                    </Card>
                    <Card id="story" title="Geschichte" style={{ ...styles.flexGrow }}>
                        <Text>{stats.story}</Text>
                    </Card>
                </View>
            </View>

            <Card id="inventory" title="Inventar" style={{ ...styles.flexGrow }} />
        </Page>
    </Document>
}