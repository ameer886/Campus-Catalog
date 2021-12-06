import React from 'react';
import { useState, useEffect } from 'react';
import {
  ScatterChart,
  CartesianGrid,
  XAxis,
  YAxis,
  ZAxis,
  Tooltip,
  Legend,
  Scatter,
} from 'recharts';

import { IntentionallyAny } from '../../../utilities';

const ProviderScatter: React.FunctionComponent = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<IntentionallyAny | null>(null);

  useEffect(() => {
    const fetchDataAsync = async () => {
      const deptFetch = await fetch(
        'https://api.bevoscourseguide.me/api/alldepartments?per_page=150',
      );
      const deptData = await deptFetch.json();

      // Want to map data to array of points with coords
      const pointArray: IntentionallyAny[] = [];
      deptData.departments.forEach((dept) => {
        if (
          dept['all professors'].length > 0 &&
          dept['all classes'].length > 0
        )
          pointArray.push({
            numProfs: dept['all professors'].length,
            numClasses: dept['all classes'].length,
            name: dept.name,
          });
      });

      setData(pointArray);
      setLoading(false);
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
    <div style={{ display: 'flex', justifyContent: 'center' }}>
      <ScatterChart
        width={window.innerWidth * 0.9}
        height={window.innerHeight * 0.8}
        margin={{ top: 10, bottom: 25, left: 5, right: 5 }}
      >
        <CartesianGrid strokeDasharray="4 4" />
        <XAxis
          dataKey="numClasses"
          name="Classes"
          type="number"
          domain={[0, 'dataMax']}
          ticks={[0, 170, 340, 511]} // Ticks are not spaced evenly by default
        />
        <YAxis
          dataKey="numProfs"
          name="Professors"
          type="number"
          domain={[0, 'dataMax']}
          ticks={[0, 96, 192, 289]}
        />
        <ZAxis dataKey="name" name="Department Name" />
        <Tooltip cursor={{ strokeDasharray: '4 4' }} />
        <Legend />
        <Scatter name="Departments" data={data} fill="#8884d8" />
      </ScatterChart>
    </div>
  );
};

export default ProviderScatter;
