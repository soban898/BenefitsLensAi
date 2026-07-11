import { motion } from 'framer-motion';
import {
  ScanEye,
  Zap,
  ShieldCheck,
  FileSearch,
  MessageSquareText,
  CalendarClock,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  FileText,
  HeartPulse,
  Briefcase,
  Building2,
  Clock,
} from 'lucide-react';
import { Navbar } from '../components/Navbar';
import { UploadZone } from '../components/UploadZone';
import { StatPill } from '../components/ui/StatPill';

interface LandingPageProps {
  onFileSelected: (file: File) => void;
}

const features = [
  {
    icon: Zap,
    title: 'Instant Analysis',
    description: 'AI reads your document and explains everything in seconds — no jargon, no confusion.',
    color: 'from-primary-500 to-primary-600',
  },
  {
    icon: CalendarClock,
    title: 'Deadline Detection',
    description: 'Automatically surfaces critical dates and deadlines you can\'t afford to miss.',
    color: 'from-teal-500 to-teal-600',
  },
  {
    icon: MessageSquareText,
    title: 'Ask Follow-ups',
    description: 'Chat with AI about your specific document. Get answers grounded in the actual text.',
    color: 'from-accent-500 to-accent-600',
  },
  {
    icon: ShieldCheck,
    title: 'Private & Secure',
    description: 'Your documents are processed securely and never stored. Your data stays yours.',
    color: 'from-primary-500 to-teal-500',
  },
];

const supportedDocs = [
  { icon: FileText, label: 'COBRA Notices' },
  { icon: HeartPulse, label: 'HSA Documents' },
  { icon: HeartPulse, label: 'FSA Documents' },
  { icon: HeartPulse, label: 'HRA Documents' },
  { icon: Briefcase, label: 'ICHRA Documents' },
  { icon: Building2, label: 'Benefits Guides' },
  { icon: ShieldCheck, label: 'Insurance Documents' },
];

const steps = [
  {
    icon: FileText,
    title: 'Upload your PDF',
    description: 'Drag and drop any benefits document — COBRA, HSA, FSA, ICHRA, or insurance guide.',
  },
  {
    icon: FileSearch,
    title: 'AI reads & analyzes',
    description: 'Gemini extracts text, identifies document type, and understands the full context.',
  },
  {
    icon: Sparkles,
    title: 'Get plain-English insights',
    description: 'Receive structured cards: summary, deadlines, coverage, responsibilities, and more.',
  },
  {
    icon: MessageSquareText,
    title: 'Ask follow-up questions',
    description: 'Chat with AI about your document. Every answer cites the source and confidence level.',
  },
];

export function LandingPage({ onFileSelected }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-mesh">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6">
        <div className="mx-auto max-w-5xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-50 border border-primary-200 text-primary-700 text-sm font-semibold mb-8"
          >
            <Sparkles className="w-4 h-4" />
            AI-Powered Benefits Document Assistant
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900 leading-[1.05] mb-6"
          >
            Understand Employee Benefits
            <br />
            Documents in{' '}
            <span className="gradient-text">Seconds</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto mb-12 leading-relaxed"
          >
            Upload your COBRA, HSA, FSA, ICHRA or Benefits document and let AI
            explain everything in plain English.
          </motion.p>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-wrap items-center justify-center gap-3 mb-12"
          >
            <StatPill icon={Zap} label="Analysis Speed" value="< 30 seconds" />
            <StatPill icon={FileText} label="Supported" value="7+ doc types" />
            <StatPill icon={ShieldCheck} label="Privacy" value="No storage" />
          </motion.div>
        </div>

        {/* Upload Area */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="mx-auto max-w-2xl"
        >
          <UploadZone onFileSelected={onFileSelected} />
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-center text-sm text-slate-400 mt-6"
        >
          No sign-up required. Your document is analyzed and immediately discarded.
        </motion.p>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-6">
        <div className="mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Everything you need to understand your benefits
            </h2>
            <p className="text-lg text-slate-500 max-w-2xl mx-auto">
              BenefitLens AI turns dense, jargon-filled benefits documents into
              clear, actionable insights.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                whileHover={{ y: -6 }}
                className="group rounded-2xl bg-white border border-slate-100 card-shadow p-6 transition-all hover:card-shadow-hover"
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center text-white shadow-lg mb-4 group-hover:scale-110 transition-transform`}>
                  <feature.icon className="w-6 h-6" strokeWidth={2} />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">{feature.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 px-6 bg-gradient-to-b from-white to-primary-50/30">
        <div className="mx-auto max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              How it works
            </h2>
            <p className="text-lg text-slate-500">
              From upload to understanding in four simple steps.
            </p>
          </motion.div>

          <div className="relative">
            {/* Connecting line */}
            <div className="hidden md:block absolute top-12 left-[12.5%] right-[12.5%] h-0.5 bg-gradient-to-r from-primary-200 via-teal-200 to-primary-200" />

            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {steps.map((step, i) => (
                <motion.div
                  key={step.title}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.15 }}
                  className="relative text-center"
                >
                  <div className="relative inline-flex w-24 h-24 rounded-3xl bg-white border border-slate-100 card-shadow items-center justify-center mb-4">
                    <step.icon className="w-10 h-10 text-primary-600" strokeWidth={1.8} />
                    <div className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-gradient-to-br from-primary-600 to-teal-500 text-white text-sm font-bold flex items-center justify-center shadow-lg">
                      {i + 1}
                    </div>
                  </div>
                  <h3 className="text-base font-bold text-slate-900 mb-2">{step.title}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">{step.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Supported Documents */}
      <section id="supported" className="py-20 px-6">
        <div className="mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Supported document types
            </h2>
            <p className="text-lg text-slate-500 mb-12">
              BenefitLens AI works with all major employee benefits documents.
            </p>
          </motion.div>

          <div className="flex flex-wrap items-center justify-center gap-3">
            {supportedDocs.map((doc, i) => (
              <motion.div
                key={doc.label}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                whileHover={{ y: -3 }}
                className="inline-flex items-center gap-2.5 px-5 py-3 rounded-2xl bg-white border border-slate-100 card-shadow"
              >
                <doc.icon className="w-5 h-5 text-teal-600" strokeWidth={2} />
                <span className="text-sm font-semibold text-slate-700">{doc.label}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-3xl rounded-3xl bg-gradient-to-br from-primary-600 to-teal-500 p-12 text-center relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-grid-pattern opacity-30" />
          <div className="relative">
            <ScanEye className="w-12 h-12 text-white mx-auto mb-6" strokeWidth={1.5} />
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to understand your benefits?
            </h2>
            <p className="text-lg text-primary-100 mb-8 max-w-xl mx-auto">
              Upload your document now and get a clear, plain-English breakdown in seconds.
            </p>
            <motion.a
              href="#top"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={(e) => {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-white text-primary-700 font-bold shadow-xl text-base"
            >
              Get Started
              <ArrowRight className="w-5 h-5" />
            </motion.a>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-100 py-12 px-6">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-600 to-teal-500 flex items-center justify-center">
                <ScanEye className="w-4 h-4 text-white" strokeWidth={2.5} />
              </div>
              <span className="font-bold text-slate-900">BenefitLens AI</span>
            </div>
            <p className="text-sm text-slate-400">
              Understand Employee Benefits Documents in Seconds.
            </p>
            <div className="flex items-center gap-2 text-sm text-slate-400">
              <Clock className="w-4 h-4" />
              <span>No login required</span>
              <CheckCircle2 className="w-4 h-4 ml-3 text-teal-500" />
              <span>Secure & private</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
