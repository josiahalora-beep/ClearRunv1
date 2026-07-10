import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "@/pages/Home";
import TryFree from "@/pages/TryFree";
import ProofMockup from "@/pages/ProofMockup";
import ProofSnapshot from "@/pages/ProofSnapshot";
import CloseoutCheck from "@/pages/CloseoutCheck";
import Checklist from "@/pages/Checklist";
import Comparison from "@/pages/Comparison";
import DashboardOperator from "@/pages/DashboardOperator";
import Proof from "@/pages/Proof";
import ProofDetail from "@/pages/ProofDetail";
import Recovery from "@/pages/Recovery";
import ExceptionRouter from "@/pages/ExceptionRouter";
import RouteReviewLive from "@/pages/RouteReviewLive";
import ReportRouteIssue from "@/pages/ReportRouteIssue";
import Import from "@/pages/Import";
import Export from "@/pages/Export";
import Pilot from "@/pages/Pilot";
import Requests from "@/pages/Requests";
import Customer from "@/pages/Customer";
import Pricing from "@/pages/Pricing";
import Compatibility from "@/pages/Compatibility";
import Objections from "@/pages/Objections";
import Resources from "@/pages/Resources";
import Partners from "@/pages/Partners";
import Field from "@/pages/Field";
import Trust from "@/pages/Trust";
import Audit from "@/pages/Audit";
import Disposal from "@/pages/Disposal";
import Reviewer from "@/pages/Reviewer";
import CityExport from "@/pages/CityExport";
import CityView from "@/pages/CityView";
import ProofGraph from "@/pages/ProofGraph";
import Intelligence from "@/pages/Intelligence";
import AdminLeads from "@/pages/AdminLeads";
import NotFound from "@/pages/NotFound";
import { ScrollToTop } from "@/components/ScrollToTop";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/try-free" element={<TryFree />} />
        <Route path="/proof-mockup" element={<ProofMockup />} />
        <Route path="/proof-snapshot" element={<ProofSnapshot />} />
        <Route path="/closeout-check" element={<CloseoutCheck />} />
        <Route path="/checklist" element={<Checklist />} />
        <Route path="/comparison" element={<Comparison />} />
        <Route path="/dashboard" element={<DashboardOperator />} />
        <Route path="/proof" element={<Proof />} />
        <Route path="/proof/:id" element={<ProofDetail />} />
        <Route path="/recovery" element={<Recovery />} />
        <Route path="/exceptions/:id" element={<ExceptionRouter />} />
        <Route path="/issues/:id" element={<ExceptionRouter />} />
        <Route path="/report-issue/:routeId" element={<ReportRouteIssue />} />
        <Route path="/report-issue" element={<ReportRouteIssue />} />
        <Route path="/route-review/:routeId" element={<RouteReviewLive />} />
        <Route path="/route-review" element={<RouteReviewLive />} />
        <Route path="/route-intelligence/:routeId" element={<RouteReviewLive />} />
        <Route path="/route-intelligence" element={<RouteReviewLive />} />
        <Route path="/import" element={<Import />} />
        <Route path="/export" element={<Export />} />
        <Route path="/pilot" element={<Pilot />} />
        <Route path="/trial" element={<Pilot />} />
        <Route path="/requests" element={<Requests />} />
        <Route path="/restaurant" element={<Customer />} />
        <Route path="/restaurant/:id" element={<Customer />} />
        <Route path="/customer" element={<Customer />} />
        <Route path="/customer/:id" element={<Customer />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/compatibility" element={<Compatibility />} />
        <Route path="/objections" element={<Objections />} />
        <Route path="/resources" element={<Resources />} />
        <Route path="/partners" element={<Partners />} />
        <Route path="/field" element={<Field />} />
        <Route path="/trust" element={<Trust />} />
        <Route path="/audit" element={<Audit />} />
        <Route path="/disposal" element={<Disposal />} />
        <Route path="/disposal/:id" element={<Disposal />} />
        <Route path="/reviewer" element={<Reviewer />} />
        <Route path="/city-export" element={<CityExport />} />
        <Route path="/cityview" element={<CityView />} />
        <Route path="/proofgraph" element={<ProofGraph />} />
        <Route path="/intelligence" element={<Intelligence />} />
        <Route path="/admin/leads" element={<AdminLeads />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
