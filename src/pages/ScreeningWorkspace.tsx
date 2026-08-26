import React, { useState, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, Play, RefreshCw, XCircle, CheckCircle2, ChevronDown, ChevronUp } from 'lucide-react';
import { useScreening } from '../context/ScreeningContext';
import { api } from '../services/api';
import { getAuthenticityResult } from '../services/authenticityService';
import { documentAnalysisService } from '../services/documentAnalysisService';

interface DocValidationResult {
  success: boolean;
  expected_type: string;
  detected_type: string;
  confidence: number;
  is_valid: boolean;
  message: string;
}

interface CheckDetail {
  name: string;
  status: 'PASS' | 'FAIL' | 'WARN';
  detail: string;
}

interface CaseCheckData {
  status: string;
  label: string;
  confidence: number;
  riskLevel: string;
  riskScore?: number;
  reasons: string[];
  checks: CheckDetail[];
}

// Sub-component: PipelineResults
interface PipelineResultsProps {
  isAnalyzing: boolean;
  currentStage: number;
  resultData: CaseCheckData | null;
  resultMode: 'NONE' | 'SCREENING';
  filename: string;
}

const PipelineResults: React.FC<PipelineResultsProps> = ({ isAnalyzing, currentStage, resultData, resultMode, filename }) => {
  const [expandedStages, setExpandedStages] = useState<Record<number, boolean>>({});

  const toggleStage = (stageId: number) => {
    setExpandedStages(prev => ({
      ...prev,
      [stageId]: !prev[stageId]
    }));
  };

  const stagesDefinition = [
    {
      id: 1,
      name: "Stage 1: Intake & Image Quality Check",
      checkName: "Quality",
      desc: "Validates the uploaded file format, checks resolution (minimum 300 DPI for document processing), detects blur, glare, and skew. Rejects files that cannot be processed reliably."
    },
    {
      id: 2,
      name: "Stage 2: OCR Text Field Extraction",
      checkName: "Font",
      desc: "Extracts all visible text fields from the document — name, date of birth, nationality, document number, expiry date — using optical character recognition tuned for government document fonts (OCR-B)."
    },
    {
      id: 3,
      name: "Stage 3: ICAO MRZ Checksum Parser",
      checkName: "MRZ",
      desc: "Reads the Machine Readable Zone (two lines at the bottom of a passport). Each field has a checksum digit calculated using the ICAO 9303 weighted modulo-10 algorithm. A single wrong digit means the document number, DOB, or expiry has been altered."
    },
    {
      id: 4,
      name: "Stage 4: Document Validation Engine",
      checkName: "Structure",
      desc: "Compares extracted field values against each other for logical consistency (e.g., expiry must be after issue date, age must match DOB, nationality must be a valid ISO code) and against the known template for the detected document type and issuing country."
    },
    {
      id: 5,
      name: "Stage 5: Tampering Forensics & ELA",
      checkName: "ELA",
      desc: "Error Level Analysis (ELA) re-compresses the image at a known quality and compares it to the original. Regions that were digitally edited (pasted text, changed digits, replaced photos) show up as bright spots because they have different compression histories than untouched regions."
    },
    {
      id: 6,
      name: "Stage 6: Biometric Face Verification",
      checkName: "Biometric",
      desc: "Detects the photo zone on the document and checks for pixel-level anomalies — clone stamping, splicing, inconsistent lighting gradients — that indicate the original photo was replaced with a different person's image."
    },
    {
      id: 7,
      name: "Stage 7: Multimodal Risk Fusion Engine",
      checkName: "Fusion",
      desc: "Takes the outputs from all 6 stages and computes a final risk score using a weighted fusion model. Higher-confidence failures (MRZ, ELA) carry more weight than warnings. Produces the final AUTHENTIC / SUSPICIOUS / FAKE verdict with confidence score."
    }
  ];

  const getStageCheck = (stageId: number, checkName: string): CheckDetail => {
    if (!resultData || resultMode === 'NONE') {
      return { name: checkName, status: 'PASS', detail: 'Pending analysis initiation...' };
    }

    const checks = resultData.checks || [];

    if (checkName === 'Structure') {
      const structCheck = checks.find(c => c.name === 'Structure' || c.name === 'Document Structure');
      const fieldCheck = checks.find(c => c.name === 'Field Consistency');
      
      const hasFail = structCheck?.status === 'FAIL' || fieldCheck?.status === 'FAIL';
      const hasWarn = structCheck?.status === 'WARN' || fieldCheck?.status === 'WARN';
      const status = hasFail ? 'FAIL' : hasWarn ? 'WARN' : 'PASS';
      
      let detail = '';
      if (status === 'FAIL') {
        detail = structCheck?.status === 'FAIL' ? structCheck.detail : fieldCheck?.detail || '';
      } else if (status === 'WARN') {
        detail = structCheck?.status === 'WARN' ? structCheck.detail : fieldCheck?.detail || '';
      } else {
        detail = structCheck?.detail || fieldCheck?.detail || "All cross-field logical checks passed.";
      }

      return {
        name: 'Document Validation Engine',
        status,
        detail
      };
    }

    // Direct mapping to named checks in DEMO_RESULTS
    const nameMap: Record<string, string> = {
      'Quality': 'Quality',
      'Font': 'Font',
      'MRZ': 'MRZ',
      'ELA': 'ELA',
      'Biometric': 'Biometric',
      'Fusion': 'Fusion'
    };

    const targetName = nameMap[checkName] || checkName;
    const check = checks.find(c => c.name === targetName);
    return check || { name: checkName, status: 'PASS', detail: 'Verification complete.' };
  };

  const getBadgeStyles = (status: 'PASS' | 'FAIL' | 'WARN', activeSession: boolean) => {
    if (!activeSession) {
      return 'bg-slate-900 text-slate-500 border border-slate-800';
    }
    switch (status) {
      case 'PASS':
        return 'bg-[#00FF88]/10 text-[#00FF88] border border-[#00FF88]/20';
      case 'FAIL':
        return 'bg-[#FF4444]/10 text-[#FF4444] border border-[#FF4444]/20';
      case 'WARN':
        return 'bg-amber-400/10 text-amber-400 border border-amber-400/20';
      default:
        return 'bg-slate-900 text-slate-500 border border-slate-800';
    }
  };

  const getProgressBarColor = (status: 'PASS' | 'FAIL' | 'WARN') => {
    switch (status) {
      case 'PASS':
        return 'bg-[#00FF88]';
      case 'FAIL':
        return 'bg-[#FF4444]';
      case 'WARN':
        return 'bg-amber-400';
      default:
        return 'bg-slate-700';
    }
  };

  if (isAnalyzing) {
    return (
      <div className="gov-card p-5 space-y-4">
        <div className="border-b border-slate-850 pb-3 flex items-center justify-between">
          <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider font-mono">
            Pipeline Execution Telemetry
          </h3>
          <span className="text-[10px] font-mono bg-blue-950 text-blue-400 px-2 py-0.5 rounded border border-blue-500/30 animate-pulse">
            Active: Stage {currentStage} / 7
          </span>
        </div>

        <div className="space-y-2">
          {stagesDefinition.map((stg) => {
            const isCompleted = currentStage > stg.id;
            const isProcessing = currentStage === stg.id;

            return (
              <div 
                key={stg.id} 
                className={`p-3 rounded-lg border flex items-center justify-between transition-all ${
                  isProcessing
                    ? 'bg-blue-950/60 border-blue-500 text-white shadow-md translate-x-1'
                    : isCompleted
                    ? 'bg-slate-900/40 border-emerald-500/30 text-emerald-300'
                    : 'bg-slate-950/20 border-slate-900 text-slate-500'
                }`}
              >
                <span className="text-xs font-bold font-mono">{stg.name}</span>
                {isCompleted ? (
                  <span className="text-[9px] font-mono font-bold bg-[#00FF88]/10 text-[#00FF88] px-2 py-0.5 rounded border border-[#00FF88]/20">
                    COMPLETED
                  </span>
                ) : isProcessing ? (
                  <span className="text-[9px] font-mono font-bold bg-amber-400/10 text-amber-400 px-2 py-0.5 rounded border border-amber-400/20 animate-pulse">
                    PROCESSING...
                  </span>
                ) : (
                  <span className="text-[9px] font-mono text-slate-600">PENDING</span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  const hasActiveSession = resultMode !== 'NONE' && !!resultData;

  return (
    <div className="space-y-5">
      {/* Accordion Stages Container */}
      <div className="gov-card p-4 space-y-2.5">
        <div className="border-b border-slate-855 pb-3 flex items-center justify-between">
          <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider font-mono">
            7-Stage Forensics Accordion
          </h3>
          {hasActiveSession && (
            <span className="text-[10px] font-mono bg-slate-900 px-2 py-0.5 rounded text-slate-400">
              File: {filename}
            </span>
          )}
        </div>

        <div className="space-y-2">
          {stagesDefinition.map((stg) => {
            const checkInfo = getStageCheck(stg.id, stg.checkName);
            const isExpanded = !!expandedStages[stg.id];
            const badgeText = hasActiveSession ? `✓ ${checkInfo.status}` : 'PENDING';

            return (
              <div 
                key={stg.id} 
                className="border border-slate-800 rounded-lg overflow-hidden bg-slate-900/30"
              >
                {/* Accordion Header */}
                <button
                  type="button"
                  onClick={() => toggleStage(stg.id)}
                  className="w-full flex items-center justify-between p-3.5 hover:bg-slate-800/20 text-left transition-colors"
                >
                  <span className="text-xs font-bold text-slate-200 font-mono">
                    {stg.name}
                  </span>
                  
                  <div className="flex items-center gap-3">
                    <span className={`text-[9px] font-bold font-mono px-2 py-0.5 rounded uppercase ${getBadgeStyles(checkInfo.status, hasActiveSession)}`}>
                      {checkInfo.status === 'FAIL' ? '✗ FAIL' : badgeText}
                    </span>
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4 text-slate-400" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-slate-400" />
                    )}
                  </div>
                </button>

                {/* Accordion Body */}
                {isExpanded && (
                  <div className="p-4 bg-slate-950/60 border-t border-slate-800/80 space-y-3">
                    <div className="space-y-1">
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">
                        What this checks:
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed font-sans">
                        {stg.desc}
                      </p>
                    </div>

                    <div className="space-y-1.5">
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">
                        Finding:
                      </div>
                      <p className="text-xs text-slate-200 font-mono leading-relaxed">
                        {hasActiveSession ? checkInfo.detail : 'Pipeline has not been executed yet.'}
                      </p>
                    </div>

                    {/* Thin progress bar */}
                    {hasActiveSession && (
                      <div className="pt-1.5">
                        <div className="h-[2px] w-full bg-slate-800 rounded-full overflow-hidden">
                          <div 
                            className={`h-full ${getProgressBarColor(checkInfo.status)}`}
                            style={{ width: checkInfo.status === 'PASS' ? '100%' : checkInfo.status === 'WARN' ? '50%' : '100%' }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Final Verdict Card */}
      {hasActiveSession && resultData && (
        <div className={`gov-card p-5 border ${
          resultData.status === 'FAKE'
            ? 'bg-red-950/20 border-red-500/30 text-red-200 shadow-[0_0_15px_rgba(239,68,68,0.05)]'
            : resultData.status === 'SUSPICIOUS'
            ? 'bg-amber-950/20 border-amber-500/30 text-amber-200 shadow-[0_0_15px_rgba(245,158,11,0.05)]'
            : 'bg-emerald-950/20 border-emerald-500/30 text-emerald-200 shadow-[0_0_15px_rgba(16,185,129,0.05)]'
        } space-y-4`}>
          <div className="flex items-center justify-between border-b border-slate-855 pb-3">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400">
                FINAL VERDICT VERIFICATION
              </span>
              <h4 className="text-xl font-extrabold font-mono mt-1 uppercase tracking-tight">
                {resultData.status === 'AUTHENTIC' ? '✓ AUTHENTIC' : `✗ ${resultData.status}`}
              </h4>
              <p className="text-[10px] text-slate-400 font-mono mt-0.5">
                {resultData.label}
              </p>
            </div>
            <div className="text-right">
              <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400 block">
                CONFIDENCE
              </span>
              <span className="text-xl font-bold font-mono text-white mt-1 block">
                {resultData.confidence}%
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-slate-400">Risk Threshold:</span>
            <span className={`text-[9px] px-2 py-0.5 rounded font-mono font-bold border uppercase ${
              resultData.riskLevel === 'CRITICAL' || resultData.riskLevel === 'HIGH'
                ? 'bg-red-500/20 text-red-300 border-red-500/30'
                : resultData.riskLevel === 'MEDIUM'
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
            }`}>
              {resultData.riskLevel}
            </span>
          </div>

          {/* Reasons List */}
          {resultData.reasons && resultData.reasons.length > 0 && (
            <div className="bg-slate-950/60 p-3.5 rounded-lg border border-slate-800/80 space-y-2 mt-1">
              <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest font-mono">
                Primary Threat Factors:
              </div>
              <ul className="space-y-1.5 text-xs font-sans text-slate-300">
                {resultData.reasons.map((r, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-[#FF4444] font-bold">•</span>
                    <span>{r}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export const ScreeningWorkspace: React.FC = () => {
  const navigate = useNavigate();
  const { activeCaseId, setActiveCaseId, travelerName, setTravelerName } = useScreening();

  const [docType, setDocType] = useState<string>('passport');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [currentStage, setCurrentStage] = useState<number>(0);
  const [resultMode, setResultMode] = useState<'NONE' | 'SCREENING'>('NONE');
  const [resultData, setResultData] = useState<CaseCheckData | null>(null);

  // Smart validation state
  const [isValidating, setIsValidating] = useState<boolean>(false);
  const [validationResult, setValidationResult] = useState<DocValidationResult | null>(null);
  const [validationPassed, setValidationPassed] = useState<boolean | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  // File Selection Handler
  const handleFileSelected = useCallback(async (file: File) => {
    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    setValidationResult(null);
    setValidationPassed(null);
    setResultMode('NONE');
    setResultData(null);
    setCurrentStage(0);

    setIsValidating(true);
    try {
      const res = await api.validateDocumentType(file, docType);
      setValidationResult(res);
      setValidationPassed(res.is_valid);
    } catch {
      setValidationResult(null);
      setValidationPassed(true);
    } finally {
      setIsValidating(false);
    }
  }, [docType]);

  const handleDropZoneClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFileSelected(file);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) handleFileSelected(file);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  // 1. Run Document Screening Handler
  const triggerNormalScreening = async () => {
    if (!selectedFile) return;
    setIsAnalyzing(true);
    setResultMode('NONE');
    setResultData(null);
    setCurrentStage(0);

    // Simulate analysis delay
    await new Promise(r => setTimeout(r, 1400));

    await documentAnalysisService.analyzeDocument({
      documentId: selectedFile.name,
      filename: selectedFile.name,
      travelerId: travelerName
    });

    setIsAnalyzing(false);
    
    // Redirect to Command Dashboard so the user sees results reactively
    navigate('/dashboard');
  };

  // 2. Verify Authenticity Handler (Stage-by-Stage Telemetry Animation)
  const triggerAuthenticityCheck = async () => {
    if (!selectedFile) return;

    setIsAnalyzing(true);
    setResultMode('NONE');
    setResultData(null);
    setCurrentStage(1);

    // Run 400ms delay per stage to animate loading state
    for (let i = 1; i <= 7; i++) {
      setCurrentStage(i);
      await new Promise(r => setTimeout(r, 400));
    }

    const authResult = await getAuthenticityResult(selectedFile.name);
    setResultData(authResult);

    setIsAnalyzing(false);
    setResultMode('SCREENING');

    // Scroll down to the results wrapper automatically
    setTimeout(() => {
      resultsRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  // Active filename helper to display in UI
  const getActiveFilename = () => {
    if (selectedFile) return selectedFile.name;
    if (activeCaseId === 'TRI-2026-0001') return "fake-passport.jpg";
    if (activeCaseId === 'TRI-2026-0002') return "genuine-passport.jpg";
    if (activeCaseId === 'TRI-2026-0003') return "manipulated-passport.jpg";
    return "unknown-passport.jpg";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gov-border pb-4">
        <div>
          <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
            Multimodal Document Screening Workspace
          </h2>
          <p className="text-xs text-slate-400">
            Official border entry passenger identity validation portal
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-slate-400">Target Scenario:</span>
          <select
            value={activeCaseId}
            onChange={(e) => {
              setActiveCaseId(e.target.value);
              setResultMode('NONE');
              setResultData(null);
            }}
            className="bg-slate-900 border border-gov-border rounded px-3 py-1.5 text-xs text-amber-400 font-mono font-bold"
          >
            <option value="TRI-2026-0001">TRI-2026-0001 (Vikram Malhotra - Hero Attack Case)</option>
            <option value="TRI-2026-0002">TRI-2026-0002 (Ananya Sharma - Genuine Passport)</option>
            <option value="TRI-2026-0003">TRI-2026-0003 (Rahul Verma - Photo Replacement)</option>
          </select>
        </div>
      </div>

      {/* Main Two-Column Workspace Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Document Intake Panel */}
        <div className="lg:col-span-5 gov-card space-y-4 h-fit">
          <div className="border-b border-gov-border pb-3 flex items-center justify-between">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Upload className="w-4 h-4 text-gov-accent" /> Document Intake Panel
            </h3>
            <span className="text-[10px] font-mono bg-blue-950 text-blue-400 px-2 py-0.5 rounded border border-blue-500/30">
              MHA Standard
            </span>
          </div>

          <div className="space-y-3 text-xs font-mono">
            <div>
              <label className="block text-slate-300 font-sans font-semibold mb-1">Traveler Full Name:</label>
              <input
                type="text"
                value={travelerName}
                onChange={(e) => setTravelerName(e.target.value)}
                className="w-full bg-slate-900 border border-gov-border rounded p-2.5 text-white font-sans focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-sans font-semibold mb-1">Document Classification Category:</label>
              <select
                value={docType}
                onChange={(e) => {
                  setDocType(e.target.value);
                  setValidationResult(null);
                  setValidationPassed(null);
                  setResultMode('NONE');
                  setResultData(null);
                }}
                className="w-full bg-slate-900 border border-gov-border rounded p-2.5 text-white font-sans focus:outline-none"
              >
                <option value="passport">Travel Passport (ICAO Doc 9303)</option>
                <option value="visa">Entry Visa / Permit Seal</option>
                <option value="national_id">National ID / Aadhaar Equivalent</option>
                <option value="driving_license">Driving License</option>
                <option value="permit">Border Transit Permit</option>
              </select>
            </div>

            {/* Hidden file input */}
            <input
              ref={fileInputRef}
              type="file"
              accept=".jpg,.jpeg,.png,.webp,.pdf"
              className="hidden"
              onChange={handleFileInputChange}
            />

            {/* Drag & Drop Preview Zone */}
            <div
              onClick={handleDropZoneClick}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              className={`border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center gap-2 bg-slate-950 transition-all cursor-pointer relative ${
                validationPassed === true
                  ? 'border-emerald-500 hover:border-emerald-400'
                  : validationPassed === false
                  ? 'border-red-500/70'
                  : 'border-gov-border hover:border-blue-500'
              }`}
            >
              {isValidating ? (
                <>
                  <RefreshCw className="w-8 h-8 text-amber-400 animate-spin" />
                  <div className="text-amber-300 font-sans font-semibold text-center text-xs">
                    Analysing document type…
                  </div>
                  <div className="text-[10px] text-slate-500">AI document classifier running</div>
                </>
              ) : selectedFile ? (
                <div className="w-full text-center space-y-2">
                  {previewUrl && (
                    <img
                      src={previewUrl}
                      alt="Document Preview"
                      className="max-h-48 mx-auto rounded border border-slate-700 object-contain shadow-md"
                    />
                  )}
                  <div className="text-emerald-300 font-sans font-semibold text-xs flex items-center justify-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" /> {selectedFile.name}
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono">
                    ✓ Scan Ready
                  </div>
                </div>
              ) : (
                <>
                  <Upload className="w-8 h-8 text-blue-400 animate-bounce" />
                  <div className="text-slate-300 font-sans font-semibold text-center">
                    Drag & Drop Document Image here or <span className="text-blue-400 underline">Browse Files</span>
                  </div>
                  <div className="text-[10px] text-slate-500">Supports JPG, PNG, WEBP, PDF up to 15MB</div>
                </>
              )}
            </div>

            {/* Smart Validation Result Banner */}
            {validationResult && !validationResult.is_valid && (
              <div className="bg-red-950/60 border border-red-500/50 text-red-200 rounded-lg p-3 text-xs font-sans space-y-1">
                <div className="flex items-center gap-2 font-bold">
                  <XCircle className="w-4 h-4 text-red-400 shrink-0" /> Incorrect Document Detected
                </div>
                <div className="text-[11px] text-slate-300 italic">{validationResult.message}</div>
              </div>
            )}

            {/* Action Buttons: side-by-side grid */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                type="button"
                onClick={triggerNormalScreening}
                disabled={!selectedFile || isAnalyzing || isValidating}
                className="flex items-center justify-center gap-2 px-3 py-3 text-xs font-sans font-bold uppercase tracking-wider border border-slate-800 bg-slate-900/40 text-slate-400 hover:bg-slate-800/60 hover:text-white rounded transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              >
                🔍 Run Document Screening
              </button>
              <button
                type="button"
                onClick={triggerAuthenticityCheck}
                disabled={!selectedFile || isAnalyzing || isValidating}
                className="flex items-center justify-center gap-2 px-3 py-3 text-xs font-sans font-bold uppercase tracking-wider bg-[#00D4FF] hover:bg-[#00b0d4] text-[#0A0F1E] rounded transition-all shadow-[0_0_12px_rgba(0,212,255,0.25)] disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {isAnalyzing ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#0A0F1E]" /> Running...
                  </>
                ) : (
                  <>
                    🛡️ Verify Authenticity
                  </>
                )}
              </button>
            </div>

            <p className="text-[10px] text-slate-500 font-sans text-center leading-tight pt-1">
              Document type classification establishes document category. Authenticity determination
              remains the sole responsibility of the AI forensic pipeline and authorized officers.
            </p>
          </div>
        </div>

        {/* Right Column: PipelineResults Accordion / Loading Progress */}
        <div className="lg:col-span-7 h-fit" ref={resultsRef}>
          <PipelineResults
            isAnalyzing={isAnalyzing}
            currentStage={currentStage}
            resultData={resultData}
            resultMode={resultMode}
            filename={getActiveFilename()}
          />
        </div>
      </div>
    </div>
  );
};

export default ScreeningWorkspace;
