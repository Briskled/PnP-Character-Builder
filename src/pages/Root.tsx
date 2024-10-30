import { Button } from "@/components/ui/button"
import { useRef, useState } from "react"
import generatePDF from "react-to-pdf"

export const Root: React.FunctionComponent = ({props}) => {
    const [count, setCount] = useState(0)
    const targetRef = useRef<HTMLDivElement>(null)

    return (
      <>
        <h1>Vite + React</h1>
        <div className="card">
          <Button onClick={() => setCount((count) => count + 1)}>
            count is {count}
          </Button>
          <Button onClick={() => generatePDF(targetRef, {filename: 'page.pdf'})}>Download</Button>
          <p>
            This is a change that is new!
          </p>
        </div>
        <div ref={targetRef}>
            <p className="read-the-docs">
            Click on the Vite and React logos to learn more. Lololol
            </p>
        </div>
      </>
    )
}