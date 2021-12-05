import React from 'react';
import { useState, useEffect } from 'react';
import { Sankey, Tooltip } from 'recharts';
import { IntentionallyAny } from '../../../utilities';

const ProviderSankey: React.FunctionComponent = () => {
  const [data, setData] = useState<IntentionallyAny | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDataAsync = async () => {
      const courseFetch = await fetch(
        'https://api.bevoscourseguide.me/api/allcourses?per_page=5740',
      );
      const courseData = await courseFetch.json();

      const buildData = {
        nodes: [
          { name: 'Courses' },
          { name: 'Monday' },
          { name: 'Tuesday' },
          { name: 'Wednesday' },
          { name: 'Thursday' },
          { name: 'Friday' },
        ],
        links: [
          { source: 0, target: 1, value: 0 },
          { source: 0, target: 2, value: 0 },
          { source: 0, target: 3, value: 0 },
          { source: 0, target: 4, value: 0 },
          { source: 0, target: 5, value: 0 },
        ],
      };

      const addToLink = (source: number, target: number) => {
        // Find the link for this spread
        let found = false;
        for (let k = 0; !found && k < buildData.links.length; k++) {
          const link = buildData.links[k];
          if (link.source === source && link.target === target) {
            // Increase existing link
            link.value += 1;
            found = true;
            break;
          }
        }
        if (!found)
          // Create new link for new day
          buildData.links.push({
            source: source,
            target: target,
            value: 1,
          });
      };

      courseData.courses.forEach((course) => {
        if (course.days.length > 0) {
          // Break days into array for usage
          const dayArr = course.days.split(
            new RegExp('(?=M)|(?=T)|(?=W)|(?=TH)|(?=F)', 'g'),
          );

          // Add to link to this spread only if multiple days
          if (dayArr.length === 1) {
            // If one day, make a direct link
            switch (dayArr[0]) {
              case 'M':
                buildData.links[0].value += 1;
                break;
              case 'T':
                buildData.links[1].value += 1;
                break;
              case 'W':
                buildData.links[2].value += 1;
                break;
              case 'TH':
                buildData.links[3].value += 1;
                break;
              case 'F':
                buildData.links[4].value += 1;
            }
          } else {
            // Find the index into nodes where this begins
            let sourceIndex = -1;
            for (let i = 6; i < buildData.nodes.length; i++) {
              if (buildData.nodes[i].name === course.days) {
                sourceIndex = i;
                break;
              }
            }
            if (sourceIndex === -1) {
              sourceIndex = buildData.nodes.length;
              buildData.nodes.push({ name: course.days });
            }

            // On spread, add new mid-link
            addToLink(0, sourceIndex);

            // Iterate each day and adjust links again
            dayArr.forEach((day) => {
              switch (day) {
                case 'M':
                  addToLink(sourceIndex, 1);
                  break;
                case 'T':
                  addToLink(sourceIndex, 2);
                  break;
                case 'W':
                  addToLink(sourceIndex, 3);
                  break;
                case 'TH':
                  addToLink(sourceIndex, 4);
                  break;
                case 'F':
                  addToLink(sourceIndex, 5);
                  break;
              }
            });
          }
        }
      });

      console.log(buildData);
      setData(buildData);
      setLoading(false);
    };
    fetchDataAsync();
  }, []);

  if (loading || data == null)
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
      <Sankey
        width={960}
        height={720}
        //nodePadding={15}
        nodeWidth={15}
        data={data}
        link={{ stroke: '#7778c8' }}
        //node={<text>Test</text>}
      >
        <Tooltip />
      </Sankey>
    </div>
  );
};

export default ProviderSankey;
