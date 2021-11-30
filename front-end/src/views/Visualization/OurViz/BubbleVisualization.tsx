import React, { useEffect, useState } from "react"
import BubbleChart from "@weknow/react-bubble-chart-d3"
import { getAPI } from "../../../APIClient"
import { useHistory } from "react-router-dom"
import { Typography } from "antd"

const { Title } = Typography

const UnivCostChart: React.FunctionComponent = () => {
   const [data, setData] = useState([]);
   const [loading, setLoading] = useState(false);
   const history = useHistory();
   const [univ_id] = useState(new Map());

   useEffect(() => {
      const parseData = (data) => {
         const output = data.map((univ) => {
            const {
               univ_name,
               avg_cost_attendance,
            } = univ
            return { label: univ_name, value: avg_cost_attendance }
         })
         return output
      }
      const fetchDataAsync = async () => {
         try {
            setLoading(true);
            const params = `per_page=189`
            const data = await getAPI({
               model: 'universities',
               params: params
            });
            data[1]['universities'].forEach((univ) => {
               univ_id.set(univ.univ_name, univ.univ_id)
            })
            const parsedData = parseData(data[1]['universities'])
            setData(parsedData)
            setLoading(false)
         } catch (err) {
            console.error(err);
            history.push('/error')
         }
      };
      fetchDataAsync();
   }, [univ_id]);

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
   console.log(univ_id)
   return (
      <>
         <Title level={2}>Average Cost of Attendance</Title>
         <div>
            <BubbleChart
               graph={{
                  zoom: 0.9,
                  offsetX: 0.0,
                  offsetY: 0.0,
               }}
               showLegend={false}
               width={1000}
               height={1000}
					valueFont={{
						family: "Arial",
						size: 12,
						color: "#fff",
						weight: "bold",
					}}
					labelFont={{
						family: "Arial",
						size: 8,
						color: "#fff",
						weight: "bold",
					}}
					data={data}
					bubbleClickFun={(val) => {
						history.push(`/universities/${univ_id.get(val)}`)
					}}
				/>
			</div>
      </>
   );

}

export default UnivCostChart;