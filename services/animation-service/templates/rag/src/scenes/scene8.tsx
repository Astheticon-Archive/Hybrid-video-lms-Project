import { makeScene2D, Rect, Txt } from '@revideo/2d';
import { all, chain, createRef, waitFor } from '@revideo/core';
import { THEME } from '../utils/theme';
import { Background } from '../components/Background';
import { Database } from '../components/Database';
import { Vector } from '../components/Vector';
import { Caption } from '../components/Caption';
import { popIn } from '../animations/pop';
import { fadeIn } from '../animations/fade';
import { pulseScale } from '../animations/pulse';
import { slideOutTo } from '../animations/slide';
import { typeText } from '../animations/typing';

export default makeScene2D('scene8', function* (view) {
  const cameraRef = createRef<Rect>();
  const titleRef = createRef<Rect>();

  const dbContainerRef = createRef<Rect>();
  const dbRef = createRef<Rect>();

  const vec1Ref = createRef<Rect>();
  const vec2Ref = createRef<Rect>();
  const vec3Ref = createRef<Rect>();

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
            fill={THEME.colors.primary}
            text={'Vector Databases'}
          />
        </Rect>

        {/* DB Cylinder stack on the right */}
        <Rect ref={dbContainerRef} x={300} y={0} opacity={1}>
          <Database ref={dbRef} glow={false} />
        </Rect>

        {/* Vectors on the left, to be inserted */}
        <Vector
          ref={vec1Ref}
          x={-400}
          y={-120}
          opacity={1}
          values={[0.15, -0.92, 0.44]}
          glow={true}
        />

        <Vector
          ref={vec2Ref}
          x={-400}
          y={0}
          opacity={1}
          values={[0.88, 0.03, -0.56]}
          glow={true}
        />

        <Vector
          ref={vec3Ref}
          x={-400}
          y={120}
          opacity={1}
          values={[-0.31, 0.65, 0.12]}
          glow={true}
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
      typeText(captionTxt, 'Vector databases index these embeddings in high-dimensional spaces to find semantic connections instantly.', 8.21)
    )
  );
});
