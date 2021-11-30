import React from 'react';
import { useState, useEffect } from 'react';

import type { IntentionallyAny } from '../../../utilities';

import Sunburst from 'react-d3-zoomable-sunburst';

const ProviderSunburst: React.FunctionComponent = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<IntentionallyAny>(null);

  useEffect(() => {
    const fetchDataAsync = async () => {
      // Fetch course data
      const courseFetch = await fetch(
        'https://api.bevoscourseguide.me/api/allcourses?per_page=10000',
      );
      const courseData = (await courseFetch.json()).courses;

      // Maps prof names to prof objects to group courses
      const profToCourses = new Map<string, IntentionallyAny>();
      // Maps dept names to dept objects to group profs
      const deptToProfs = new Map<string, IntentionallyAny>();

      // For each course
      courseData.forEach((course) => {
        // For each professor that teaches it
        course.professors.forEach((prof) => {
          if (prof !== 'NaN') {
            // If the professor has no datum yet, make the datum
            if (!profToCourses.has(prof)) {
              profToCourses.set(prof, {
                name: prof,
                children: [],
              });
            }

            // Add the course to the professor
            const profObj = profToCourses.get(prof);
            profObj.children.push({
              // note: we're skipping sections here because there's way too much
              name: course['num name'],
              children: [],
              value: course.section.length,
            });

            // Finally, if the department of this course/prof doesn't exist, add one
            if (!deptToProfs.has(course['dept general'])) {
              deptToProfs.set(course['dept general'], {
                name: course['dept general'],
                children: [],
              });
            }
            const deptObj = deptToProfs.get(course['dept general']);
            // Add professor to department if we haven't already done so
            let includesProf = false;
            for (let i = 0; i < deptObj.children.length; i++)
              if (deptObj.children[i].name === profObj.name)
                includesProf = true;
            if (!includesProf) deptObj.children.push(profObj);
          }
        });
      });

      const sunburstData = {
        name: 'Bevos',
        children: Array.from(deptToProfs.values()),
      };
      setData(sunburstData);
      setLoading(false);
    };
    fetchDataAsync();
  }, []);

  if (loading || data == null) return <p>Loading</p>;

  return (
    <div
      style={{
        justifyContent: 'center',
        display: 'flex',
      }}
    >
      <Sunburst
        data={data}
        scale="exponential"
        tooltipContent={<div className="sunburstTooltip" />}
        tooltip
        tooltipPosition="right"
        keyId="Sunburst"
        value="value"
        width={window.innerWidth * 0.8}
        height={window.innerHeight * 0.8}
      />
    </div>
  );
};

export default ProviderSunburst;
