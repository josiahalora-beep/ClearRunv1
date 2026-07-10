import React from "react";
import { useParams } from "react-router-dom";
import ExceptionDetail from "@/pages/ExceptionDetail";
import TicketIssueDetail from "@/pages/TicketIssueDetail";
import RouteIssueDetail from "@/pages/RouteIssueDetail";
import { routeExceptionQueue } from "@/data/mockData";
import { routeIntelligenceExceptions } from "@/data/routeIntelligenceData";

export default function ExceptionRouter() {
  const { id } = useParams();
  const routeIssue = routeIntelligenceExceptions.find((item) => item.id === id);
  const ticketIssue = routeExceptionQueue.find((item) => item.id === id);

  if (routeIssue) {
    return <RouteIssueDetail issue={routeIssue} />;
  }

  if (ticketIssue) {
    return <TicketIssueDetail issue={ticketIssue} />;
  }

  return <ExceptionDetail />;
}
