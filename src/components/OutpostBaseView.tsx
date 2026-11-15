import React from 'react';
import type { SystemMode, CrewCondition, SystemId } from '../domain/types';

interface OutpostBaseViewProps {
  systemModes: Record<SystemId, SystemMode>;
  crewCondition: CrewCondition;
  selectedSystemId: string | null;
  pendingEventSystemId?: string;
  onSelectObject: (id: string) => void;
}

export const OutpostBaseView: React.FC<OutpostBaseViewProps> = ({
  systemModes,
  crewCondition,
  selectedSystemId,
  pendingEventSystemId,
  onSelectObject,
}) => {
  const getStatusColor = (mode: SystemMode) => {
    switch (mode) {
      case 'normal': return '#10B981';
      case 'conserve': return '#F59E0B';
      case 'damaged': return '#EF4444';
      case 'paused': return '#64748B';
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent, id: string) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onSelectObject(id);
    }
  };

  return (
    <div className="relative w-full max-w-5xl mx-auto rounded-3xl overflow-hidden border-4 border-[var(--color-line)] bg-[#070914] shadow-2xl">
      <svg
        viewBox="0 0 1000 660"
        className="w-full h-auto select-none"
        aria-label="Interactive 2.5D Realistic Isometric Lunar Base Map"
      >
        <defs>
          {/* Deep Space Sky Gradient */}
          <linearGradient id="deepSpace" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#050711" />
            <stop offset="50%" stopColor="#0E1328" />
            <stop offset="100%" stopColor="#1B223F" />
          </linearGradient>

          {/* Lunar Regolith Platform Gradients */}
          <linearGradient id="regolithTop" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3B445C" />
            <stop offset="50%" stopColor="#2B3247" />
            <stop offset="100%" stopColor="#1E2333" />
          </linearGradient>

          <linearGradient id="regolithSideLeft" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#1A2030" />
            <stop offset="100%" stopColor="#0A0D16" />
          </linearGradient>

          {/* Subterranean Energy Plant Foundation */}
          <linearGradient id="basementMetal" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#1E293B" />
            <stop offset="50%" stopColor="#334155" />
            <stop offset="100%" stopColor="#0F172A" />
          </linearGradient>

          {/* Glass Greenhouse Arch Glass Shader */}
          <linearGradient id="glassVaultShader" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#6EE7B7" stopOpacity="0.85" />
            <stop offset="50%" stopColor="#10B981" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#047857" stopOpacity="0.9" />
          </linearGradient>

          {/* White Thermal Blanket Capsule Pod Shading */}
          <linearGradient id="capsuleWhite" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="65%" stopColor="#E2E8F0" />
            <stop offset="100%" stopColor="#94A3B8" />
          </linearGradient>

          {/* Photovoltaic Solar Panel Shader */}
          <linearGradient id="solarCellGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1E3A8A" />
            <stop offset="50%" stopColor="#1D4ED8" />
            <stop offset="100%" stopColor="#0F172A" />
          </linearGradient>

          {/* Glow Filters */}
          <filter id="glowGreen" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* 1. STARFIELD & SKY */}
        <rect width="1000" height="660" fill="url(#deepSpace)" />
        <circle cx="120" cy="80" r="1.5" fill="#FFF" opacity="0.9" />
        <circle cx="340" cy="110" r="2" fill="#FFF" opacity="0.95" />
        <circle cx="680" cy="60" r="1.5" fill="#FFF" opacity="0.7" />
        <circle cx="880" cy="100" r="2" fill="#FFF" opacity="0.8" />

        {/* Earth Horizon Rim */}
        <circle cx="180" cy="110" r="36" fill="#2563EB" />
        <path d="M152,105 Q180,90 205,110 Q185,130 152,105 Z" fill="#22C55E" opacity="0.85" />
        <circle cx="180" cy="110" r="36" fill="none" stroke="#60A5FA" strokeWidth="2" opacity="0.5" />

        {/* 2. ISOMETRIC LUNAR SURFACE PLATFORM */}
        <g id="lunarSurface">
          {/* Basement Platform Faces */}
          <polygon points="500,610 60,390 60,430 500,650" fill="url(#regolithSideLeft)" />
          <polygon points="500,610 940,390 940,430 500,650" fill="#0A0D16" />

          {/* Top Surface Regolith Plane */}
          <polygon points="500,170 940,390 500,610 60,390" fill="url(#regolithTop)" stroke="#475569" strokeWidth="4" />

          {/* Impact Craters */}
          <ellipse cx="280" cy="340" rx="48" ry="24" fill="#181E2E" stroke="#2C354A" strokeWidth="3" />
          <ellipse cx="760" cy="420" rx="40" ry="20" fill="#181E2E" stroke="#2C354A" strokeWidth="3" />
        </g>

        {/* 3. BASEMENT ENERGY PLANT & SOLAR ARRAY (Front-Left Stage) */}
        <g
          role="button"
          tabIndex={0}
          aria-label={`Subterranean Basement Energy Plant & Solar Array. Status: ${systemModes.solar}`}
          onClick={() => onSelectObject('solar')}
          onKeyDown={(e) => handleKeyDown(e, 'solar')}
          className="cursor-pointer focus:outline-none"
        >
          <rect x="150" y="400" width="230" height="170" fill="transparent" pointerEvents="all" />

          {/* Subterranean Raised Steel Basement Slab */}
          <polygon points="260,410 370,465 260,520 150,465" fill="url(#basementMetal)" stroke="#64748B" strokeWidth="3" />
          <polygon points="150,465 260,520 260,535 150,480" fill="#0F172A" />
          <polygon points="260,520 370,465 370,480 260,535" fill="#1E293B" />

          {/* Underground Power Cables Conduit */}
          <path d="M 260,520 L 360,500 L 460,450" fill="none" stroke="#F59E0B" strokeWidth="3" strokeDasharray="6,4" />

          {pendingEventSystemId === 'solar' && (
            <ellipse cx="260" cy="465" rx="110" ry="55" fill="none" stroke="#EF4444" strokeWidth="6" className="animate-pulse" />
          )}

          {/* 3D Photovoltaic Panels Array */}
          <g transform="translate(170, 420)">
            {/* Panel Row 1 */}
            <polygon points="30,20 70,0 110,20 70,40" fill="url(#solarCellGradient)" stroke="#60A5FA" strokeWidth="2" />
            <polygon points="75,42 115,22 155,42 115,62" fill="url(#solarCellGradient)" stroke="#60A5FA" strokeWidth="2" />
            {/* Panel Row 2 */}
            <polygon points="0,45 40,25 80,45 40,65" fill="url(#solarCellGradient)" stroke="#60A5FA" strokeWidth="2" />
            <polygon points="45,67 85,47 125,67 85,87" fill="url(#solarCellGradient)" stroke="#60A5FA" strokeWidth="2" />
          </g>

          {/* System Status Pill */}
          <rect x="195" y="535" width="130" height="28" rx="14" fill="#0F172A" stroke="#475569" strokeWidth="2" />
          <circle cx="210" cy="549" r="6" fill={getStatusColor(systemModes.solar)} />
          <text x="224" y="553" fontSize="12" fontWeight="900" fill="#F8FAFC">POWER PLANT</text>
        </g>

        {/* 4. REALISTIC HYDROPONIC GREENHOUSE DOMES (Right Wing) */}
        <g
          role="button"
          tabIndex={0}
          aria-label={`Hydroponic Greenhouse Domes. Status: ${systemModes.greenhouse}`}
          onClick={() => onSelectObject('greenhouse')}
          onKeyDown={(e) => handleKeyDown(e, 'greenhouse')}
          className="cursor-pointer focus:outline-none"
        >
          <rect x="580" y="220" width="280" height="220" fill="transparent" pointerEvents="all" />

          {pendingEventSystemId === 'greenhouse' && (
            <ellipse cx="720" cy="320" rx="130" ry="70" fill="none" stroke="#EF4444" strokeWidth="6" className="animate-pulse" />
          )}

          {/* Double Arch Glass Vault */}
          <path
            d="M 600,300 C 620,200 840,250 840,350 L 720,410 C 720,410 600,390 600,300 Z"
            fill="url(#glassVaultShader)"
            stroke={selectedSystemId === 'greenhouse' ? '#F97316' : '#0F172A'}
            strokeWidth="4"
          />

          {/* Internal Hydroponic Grow Lights & Plants */}
          <g opacity="0.9" filter="url(#glowGreen)">
            <ellipse cx="680" cy="310" rx="16" ry="10" fill="#4ADE80" />
            <ellipse cx="720" cy="330" rx="18" ry="12" fill="#22C55E" />
            <ellipse cx="760" cy="350" rx="16" ry="10" fill="#16A34A" />
          </g>

          {/* Structural Steel Rib Framework */}
          <path d="M 640,290 C 650,230 780,270 780,330" fill="none" stroke="#FFFFFF" strokeWidth="3" opacity="0.8" />
          <path d="M 680,310 C 690,250 810,290 810,350" fill="none" stroke="#FFFFFF" strokeWidth="3" opacity="0.8" />

          {/* Status Badge */}
          <rect x="655" y="400" width="135" height="28" rx="14" fill="#0F172A" stroke="#475569" strokeWidth="2" />
          <circle cx="670" cy="414" r="6" fill={getStatusColor(systemModes.greenhouse)} />
          <text x="684" y="418" fontSize="12" fontWeight="900" fill="#F8FAFC">GREENHOUSE</text>
        </g>

        {/* 5. CENTRAL HABITAT CAPSULE POD */}
        <g
          role="button"
          tabIndex={0}
          aria-label={`Central Habitat Capsule Pod. Status: ${systemModes.habitat}`}
          onClick={() => onSelectObject('habitat')}
          onKeyDown={(e) => handleKeyDown(e, 'habitat')}
          className="cursor-pointer focus:outline-none"
        >
          <rect x="430" y="140" width="140" height="230" fill="transparent" pointerEvents="all" />

          {pendingEventSystemId === 'habitat' && (
            <ellipse cx="500" cy="240" rx="80" ry="105" fill="none" stroke="#EF4444" strokeWidth="6" className="animate-pulse" />
          )}

          {/* Support Legs */}
          <line x1="455" y1="290" x2="445" y2="330" stroke="#94A3B8" strokeWidth="6" />
          <line x1="545" y1="290" x2="555" y2="330" stroke="#94A3B8" strokeWidth="6" />

          {/* Multi-stage Capsule Pod Body */}
          <rect x="445" y="150" width="110" height="140" rx="45" fill="url(#capsuleWhite)" stroke={selectedSystemId === 'habitat' ? '#F97316' : '#0F172A'} strokeWidth="4" />
          <ellipse cx="500" cy="150" rx="55" ry="24" fill="#FFFFFF" stroke="#0F172A" strokeWidth="3" />

          {/* Porthole Observation Window */}
          <circle cx="500" cy="205" r="16" fill="#0F172A" stroke="#38BDF8" strokeWidth="3" />
          <circle cx="495" cy="200" r="5" fill="#FFFFFF" opacity="0.9" />

          {/* Status Badge */}
          <rect x="440" y="335" width="120" height="28" rx="14" fill="#0F172A" stroke="#475569" strokeWidth="2" />
          <circle cx="455" cy="349" r="6" fill={getStatusColor(systemModes.habitat)} />
          <text x="468" y="353" fontSize="12" fontWeight="900" fill="#F8FAFC">HABITAT</text>
        </g>

        {/* 6. COMMS DISH & TOWER */}
        <g
          role="button"
          tabIndex={0}
          aria-label="High-Gain Communications Dish"
          onClick={() => onSelectObject('comms')}
          onKeyDown={(e) => handleKeyDown(e, 'comms')}
          className="cursor-pointer focus:outline-none"
        >
          <rect x="660" y="120" width="110" height="120" fill="transparent" pointerEvents="all" />
          <polygon points="660,190 710,170 750,200 700,220" fill="#475569" />
          <line x1="705" y1="195" x2="715" y2="155" stroke="#F8FAFC" strokeWidth="4" />
          <ellipse cx="725" cy="145" rx="24" ry="15" fill="#F8FAFC" stroke={selectedSystemId === 'comms' ? '#F97316' : '#0F172A'} strokeWidth="3" transform="rotate(-25 725 145)" />
        </g>

        {/* 7. LUNAR ROVER */}
        <g
          role="button"
          tabIndex={0}
          aria-label="Autonomous Lunar Rover"
          onClick={() => onSelectObject('rover')}
          onKeyDown={(e) => handleKeyDown(e, 'rover')}
          className="cursor-pointer focus:outline-none"
        >
          <rect x="430" y="440" width="110" height="80" fill="transparent" pointerEvents="all" />
          <g transform="translate(440, 450)">
            <circle cx="15" cy="40" r="8" fill="#0F172A" stroke="#94A3B8" strokeWidth="2" />
            <circle cx="75" cy="40" r="8" fill="#0F172A" stroke="#94A3B8" strokeWidth="2" />
            <polygon points="10,25 70,0 90,20 30,45" fill="#E2E8F0" stroke={selectedSystemId === 'rover' ? '#F97316' : '#0F172A'} strokeWidth="3" />
          </g>
        </g>

        {/* 8. ASTRONAUT CREW */}
        <g
          role="button"
          tabIndex={0}
          aria-label={`Moonbase Astronaut Crew. Status: ${crewCondition}`}
          onClick={() => onSelectObject('crew')}
          onKeyDown={(e) => handleKeyDown(e, 'crew')}
          className="cursor-pointer focus:outline-none"
        >
          <rect x="400" y="370" width="170" height="90" fill="transparent" pointerEvents="all" />
          <g transform="translate(410, 380)">
            <circle cx="15" cy="12" r="9" fill="#FFFFFF" stroke="#0F172A" strokeWidth="2" />
            <rect x="9" y="8" width="12" height="7" rx="3.5" fill="#F59E0B" />
            <rect x="6" y="21" width="18" height="22" rx="5" fill="#FFFFFF" stroke="#0F172A" strokeWidth="2" />
          </g>
          <rect x="445" y="430" width="105" height="28" rx="14" fill="#0F172A" stroke="#475569" strokeWidth="2" />
          <circle cx="460" cy="444" r="6" fill={crewCondition === 'stable' ? '#10B981' : '#EF4444'} />
          <text x="472" y="448" fontSize="12" fontWeight="900" fill="#F8FAFC">CREW</text>
        </g>
      </svg>
    </div>
  );
};