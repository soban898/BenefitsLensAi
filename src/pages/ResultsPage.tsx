import { motion } from 'framer-motion';
import {
  FileText,
  ShieldCheck,
  CalendarClock,
  CalendarDays,
  HeartPulse,
  UserCheck,
  Building2,
  AlertTriangle,
  ListTodo,
  HelpCircle,
  ScanEye,
  ArrowLeft,
  FileCheck,
} from 'lucide-react';
import type { AnalysisResponse } from '../types';
import { Card, CardHeader, CardBody } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { ListItem } from '../components/ui/ListItem';
import { AIChat } from '../components/AIChat';
import { ExportBar } from '../components/ExportBar';

interface ResultsPageProps {
  data: AnalysisResponse;
  onReset: () => void;
}

export function ResultsPage({ data, onReset }: ResultsPageProps) {
  const { analysis, fileName, pageCount } = data;

  return (
    <div className="min-h-screen bg-mesh">
      {/* Top bar */}
      <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-slate-100">
        <div className="mx-auto max-w-6xl px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-600 to-teal-500 flex items-center justify-center shadow-lg">
              <ScanEye className="w-5 h-5 text-white" strokeWidth={2.5} />
            </div>
            <div>
              <span className="font-bold text-slate-900 tracking-tight">BenefitLens</span>
              <span className="ml-1.5 text-xs font-bold text-teal-600">AI</span>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={onReset}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-slate-200 text-sm font-semibold text-slate-700 hover:border-primary-300 hover:text-primary-700 transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            Analyze Another Document
          </motion.button>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-6 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-10"
        >
          <div className="flex items-center gap-2 mb-3">
            <FileCheck className="w-5 h-5 text-teal-500" />
            <span className="text-sm font-semibold text-teal-600">Analysis Complete</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-3">
            Your Benefits Document, Explained
          </h1>
          <p className="text-base text-slate-500 max-w-2xl">
            Here's a clear, plain-English breakdown of your document. Every insight
            below was extracted and analyzed by AI.
          </p>

          <div className="flex flex-wrap items-center gap-3 mt-5">
            <Badge color="primary">
              <FileText className="w-3.5 h-3.5" />
              {fileName}
            </Badge>
            <Badge color="slate">
              {pageCount} {pageCount === 1 ? 'page' : 'pages'}
            </Badge>
            <Badge color="teal">
              <ShieldCheck className="w-3.5 h-3.5" />
              AI Analyzed
            </Badge>
          </div>

          <div className="mt-6">
            <ExportBar analysis={analysis} fileName={fileName} />
          </div>
        </motion.div>

        {/* Document Type & Plan Type — top row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <Card delay={0.1} hover>
            <CardHeader
              icon={<FileText className="w-6 h-6" strokeWidth={2} />}
              title="Document Type"
              accent="from-primary-500 to-primary-600"
            />
            <CardBody>
              <p className="text-base font-semibold text-slate-800">{analysis.documentType}</p>
            </CardBody>
          </Card>

          <Card delay={0.15} hover>
            <CardHeader
              icon={<ShieldCheck className="w-6 h-6" strokeWidth={2} />}
              title="Plan Type"
              accent="from-teal-500 to-teal-600"
            />
            <CardBody>
              <p className="text-base font-semibold text-slate-800">{analysis.planType}</p>
            </CardBody>
          </Card>
        </div>

        {/* Summary */}
        <Card delay={0.2} className="mb-6">
          <CardHeader
            icon={<FileText className="w-6 h-6" strokeWidth={2} />}
            title="Summary"
            subtitle="Plain-English overview of your document"
            accent="from-primary-500 to-teal-500"
          />
          <CardBody>
            <p className="text-base text-slate-700 leading-relaxed">{analysis.summary}</p>
          </CardBody>
        </Card>

        {/* Coverage */}
        <Card delay={0.25} className="mb-6">
          <CardHeader
            icon={<HeartPulse className="w-6 h-6" strokeWidth={2} />}
            title="Coverage"
            subtitle="What's covered under this plan"
            accent="from-teal-500 to-accent-500"
          />
          <CardBody>
            {analysis.coverage.length > 0 ? (
              <ul>
                {analysis.coverage.map((item, i) => (
                  <ListItem key={i} icon={HeartPulse} color="teal">
                    {item}
                  </ListItem>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-slate-400 italic">No coverage details identified.</p>
            )}
          </CardBody>
        </Card>

        {/* Key Deadlines & Important Dates */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <Card delay={0.3} hover>
            <CardHeader
              icon={<CalendarClock className="w-6 h-6" strokeWidth={2} />}
              title="Key Deadlines"
              subtitle="Don't miss these"
              accent="from-red-500 to-amber-500"
            />
            <CardBody>
              {analysis.keyDeadlines.length > 0 ? (
                <ul>
                  {analysis.keyDeadlines.map((item, i) => (
                    <ListItem key={i} icon={CalendarClock} color="red">
                      {item}
                    </ListItem>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-slate-400 italic">No deadlines identified.</p>
              )}
            </CardBody>
          </Card>

          <Card delay={0.35} hover>
            <CardHeader
              icon={<CalendarDays className="w-6 h-6" strokeWidth={2} />}
              title="Important Dates"
              subtitle="Key dates to remember"
              accent="from-primary-500 to-primary-600"
            />
            <CardBody>
              {analysis.importantDates.length > 0 ? (
                <ul>
                  {analysis.importantDates.map((item, i) => (
                    <ListItem key={i} icon={CalendarDays} color="primary">
                      {item}
                    </ListItem>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-slate-400 italic">No important dates identified.</p>
              )}
            </CardBody>
          </Card>
        </div>

        {/* Employee & Employer Responsibilities */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <Card delay={0.4} hover>
            <CardHeader
              icon={<UserCheck className="w-6 h-6" strokeWidth={2} />}
              title="Employee Responsibilities"
              subtitle="What you need to do"
              accent="from-primary-500 to-teal-500"
            />
            <CardBody>
              {analysis.employeeResponsibilities.length > 0 ? (
                <ul>
                  {analysis.employeeResponsibilities.map((item, i) => (
                    <ListItem key={i} icon={UserCheck} color="primary">
                      {item}
                    </ListItem>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-slate-400 italic">No employee responsibilities identified.</p>
              )}
            </CardBody>
          </Card>

          <Card delay={0.45} hover>
            <CardHeader
              icon={<Building2 className="w-6 h-6" strokeWidth={2} />}
              title="Employer Responsibilities"
              subtitle="What your employer handles"
              accent="from-teal-500 to-teal-600"
            />
            <CardBody>
              {analysis.employerResponsibilities.length > 0 ? (
                <ul>
                  {analysis.employerResponsibilities.map((item, i) => (
                    <ListItem key={i} icon={Building2} color="teal">
                      {item}
                    </ListItem>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-slate-400 italic">No employer responsibilities identified.</p>
              )}
            </CardBody>
          </Card>
        </div>

        {/* Warnings & Next Steps */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <Card delay={0.5} hover>
            <CardHeader
              icon={<AlertTriangle className="w-6 h-6" strokeWidth={2} />}
              title="Warnings"
              subtitle="Pay attention to these"
              accent="from-amber-500 to-red-500"
            />
            <CardBody>
              {analysis.importantWarnings.length > 0 ? (
                <ul>
                  {analysis.importantWarnings.map((item, i) => (
                    <ListItem key={i} icon={AlertTriangle} color="amber">
                      {item}
                    </ListItem>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-slate-400 italic">No warnings identified.</p>
              )}
            </CardBody>
          </Card>

          <Card delay={0.55} hover>
            <CardHeader
              icon={<ListTodo className="w-6 h-6" strokeWidth={2} />}
              title="Next Steps"
              subtitle="What to do now"
              accent="from-primary-500 to-teal-500"
            />
            <CardBody>
              {analysis.nextSteps.length > 0 ? (
                <ul>
                  {analysis.nextSteps.map((item, i) => (
                    <ListItem key={i} icon={ListTodo} color="primary">
                      {item}
                    </ListItem>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-slate-400 italic">No next steps identified.</p>
              )}
            </CardBody>
          </Card>
        </div>

        {/* Common Questions */}
        {analysis.commonQuestions.length > 0 && (
          <Card delay={0.6} className="mb-6">
            <CardHeader
              icon={<HelpCircle className="w-6 h-6" strokeWidth={2} />}
              title="Common Questions"
              subtitle="Frequently asked about this document type"
              accent="from-primary-500 to-teal-500"
            />
            <CardBody>
              <div className="space-y-4">
                {analysis.commonQuestions.map((qa, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 + i * 0.1 }}
                    className="rounded-xl bg-slate-50 border border-slate-100 p-4"
                  >
                    <p className="text-sm font-bold text-slate-900 mb-1.5 flex items-start gap-2">
                      <HelpCircle className="w-4 h-4 text-primary-500 flex-shrink-0 mt-0.5" />
                      {qa.question}
                    </p>
                    <p className="text-sm text-slate-600 leading-relaxed pl-6">{qa.answer}</p>
                  </motion.div>
                ))}
              </div>
            </CardBody>
          </Card>
        )}

        {/* AI Chat */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.7 }}
          className="mb-6"
        >
          <AIChat documentText={data.extractedText} fileName={fileName} />
        </motion.div>

        {/* Footer */}
        <div className="text-center py-12">
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={onReset}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-primary-600 to-teal-500 text-white font-semibold shadow-lg shadow-primary-600/20"
          >
            <ArrowLeft className="w-4 h-4" />
            Analyze Another Document
          </motion.button>
          <p className="text-xs text-slate-400 mt-6">
            BenefitLens AI · Understand Employee Benefits Documents in Seconds
          </p>
        </div>
      </div>
    </div>
  );
}
