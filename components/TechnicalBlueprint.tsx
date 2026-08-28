import React from 'react';

interface TechnicalBlueprintProps {
  category?: string;
  activeDimensions?: {
    dintmin?: string;
    dintmax?: string;
    dextmin?: string;
    dextmax?: string;
    htmin?: string;
    htmax?: string;
    dflmin?: string;
    dflmax?: string;
    hflmin?: string;
    hflmax?: string;
    dpesmin?: string;
    dpesmax?: string;
    hpesmin?: string;
    hpesmax?: string;
    desfmin?: string;
    desfmax?: string;
  };
  compact?: boolean;
}

export const TechnicalBlueprint: React.FC<TechnicalBlueprintProps> = ({ 
  category = 'Buchas',
  activeDimensions = {},
  compact = false 
}) => {
  const isFlanged = category.toLowerCase().includes('flange') || Boolean(activeDimensions.dflmin || activeDimensions.dflmax);
  const isSpherical = category.toLowerCase().includes('esfer') || Boolean(activeDimensions.desfmin || activeDimensions.desfmax);

  return (
    <div className={`relative w-full ${compact ? 'h-48' : 'h-64 sm:h-72'} bg-[#0f141c] rounded-xl overflow-hidden border border-slate-700/80 shadow-inner flex items-center justify-center select-none group`}>
      {/* Blueprint Grid Pattern */}
      <div 
        className="absolute inset-0 opacity-25 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(56, 189, 248, 0.2) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(56, 189, 248, 0.2) 1px, transparent 1px),
            linear-gradient(to right, rgba(56, 189, 248, 0.08) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(56, 189, 248, 0.08) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px, 40px 40px, 8px 8px, 8px 8px'
        }}
      />

      {/* Industrial Warning / Measure Markers in Corners */}
      <div className="absolute top-2 left-3 font-mono text-[9px] text-sky-400/70 tracking-widest uppercase flex items-center gap-1">
        <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
        <span>CAD-2D // COTAGEM ISO 2768</span>
      </div>

      <div className="absolute top-2 right-3 font-mono text-[9px] text-amber-400/80 tracking-wider">
        UNIDADE: MM
      </div>

      {/* SVG Engineering 2D Drawing */}
      <svg 
        viewBox="0 0 400 240" 
        className="w-full h-full p-2 max-w-[380px] drop-shadow-[0_0_12px_rgba(56,189,248,0.25)] transition-transform duration-500 group-hover:scale-105"
      >
        <defs>
          {/* Metal Hatch Pattern */}
          <pattern id="metalHatch" width="6" height="6" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">
            <line x1="0" y1="0" x2="0" y2="6" stroke="rgba(56, 189, 248, 0.4)" strokeWidth="1" />
          </pattern>
          {/* Arrow markers */}
          <marker id="arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="4" markerHeight="4" orient="auto-start-reverse">
            <path d="M 0 1.5 L 10 5 L 0 8.5 z" fill="#faaa55" />
          </marker>
          <marker id="arrow-sky" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="4" markerHeight="4" orient="auto-start-reverse">
            <path d="M 0 1.5 L 10 5 L 0 8.5 z" fill="#38bdf8" />
          </marker>
        </defs>

        {/* Center line (Eixo de Simetria) */}
        <line x1="40" y1="120" x2="360" y2="120" stroke="#38bdf8" strokeWidth="1" strokeDasharray="16,4,4,4" opacity="0.6" />
        <text x="362" y="123" fill="#38bdf8" fontSize="8" fontFamily="monospace" opacity="0.7">CL</text>

        {isSpherical ? (
          /* Esférico Drawing */
          <g>
            {/* Outer Sphere Profile */}
            <circle cx="200" cy="120" r="55" fill="url(#metalHatch)" stroke="#38bdf8" strokeWidth="2" />
            <circle cx="200" cy="120" r="28" fill="#0f141c" stroke="#38bdf8" strokeWidth="2" />
            
            {/* Dimension Lines */}
            <line x1="145" y1="40" x2="255" y2="40" stroke="#faaa55" strokeWidth="1.2" markerStart="url(#arrow)" markerEnd="url(#arrow)" />
            <line x1="145" y1="35" x2="145" y2="70" stroke="#faaa55" strokeWidth="0.8" strokeDasharray="3,3" opacity="0.7" />
            <line x1="255" y1="35" x2="255" y2="70" stroke="#faaa55" strokeWidth="0.8" strokeDasharray="3,3" opacity="0.7" />
            <text x="200" y="34" fill="#faaa55" fontSize="10" fontWeight="bold" fontFamily="monospace" textAnchor="middle">Ø desf</text>

            <line x1="172" y1="80" x2="228" y2="80" stroke="#38bdf8" strokeWidth="1.2" markerStart="url(#arrow-sky)" markerEnd="url(#arrow-sky)" />
            <text x="200" y="75" fill="#38bdf8" fontSize="9" fontWeight="bold" fontFamily="monospace" textAnchor="middle">Ø dint</text>
          </g>
        ) : isFlanged ? (
          /* Flanged Bushing (Bucha Flangeada) */
          <g>
            {/* Upper Half Section */}
            <path 
              d="M 120 70 L 145 70 L 145 85 L 260 85 L 260 105 L 120 105 Z" 
              fill="url(#metalHatch)" 
              stroke="#38bdf8" 
              strokeWidth="1.8" 
            />
            {/* Lower Half Section */}
            <path 
              d="M 120 135 L 260 135 L 260 155 L 145 155 L 145 170 L 120 170 Z" 
              fill="url(#metalHatch)" 
              stroke="#38bdf8" 
              strokeWidth="1.8" 
            />
            
            {/* Internal Hole Background */}
            <rect x="120" y="105" width="140" height="30" fill="#0b0f17" opacity="0.6" />

            {/* Dimension: dint (Diâmetro Interno) */}
            <line x1="275" y1="105" x2="275" y2="135" stroke="#38bdf8" strokeWidth="1.2" markerStart="url(#arrow-sky)" markerEnd="url(#arrow-sky)" />
            <line x1="260" y1="105" x2="285" y2="105" stroke="#38bdf8" strokeWidth="0.8" strokeDasharray="2,2" opacity="0.6" />
            <line x1="260" y1="135" x2="285" y2="135" stroke="#38bdf8" strokeWidth="0.8" strokeDasharray="2,2" opacity="0.6" />
            <text x="290" y="123" fill="#38bdf8" fontSize="9" fontWeight="bold" fontFamily="monospace">Ø dint</text>

            {/* Dimension: dext (Diâmetro Externo Corpo) */}
            <line x1="240" y1="85" x2="240" y2="155" stroke="#faaa55" strokeWidth="1.2" markerStart="url(#arrow)" markerEnd="url(#arrow)" />
            <text x="240" y="123" fill="#faaa55" fontSize="9" fontWeight="bold" fontFamily="monospace" textAnchor="middle" transform="rotate(-90 240 123)" dy="-6">Ø dext</text>

            {/* Dimension: dfl (Diâmetro Flange) */}
            <line x1="105" y1="70" x2="105" y2="170" stroke="#faaa55" strokeWidth="1.2" markerStart="url(#arrow)" markerEnd="url(#arrow)" />
            <line x1="100" y1="70" x2="120" y2="70" stroke="#faaa55" strokeWidth="0.8" strokeDasharray="2,2" opacity="0.6" />
            <line x1="100" y1="170" x2="120" y2="170" stroke="#faaa55" strokeWidth="0.8" strokeDasharray="2,2" opacity="0.6" />
            <text x="98" y="123" fill="#faaa55" fontSize="9" fontWeight="bold" fontFamily="monospace" textAnchor="end">Ø dfl</text>

            {/* Dimension: hfl (Altura Flange) */}
            <line x1="120" y1="52" x2="145" y2="52" stroke="#38bdf8" strokeWidth="1.2" markerStart="url(#arrow-sky)" markerEnd="url(#arrow-sky)" />
            <line x1="120" y1="48" x2="120" y2="70" stroke="#38bdf8" strokeWidth="0.8" strokeDasharray="2,2" opacity="0.6" />
            <line x1="145" y1="48" x2="145" y2="70" stroke="#38bdf8" strokeWidth="0.8" strokeDasharray="2,2" opacity="0.6" />
            <text x="132" y="44" fill="#38bdf8" fontSize="8" fontWeight="bold" fontFamily="monospace" textAnchor="middle">hfl</text>

            {/* Dimension: ht (Altura Total) */}
            <line x1="120" y1="195" x2="260" y2="195" stroke="#faaa55" strokeWidth="1.2" markerStart="url(#arrow)" markerEnd="url(#arrow)" />
            <line x1="120" y1="170" x2="120" y2="202" stroke="#faaa55" strokeWidth="0.8" strokeDasharray="2,2" opacity="0.6" />
            <line x1="260" y1="155" x2="260" y2="202" stroke="#faaa55" strokeWidth="0.8" strokeDasharray="2,2" opacity="0.6" />
            <text x="190" y="210" fill="#faaa55" fontSize="10" fontWeight="bold" fontFamily="monospace" textAnchor="middle">ht (Comprimento Total)</text>
          </g>
        ) : (
          /* Cylindrical Bushing (Bucha Cilíndrica Padrão) */
          <g>
            {/* Upper Half Section */}
            <rect x="130" y="75" width="140" height="28" fill="url(#metalHatch)" stroke="#38bdf8" strokeWidth="1.8" />
            {/* Lower Half Section */}
            <rect x="130" y="137" width="140" height="28" fill="url(#metalHatch)" stroke="#38bdf8" strokeWidth="1.8" />

            {/* Internal Hole */}
            <rect x="130" y="103" width="140" height="34" fill="#0b0f17" opacity="0.6" />

            {/* Dimension: dint */}
            <line x1="285" y1="103" x2="285" y2="137" stroke="#38bdf8" strokeWidth="1.2" markerStart="url(#arrow-sky)" markerEnd="url(#arrow-sky)" />
            <line x1="270" y1="103" x2="295" y2="103" stroke="#38bdf8" strokeWidth="0.8" strokeDasharray="2,2" opacity="0.6" />
            <line x1="270" y1="137" x2="295" y2="137" stroke="#38bdf8" strokeWidth="0.8" strokeDasharray="2,2" opacity="0.6" />
            <text x="300" y="123" fill="#38bdf8" fontSize="9" fontWeight="bold" fontFamily="monospace">Ø dint</text>

            {/* Dimension: dext */}
            <line x1="115" y1="75" x2="115" y2="165" stroke="#faaa55" strokeWidth="1.2" markerStart="url(#arrow)" markerEnd="url(#arrow)" />
            <line x1="110" y1="75" x2="130" y2="75" stroke="#faaa55" strokeWidth="0.8" strokeDasharray="2,2" opacity="0.6" />
            <line x1="110" y1="165" x2="130" y2="165" stroke="#faaa55" strokeWidth="0.8" strokeDasharray="2,2" opacity="0.6" />
            <text x="108" y="123" fill="#faaa55" fontSize="9" fontWeight="bold" fontFamily="monospace" textAnchor="end">Ø dext</text>

            {/* Dimension: ht */}
            <line x1="130" y1="190" x2="270" y2="190" stroke="#faaa55" strokeWidth="1.2" markerStart="url(#arrow)" markerEnd="url(#arrow)" />
            <line x1="130" y1="165" x2="130" y2="198" stroke="#faaa55" strokeWidth="0.8" strokeDasharray="2,2" opacity="0.6" />
            <line x1="270" y1="165" x2="270" y2="198" stroke="#faaa55" strokeWidth="0.8" strokeDasharray="2,2" opacity="0.6" />
            <text x="200" y="206" fill="#faaa55" fontSize="10" fontWeight="bold" fontFamily="monospace" textAnchor="middle">ht (Comprimento)</text>
          </g>
        )}
      </svg>

      {/* Blueprint Legend Footer */}
      <div className="absolute bottom-2 left-3 right-3 flex justify-between items-center text-[9px] font-mono text-slate-400 border-t border-slate-800/80 pt-1">
        <span className="flex items-center gap-2">
          <span className="text-[#38bdf8]">■</span> Diâmetro Interno
          <span className="text-[#faaa55]">■</span> Cotas Externas
        </span>
        <span className="text-amber-400 font-semibold uppercase">TOL. SINTERIZADO</span>
      </div>
    </div>
  );
};
