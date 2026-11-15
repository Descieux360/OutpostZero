import type { SystemId, SystemMode } from '../domain/types'

interface Props {
  modes: Record<SystemId, SystemMode>
  selected: SystemId | null
  onSelect: (id: SystemId) => void
}

const toneColor = (m: SystemMode) => (m === 'damaged' ? 'var(--color-critical)' : m === 'normal' ? 'var(--color-nominal)' : 'var(--color-caution)')
const modeText: Record<SystemMode, string> = { normal: 'Normal', conserve: 'Conserving', paused: 'Paused', damaged: 'Damaged' }

/** Clickable SVG building. Keyboard accessible; selection ring + status dot + text label. */
function Building({ id, label, x, y, modes, selected, onSelect, children }: Props & { id: SystemId; label: string; x: number; y: number; children: React.ReactNode }) {
  const active = selected === id
  return (
    <g
      transform={`translate(${x} ${y})`}
      role="button"
      tabIndex={0}
      aria-label={`${label}, status ${modeText[modes[id]]}`}
      aria-pressed={active}
      onClick={() => onSelect(id)}
      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), onSelect(id))}
      className="cursor-pointer outline-none focus-visible:[&>rect.focus]:stroke-nominal"
    >
      <rect className="focus" x={-10} y={-92} width={200} height={142} rx={10} fill={active ? 'rgba(95,208,200,0.07)' : 'transparent'} stroke={active ? 'var(--color-nominal)' : 'transparent'} strokeWidth={1.5} strokeDasharray="5 4" />
      {children}
      <circle cx={8} cy={-80} r={5} fill={toneColor(modes[id])} />
      <text x={20} y={-76} fontSize={13} fill="var(--color-regolith)" fontWeight={600}>{label}</text>
      <text x={20} y={-62} fontSize={11} fill="var(--color-dust)">{modeText[modes[id]]}</text>
    </g>
  )
}

export function OutpostMap(props: Props) {
  const { modes } = props
  return (
    <svg viewBox="0 0 800 400" className="w-full rounded-lg border border-line bg-vacuum" role="group" aria-label="Lunar outpost map. Select a building for details.">
      {/* Placeholder backdrop: not real lunar imagery */}
      {[[60, 40], [210, 80], [330, 28], [470, 62], [600, 30], [700, 96], [140, 130]].map(([cx, cy], i) => (
        <circle key={i} cx={cx} cy={cy} r={1.4} fill="var(--color-dust)" opacity={0.7} />
      ))}
      <path d="M0 300 Q140 280 280 292 T560 290 T800 284 V400 H0Z" fill="#1a2438" />
      <path d="M0 330 Q200 316 400 326 T800 320 V400 H0Z" fill="#141d2f" />
      <ellipse cx={120} cy={365} rx={46} ry={9} fill="#0f1726" />
      <ellipse cx={660} cy={372} rx={60} ry={10} fill="#0f1726" />
      {/* Power conduits (visual only) */}
      <path d="M190 292 H300 M470 292 H570" stroke="var(--color-line)" strokeWidth={3} strokeDasharray="2 6" strokeLinecap="round" />

      <Building {...props} id="solar" label="Solar array" x={40} y={230}>
        {[0, 44, 88, 132].map((dx) => (
          <g key={dx} transform={`translate(${dx + 6} 0)`}>
            <path d="M0 60 L10 22 H40 L34 60Z" fill="#23406b" stroke={toneColor(modes.solar)} strokeWidth={1.5} />
            <path d="M12 22 L6 60 M24 22 L20 60" stroke="#3a5f96" strokeWidth={1} />
            <path d="M17 60 V70" stroke="var(--color-dust)" strokeWidth={2} />
          </g>
        ))}
      </Building>

      <Building {...props} id="habitat" label="Habitat" x={300} y={236}>
        <path d="M0 62 A80 62 0 0 1 160 62Z" fill="#26344d" stroke={toneColor(modes.habitat)} strokeWidth={2} />
        <path d="M52 62 A28 24 0 0 1 108 62Z" fill="#0d1626" stroke="var(--color-caution)" strokeWidth={1.5} strokeDasharray="3 3" />
        <text x={80} y={56} fontSize={9} textAnchor="middle" fill="var(--color-caution)">shielded area</text>
        <rect x={72} y={2} width={16} height={5} fill="var(--color-dust)" />
      </Building>

      <Building {...props} id="greenhouse" label="Greenhouse" x={580} y={236}>
        <path d="M0 62 V36 Q0 6 60 6 T120 36 V62Z" fill="rgba(95,208,200,0.10)" stroke={toneColor(modes.greenhouse)} strokeWidth={2} />
        <path d="M30 62 V12 M60 62 V6 M90 62 V12" stroke="var(--color-nominal)" strokeOpacity={0.35} />
        <path d="M18 62 q6 -14 12 0 M50 62 q6 -18 12 0 M80 62 q6 -14 12 0" stroke="var(--color-nominal)" strokeWidth={2} fill="none" />
      </Building>
    </svg>
  )
}
