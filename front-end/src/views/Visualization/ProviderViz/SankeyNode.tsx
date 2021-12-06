import React from 'react';
import { Rectangle, Layer } from 'recharts';
import { IntentionallyAny } from '../../../utilities';

// Components taken from Recharts demo:
// https://github.com/recharts/recharts/blob/6c692d3919b75c348b9d4a034aca011fb40f0202/demo/component/DemoSankeyNode.tsx

const SankeyNode: React.FunctionComponent = ({
  x,
  y,
  width,
  height,
  index,
  payload,
  containerWidth,
}: IntentionallyAny) => {
  const isOut = x + width + 6 > containerWidth;
  return (
    <Layer key={`CustomNode${index}`}>
      <Rectangle
        x={x}
        y={y}
        width={width}
        height={height}
        fill="#5192ca"
        fillOpacity="1"
      />
      <text
        textAnchor={isOut ? 'end' : 'start'}
        x={isOut ? x - 6 : x + width + 6}
        y={y + height / 2}
        fontSize="14"
        stroke="#333"
      >
        {payload.name}
      </text>
      <text
        textAnchor={isOut ? 'end' : 'start'}
        x={isOut ? x - 6 : x + width + 6}
        y={y + height / 2 + 13}
        fontSize="12"
        stroke="#333"
        strokeOpacity="0.5"
      >
        {payload.value + ' courses'}
      </text>
    </Layer>
  );
};

export default SankeyNode;
