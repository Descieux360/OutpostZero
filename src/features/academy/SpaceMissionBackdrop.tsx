/** Decorative inline SVG scenery for the mission-selection map. */
export function SpaceMissionBackdrop() {
  return (
    <svg className="mission-scenery" viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <defs>
        <radialGradient id="earthGradient" cx="35%" cy="28%"><stop offset="0" stopColor="#74e2ff" /><stop offset=".55" stopColor="#1687e8" /><stop offset="1" stopColor="#09356f" /></radialGradient>
        <radialGradient id="marsGradient" cx="32%" cy="25%"><stop offset="0" stopColor="#ffb16b" /><stop offset=".58" stopColor="#f15a24" /><stop offset="1" stopColor="#8d2c2a" /></radialGradient>
        <radialGradient id="moonGradient" cx="35%" cy="28%"><stop offset="0" stopColor="#f1f5f9" /><stop offset="1" stopColor="#8292ad" /></radialGradient>
        <linearGradient id="lunarGround" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#8997b4" /><stop offset="1" stopColor="#26314b" /></linearGradient>
        <linearGradient id="rocketFlame" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#fff7ad" /><stop offset=".5" stopColor="#ffb02e" /><stop offset="1" stopColor="#f15a24" stopOpacity="0" /></linearGradient>
        <filter id="planetGlow" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="12" /></filter>
        <clipPath id="earthClip"><circle cx="0" cy="0" r="118" /></clipPath>
        <clipPath id="marsClip"><circle cx="0" cy="0" r="88" /></clipPath>
      </defs>

      {/* Stars */}
      <g fill="#fff">
        <circle cx="48" cy="356" r="2" opacity=".8"/><circle cx="405" cy="122" r="1.5" opacity=".9"/><circle cx="535" cy="258" r="2" opacity=".75"/>
        <circle cx="910" cy="216" r="1.5" opacity=".8"/><circle cx="1070" cy="110" r="2" opacity=".85"/><circle cx="1384" cy="352" r="1.5" opacity=".85"/>
        <circle cx="1264" cy="510" r="2" opacity=".7"/><circle cx="836" cy="390" r="1.5" opacity=".8"/><circle cx="623" cy="457" r="2" opacity=".7"/>
        <circle cx="321" cy="482" r="1.5" opacity=".7"/><circle cx="74" cy="556" r="1.5" opacity=".8"/><circle cx="1100" cy="590" r="1.5" opacity=".8"/>
        <circle cx="461" cy="56" r="1.5" opacity=".75"/><circle cx="1000" cy="32" r="1.5" opacity=".8"/><circle cx="1345" cy="60" r="1.5" opacity=".75"/>
      </g>
      <g fill="#ffd700"><circle cx="274" cy="365" r="2.2"/><circle cx="772" cy="268" r="2"/><circle cx="1190" cy="292" r="2"/></g>
      <g fill="#60a5fa"><circle cx="533" cy="160" r="2"/><circle cx="968" cy="478" r="2"/><circle cx="80" cy="264" r="2"/></g>

      {/* Earth */}
      <g transform="translate(112 157)">
        <circle r="130" fill="#278cff" opacity=".17" filter="url(#planetGlow)" />
        <circle r="118" fill="url(#earthGradient)" stroke="#8be7ff" strokeWidth="3" />
        <g clipPath="url(#earthClip)" fill="#43c878" opacity=".95">
          <path d="M-100 -42l23-22 26 4 11 17-9 14 12 10-8 15-22 7-6 21-17 7-15-14-3-27-16-14z" />
          <path d="M-10 -83l25-18 34 10 11 20-19 11-3 22-18 10-11 24-19-9-4-22-18-12 4-20-14-9z" />
          <path d="M26 21l18-12 24 4 13 17-5 30-15 21-8 29-18 12-13-20 4-28-13-20z" />
          <path d="M72-71l40 5 18 21-8 18-28-3-11 13-21-14z" />
        </g>
        <path d="M-104 -40 Q-35 -122 48 -104" fill="none" stroke="#c5f6ff" strokeWidth="5" opacity=".35" />
      </g>

      {/* Saturn and rings */}
      <g transform="translate(742 102) rotate(-13)">
        <ellipse rx="116" ry="33" fill="none" stroke="#e5c889" strokeWidth="11" opacity=".7" />
        <ellipse rx="102" ry="28" fill="none" stroke="#f4dfaa" strokeWidth="4" opacity=".85" />
        <circle r="58" fill="#d4a85e" stroke="#ffe5ac" strokeWidth="2" />
        <path d="M-54-5 Q0 16 54-5M-46 20Q0 39 46 19" fill="none" stroke="#8a603f" strokeWidth="8" opacity=".45" />
      </g>

      {/* Mars */}
      <g transform="translate(1324 171)">
        <circle r="103" fill="#ff6a34" opacity=".15" filter="url(#planetGlow)" />
        <circle r="88" fill="url(#marsGradient)" stroke="#ffb36e" strokeWidth="3" />
        <g clipPath="url(#marsClip)" fill="none" stroke="#8f3128" strokeWidth="11" opacity=".42">
          <path d="M-77-20q27-25 54-4t55 1q22-1 48-25"/><path d="M-72 32q34 10 53-12t55 5q29 21 58-1"/>
          <path d="M-25-86q-4 20 15 31t1 31"/>
        </g>
        <circle cx="37" cy="-38" r="15" fill="#f98a53" opacity=".5" />
      </g>

      {/* Asteroids */}
      <g fill="#8793a8" stroke="#c0c9d9" strokeWidth="2" opacity=".9">
        <path d="M443 312l12-11 16 5 4 15-13 10-16-4z"/><path d="M1014 302l9-13 18 2 9 13-11 12-18-2z"/>
        <path d="M1266 440l11-10 16 6 2 14-13 8-14-6z"/><path d="M548 514l7-9 13 2 5 11-10 8-13-3z"/>
      </g>

      {/* Rocket with a bright exhaust trail */}
      <path d="M1205 336 Q1150 397 1088 449" fill="none" stroke="#ff9d42" strokeWidth="4" opacity=".32" />
      <path d="M1201 333 Q1156 393 1094 443" fill="none" stroke="#c8edff" strokeWidth="1.5" opacity=".5" />
      <g transform="translate(1214 326) rotate(42)">
        <path d="M0-55 Q30-28 24 18 L0 36 -24 18 Q-30-28 0-55Z" fill="#f8fafc" stroke="#57b8ff" strokeWidth="4" />
        <path d="M-21 7l-20 21 20 2M21 7l20 21-20 2" fill="#f97316" stroke="#ffd25a" strokeWidth="3" />
        <circle cy="-9" r="8" fill="#44b8ff" stroke="#0b3779" strokeWidth="3" />
        <path d="M-12 34 Q0 75 12 34Z" fill="url(#rocketFlame)" />
      </g>

      {/* Lunar horizon and craters */}
      <path d="M0 713 Q175 644 342 699 T685 680 T1045 699 T1440 658 L1440 900 0 900Z" fill="url(#lunarGround)" opacity=".94" />
      <path d="M0 745 Q225 695 440 728 T850 718 T1200 730 T1440 710" fill="none" stroke="#c0c9d9" strokeWidth="3" opacity=".26" />
      <g fill="#1f2a43" stroke="#a4aec0" strokeWidth="3" opacity=".72">
        <ellipse cx="499" cy="791" rx="61" ry="18"/><ellipse cx="1206" cy="793" rx="82" ry="23"/><ellipse cx="932" cy="742" rx="39" ry="13"/>
      </g>

      {/* Small lunar outpost: habitat, greenhouse, antenna and solar panels */}
      <g transform="translate(86 621)" stroke="#dbeafe" strokeWidth="3">
        <path d="M24 98h235v90H24z" fill="#38516e"/><path d="M39 98l28-55h72l28 55z" fill="#bdefff" fillOpacity=".66"/>
        <path d="M178 98l20-40h47l20 40z" fill="#72d8ad" fillOpacity=".68"/>
        <path d="M76 69h27M213 72h18M94 98v45M218 98v43" fill="none" />
        <path d="M-30 105l41-22 42 22-42 22zM-30 133l41-22 42 22-42 22z" fill="#174da1" stroke="#67c9ff" />
        <path d="M-8 102v53M13 93v53" stroke="#a8dfff" strokeWidth="2" />
        <path d="M240 54v-41m0 0l-22 16m22-16 22 16" fill="none" stroke="#ffd25a" />
        <circle cx="239" cy="11" r="5" fill="#ffd25a" stroke="none" />
        <rect x="107" y="126" width="28" height="36" rx="4" fill="#0f2441" />
      </g>
    </svg>
  )
}
