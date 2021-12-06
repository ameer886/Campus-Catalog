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
} from "recharts";

const { Title } = Typography;

const Scatterplot: React.FunctionComponent = () => {
    const [data, setData] = useState([]);
    const [displayData, setDisplayData] = useState();
    const [loading, setLoading] = useState(false);
    const history = useHistory()
    const [score, setScore] = useState("Walk Score");

    useEffect(() => {
      const fetchDataAsync = async () => {
        try {
          setLoading(true);
          const params = `walk_score=1,2,3,4&transit_score=1,2,3,4&per_page=300`;
          const data = await getAPI({
            model: 'housing',
            params: params,
          });
          setData(data[1]["properties"]);
          setLoading(false);
        } catch (err) {
          console.error(err);
          history.push('/error');
        }
      };
      fetchDataAsync();
    }, []);

    useEffect(() => {
      const parseData = (data) => {
        let output = data.map((housing) => {
          const { walk_score, rent } = housing;
          const avg = (rent["min"] + rent["max"]) / 2;
          return { x: walk_score, y: avg };
        });
        if (score == "Transit Score") {
          output = data.map((housing) => {
            const { transit_score, rent } = housing;
            const avg = (rent["min"] + rent["max"]) / 2;
            return { x: transit_score, y: avg };
          });
        } 
        return output;
      };
      setDisplayData(parseData(data))
    }, [score]);

    if (loading)
      return (
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
      );
    
   return (
     <>
       <Title level={2}>{score} vs. Average Rent Cost</Title>
       <div style={{
          justifyContent: 'center',
          display: 'flex',
        }}>
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
         <ScatterChart width={1750} height={750}
            margin={{ top: 20, right: 20, bottom: 10, left: 10 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="x" name={score} ticks={[10,20, 30, 40, 50, 60, 70, 80, 90, 100]} type="number"/>
            <YAxis dataKey="y" name="Average Rent Cost" unit="$" type="number" />
            <Scatter name="Property" data={displayData} fill="#8884d8" />
         </ScatterChart>
       </div>
     </>
   );
 };
 
 export default Scatterplot;