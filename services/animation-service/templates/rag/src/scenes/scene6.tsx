import { makeScene2D, Rect, Txt, Line } from '@revideo/2d';
import { all, chain, createRef, waitFor } from '@revideo/core';
import { THEME } from '../utils/theme';
import { Background } from '../components/Background';
import { Card } from '../components/Card';
import { Document } from '../components/Document';
import { Caption } from '../components/Caption';
import { Badge } from '../components/Badge';
import { AnimatedArrow } from '../components/AnimatedArrow';
import { popIn } from '../animations/pop';
import { fadeIn } from '../animations/fade';
import { drawIn } from '../animations/draw';
import { typeText } from '../animations/typing';

export default makeScene2D('scene6', function* (view) {
  const cameraRef = createRef<Rect>();
  const titleRef = createRef<Rect>();

  const originalDocRef = createRef<Rect>();
  const sourceDocRef = createRef<Rect>();
  const dimLabelRef = createRef<Rect>();

  const chunk1Ref = createRef<Rect>();
  const chunk2Ref = createRef<Rect>();
  const chunk3Ref = createRef<Rect>();

  const arrow1Ref = createRef<Line>();
  const arrow2Ref = createRef<Line>();
  const arrow3Ref = createRef<Line>();

  const captionRef = createRef<Rect>();

  view.add(
    <Background>
      <Rect ref={cameraRef} size={['100%', '100%']} justifyContent={'center'} alignItems={'center'}>

        {/* Title */}
        <Rect ref={titleRef} y={-400} opacity={1}>
          <Txt
            fontFamily={THEME.fonts.main}
            fontSize={48}
            fontWeight={800}
            fill={THEME.colors.text}
            text={'Document Chunking'}
          />
        </Rect>


        {/* Large Original Document */}
        <Rect ref={originalDocRef} x={-400} y={0} opacity={1} alignItems={'center'}>
          ref={sourceDocRef} x={0} y={210} opacity={1} layout direction={'row'} alignItems={'center'} gap={20}
          <Document linesCount={5} highlightedLine={-1} />
          <Txt
            fontFamily={THEME.fonts.main}
            fontSize={20}
            fontWeight={700}
            fill={THEME.colors.textMuted}


          />
          <Document linesCount={8} />
        </Rect>

        {/* Chunk 1 Card */}
        <Card
          ref={chunk1Ref}
          x={300}
          y={-160}
          width={350}
          height={125}
          opacity={1}
        >
          <Badge text={'CHUNK 1 (Intro)'} color={THEME.colors.cyan} marginBottom={14} />
          <Rect layout direction={'row'} gap={6} width={'100%'}>
            <Rect width={'100%'} height={8} radius={4} fill={THEME.colors.textMuted} />
          </Rect>
        </Card>

        {/* Chunk 2 Card */}
        <Card
          ref={chunk2Ref}
          x={300}
          y={0}
          width={350}
          height={125}
          opacity={1}
        >
          <Badge text={'CHUNK 2 (Details)'} color={THEME.colors.cyan} marginBottom={14} />
          <Rect layout direction={'row'} gap={6} width={'100%'}>
            <Rect width={'90%'} height={8} radius={4} fill={THEME.colors.textMuted} />
          </Rect>
        </Card>

        {/* Chunk 3 Card */}
        <Card
          ref={chunk3Ref}
          x={300}
          y={160}
          width={350}
          height={125}
          opacity={1}
        >
          <Badge text={'CHUNK 3 (Summary)'} color={THEME.colors.cyan} marginBottom={14} />
          <Rect layout direction={'row'} gap={6} width={'100%'}>
            <Rect width={'80%'} height={8} radius={4} fill={THEME.colors.textMuted} />
          </Rect>
        </Card>

        {/* Dynamic branching arrows */}
        <AnimatedArrow
          ref={arrow1Ref}
          points={[[-220, 0], [-100, 0], [100, -160]]}
          glowColor={THEME.colors.cyan}
        />
        <AnimatedArrow
          ref={arrow2Ref}
          points={[[-220, 0], [100, 0]]}
          glowColor={THEME.colors.cyan}
        />
        <AnimatedArrow
          ref={arrow3Ref}
          points={[[-220, 0], [-100, 0], [100, 160]]}
          glowColor={THEME.colors.cyan}
        />

        {/* Caption */}
        <Caption
          ref={captionRef}
          text={''}
          y={350}
          opacity={1}
        />

      </Rect>
    </Background>
  );

  const captionTxt = captionRef().children()[0] as Txt;

  yield* all(
    // Slow camera drift
    cameraRef().scale(1.04, 8),
    cameraRef().position.x(-10, 8),

    // Scene animation sequence
    chain(
      typeText(captionTxt, 'We chunk documents into smaller paragraphs to make sure RAG retrieves highly specific context.', 7.39)
    )
  );
});
