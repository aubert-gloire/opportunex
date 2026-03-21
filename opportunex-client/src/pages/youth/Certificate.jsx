import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Printer, ArrowLeft, Award } from 'lucide-react';
import { courseAPI } from '@/api';
import Button from '@/components/ui/Button';
import Skeleton from '@/components/ui/Skeleton';

const Certificate = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data, isLoading, isError } = useQuery({
    queryKey: ['certificate', id],
    queryFn: async () => {
      const res = await courseAPI.getCertificate(id);
      return res.data.certificate;
    },
  });

  const handlePrint = () => window.print();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center p-8">
        <div className="w-full max-w-3xl">
          <Skeleton className="h-[500px]" />
        </div>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-8">
        <div className="text-center">
          <p className="text-stone-400 text-sm mb-4">
            Certificate not found. Complete the course to earn your certificate.
          </p>
          <Button variant="primary" onClick={() => navigate('/youth/my-courses')}>
            My Courses
          </Button>
        </div>
      </div>
    );
  }

  const completedDate = new Date(data.completedAt).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const certId = String(data.id).slice(-10).toUpperCase();

  return (
    <>
      {/* Print styles */}
      <style>{`
        @media print {
          .no-print { display: none !important; }
          body { margin: 0; background: white; }
          .certificate-wrapper { padding: 0 !important; background: white !important; min-height: unset !important; }
          .certificate-card { box-shadow: none !important; border: 2px solid #1E3A5F !important; }
        }
        @page { size: A4 landscape; margin: 10mm; }
      `}</style>

      {/* Top bar — hidden on print */}
      <div className="no-print bg-white border-b border-stone-100 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <button
            onClick={() => navigate('/youth/my-courses')}
            className="flex items-center gap-2 text-sm text-stone-400 hover:text-stone-900 transition-colors font-light"
          >
            <ArrowLeft className="w-4 h-4" />
            My Courses
          </button>
          <Button variant="primary" onClick={handlePrint} className="flex items-center gap-2">
            <Printer className="w-4 h-4" />
            Download / Print
          </Button>
        </div>
      </div>

      {/* Certificate wrapper */}
      <div className="certificate-wrapper min-h-screen bg-stone-50 flex items-center justify-center p-8">
        <div
          className="certificate-card bg-white w-full max-w-4xl shadow-xl"
          style={{ aspectRatio: '1.414 / 1', position: 'relative', overflow: 'hidden' }}
        >
          {/* Outer border */}
          <div className="absolute inset-4 border border-[#1E3A5F]/20 pointer-events-none" />
          <div className="absolute inset-5 border border-[#C4A46B]/30 pointer-events-none" />

          {/* Corner ornaments */}
          {[
            'top-3 left-3',
            'top-3 right-3 rotate-90',
            'bottom-3 right-3 rotate-180',
            'bottom-3 left-3 -rotate-90',
          ].map((pos, i) => (
            <div key={i} className={`absolute ${pos} w-8 h-8 pointer-events-none`}>
              <svg viewBox="0 0 32 32" fill="none">
                <path d="M0 0 L16 0 L0 16 Z" fill="#C4A46B" opacity="0.4" />
                <path d="M0 0 L8 0 L0 8 Z" fill="#1E3A5F" opacity="0.3" />
              </svg>
            </div>
          ))}

          {/* Content */}
          <div className="absolute inset-0 flex flex-col items-center justify-center px-16 py-12 text-center">
            {/* Header */}
            <div className="mb-2">
              <p className="text-[10px] uppercase tracking-[0.35em] text-[#C4A46B] font-light mb-1">
                OpportuneX
              </p>
              <div className="flex items-center justify-center gap-3">
                <div className="h-px w-16 bg-[#1E3A5F]/20" />
                <Award className="w-5 h-5 text-[#C4A46B]" />
                <div className="h-px w-16 bg-[#1E3A5F]/20" />
              </div>
            </div>

            {/* Title */}
            <h1
              className="font-display text-[#1E3A5F] mt-4 mb-2"
              style={{ fontSize: 'clamp(1.6rem, 4vw, 2.5rem)', letterSpacing: '-0.02em', fontWeight: 300 }}
            >
              Certificate of Completion
            </h1>

            <p className="text-stone-400 text-xs uppercase tracking-[0.2em] mb-6">
              This certifies that
            </p>

            {/* Student name */}
            <div className="mb-1">
              <p
                className="font-display italic text-[#1E3A5F]"
                style={{ fontSize: 'clamp(1.8rem, 5vw, 3rem)', letterSpacing: '-0.01em', fontWeight: 300 }}
              >
                {data.studentName}
              </p>
              <div className="h-px bg-[#C4A46B]/50 mt-2 mx-auto w-64" />
            </div>

            <p className="text-stone-400 text-xs uppercase tracking-[0.2em] mt-4 mb-3">
              has successfully completed
            </p>

            {/* Course title */}
            <h2
              className="font-display text-stone-900 mb-1 max-w-lg"
              style={{ fontSize: 'clamp(1rem, 2.5vw, 1.5rem)', letterSpacing: '-0.015em', fontWeight: 300 }}
            >
              {data.courseTitle}
            </h2>

            {/* Skills */}
            {data.skills && data.skills.length > 0 && (
              <div className="flex flex-wrap justify-center gap-2 mt-3 mb-4">
                {data.skills.slice(0, 5).map((skill, i) => (
                  <span
                    key={i}
                    className="text-[9px] uppercase tracking-[0.15em] px-2 py-0.5 border border-[#1E3A5F]/20 text-[#1E3A5F]/60"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            )}

            {/* Footer row */}
            <div className="flex items-end justify-between w-full mt-auto pt-6 border-t border-stone-100">
              <div className="text-left">
                <p className="text-[10px] uppercase tracking-[0.15em] text-stone-400 mb-1">Date Issued</p>
                <p className="font-display font-light text-stone-700 text-sm" style={{ letterSpacing: '-0.01em' }}>
                  {completedDate}
                </p>
              </div>

              <div className="text-center">
                <div
                  className="text-[9px] text-stone-300 font-mono"
                  style={{ letterSpacing: '0.08em' }}
                >
                  CERT-{certId}
                </div>
              </div>

              <div className="text-right">
                <p className="text-[10px] uppercase tracking-[0.15em] text-stone-400 mb-1">Issued by</p>
                <p className="font-display font-light text-stone-700 text-sm" style={{ letterSpacing: '-0.01em' }}>
                  {data.instructorName}
                </p>
                <p className="text-[9px] uppercase tracking-[0.12em] text-[#C4A46B]">OpportuneX</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Certificate;
