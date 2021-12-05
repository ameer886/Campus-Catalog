import React, { useEffect, useState } from 'react';
import { getAPI } from '../../../APIClient';
import { useHistory } from 'react-router-dom';
import { Typography } from 'antd';
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
   const [loading, setLoading] = useState(false);
   const history = useHistory()
 
   useEffect(() => {
     const parseData = (data) => {
       const output = data.map((housing) => {
         const { walk_score, rent } = housing;
         const avg = (rent["min"] + rent["max"]) / 2;
         return { x: walk_score, y: avg };
       });
       return output;
     };
     const fetchDataAsync = async () => {
       try {
         setLoading(true);
         const params = `walk_score=1,2,3,4&per_page=300`;
         const data = await getAPI({
           model: 'housing',
           params: params,
         });
         const parsedData = parseData(data[1]['properties']);
         setData(parsedData);
         setLoading(false);
       } catch (err) {
         console.error(err);
         history.push('/error');
       }
     };
     fetchDataAsync();
   }, []);
 
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
       <Title level={2}>Walk Score vs. Average Rent Cost</Title>
       <div>
         <ScatterChart width={1750} height={750}
            margin={{ top: 20, right: 20, bottom: 10, left: 10 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="x" name="Walk Score" ticks={[10,20, 30, 40, 50, 60, 70, 80, 90, 100]} type="number"/>
            <YAxis dataKey="y" name="Average Rent Cost" unit="$" type="number" />
            <Scatter name="Property" data={data} fill="#8884d8" />
         </ScatterChart>
       </div>
     </>
   );
 };
 
 export default Scatterplot;