import React, { useEffect, useState } from 'react';
import { getAPI } from '../../../APIClient';
import { useHistory } from 'react-router-dom';
import { Typography } from 'antd';
import Form from 'react-bootstrap/Form';
import {
  ScatterChart,
  XAxis,
  YAxis,
  Scatter,
  CartesianGrid,
} from 'recharts';

import { IntentionallyAny } from '../../../utilities';

const { Title } = Typography;

const Scatterplot: React.FunctionComponent = () => {
  const [data, setData] = useState<IntentionallyAny | null>(null);
  const [displayData, setDisplayData] =
    useState<IntentionallyAny | null>(null);
  const [loading, setLoading] = useState(false);
  const history = useHistory();
  const [score, setScore] = useState('Walk Score');

  useEffect(() => {
    const fetchDataAsync = async () => {
      try {
        setLoading(true);
        const params =
          'walk_score=1,2,3,4&transit_score=1,2,3,4&per_page=300';
        const response = await getAPI({
          model: 'housing',
          params: params,
        });

        const output: IntentionallyAny = {
          'Transit Score': [],
          'Walk Score': [],
        };

        response[1].properties.forEach((house) => {
          const { walk_score, transit_score, rent } = house;
          const avg = (rent.min + rent.max) / 2;
          output['Transit Score'].push({
            x: transit_score,
            y: avg,
          });
          output['Walk Score'].push({
            x: walk_score,
            y: avg,
          });
        });

        setData(output);
      } catch (err) {
        console.error(err);
        history.push('/error');
      }
    };
    fetchDataAsync();
  }, []);

  useEffect(() => {
    if (data == null) return;

    setDisplayData(data[score]);
    setLoading(false);
  }, [score, data]);

  console.log(displayData);

  return (
    <>
      <Title level={2}>{score} vs. Average Rent Cost</Title>
      <div>
        <Form>
          <Form.Group>
            <Form.Label htmlFor="scoreSelect">
              Select your score:
            </Form.Label>
            <br />
            <select onChange={(e) => setScore(e.target.value)}>
              <option value="Walk Score">Walk Score</option>
              <option value="Transit Score">Transit Score</option>
            </select>
          </Form.Group>
        </Form>

        {!loading && (
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <ScatterChart
              width={window.innerWidth * 0.9}
              height={window.innerHeight * 0.8}
              margin={{ top: 10, bottom: 25, left: 5, right: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="x"
                name={score}
                ticks={[10, 20, 30, 40, 50, 60, 70, 80, 90, 100]}
                type="number"
              />
              <YAxis
                dataKey="y"
                name="Average Rent Cost"
                unit="$"
                type="number"
              />
              <Scatter
                name="Property"
                data={displayData}
                fill="#8884d8"
              />
            </ScatterChart>
          </div>
        )}

        {loading && (
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              width: '100%',
              marginBottom: '8px',
            }}
          >
            Loading, please be patient.
          </div>
        )}
      </div>
    </>
  );
};

export default Scatterplot;
