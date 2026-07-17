import { makeScene2D, Rect, Txt, Node, Layout } from '@revideo/2d';
import { all, sequence, waitFor, createRef, fadeTransition } from '@revideo/core';
import { colors, fonts, fontWeights, animationDurations, nodeStyle, canvas } from '../styles/theme.js';
import { generateCues } from '../utils/captions.js';

export default makeScene2D('Scene008', function* (view) {
  view.fill(colors.background);

  // --- REFS ---
  const tableContainer = createRef<Node>();
  
  const titleText = createRef<Txt>();

  // Row refs
  const rowRefs = Array.from({ length: 7 }).map(() => ({
    container: createRef<Node>(),
    bg: createRef<Rect>(),
    operation: createRef<Txt>(),
    complexity: createRef<Txt>(),
    complexityBg: createRef<Rect>(),
  }));

  // Caption refs
  const captionContainer = createRef<Rect>();
  const captionText = createRef<Txt>();

  // --- NARRATION ---
  const beatAText = "Let's summarize everything we've learned about singly linked lists by looking at the time complexity for each operation. We'll build out a cheat sheet table that you can refer back to.";
  const beatBText = "Accessing or searching takes linear time since we must traverse. Inserting at the head is extremely fast, taking constant time. Inserting at the tail or middle requires traversal, taking linear time. Deleting the head is constant time, but deleting from the middle or tail also requires traversal, making it linear time.";
  const beatCTextStr = "This cheat sheet highlights the primary tradeoff of a singly linked list. They are fantastic when you frequently need to add or remove elements directly at the front, but they slow down significantly if you need to search for or modify elements near the end.";

  const cuesA = generateCues(beatAText, 0, 25.7);
  const cuesB = generateCues(beatBText, 25.7, 51.3 - 25.7);
  const cuesC = generateCues(beatCTextStr, 51.3, 77.0 - 51.3);
  const allCues = [...cuesA, ...cuesB, ...cuesC];

  // --- CONTENT & DATA ---
  const rowData = [
    { op: "Access", comp: "O(n)", color: colors.tertiaryAccent },
    { op: "Search", comp: "O(n)", color: colors.tertiaryAccent },
    { op: "Insert at Head", comp: "O(1)", color: colors.primaryAccent },
    { op: "Insert at Tail", comp: "O(n)", color: colors.tertiaryAccent },
    { op: "Insert at Middle", comp: "O(n)", color: colors.tertiaryAccent },
    { op: "Delete at Head", comp: "O(1)", color: colors.primaryAccent },
    { op: "Delete at Middle/Tail", comp: "O(n)", color: colors.tertiaryAccent },
  ];

  // --- LAYOUT ---
  const tableWidth = 900;
  const rowHeight = 70;
  const rowSpacing = 16;
  const startY = -240;

  view.add(
    <Node>
      <Txt
        ref={titleText}
        y={-400}
        text="Singly Linked List: Time Complexity"
        fill={colors.text}
        fontFamily={fonts.heading}
        fontWeight={fontWeights.headingWeight}
        fontSize={48}
        opacity={0}
      />

      <Node ref={tableContainer} y={0}>
        {rowData.map((data, index) => {
          const yPos = startY + index * (rowHeight + rowSpacing);
          const refs = rowRefs[index];
          
          return (
            <Node ref={refs.container} y={yPos} x={-100} opacity={0} key={String(index)}>
              <Rect
                ref={refs.bg}
                width={tableWidth}
                height={rowHeight}
                fill={colors.codeBlockBackground}
                radius={nodeStyle.borderRadius}
                stroke={colors.nodeBorder}
                lineWidth={nodeStyle.borderWidth}
              />
              
              <Txt
                ref={refs.operation}
                x={-tableWidth / 2 + 40}
                text={data.op}
                fill={colors.text}
                fontFamily={fonts.body}
                fontWeight={fontWeights.headingWeight}
                fontSize={32}
                textAlign="left"
                offsetX={-1}
                justifyContent="center"
              />

              <Rect
                ref={refs.complexityBg}
                x={tableWidth / 2 - 100}
                width={160}
                height={50}
                fill={data.color}
                radius={nodeStyle.borderRadius}
              >
                <Txt
                  ref={refs.complexity}
                  text={data.comp}
                  fill={colors.background}
                  fontFamily={fonts.code}
                  fontWeight={fontWeights.headingWeight}
                  fontSize={32}
                />
              </Rect>
            </Node>
          );
        })}
      </Node>

      {/* CAPTIONS OVERLAY */}
      <Node y={canvas.height / 2 - 120} zIndex={100}>
        <Rect
          ref={captionContainer}
          layout
          fill={`${colors.codeBlockBackground}CC`}
          radius={nodeStyle.borderRadius}
          opacity={0}
          padding={[20, 40]}
          alignItems="center"
          justifyContent="center"
        >
          <Txt
            ref={captionText}
            text=""
            fill={colors.text}
            fontFamily={fonts.body}
            fontWeight={fontWeights.bodyWeight}
            fontSize={36}
            textAlign="center"
            textWrap={true}
            maxWidth={canvas.width * 0.8}
          />
        </Rect>
      </Node>
    </Node>
  );

  // Helper generator to pulse a cell
  function* pulseCell(refs: any) {
    yield* sequence(
      0.15,
      refs.complexityBg().scale(1.2, 0.15),
      refs.complexityBg().scale(1, 0.15)
    );
  }

  yield* all(
    fadeTransition(1),
    // --- CAPTIONS THREAD ---
    (function* () {
      for (const cue of allCues) {
        const cueDuration = cue.end - cue.start;
        const holdTime = Math.max(0, cueDuration - animationDurations.fadeIn * 2);
        yield* captionText().text(cue.text, 0);
        yield* captionContainer().opacity(1, animationDurations.fadeIn);
        if (holdTime > 0) yield* waitFor(holdTime);
        yield* captionContainer().opacity(0, animationDurations.fadeIn);
      }
    })(),

    // --- MAIN ANIMATION THREAD ---
    (function* () {
      
      // BEAT A (0 - 25.7s): Table build-in
      const beatADuration = 25.7;
      
      yield* titleText().opacity(1, animationDurations.fadeIn);
      yield* waitFor(1);

      // Animate rows sequentially
      for (let i = 0; i < rowRefs.length; i++) {
        yield* all(
          rowRefs[i].container().opacity(1, animationDurations.fadeIn),
          rowRefs[i].container().x(0, animationDurations.fadeIn)
        );
        yield* waitFor(0.5);
      }
      
      const timeSpentA = animationDurations.fadeIn + 1 + rowRefs.length * (animationDurations.fadeIn + 0.5);
      if (beatADuration - timeSpentA > 0) yield* waitFor(beatADuration - timeSpentA);

      // BEAT B (25.7 - 51.3s): Row highlight sweep
      const beatBDuration = 51.3 - 25.7;
      
      // There are 7 rows. We spread out the pulses evenly over Beat B.
      // We'll leave 2 seconds at the beginning and end.
      const timePerPulse = (beatBDuration - 4) / rowRefs.length;
      
      yield* waitFor(2);
      
      for (let i = 0; i < rowRefs.length; i++) {
        yield* pulseCell(rowRefs[i]);
        yield* waitFor(timePerPulse - 0.3); // 0.3 is roughly pulse duration
      }
      
      yield* waitFor(2);

      // BEAT C (51.3 - 77.0s): Full table hold
      const beatCDuration = 77.0 - 51.3;
      yield* waitFor(beatCDuration);
    })()
  );
});
