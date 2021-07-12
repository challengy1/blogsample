import React, { FC } from 'react';
import { Bar, Line, Scatter, Bubble, Pie, Doughnut, PolarArea, Radar } from 'react-chartjs-2';
import { css } from '@emotion/react';
import { ChartData, ChartOptions, ChartType } from 'chart.js';

type PropsType = {
  code: string;
  height: string;
  width: string;
};

type dataType = {
  graph: {
    type: ChartType;
    data: ChartData;
    options: ChartOptions;
  };
};

export const Graph: FC<PropsType> = (props) => {
  const { code, height, width } = props;
  const input = JSON.parse(code) as dataType;
  const { graph } = input;
  const { type, data, options } = graph;
  const numHeight = parseInt(height.replace('px', ''), 10);
  const numWidth = parseInt(width.replace('px', ''), 10);

  const selectGraph = () => {
    switch (type) {
      case 'bar':
        return <Bar type="bar" data={data} options={options} height={numHeight} width={numWidth} />;
      case 'line':
        return <Line type="line" data={data} options={options} height={numHeight} width={numWidth} />;
      case 'scatter':
        return <Scatter type="scatter" data={data} options={options} height={numHeight} width={numWidth} />;
      case 'bubble':
        return <Bubble type="bubble" data={data} options={options} height={numHeight} width={numWidth} />;
      case 'pie':
        return <Pie type="pie" data={data} options={options} height={numHeight} width={numWidth} />;
      case 'doughnut':
        return <Doughnut type="doughnut" data={data} options={options} height={numHeight} width={numWidth} />;
      case 'polarArea':
        return <PolarArea type="polarArea" data={data} options={options} height={numHeight} width={numWidth} />;
      case 'radar':
        return <Radar type="radar" data={data} options={options} height={numHeight} width={numWidth} />;
      default:
        return null;
    }
  };

  return (
    /* eslint-disable @typescript-eslint/no-use-before-define */
    <div>
      <div css={graphCss}>{selectGraph()}</div>
    </div>
    /* eslint-enable @typescript-eslint/no-use-before-define */
  );
};

const graphCss = css`
  width: 95%;
  margin-bottom: 30px;
`;
