import type { MCQImage } from "@/lib/types";

/* ── Individual SVG renderers ──────────────────────────────────── */

function ChestXray() {
  return (
    <svg viewBox="0 0 320 240" className="w-full h-full" aria-label="Chest X-ray">
      <rect width="320" height="240" fill="#080808" rx="4" />
      {/* spine */}
      <rect x="155" y="18" width="10" height="185" fill="#3a3a3a" rx="2" />
      {/* ribs left */}
      {Array.from({ length: 9 }).map((_, i) => (
        <path key={`rl${i}`}
          d={`M 155 ${28 + i * 20} Q ${110 - i * 2} ${18 + i * 20} ${58 + i * 2} ${34 + i * 20}`}
          stroke="#555" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      ))}
      {/* ribs right */}
      {Array.from({ length: 9 }).map((_, i) => (
        <path key={`rr${i}`}
          d={`M 165 ${28 + i * 20} Q ${210 + i * 2} ${18 + i * 20} ${262 - i * 2} ${34 + i * 20}`}
          stroke="#555" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      ))}
      {/* clavicles */}
      <path d="M 110 22 Q 130 14 158 18" stroke="#888" strokeWidth="3" fill="none" />
      <path d="M 210 22 Q 190 14 162 18" stroke="#888" strokeWidth="3" fill="none" />
      {/* heart shadow */}
      <ellipse cx="148" cy="148" rx="46" ry="58" fill="#181818" stroke="#3a3a3a" strokeWidth="1.5" />
      {/* lungs */}
      <ellipse cx="98" cy="120" rx="50" ry="80" fill="#101010" stroke="#444" strokeWidth="1" />
      <ellipse cx="218" cy="120" rx="54" ry="80" fill="#101010" stroke="#444" strokeWidth="1" />
      {/* lung vasculature */}
      {[120, 140, 160].map((y, i) => (
        <line key={`lv${i}`} x1="70" y1={y} x2="140" y2={y + 5} stroke="#252525" strokeWidth="1" />
      ))}
      {[110, 130, 155].map((y, i) => (
        <line key={`rv${i}`} x1="175" y1={y} x2="260" y2={y + 5} stroke="#252525" strokeWidth="1" />
      ))}
      {/* labels */}
      <text x="14" y="230" fill="#555" fontSize="11" fontFamily="monospace">R</text>
      <text x="302" y="230" fill="#555" fontSize="11" fontFamily="monospace">L</text>
      <text x="8" y="14" fill="#444" fontSize="9" fontFamily="monospace">PA CHEST</text>
    </svg>
  );
}

function ECGStrip({ finding }: { finding?: string }) {
  const hasSTE = finding?.toLowerCase().includes("st elevation");
  const waveColor = hasSTE ? "#FF6B6B" : "#22C55E";
  // Two PQRST complexes
  const complex = (ox: number) =>
    `M ${ox} 80 L ${ox + 15} 80 L ${ox + 18} 76 L ${ox + 21} 80 L ${ox + 26} 80 ` +
    `L ${ox + 30} ${hasSTE ? 35 : 20} L ${ox + 35} ${hasSTE ? 90 : 100} L ${ox + 40} 80 ` +
    `L ${ox + 46} 80 L ${ox + 50} ${hasSTE ? 62 : 70} L ${ox + 56} 80`;
  return (
    <svg viewBox="0 0 380 160" className="w-full h-full" aria-label="ECG Strip">
      <rect width="380" height="160" fill="#051005" rx="4" />
      {/* grid */}
      {Array.from({ length: 20 }).map((_, i) => (
        <line key={`v${i}`} x1={i * 20} y1="0" x2={i * 20} y2="160" stroke="#0a2a0a" strokeWidth="1" />
      ))}
      {Array.from({ length: 9 }).map((_, i) => (
        <line key={`h${i}`} x1="0" y1={i * 20} x2="380" y2={i * 20} stroke="#0a2a0a" strokeWidth="1" />
      ))}
      {/* major grid */}
      {Array.from({ length: 5 }).map((_, i) => (
        <line key={`mv${i}`} x1={i * 80} y1="0" x2={i * 80} y2="160" stroke="#0f3a0f" strokeWidth="1.5" />
      ))}
      {[0, 40, 80, 120, 160].map((y) => (
        <line key={`mh${y}`} x1="0" y1={y} x2="380" y2={y} stroke="#0f3a0f" strokeWidth="1.5" />
      ))}
      {/* baseline */}
      <line x1="0" y1="80" x2="380" y2="80" stroke="#1a4a1a" strokeWidth="1" />
      {/* waveforms */}
      {[10, 110, 210, 300].map((ox) => (
        <path key={ox} d={complex(ox)} stroke={waveColor} strokeWidth="2.5" fill="none"
          strokeLinecap="round" strokeLinejoin="round" />
      ))}
      {/* STE label */}
      {hasSTE && (
        <text x="10" y="150" fill="#FF6B6B" fontSize="10" fontFamily="monospace">▲ ST ELEVATION V1–V4</text>
      )}
      {!hasSTE && (
        <text x="10" y="150" fill="#22C55E" fontSize="10" fontFamily="monospace">SINUS RHYTHM</text>
      )}
      <text x="300" y="150" fill="#555" fontSize="9" fontFamily="monospace">25mm/s 10mm/mV</text>
    </svg>
  );
}

function BrainCT() {
  return (
    <svg viewBox="0 0 280 280" className="w-full h-full" aria-label="CT Brain Axial">
      <rect width="280" height="280" fill="#050505" rx="4" />
      {/* skull ring */}
      <circle cx="140" cy="140" r="128" fill="#1c1c1c" stroke="#3a3a3a" strokeWidth="3" />
      <circle cx="140" cy="140" r="112" fill="#111" />
      {/* grey matter rim */}
      <circle cx="140" cy="140" r="108" fill="#1a1a1a" stroke="#2a2a2a" strokeWidth="1" />
      {/* white matter */}
      <circle cx="140" cy="140" r="88" fill="#141414" />
      {/* lateral ventricles */}
      <ellipse cx="125" cy="130" rx="14" ry="8" fill="#0a0a0a" stroke="#252525" strokeWidth="0.5" />
      <ellipse cx="155" cy="130" rx="14" ry="8" fill="#0a0a0a" stroke="#252525" strokeWidth="0.5" />
      {/* falx cerebri */}
      <line x1="140" y1="32" x2="140" y2="248" stroke="#2a2a2a" strokeWidth="1.5" />
      {/* sulci */}
      {[30, 70, 110, 150, 190, 230, 270, 310, 350].map((angle) => {
        const rad = (angle * Math.PI) / 180;
        const x1 = 140 + 88 * Math.cos(rad);
        const y1 = 140 + 88 * Math.sin(rad);
        const x2 = 140 + 105 * Math.cos(rad);
        const y2 = 140 + 105 * Math.sin(rad);
        return <line key={angle} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#1e1e1e" strokeWidth="1" />;
      })}
      {/* hypodense area (ischaemia) */}
      <ellipse cx="105" cy="120" rx="22" ry="18" fill="#090909" stroke="#222" strokeWidth="0.5" opacity="0.8" />
      {/* labels */}
      <text x="8" y="20" fill="#555" fontSize="9" fontFamily="monospace">AXIAL CT BRAIN</text>
      <text x="8" y="270" fill="#555" fontSize="9" fontFamily="monospace">R</text>
      <text x="262" y="270" fill="#555" fontSize="9" fontFamily="monospace">L</text>
    </svg>
  );
}

function HandXray() {
  return (
    <svg viewBox="0 0 220 320" className="w-full h-full" aria-label="Hand X-ray">
      <rect width="220" height="320" fill="#080808" rx="4" />
      {/* wrist bones */}
      {[
        [75, 265, 28, 18], [105, 268, 22, 16], [130, 262, 22, 18], [150, 265, 20, 16],
        [72, 242, 22, 16], [100, 240, 24, 16], [128, 240, 22, 16], [152, 242, 20, 16],
      ].map(([cx, cy, rx, ry], i) => (
        <ellipse key={`c${i}`} cx={cx} cy={cy} rx={rx} ry={ry} fill="#202020" stroke="#505050" strokeWidth="1.5" />
      ))}
      {/* metacarpals */}
      {[62, 88, 110, 132, 155].map((x, i) => (
        <rect key={`mc${i}`} x={x - 8} y={i === 0 ? 210 : 200} width="16" height={i === 0 ? 42 : 52}
          fill="#1c1c1c" stroke="#555" strokeWidth="1.5" rx="4" />
      ))}
      {/* proximal phalanges */}
      {[62, 88, 110, 132, 155].map((x, i) => (
        <rect key={`pp${i}`} x={x - 7} y={i === 0 ? 167 : 145} width="14" height={i === 0 ? 36 : 48}
          fill="#1a1a1a" stroke="#555" strokeWidth="1.5" rx="3" />
      ))}
      {/* middle phalanges (not thumb) */}
      {[88, 110, 132, 155].map((x) => (
        <rect key={`mp${x}`} x={x - 6} y={100} width="12" height={38}
          fill="#1a1a1a" stroke="#555" strokeWidth="1.5" rx="3" />
      ))}
      {/* distal phalanges */}
      {[62, 88, 110, 132, 155].map((x, i) => (
        <path key={`dp${i}`}
          d={`M ${x - 6} ${i === 0 ? 130 : 93} L ${x + 6} ${i === 0 ? 130 : 93} L ${x + 4} ${i === 0 ? 108 : 68} L ${x} ${i === 0 ? 104 : 64} L ${x - 4} ${i === 0 ? 108 : 68} Z`}
          fill="#1a1a1a" stroke="#555" strokeWidth="1.5" />
      ))}
      {/* joint space erosions (for RA question) */}
      <ellipse cx="88" cy="145" rx="9" ry="4" fill="#0a0a0a" stroke="#333" strokeWidth="0.5" />
      <ellipse cx="110" cy="145" rx="9" ry="4" fill="#0a0a0a" stroke="#333" strokeWidth="0.5" />
      <text x="8" y="14" fill="#555" fontSize="9" fontFamily="monospace">HAND X-RAY PA</text>
      <text x="8" y="312" fill="#555" fontSize="9" fontFamily="monospace">R</text>
    </svg>
  );
}

function KneeXray() {
  return (
    <svg viewBox="0 0 240 300" className="w-full h-full" aria-label="Knee X-ray">
      <rect width="240" height="300" fill="#080808" rx="4" />
      {/* femur shaft */}
      <rect x="90" y="10" width="60" height="110" fill="#1c1c1c" stroke="#555" strokeWidth="2" rx="10" />
      {/* femoral condyles */}
      <ellipse cx="100" cy="128" rx="30" ry="22" fill="#1c1c1c" stroke="#555" strokeWidth="2" />
      <ellipse cx="140" cy="128" rx="30" ry="22" fill="#1c1c1c" stroke="#555" strokeWidth="2" />
      {/* joint space */}
      <rect x="70" y="148" width="100" height="6" fill="#050505" />
      {/* tibial plateau */}
      <rect x="65" y="154" width="110" height="14" fill="#1c1c1c" stroke="#555" strokeWidth="2" rx="3" />
      {/* tibia shaft */}
      <rect x="82" y="168" width="50" height="110" fill="#1c1c1c" stroke="#555" strokeWidth="2" rx="8" />
      {/* fibula */}
      <rect x="142" y="172" width="20" height="98" fill="#181818" stroke="#444" strokeWidth="1.5" rx="6" />
      {/* patella */}
      <ellipse cx="120" cy="132" rx="20" ry="14" fill="#161616" stroke="#444" strokeWidth="1.5" />
      {/* osteophyte */}
      <path d="M 68 154 L 55 144 L 65 148" fill="#252525" stroke="#555" strokeWidth="1" />
      <text x="8" y="14" fill="#555" fontSize="9" fontFamily="monospace">KNEE AP</text>
      <text x="8" y="292" fill="#555" fontSize="9" fontFamily="monospace">R</text>
    </svg>
  );
}

function AbdominalXray() {
  return (
    <svg viewBox="0 0 300 360" className="w-full h-full" aria-label="Abdominal X-ray">
      <rect width="300" height="360" fill="#080808" rx="4" />
      {/* spine */}
      <rect x="143" y="20" width="14" height="310" fill="#3a3a3a" rx="3" />
      {/* vertebral bodies */}
      {Array.from({ length: 10 }).map((_, i) => (
        <rect key={`v${i}`} x="136" y={28 + i * 30} width="28" height="20"
          fill="#222" stroke="#555" strokeWidth="1" rx="2" />
      ))}
      {/* iliac bones */}
      <path d="M 80 200 Q 50 160 60 260 Q 80 300 120 310 L 143 305" stroke="#555" strokeWidth="3" fill="none" strokeLinecap="round" />
      <path d="M 220 200 Q 250 160 240 260 Q 220 300 180 310 L 157 305" stroke="#555" strokeWidth="3" fill="none" strokeLinecap="round" />
      {/* bowel gas loops — step-ladder pattern */}
      {[60, 100, 140, 180].map((y, i) => (
        <g key={`bl${i}`}>
          <rect x={i % 2 === 0 ? 70 : 160} y={y} width="90" height="28" rx="12"
            fill="#0a0a0a" stroke="#333" strokeWidth="1.5" />
          {/* air-fluid levels */}
          <line x1={i % 2 === 0 ? 75 : 165} y1={y + 18} x2={i % 2 === 0 ? 155 : 245} y2={y + 18}
            stroke="#1e1e1e" strokeWidth="1" />
        </g>
      ))}
      {/* psoas shadows */}
      <path d="M 120 50 Q 100 150 105 280" stroke="#1e1e1e" strokeWidth="8" fill="none" opacity="0.5" />
      <path d="M 180 50 Q 200 150 195 280" stroke="#1e1e1e" strokeWidth="8" fill="none" opacity="0.5" />
      <text x="8" y="14" fill="#555" fontSize="9" fontFamily="monospace">ERECT AXR</text>
      <text x="8" y="352" fill="#555" fontSize="9" fontFamily="monospace">R</text>
      <text x="278" y="352" fill="#555" fontSize="9" fontFamily="monospace">L</text>
    </svg>
  );
}

function ThyroidScan() {
  return (
    <svg viewBox="0 0 260 200" className="w-full h-full" aria-label="Thyroid Scan">
      <rect width="260" height="200" fill="#030810" rx="4" />
      {/* left lobe */}
      <ellipse cx="90" cy="100" rx="48" ry="62" fill="#0a1a0a" stroke="#1a4a1a" strokeWidth="1" />
      <ellipse cx="90" cy="100" rx="38" ry="52" fill="#0d2a0d" />
      <ellipse cx="90" cy="100" rx="25" ry="35" fill="#144a14" opacity="0.7" />
      {/* isthmus */}
      <rect x="118" y="88" width="24" height="24" fill="#0d2a0d" stroke="#1a4a1a" strokeWidth="1" rx="4" />
      {/* right lobe */}
      <ellipse cx="170" cy="100" rx="52" ry="62" fill="#0a1a0a" stroke="#1a4a1a" strokeWidth="1" />
      <ellipse cx="170" cy="100" rx="42" ry="52" fill="#0d2a0d" />
      <ellipse cx="170" cy="100" rx="30" ry="38" fill="#144a14" opacity="0.7" />
      {/* hot/cold nodule */}
      <ellipse cx="158" cy="88" rx="14" ry="12" fill="#1a1a0a" stroke="#555" strokeWidth="1" />
      {/* uptake gradient dots */}
      {Array.from({ length: 30 }).map((_, i) => {
        const angle = (i / 30) * 2 * Math.PI;
        const r = 20 + Math.random() * 18;
        const side = i % 2 === 0 ? 90 : 170;
        return (
          <circle key={i} cx={side + r * Math.cos(angle)} cy={100 + r * Math.sin(angle)}
            r="1.5" fill="#22aa22" opacity={0.3 + Math.random() * 0.5} />
        );
      })}
      <text x="8" y="14" fill="#2a6a2a" fontSize="9" fontFamily="monospace">THYROID NUCLEAR SCAN</text>
      <text x="50" y="186" fill="#2a6a2a" fontSize="9" fontFamily="monospace">L LOBE</text>
      <text x="148" y="186" fill="#2a6a2a" fontSize="9" fontFamily="monospace">R LOBE</text>
      <text x="108" y="190" fill="#555" fontSize="8" fontFamily="monospace">ISTHMUS</text>
    </svg>
  );
}

function Histology() {
  return (
    <svg viewBox="0 0 280 220" className="w-full h-full" aria-label="Histology slide">
      <rect width="280" height="220" fill="#1a0a0a" rx="4" />
      {/* cells */}
      {Array.from({ length: 40 }).map((_, i) => {
        const x = 20 + (i % 8) * 30;
        const y = 20 + Math.floor(i / 8) * 38;
        const r = 10 + Math.random() * 4;
        return (
          <g key={i}>
            <circle cx={x} cy={y} r={r} fill="#2a0a0a" stroke="#8B3A3A" strokeWidth="1" />
            <circle cx={x - 2} cy={y - 2} r={4} fill="#6B1A1A" />
            <circle cx={x + 2} cy={y + 2} r={2} fill="#8B3A3A" opacity="0.5" />
          </g>
        );
      })}
      {/* fibrous stroma */}
      <path d="M 20 200 Q 140 180 280 200" stroke="#5a2a2a" strokeWidth="1" fill="none" />
      <text x="8" y="14" fill="#8B3A3A" fontSize="9" fontFamily="monospace">H&E STAIN ×200</text>
    </svg>
  );
}

function Fundoscopy() {
  return (
    <svg viewBox="0 0 260 260" className="w-full h-full" aria-label="Fundoscopy">
      <rect width="260" height="260" fill="#050505" rx="4" />
      <circle cx="130" cy="130" r="120" fill="#1a0800" />
      <circle cx="130" cy="130" r="110" fill="#220a00" />
      {/* optic disc */}
      <circle cx="168" cy="118" r="18" fill="#cc9944" stroke="#ffcc66" strokeWidth="1.5" />
      <circle cx="168" cy="118" r="10" fill="#ddaa55" />
      {/* cup */}
      <circle cx="169" cy="117" r="5" fill="#eebb66" />
      {/* retinal vessels */}
      {[0, 40, 80, 120, 160, 200, 240, 280, 320].map((angle, i) => {
        const rad = (angle * Math.PI) / 180;
        return (
          <path key={i}
            d={`M ${168 + 10 * Math.cos(rad)} ${118 + 10 * Math.sin(rad)} Q ${130 + 50 * Math.cos(rad)} ${130 + 50 * Math.sin(rad)} ${130 + 90 * Math.cos(rad)} ${130 + 90 * Math.sin(rad)}`}
            stroke={i % 2 === 0 ? "#cc4444" : "#882222"}
            strokeWidth={2 - i * 0.1}
            fill="none" />
        );
      })}
      {/* fovea */}
      <circle cx="110" cy="132" r="8" fill="#110400" stroke="#331100" strokeWidth="1" />
      {/* haemorrhages */}
      <ellipse cx="90" cy="90" rx="8" ry="4" fill="#660000" opacity="0.8" transform="rotate(-30 90 90)" />
      <ellipse cx="155" cy="155" rx="6" ry="3" fill="#660000" opacity="0.7" transform="rotate(20 155 155)" />
      {/* cotton wool spots */}
      <ellipse cx="148" cy="150" rx="7" ry="5" fill="#fffacc" opacity="0.3" />
      {/* papilloedema disc swelling */}
      <circle cx="168" cy="118" r="22" fill="none" stroke="#ffcc6644" strokeWidth="4" />
      <text x="8" y="254" fill="#8B5E3C" fontSize="9" fontFamily="monospace">FUNDOSCOPY — PAPILLOEDEMA</text>
    </svg>
  );
}

function UrineDipstick() {
  const strips = [
    { label: "Glucose", neg: false, value: "4+" },
    { label: "Protein", neg: true, value: "NEG" },
    { label: "Ketones", neg: false, value: "4+" },
    { label: "Blood", neg: true, value: "NEG" },
    { label: "Nitrite", neg: true, value: "NEG" },
    { label: "pH", neg: null, value: "6.0" },
  ];
  return (
    <svg viewBox="0 0 280 200" className="w-full h-full" aria-label="Urine Dipstick">
      <rect width="280" height="200" fill="#0a0808" rx="4" />
      <rect x="20" y="20" width="240" height="20" fill="#2a2010" stroke="#554030" strokeWidth="1" rx="4" />
      <text x="28" y="34" fill="#aaa" fontSize="10" fontFamily="monospace">URINE DIPSTICK ANALYSIS</text>
      {strips.map((s, i) => (
        <g key={s.label}>
          <rect x="20" y={48 + i * 24} width="240" height="20" fill={i % 2 === 0 ? "#120c0a" : "#0e0a08"} />
          <text x="28" y={62 + i * 24} fill="#888" fontSize="10" fontFamily="monospace">{s.label}</text>
          <rect x="170" y={50 + i * 24} width="80" height="16" rx="3"
            fill={s.neg === false ? "rgba(239,68,68,0.3)" : s.neg === true ? "rgba(31,41,55,0.8)" : "rgba(99,102,241,0.2)"}
            stroke={s.neg === false ? "#EF4444" : s.neg === true ? "#374151" : "#818CF8"} strokeWidth="1" />
          <text x="210" y={62 + i * 24} fill={s.neg === false ? "#FCA5A5" : s.neg === true ? "#6B7280" : "#A5B4FC"}
            fontSize="10" fontFamily="monospace" textAnchor="middle">{s.value}</text>
        </g>
      ))}
      <text x="8" y="192" fill="#555" fontSize="9" fontFamily="monospace">MSU — POINT OF CARE TEST</text>
    </svg>
  );
}

function PeripheralSmear() {
  return (
    <svg viewBox="0 0 280 220" className="w-full h-full" aria-label="Peripheral Blood Smear">
      <rect width="280" height="220" fill="#08080a" rx="4" />
      {/* RBCs */}
      {Array.from({ length: 35 }).map((_, i) => {
        const x = 18 + (i % 7) * 38;
        const y = 20 + Math.floor(i / 7) * 40;
        return (
          <g key={i}>
            <ellipse cx={x} cy={y} rx={13} ry={11} fill="#6b1a2a" stroke="#8B2232" strokeWidth="1" />
            <ellipse cx={x} cy={y} rx={5} ry={4} fill="#3a0a12" />
          </g>
        );
      })}
      {/* WBCs (larger) */}
      {[[80, 100], [180, 160], [240, 80]].map(([x, y], i) => (
        <g key={`wbc${i}`}>
          <circle cx={x} cy={y} r={18} fill="#1a1a3a" stroke="#4444aa" strokeWidth="1.5" />
          <circle cx={x - 2} cy={y - 2} r={8} fill="#2a2a5a" />
          {/* multi-lobed nucleus */}
          <circle cx={x + 4} cy={y + 4} r={5} fill="#2a2a5a" />
        </g>
      ))}
      {/* platelets */}
      {[[120, 140], [200, 100], [60, 170]].map(([x, y], i) => (
        <ellipse key={`plt${i}`} cx={x} cy={y} rx={4} ry={3} fill="#4a2a0a" stroke="#8B5A1a" strokeWidth="1" />
      ))}
      <text x="8" y="14" fill="#555" fontSize="9" fontFamily="monospace">PERIPHERAL BLOOD SMEAR ×400</text>
      <text x="8" y="212" fill="#555" fontSize="9" fontFamily="monospace">GIEMSA STAIN</text>
    </svg>
  );
}

/* ── Main component ────────────────────────────────────────────── */
export default function MedicalImage({ image }: { image: MCQImage }) {
  const render = () => {
    switch (image.type) {
      case "chest-xray":   return <ChestXray />;
      case "ecg":          return <ECGStrip finding={image.finding} />;
      case "brain-ct":     return <BrainCT />;
      case "hand-xray":    return <HandXray />;
      case "knee-xray":    return <KneeXray />;
      case "abdominal-xray": return <AbdominalXray />;
      case "thyroid-scan": return <ThyroidScan />;
      case "histology":    return <Histology />;
      case "fundoscopy":   return <Fundoscopy />;
      case "urine-dipstick": return <UrineDipstick />;
      case "peripheral-smear": return <PeripheralSmear />;
      default:             return <ChestXray />;
    }
  };

  return (
    <div className="rounded-xl overflow-hidden" style={{ border: "1px solid rgba(255,255,255,0.07)" }}>
      <div className="aspect-video flex items-center justify-center bg-black">
        {render()}
      </div>
      <div className="px-3 py-2 flex items-center justify-between"
        style={{ background: "rgba(0,0,0,0.5)", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
        <span className="text-xs font-medium text-slate-400">{image.caption}</span>
        {image.finding && (
          <span className="text-xs text-amber-400 max-w-xs text-right truncate" title={image.finding}>
            ↑ {image.finding}
          </span>
        )}
      </div>
    </div>
  );
}
