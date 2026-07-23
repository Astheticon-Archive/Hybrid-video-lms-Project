import { makeScene2D, Rect, Txt, Line } from '@revideo/2d';
import { all, chain, createRef, waitFor } from '@revideo/core';
import { THEME } from '../utils/theme';
import { Background } from '../components/Background';
import { Database } from '../components/Database';
import { SearchBar } from '../components/SearchBar';
import { Vector } from '../components/Vector';
import { Document } from '../components/Document';
import { Caption } from '../components/Caption';
import { AnimatedArrow } from '../components/AnimatedArrow';
import { popIn } from '../animations/pop';
import { fadeIn } from '../animations/fade';
import { drawIn } from '../animations/draw';
import { slideOutTo } from '../animations/slide';
import { typeText } from '../animations/typing';

export default makeScene2D('scene9', function* (view) {
  const cameraRef = createRef<Rect>();
  const titleRef = createRef<Rect>();

  const searchBarRef = createRef<Rect>();
  const arrowSearchToVecRef = createRef<Line>();

  const queryVecRef = createRef<Rect>();
  const arrowVecToDbRef = createRef<Line>();

  const dbContainerRef = createRef<Rect>();
  const dbRef = createRef<Rect>();
  const arrowDbToDocRef = createRef<Line>();

  const docContainerRef = createRef<Rect>();
  const docRef = createRef<Document>();

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
            fill={THEME.colors.cyan}
            text={'Vector Search & Retrieval'}
          />
        </Rect>

        {/* User Search Bar */}
        <SearchBar
          ref={searchBarRef}
          x={-500}
          y={-150}
          opacity={1}
          searchText={'What is RAG?'}
        />

        {/* Arrow Search -> Vector */}
        <AnimatedArrow
          ref={arrowSearchToVecRef}
          points={[[-500, -100], [-500, -20]]}
          glowColor={THEME.colors.primary}
        />

        {/* Query Vector */}
        <Vector
          ref={queryVecRef}
          x={-500}
          y={50}
          opacity={1}
          values={[0.77, -0.12, 0.54]}
          glow={true}
        />

        {/* Arrow Vector -> DB */}
        <AnimatedArrow
          ref={arrowVecToDbRef}
          points={[[-350, 50], [-130, 50]]}
          glowColor={THEME.colors.cyan}
        />

        {/* DB Cylinder stack */}
        <Rect ref={dbContainerRef} x={0} y={50} opacity={1}>
          <Database ref={dbRef} />
        </Rect>

        {/* Arrow DB -> Document */}
        <AnimatedArrow
          ref={arrowDbToDocRef}
          points={[[120, 50], [330, 50]]}
          glowColor={THEME.colors.cyan}
        />

        {/* Retrieved Document */}
        <Rect ref={docContainerRef} x={450} y={50} opacity={1}>
          <Document ref={docRef} highlightedLine={2} highlightColor={THEME.colors.cyan} />
        </Rect>

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
    cameraRef().scale(1.04, 10),
    cameraRef().position.y(-10, 10),

    // Scene animation sequence
    chain(
      typeText(captionTxt, 'The query is vectorized, compared to indexed vectors, and the top-matching documents are retrieved.', 7.44)
    )
  );
});
