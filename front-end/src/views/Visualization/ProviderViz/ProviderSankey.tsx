import React from 'react';
import { useState, useEffect } from 'react';
import { Sankey, Tooltip } from 'recharts';

import SankeyNode from './SankeyNode';

import { IntentionallyAny } from '../../../utilities';

const ProviderSankey: React.FunctionComponent = () => {
  const [data, setData] = useState<IntentionallyAny | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDataAsync = async () => {
      // Our provider's site crashes if we actually fetch every single course at once
      // so instead we're going to run a ton of fetch requests in a row
      const courseData: IntentionallyAny = {
        courses: [],
      };

      for (let i = 1; i <= 115; i++) {
        const pageFetch = await fetch(
          `https://api.bevoscourseguide.me/api/allcourses?page=${i}&per_page=50`,
        );
        const pageData = await pageFetch.json();
        courseData.courses.push(...pageData.courses);
      }

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

      const addToLink = (
        source: number,
        target: number,
        amount?: number,
      ) => {
        // Find the link for this spread
        let found = false;
        for (let k = 0; !found && k < buildData.links.length; k++) {
          const link = buildData.links[k];
          if (link.source === source && link.target === target) {
            // Increase existing link
            link.value += amount ?? 1;
            found = true;
            break;
          }
        }
        if (!found)
          // Create new link for new day
          buildData.links.push({
            source: source,
            target: target,
            value: amount ?? 1,
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
            // You may think we should add one here, and you'd be right
            // Except that the payloads calculate node displays via a
            // max(sum(inputs), sum(outputs)) function
            // So the middle layer looks like it has more outputs than
            // inputs, which is v. ugly
            // Hence this "fix"
            addToLink(0, sourceIndex, dayArr.length);

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
        //width={1400}  // Supposedly these can be set to percentages
        //height={1000} // but idk how, hence this fugly fix
        width={window.innerWidth * 0.9}
        height={window.innerHeight}
        nodePadding={30}
        nodeWidth={15}
        data={data}
        link={{ stroke: '#7778c8' }}
        margin={{ left: 100, right: 100, top: 40, bottom: 40 }}
        node={<SankeyNode />}
      >
        <Tooltip />
      </Sankey>
    </div>
  );
};

export default ProviderSankey;
