import {
  getAllInterviewReports,
  generateInterviewReport,
  getInterviewReportById,
  generateResumePdf,
} from "../services/interview.api";
import { useContext, useEffect, useCallback } from "react";
import { InterviewContext } from "../interview.context";
import { useParams } from "react-router-dom";

export const useInterview = () => {
  const context = useContext(InterviewContext);
  const { interviewId } = useParams();

  if (!context) {
    throw new Error("useInterview must be used within an InterviewProvider");
  }

  const { loading, setLoading, loadingText, setLoadingText, report, setReport, reports, setReports } =
    context;

  const generateReport = useCallback(
    async ({ jobDescription, selfDescription, resumeFile }) => {
      setLoadingText("Loading your interview plan...");
      setLoading(true);
      let response = null;
      try {
        response = await generateInterviewReport({
          jobDescription,
          selfDescription,
          resumeFile,
        });
        setReport(response.interviewReport);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }

      return response?.interviewReport || null;
    },
    [setLoading, setLoadingText, setReport],
  );

  const getReportById = useCallback(
    async (id) => {
      setLoadingText("Loading your interview plan...");
      setLoading(true);
      let response = null;
      try {
        response = await getInterviewReportById(id);
        setReport(response.interviewReport);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
      return response?.interviewReport || null;
    },
    [setLoading, setLoadingText, setReport],
  );

  const getReports = useCallback(async () => {
    setLoadingText("Loading your interview plan...");
    setLoading(true);
    let response = null;
    try {
      response = await getAllInterviewReports();
      setReports(response.interviewReports);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }

    return response?.interviewReports || null;
  }, [setLoading, setLoadingText, setReports]);

  const getResumePdf = async (interviewReportId) => {
    setLoadingText("Downloading PDF...");
    setLoading(true);
    let response = null;
    try {
      response = await generateResumePdf({ interviewReportId });
      const url = window.URL.createObjectURL(
        new Blob([response], { type: "application/pdf" }),
      );
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `resume_${interviewReportId}.pdf`);
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (interviewId) {
      getReportById(interviewId);
    } else {
      getReports();
    }
  }, [interviewId, getReportById, getReports]);

  return {
    generateReport,
    getReportById,
    getReports,
    getResumePdf,
    loading,
    setLoading,
    loadingText,
    report,
    setReport,
    reports,
    setReports,
  };
};
