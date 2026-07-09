import { createContext,useState } from "react";


export const InterviewContext = createContext()

export const InterviewProvider = ({ children }) => {
    const [loading, setLoading] = useState(false)
    const [loadingText, setLoadingText] = useState("Loading your interview plan...")
    const [report, setReport] = useState(null)
    const [reports, setReports] = useState([])

    return (
        <InterviewContext.Provider value={{ loading, setLoading, loadingText, setLoadingText, report, setReport, reports, setReports }}>
            {children}
        </InterviewContext.Provider>
    )
}