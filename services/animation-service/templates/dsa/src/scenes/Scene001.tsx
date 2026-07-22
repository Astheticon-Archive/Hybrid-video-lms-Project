import { makeScene2D, Rect, Circle, Line, Txt, Node } from '@revideo/2d';
import { all, sequence, waitFor, createRef } from '@revideo/core';
import { colors, fonts, fontWeights, animationDurations, easing, nodeStyle, pointerStyle, canvas } from '../styles/theme.js';
import { generateCues } from '../utils/captions.js';

export default makeScene2D('Scene001', function* (view) {
  view.fill(colors.background);

  // --- REFS ---
  // Left: Array
  const arrayContainer = createRef<Node>();
  const newArrayBox = createRef<Rect>();
  const arrayBox1 = createRef<Rect>();
  const arrayBox2 = createRef<Rect>();
  const arrayBox3 = createRef<Rect>();
  const arrayBox4 = createRef<Rect>();
  const arrayBox5 = createRef<Rect>();

  // Right: Linked List
  const llContainer = createRef<Node>();
  const headLabel = createRef<Txt>();
  const headArrow = createRef<Line>();
  
  const newLLNode = createRef<Circle>();
  const newLLArrow = createRef<Line>();
  
  const llNode1 = createRef<Circle>();
  const llArrow1 = createRef<Line>();
  const llNode2 = createRef<Circle>();
  const llArrow2 = createRef<Line>();
  const llNode3 = createRef<Circle>();
  const llArrow3 = createRef<Line>();
  const llNode4 = createRef<Circle>();

  // Text
  const textContainer = createRef<Node>();
  const textLine1 = createRef<Txt>();
  const textLine2 = createRef<Txt>();

  // Caption refs
  const captionContainer = createRef<Rect>();
  const captionText = createRef<Txt>();

  // --- CAPTIONS DATA ---
  const beatAText = "Let's start with a question. Imagine you have a list of numbers stored in an array, and you need to insert a new number right at the beginning. What happens? Every single element in that array has to shift over by one spot to make room. If your array has a thousand elements, that's a thousand moves, just to add one value. The same problem happens when you delete from the front. Everything after it has to shift back to fill the gap. This shifting takes time, and as your data grows, that time grows too.";
  const beatBText = "In the worst case, inserting or deleting at the front of an array costs O of n time, where n is the number of elements. That's because arrays store their elements in one continuous block of memory, back to back, like seats in a row. To insert in the middle of that row, you have to physically move people down. So, is there a way to add or remove elements without all that shifting? Yes. That's exactly what a linked list gives us. Instead of storing elements in one continuous block, a linked list stores each element separately, wherever there's free space in memory.";
  const beatCText = "Each element knows where the next one lives, because it holds a reference, or a pointer, to it. Think of it like a treasure hunt. Each clue doesn't tell you the whole path. It just tells you where to find the next clue. As long as you know where to start, you can follow the chain all the way through. Because elements aren't glued together in memory, inserting a new one is often as simple as changing a couple of these references, no shifting required. In this lesson, we'll build this idea from the ground up, starting with a single building block called a node.";

  const cuesA = generateCues(beatAText, 0, 35.0);
  const cuesB = generateCues(beatBText, 35.0, 38.5);
  const cuesC = generateCues(beatCText, 73.5, 38.9);
  const allCues = [...cuesA, ...cuesB, ...cuesC];

  // --- INITIAL SETUP ---
  
  const boxSize = 80;
  const boxSpacing = 100;
  const arrayStartX = -480 - (boxSpacing * 2); // Center around -480

  const nodeRadius = 40;
  const nodeSpacing = 120;
  const llStartX = 480 - (nodeSpacing * 1.5);

  view.add(
    <Node>
      {/* LEFT: ARRAY */}
      <Node ref={arrayContainer} x={0} y={0}>
        <Rect
          ref={newArrayBox}
          x={arrayStartX}
          y={0}
          width={boxSize}
          height={boxSize}
          radius={nodeStyle.borderRadius}
          fill={colors.codeBlockBackground}
          stroke={colors.nodeBorder}
          lineWidth={nodeStyle.borderWidth}
          opacity={0}
        />
        <Rect
          ref={arrayBox1}
          x={arrayStartX}
          y={0}
          width={boxSize}
          height={boxSize}
          radius={nodeStyle.borderRadius}
          fill={colors.codeBlockBackground}
          stroke={colors.nodeBorder}
          lineWidth={nodeStyle.borderWidth}
        />
        <Rect
          ref={arrayBox2}
          x={arrayStartX + boxSpacing}
          y={0}
          width={boxSize}
          height={boxSize}
          radius={nodeStyle.borderRadius}
          fill={colors.codeBlockBackground}
          stroke={colors.nodeBorder}
          lineWidth={nodeStyle.borderWidth}
        />
        <Rect
          ref={arrayBox3}
          x={arrayStartX + boxSpacing * 2}
          y={0}
          width={boxSize}
          height={boxSize}
          radius={nodeStyle.borderRadius}
          fill={colors.codeBlockBackground}
          stroke={colors.nodeBorder}
          lineWidth={nodeStyle.borderWidth}
        />
        <Rect
          ref={arrayBox4}
          x={arrayStartX + boxSpacing * 3}
          y={0}
          width={boxSize}
          height={boxSize}
          radius={nodeStyle.borderRadius}
          fill={colors.codeBlockBackground}
          stroke={colors.nodeBorder}
          lineWidth={nodeStyle.borderWidth}
        />
        <Rect
          ref={arrayBox5}
          x={arrayStartX + boxSpacing * 4}
          y={0}
          width={boxSize}
          height={boxSize}
          radius={nodeStyle.borderRadius}
          fill={colors.codeBlockBackground}
          stroke={colors.nodeBorder}
          lineWidth={nodeStyle.borderWidth}
        />
      </Node>

      {/* RIGHT: LINKED LIST */}
      <Node ref={llContainer} x={0} y={0}>
        <Txt
          ref={headLabel}
          x={llStartX}
          y={-100}
          text="head"
          fill={colors.text}
          fontFamily={fonts.body}
          fontWeight={fontWeights.bodyWeight}
          fontSize={24}
        />
        <Line
          ref={headArrow}
          points={[
            [llStartX, -80],
            [llStartX, -50]
          ]}
          stroke={colors.nodeBorder}
          lineWidth={pointerStyle.strokeWidth}
          endArrow
          arrowSize={pointerStyle.arrowheadSize}
        />

        <Circle
          ref={newLLNode}
          x={llStartX}
          y={-120}
          width={nodeRadius * 2}
          height={nodeRadius * 2}
          fill={colors.primaryAccent}
          stroke={colors.nodeBorder}
          lineWidth={nodeStyle.borderWidth}
          opacity={0}
        />
        <Line
          ref={newLLArrow}
          points={[
            [llStartX, -80],
            [llStartX, -50]
          ]}
          stroke={colors.nodeBorder}
          lineWidth={pointerStyle.strokeWidth}
          endArrow
          arrowSize={pointerStyle.arrowheadSize}
          opacity={0}
        />

        <Circle
          ref={llNode1}
          x={llStartX}
          y={0}
          width={nodeRadius * 2}
          height={nodeRadius * 2}
          fill={colors.primaryAccent}
          stroke={colors.nodeBorder}
          lineWidth={nodeStyle.borderWidth}
        />
        <Line
          ref={llArrow1}
          points={[
            [llStartX + nodeRadius, 0],
            [llStartX + nodeSpacing - nodeRadius, 0]
          ]}
          stroke={colors.nodeBorder}
          lineWidth={pointerStyle.strokeWidth}
          endArrow
          arrowSize={pointerStyle.arrowheadSize}
        />
        
        <Circle
          ref={llNode2}
          x={llStartX + nodeSpacing}
          y={0}
          width={nodeRadius * 2}
          height={nodeRadius * 2}
          fill={colors.primaryAccent}
          stroke={colors.nodeBorder}
          lineWidth={nodeStyle.borderWidth}
        />
        <Line
          ref={llArrow2}
          points={[
            [llStartX + nodeSpacing + nodeRadius, 0],
            [llStartX + nodeSpacing * 2 - nodeRadius, 0]
          ]}
          stroke={colors.nodeBorder}
          lineWidth={pointerStyle.strokeWidth}
          endArrow
          arrowSize={pointerStyle.arrowheadSize}
        />

        <Circle
          ref={llNode3}
          x={llStartX + nodeSpacing * 2}
          y={0}
          width={nodeRadius * 2}
          height={nodeRadius * 2}
          fill={colors.primaryAccent}
          stroke={colors.nodeBorder}
          lineWidth={nodeStyle.borderWidth}
        />
        <Line
          ref={llArrow3}
          points={[
            [llStartX + nodeSpacing * 2 + nodeRadius, 0],
            [llStartX + nodeSpacing * 3 - nodeRadius, 0]
          ]}
          stroke={colors.nodeBorder}
          lineWidth={pointerStyle.strokeWidth}
          endArrow
          arrowSize={pointerStyle.arrowheadSize}
        />

        <Circle
          ref={llNode4}
          x={llStartX + nodeSpacing * 3}
          y={0}
          width={nodeRadius * 2}
          height={nodeRadius * 2}
          fill={colors.primaryAccent}
          stroke={colors.nodeBorder}
          lineWidth={nodeStyle.borderWidth}
        />
      </Node>

      {/* TEXT: BEAT C */}
      <Node ref={textContainer} y={300}>
        <Txt
          ref={textLine1}
          y={-25}
          text="Arrays: Insertion at front = O(n) shifts"
          fill={colors.text}
          fontFamily={fonts.body}
          fontWeight={fontWeights.bodyWeight}
          fontSize={32}
          opacity={0}
        />
        <Txt
          ref={textLine2}
          y={25}
          text="Linked Lists: Insertion = just relink pointers"
          fill={colors.text}
          fontFamily={fonts.body}
          fontWeight={fontWeights.bodyWeight}
          fontSize={32}
          opacity={0}
        />
      </Node>

      {/* CAPTIONS OVERLAY */}
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

  // --- ANIMATION SEQUENCE ---
  // Captions and scene animations run together via all()


  yield* all(
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
      // BEAT A: 0s - 35.0s (Array shifting)
      const beatADuration = 35.0;
      const delayBetweenShifts = 0.5;
      const totalShiftsTime = delayBetweenShifts * 5 + animationDurations.moveTo;

      yield* sequence(
        delayBetweenShifts,
        arrayBox5().x(arrayBox5().x() + boxSpacing, animationDurations.moveTo),
        arrayBox4().x(arrayBox4().x() + boxSpacing, animationDurations.moveTo),
        arrayBox3().x(arrayBox3().x() + boxSpacing, animationDurations.moveTo),
        arrayBox2().x(arrayBox2().x() + boxSpacing, animationDurations.moveTo),
        arrayBox1().x(arrayBox1().x() + boxSpacing, animationDurations.moveTo),
      );

      yield* newArrayBox().opacity(1, animationDurations.fadeIn);

      const paddingA = beatADuration - totalShiftsTime - animationDurations.fadeIn;
      if (paddingA > 0) {
        yield* waitFor(paddingA);
      }

      // BEAT B: 35.0s - 73.5s (Linked List insertion)
      const beatBDuration = 73.5 - 35.0;

      yield* newLLNode().opacity(1, animationDurations.fadeIn);

      yield* all(
        newLLArrow().opacity(1, animationDurations.fadeIn),
        headLabel().y(-220, animationDurations.pointerMove),
        headArrow().points([
          [llStartX, -200],
          [llStartX, -170]
        ], animationDurations.pointerMove),
      );

      const paddingB = beatBDuration - (animationDurations.fadeIn * 2) - animationDurations.pointerMove;
      if (paddingB > 0) {
        yield* waitFor(paddingB);
      }

      // BEAT C: 73.5s - 112.4s (Text fade in)
      const beatCDuration = 112.4 - 73.5;

      yield* all(
        textLine1().opacity(1, animationDurations.fadeIn),
        textLine2().opacity(1, animationDurations.fadeIn),
      );

      const paddingC = beatCDuration - animationDurations.fadeIn;
      if (paddingC > 0) {
        yield* waitFor(paddingC);
      }
    })(),
  );
});
