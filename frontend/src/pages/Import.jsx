import React, { useState } from "react";
import { UploadCloud, FileSpreadsheet, FileText, CheckCircle2 } from "lucide-react";
import { Layout } from "@/components/Layout";
import { PageHeader } from "@/components/shared/PageHeader";
import { DisclaimerBanner } from "@/components/shared/DisclaimerBanner";
import { Button } from "@/components/ui/button";
import { importSources } from "@/data/mockData";

export default function Import() {
  const [fileName, setFileName] = useState(null);
  const [imported, setImported] = useState(false);

  const handleFile = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      setImported(false);
    }
  };

  const handleImport = () => {
    if (fileName) setImported(true);
  };

  return (
    <Layout>
      <section className="container-page py-12 sm:py-16">
        <PageHeader
          eyebrow="Import Records"
          title="Bring in the records you already have"
          description="Upload spreadsheets, PDFs, or exports from your existing field-service software — ClearRun maps them into proof packets."
        />

        <div className="mt-10 grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 rounded-xl border-2 border-dashed border-slate-300 bg-white p-10 flex flex-col items-center text-center gap-3">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-navy-900/5 text-navy-900"><UploadCloud className="h-6 w-6" /></span>
            <p className="font-display font-semibold text-navy-950">Drop a file or browse</p>
            <p className="text-sm text-slate-500 max-w-sm">CSV, XLSX, or PDF service tickets up to 25MB.</p>
            <label className="mt-2">
              <input type="file" data-testid="import-file-input" className="hidden" onChange={handleFile} />
              <span className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-navy-900 cursor-pointer hover:border-navy-800">
                Choose File
              </span>
            </label>
            {fileName && (
              <div data-testid="import-selected-file" className="mt-3 flex items-center gap-2 text-sm text-navy-800 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2">
                <FileText className="h-4 w-4" /> {fileName}
              </div>
            )}
            {!imported ? (
              <Button data-testid="import-submit-btn" className="mt-4" disabled={!fileName} onClick={handleImport}>
                Import Records
              </Button>
            ) : (
              <div data-testid="import-success-message" className="mt-4 flex items-center gap-2 text-status-complete text-sm font-medium">
                <CheckCircle2 className="h-4 w-4" /> Import queued for processing
              </div>
            )}
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-card h-fit">
            <h3 className="font-display font-semibold text-navy-950 mb-4 flex items-center gap-2">
              <FileSpreadsheet className="h-4 w-4 text-navy-800" /> Supported sources
            </h3>
            <ul className="flex flex-col gap-2.5">
              {importSources.map((s) => (
                <li key={s} className="text-sm text-slate-600 flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-navy-800 shrink-0" /> {s}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <DisclaimerBanner className="max-w-2xl mt-8" text="This is a demo import flow. No files are stored or processed by this preview." />
      </section>
    </Layout>
  );
}
