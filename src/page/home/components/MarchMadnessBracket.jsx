import React, { useState, useRef, useEffect } from "react";

// ── Layout constants ──────────────────────────────────────────────────────────
const TEAM_H = 32;
const MATCHUP_H = TEAM_H * 2; // height of one matchup box
const MATCHUP_GAP = 10; // gap between consecutive matchup boxes in R1
const BOX_W = 132; // matchup box width
const COL_GAP = 28; // horizontal gap between columns (line space)
const COL_W = BOX_W + COL_GAP;
const PADDING = 16;
const COLS = 4; // rounds per side
const SIDE_W = COLS * COL_W;

// R1 has 16 matchups; each slot = matchup + gap
const R1_SLOT_H = MATCHUP_H + MATCHUP_GAP;
const BRACKET_H = 16 * R1_SLOT_H; // total height driven by R1 slots
const CENTER_W = 240;
const TOTAL_W = SIDE_W * 2 + CENTER_W + PADDING * 2;
const TOTAL_H = BRACKET_H + 40;

export default function MarchMadnessBracket() {
  const [selections, setSelections] = useState({});
  const [scale, setScale] = useState(1);
  const wrapRef = useRef(null);

  // Auto-scale to fit container width
  useEffect(() => {
    const calc = () => {
      if (!wrapRef.current) return;
      const avail = wrapRef.current.getBoundingClientRect().width;
      setScale(Math.min(1, avail / TOTAL_W));
    };
    calc();
    const ro = new ResizeObserver(calc);
    if (wrapRef.current) ro.observe(wrapRef.current);
    return () => ro.disconnect();
  }, []);

  // ── Region styles ────────────────────────────────────────────────────────────
  const regions = {
    east: {
      name: "EAST",
      border: "border-blue-400",
      hover: "hover:bg-blue-50",
      selected: "bg-blue-500",
    },
    west: {
      name: "WEST",
      border: "border-emerald-400",
      hover: "hover:bg-emerald-50",
      selected: "bg-emerald-500",
    },
    south: {
      name: "SOUTH",
      border: "border-rose-400",
      hover: "hover:bg-rose-50",
      selected: "bg-rose-500",
    },
    midwest: {
      name: "MIDWEST",
      border: "border-violet-400",
      hover: "hover:bg-violet-50",
      selected: "bg-violet-500",
    },
  };

  // ── Teams ────────────────────────────────────────────────────────────────────
  const teamsLeft = {
    east: [
      ["(1) UConn", "(16) Stetson"],
      ["(8) FAU", "(9) Northwestern"],
      ["(5) San Diego St", "(12) UAB"],
      ["(4) Auburn", "(13) Yale"],
      ["(6) BYU", "(11) Duquesne"],
      ["(3) Illinois", "(14) Morehead St"],
      ["(7) Wash State", "(10) Drake"],
      ["(2) Iowa State", "(15) SD State"],
    ],
    west: [
      ["(1) UNC", "(16) Wagner"],
      ["(8) Miss State", "(9) Michigan St"],
      ["(5) Saint Mary's", "(12) Grand Canyon"],
      ["(4) Alabama", "(13) Charleston"],
      ["(6) Clemson", "(11) New Mexico"],
      ["(3) Baylor", "(14) Colgate"],
      ["(7) Dayton", "(10) Nevada"],
      ["(2) Arizona", "(15) Long Beach"],
    ],
  };
  const teamsRight = {
    south: [
      ["(1) Houston", "(16) Longwood"],
      ["(8) Nebraska", "(9) Texas A&M"],
      ["(5) Wisconsin", "(12) James Madison"],
      ["(4) Duke", "(13) Vermont"],
      ["(6) Texas Tech", "(11) NC State"],
      ["(3) Kentucky", "(14) Oakland"],
      ["(7) Florida", "(10) Colorado"],
      ["(2) Marquette", "(15) Western KY"],
    ],
    midwest: [
      ["(1) Purdue", "(16) Grambling"],
      ["(8) Utah State", "(9) TCU"],
      ["(5) Gonzaga", "(12) McNeese"],
      ["(4) Kansas", "(13) Samford"],
      ["(6) S Carolina", "(11) Oregon"],
      ["(3) Creighton", "(14) Akron"],
      ["(7) Texas", "(10) Colorado St"],
      ["(2) Tennessee", "(15) Saint Peter's"],
    ],
  };

  // ── State helpers ─────────────────────────────────────────────────────────────
  const setWinner = (key, team, region) =>
    setSelections((p) => ({ ...p, [key]: { team, region } }));
  const getW = (key) => selections[key];

  // ── UI Components ────────────────────────────────────────────────────────────
  const TeamBtn = ({ label, isWinner, region, disabled, onClick }) => {
    const r = regions[region] || {};
    return (
      <button
        disabled={disabled}
        onClick={onClick}
        style={{ height: TEAM_H }}
        className={`w-full px-2 text-[10px] font-semibold text-left border transition-all duration-200 relative overflow-hidden
          ${r.border || "border-gray-300"}
          ${
            isWinner
              ? `${r.selected} text-white`
              : disabled
                ? "bg-gray-50 text-gray-400 italic cursor-default"
                : `bg-white ${r.hover}`
          }`}
      >
        <span className="truncate block pr-4">{label}</span>
        {isWinner && (
          <span className="absolute right-1 top-1/2 -translate-y-1/2 text-xs">
            ✓
          </span>
        )}
      </button>
    );
  };

  const MatchupBox = ({ top, bottom, topR, bottomR, selKey, onSel }) => {
    const w = getW(selKey);
    return (
      <div
        style={{ width: BOX_W }}
        className="rounded overflow-hidden shadow flex flex-col"
      >
        <TeamBtn
          label={top}
          isWinner={w?.team === top}
          region={topR}
          disabled={top === "TBD"}
          onClick={() => onSel(top, topR)}
        />
        <TeamBtn
          label={bottom}
          isWinner={w?.team === bottom}
          region={bottomR}
          disabled={bottom === "TBD"}
          onClick={() => onSel(bottom, bottomR)}
        />
      </div>
    );
  };

  // ── Matchup y-position calculation ───────────────────────────────────────────
  // R1: 16 slots of R1_SLOT_H each, box centred in slot
  // R2-R4: each matchup spans 2 slots of previous round → centre = avg of pair centres
  const r1Y = (i) => PADDING + i * R1_SLOT_H + (R1_SLOT_H - MATCHUP_H) / 2;

  const roundYs = (() => {
    const r1 = Array.from({ length: 16 }, (_, i) => r1Y(i) + MATCHUP_H / 2); // y-centres
    const collapse = (prev) =>
      Array.from(
        { length: prev.length / 2 },
        (_, i) => (prev[i * 2] + prev[i * 2 + 1]) / 2,
      );
    const r2 = collapse(r1);
    const r3 = collapse(r2);
    const r4 = collapse(r3);
    return { r1, r2, r3, r4 };
  })();

  // Convert y-centre to top position for a box
  const yTop = (yc) => yc - MATCHUP_H / 2;

  // ── Build matchup data arrays ─────────────────────────────────────────────────
  const buildR1 = (gameOffset, getTeam) =>
    Array.from({ length: 16 }, (_, i) => ({
      key: `1-${gameOffset + i}`,
      teams: getTeam(i),
      yc: roundYs.r1[i],
    }));

  const buildRound = (round, count, gameOffset, getTeams) =>
    Array.from({ length: count }, (_, i) => ({
      key: `${round}-${gameOffset + i}`,
      teams: getTeams(i),
      yc:
        round === 2
          ? roundYs.r2[i]
          : round === 3
            ? roundYs.r3[i]
            : roundYs.r4[i],
    }));

  // LEFT
  const r1L = buildR1(0, (i) =>
    i < 8
      ? [
          { team: teamsLeft.east[i][0], region: "east" },
          { team: teamsLeft.east[i][1], region: "east" },
        ]
      : [
          { team: teamsLeft.west[i - 8][0], region: "west" },
          { team: teamsLeft.west[i - 8][1], region: "west" },
        ],
  );

  const r2L = buildRound(2, 8, 0, (i) => {
    const a = getW(`1-${i * 2}`),
      b = getW(`1-${i * 2 + 1}`);
    return [
      { team: a?.team || "TBD", region: a?.region },
      { team: b?.team || "TBD", region: b?.region },
    ];
  });
  const r3L = buildRound(3, 4, 0, (i) => {
    const a = getW(`2-${i * 2}`),
      b = getW(`2-${i * 2 + 1}`);
    return [
      { team: a?.team || "TBD", region: a?.region },
      { team: b?.team || "TBD", region: b?.region },
    ];
  });
  const r4L = buildRound(4, 2, 0, (i) => {
    const a = getW(`3-${i * 2}`),
      b = getW(`3-${i * 2 + 1}`);
    return [
      { team: a?.team || "TBD", region: a?.region },
      { team: b?.team || "TBD", region: b?.region },
    ];
  });

  // RIGHT
  const r1R = buildR1(16, (i) =>
    i < 8
      ? [
          { team: teamsRight.south[i][0], region: "south" },
          { team: teamsRight.south[i][1], region: "south" },
        ]
      : [
          { team: teamsRight.midwest[i - 8][0], region: "midwest" },
          { team: teamsRight.midwest[i - 8][1], region: "midwest" },
        ],
  );

  const r2R = buildRound(2, 8, 8, (i) => {
    const a = getW(`1-${16 + i * 2}`),
      b = getW(`1-${16 + i * 2 + 1}`);
    return [
      { team: a?.team || "TBD", region: a?.region },
      { team: b?.team || "TBD", region: b?.region },
    ];
  });
  const r3R = buildRound(3, 4, 4, (i) => {
    const a = getW(`2-${8 + i * 2}`),
      b = getW(`2-${8 + i * 2 + 1}`);
    return [
      { team: a?.team || "TBD", region: a?.region },
      { team: b?.team || "TBD", region: b?.region },
    ];
  });
  const r4R = buildRound(4, 2, 2, (i) => {
    const a = getW(`3-${4 + i * 2}`),
      b = getW(`3-${4 + i * 2 + 1}`);
    return [
      { team: a?.team || "TBD", region: a?.region },
      { team: b?.team || "TBD", region: b?.region },
    ];
  });

  // Centre matchups
  const ffTopYC = roundYs.r4[0]; // align FF with Elite8 top winner
  const ffBotYC = roundYs.r4[1]; // align FF with Elite8 bottom winner
  const champYC = (ffTopYC + ffBotYC) / 2;

  const ff0 = [
    { team: getW("4-0")?.team || "TBD", region: getW("4-0")?.region },
    { team: getW("4-1")?.team || "TBD", region: getW("4-1")?.region },
  ];
  const ff1 = [
    { team: getW("4-2")?.team || "TBD", region: getW("4-2")?.region },
    { team: getW("4-3")?.team || "TBD", region: getW("4-3")?.region },
  ];
  const champ = [
    { team: getW("5-0")?.team || "TBD", region: getW("5-0")?.region },
    { team: getW("5-1")?.team || "TBD", region: getW("5-1")?.region },
  ];
  const champion = getW("6-0");

  // ── Column x helpers ──────────────────────────────────────────────────────────
  const lX = (col) => PADDING + col * COL_W; // left boxes, col 0..3
  const rX = (col) => TOTAL_W - PADDING - BOX_W - col * COL_W; // right boxes, col 0..3

  // Center
  const ffCX = PADDING + SIDE_W + CENTER_W / 2;
  const ffLeft = ffCX - BOX_W / 2;

  // ── SVG Lines ─────────────────────────────────────────────────────────────────
  // Connects round A y-centres (pairs) to round B y-centres
  const BracketLines = ({ ycA, ycB, xFrom, xTo, color = "#475569" }) => {
    if (!ycA?.length || !ycB?.length) return null;
    const midX = (xFrom + xTo) / 2;
    return (
      <>
        {ycB.map((yNext, i) => {
          const yA = ycA[i * 2];
          const yB = ycA[i * 2 + 1];
          return (
            <g key={i}>
              <line
                x1={xFrom}
                y1={yA}
                x2={midX}
                y2={yA}
                stroke={color}
                strokeWidth="1.5"
              />
              <line
                x1={xFrom}
                y1={yB}
                x2={midX}
                y2={yB}
                stroke={color}
                strokeWidth="1.5"
              />
              <line
                x1={midX}
                y1={yA}
                x2={midX}
                y2={yB}
                stroke={color}
                strokeWidth="1.5"
              />
              <line
                x1={midX}
                y1={yNext}
                x2={xTo}
                y2={yNext}
                stroke={color}
                strokeWidth="1.5"
              />
            </g>
          );
        })}
      </>
    );
  };

  // ── Render column of boxes ────────────────────────────────────────────────────
  const RenderCol = ({ matchups, xLeft }) =>
    matchups.map((m) => (
      <div
        key={m.key}
        style={{
          position: "absolute",
          top: yTop(m.yc),
          left: xLeft,
          zIndex: 1,
        }}
      >
        <MatchupBox
          top={m.teams[0].team}
          bottom={m.teams[1].team}
          topR={m.teams[0].region}
          bottomR={m.teams[1].region}
          selKey={m.key}
          onSel={(t, r) => setWinner(m.key, t, r)}
        />
      </div>
    ));

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-3">
      <div className="w-full max-w-screen-2xl mx-auto">
        {/* Title */}
        <div className="text-center mb-4">
          <h1
            className="text-2xl font-black text-white uppercase"
            style={{ fontFamily: "Georgia,serif", letterSpacing: "0.2em" }}
          >
            March Madness
          </h1>
          <p className="text-yellow-400 text-xs tracking-[0.25em] uppercase mt-1">
            2024 NCAA Tournament Bracket
          </p>
        </div>

        {/* Outer measure div */}
        <div ref={wrapRef} className="w-full">
          {/* Scaled bracket */}
          <div
            style={{
              width: "100%",
              height: TOTAL_H * scale,
              position: "relative",
            }}
          >
            <div
              style={{
                width: TOTAL_W,
                height: TOTAL_H,
                transformOrigin: "top left",
                transform: `scale(${scale})`,
                position: "absolute",
                top: 0,
                left: 0,
              }}
            >
              {/* ── SVG lines ─────────────────────────────────────────── */}
              <svg
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: TOTAL_W,
                  height: TOTAL_H,
                  pointerEvents: "none",
                  zIndex: 0,
                }}
              >
                {/* LEFT: R1→R2→R3→R4 */}
                <BracketLines
                  ycA={roundYs.r1}
                  ycB={roundYs.r2}
                  xFrom={lX(0) + BOX_W}
                  xTo={lX(1)}
                />
                <BracketLines
                  ycA={roundYs.r2}
                  ycB={roundYs.r3}
                  xFrom={lX(1) + BOX_W}
                  xTo={lX(2)}
                />
                <BracketLines
                  ycA={roundYs.r3}
                  ycB={roundYs.r4}
                  xFrom={lX(2) + BOX_W}
                  xTo={lX(3)}
                />

                {/* LEFT Elite8 → FF Top */}
                {(() => {
                  const yA = roundYs.r4[0],
                    yB = roundYs.r4[1];
                  const xFrom = lX(3) + BOX_W,
                    xTo = ffLeft;
                  const midX = (xFrom + xTo) / 2;
                  return (
                    <>
                      <line
                        x1={xFrom}
                        y1={yA}
                        x2={midX}
                        y2={yA}
                        stroke="#64748b"
                        strokeWidth="1.5"
                      />
                      <line
                        x1={xFrom}
                        y1={yB}
                        x2={midX}
                        y2={yB}
                        stroke="#64748b"
                        strokeWidth="1.5"
                      />
                      <line
                        x1={midX}
                        y1={yA}
                        x2={midX}
                        y2={yB}
                        stroke="#64748b"
                        strokeWidth="1.5"
                      />
                      <line
                        x1={midX}
                        y1={ffTopYC}
                        x2={xTo}
                        y2={ffTopYC}
                        stroke="#64748b"
                        strokeWidth="1.5"
                      />
                    </>
                  );
                })()}

                {/* RIGHT: R1→R2→R3→R4 (lines go rightward → leftward for right side) */}
                <BracketLines
                  ycA={roundYs.r1}
                  ycB={roundYs.r2}
                  xFrom={rX(0)}
                  xTo={rX(1) + BOX_W}
                />
                <BracketLines
                  ycA={roundYs.r2}
                  ycB={roundYs.r3}
                  xFrom={rX(1)}
                  xTo={rX(2) + BOX_W}
                />
                <BracketLines
                  ycA={roundYs.r3}
                  ycB={roundYs.r4}
                  xFrom={rX(2)}
                  xTo={rX(3) + BOX_W}
                />

                {/* RIGHT Elite8 → FF Bottom */}
                {(() => {
                  const yA = roundYs.r4[0],
                    yB = roundYs.r4[1];
                  const xFrom = rX(3),
                    xTo = ffLeft + BOX_W;
                  const midX = (xFrom + xTo) / 2;
                  return (
                    <>
                      <line
                        x1={xFrom}
                        y1={yA}
                        x2={midX}
                        y2={yA}
                        stroke="#64748b"
                        strokeWidth="1.5"
                      />
                      <line
                        x1={xFrom}
                        y1={yB}
                        x2={midX}
                        y2={yB}
                        stroke="#64748b"
                        strokeWidth="1.5"
                      />
                      <line
                        x1={midX}
                        y1={yA}
                        x2={midX}
                        y2={yB}
                        stroke="#64748b"
                        strokeWidth="1.5"
                      />
                      <line
                        x1={midX}
                        y1={ffBotYC}
                        x2={xTo}
                        y2={ffBotYC}
                        stroke="#64748b"
                        strokeWidth="1.5"
                      />
                    </>
                  );
                })()}

                {/* FF Top → Championship */}
                <line
                  x1={ffLeft + BOX_W}
                  y1={ffTopYC}
                  x2={ffCX + 30}
                  y2={ffTopYC}
                  stroke="#f59e0b"
                  strokeWidth="1.5"
                />
                <line
                  x1={ffCX + 30}
                  y1={ffTopYC}
                  x2={ffCX + 30}
                  y2={champYC}
                  stroke="#f59e0b"
                  strokeWidth="1.5"
                />
                <line
                  x1={ffCX + 30}
                  y1={champYC}
                  x2={ffLeft + BOX_W}
                  y2={champYC}
                  stroke="#f59e0b"
                  strokeWidth="1.5"
                />

                {/* FF Bottom → Championship */}
                <line
                  x1={ffLeft}
                  y1={ffBotYC}
                  x2={ffCX - 30}
                  y2={ffBotYC}
                  stroke="#f59e0b"
                  strokeWidth="1.5"
                />
                <line
                  x1={ffCX - 30}
                  y1={ffBotYC}
                  x2={ffCX - 30}
                  y2={champYC}
                  stroke="#f59e0b"
                  strokeWidth="1.5"
                />
                <line
                  x1={ffCX - 30}
                  y1={champYC}
                  x2={ffLeft}
                  y2={champYC}
                  stroke="#f59e0b"
                  strokeWidth="1.5"
                />
              </svg>

              {/* ── Left matchup boxes ── */}
              <RenderCol matchups={r1L} xLeft={lX(0)} />
              <RenderCol matchups={r2L} xLeft={lX(1)} />
              <RenderCol matchups={r3L} xLeft={lX(2)} />
              <RenderCol matchups={r4L} xLeft={lX(3)} />

              {/* ── Right matchup boxes ── */}
              <RenderCol matchups={r1R} xLeft={rX(0)} />
              <RenderCol matchups={r2R} xLeft={rX(1)} />
              <RenderCol matchups={r3R} xLeft={rX(2)} />
              <RenderCol matchups={r4R} xLeft={rX(3)} />

              {/* ── Region labels ── */}
              {[
                { label: "EAST", x: lX(0), y: PADDING - 16, color: "#60a5fa" },
                {
                  label: "WEST",
                  x: lX(0),
                  y: PADDING + BRACKET_H / 2 - 16,
                  color: "#34d399",
                },
                { label: "SOUTH", x: rX(0), y: PADDING - 16, color: "#fb7185" },
                {
                  label: "MIDWEST",
                  x: rX(0),
                  y: PADDING + BRACKET_H / 2 - 16,
                  color: "#a78bfa",
                },
              ].map((r) => (
                <div
                  key={r.label}
                  style={{
                    position: "absolute",
                    top: r.y,
                    left: r.x,
                    width: BOX_W,
                    textAlign: "center",
                    zIndex: 2,
                  }}
                >
                  <span
                    style={{ color: r.color }}
                    className="text-[9px] font-black tracking-widest uppercase"
                  >
                    {r.label}
                  </span>
                </div>
              ))}

              {/* ── Round labels ── */}
              {[
                { l: "R64", c: 0 },
                { l: "R32", c: 1 },
                { l: "S16", c: 2 },
                { l: "E8", c: 3 },
              ].map((r) => (
                <div
                  key={r.l}
                  style={{
                    position: "absolute",
                    top: 4,
                    left: lX(r.c) + BOX_W / 2 - 14,
                    zIndex: 2,
                    width: 28,
                    textAlign: "center",
                  }}
                >
                  <span className="text-[8px] font-bold text-slate-500 uppercase tracking-wider">
                    {r.l}
                  </span>
                </div>
              ))}

              {/* ── Final Four Top ── */}
              <div
                style={{
                  position: "absolute",
                  top: yTop(ffTopYC) - 20,
                  left: ffLeft,
                  zIndex: 2,
                  width: BOX_W,
                  textAlign: "center",
                }}
              >
                <span className="text-[9px] font-black tracking-widest text-yellow-400 uppercase">
                  Final Four
                </span>
              </div>
              <div
                style={{
                  position: "absolute",
                  top: yTop(ffTopYC),
                  left: ffLeft,
                  zIndex: 2,
                }}
              >
                <MatchupBox
                  top={ff0[0].team}
                  bottom={ff0[1].team}
                  topR={ff0[0].region}
                  bottomR={ff0[1].region}
                  selKey="5-0"
                  onSel={(t, r) => setWinner("5-0", t, r)}
                />
              </div>

              {/* ── Championship ── */}
              <div
                style={{
                  position: "absolute",
                  top: yTop(champYC) - 48,
                  left: ffCX - 70,
                  width: 140,
                  zIndex: 2,
                  textAlign: "center",
                }}
              >
                <div className="text-3xl mb-0.5 animate-bounce">🏆</div>
                <span className="text-[9px] font-black tracking-widest text-yellow-300 uppercase">
                  Championship
                </span>
              </div>
              <div
                style={{
                  position: "absolute",
                  top: yTop(champYC),
                  left: ffLeft,
                  zIndex: 2,
                }}
              >
                <MatchupBox
                  top={champ[0].team}
                  bottom={champ[1].team}
                  topR={champ[0].region}
                  bottomR={champ[1].region}
                  selKey="6-0"
                  onSel={(t, r) => setWinner("6-0", t, r)}
                />
              </div>
              {champion && (
                <div
                  style={{
                    position: "absolute",
                    top: yTop(champYC) + MATCHUP_H + 8,
                    left: ffCX - 80,
                    width: 160,
                    zIndex: 2,
                  }}
                >
                  <div className="text-center bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/40 rounded-xl p-2">
                    <p className="text-sm font-black text-yellow-400 animate-pulse">
                      🎉 {champion.team} 🎉
                    </p>
                    <p className="text-[8px] tracking-widest text-gray-400 uppercase mt-0.5">
                      2024 Champion
                    </p>
                  </div>
                </div>
              )}

              {/* ── Final Four Bottom ── */}
              <div
                style={{
                  position: "absolute",
                  top: yTop(ffBotYC) - 20,
                  left: ffLeft,
                  zIndex: 2,
                  width: BOX_W,
                  textAlign: "center",
                }}
              >
                <span className="text-[9px] font-black tracking-widest text-yellow-400 uppercase">
                  Final Four
                </span>
              </div>
              <div
                style={{
                  position: "absolute",
                  top: yTop(ffBotYC),
                  left: ffLeft,
                  zIndex: 2,
                }}
              >
                <MatchupBox
                  top={ff1[0].team}
                  bottom={ff1[1].team}
                  topR={ff1[0].region}
                  bottomR={ff1[1].region}
                  selKey="5-1"
                  onSel={(t, r) => setWinner("5-1", t, r)}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="flex justify-center gap-4 mt-3 flex-wrap">
          {Object.entries(regions).map(([k, r]) => (
            <div key={k} className="flex items-center gap-1.5">
              <div className={`w-2.5 h-2.5 rounded-sm ${r.selected}`} />
              <span className="text-[10px] text-slate-400 font-semibold tracking-wider">
                {r.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
