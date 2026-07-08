import {Txt, Rect, Layout} from '@revideo/2d';

export const Terminal = ({command, output}: {command: string, output: string[]}) => (
  <Layout>
    <Rect fill={'#1e1e1e'} padding={20} radius={10}>
      <Txt text={`$ ${command}`} fill={'white'} fontFamily={'monospace'} />
      <Layout direction={'column'} marginTop={10}>
        {output.map((line, i) => <Txt key={i.toString()} text={line} fill={'#cccccc'} fontFamily={'monospace'} />)}
      </Layout>
    </Rect>
  </Layout>
);
