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
        'https://api.bevoscourseguide.me/api/coursereduced',
      );
      const courseData = await courseFetch.json();

      // Maps prof names to prof objects to group courses
      const profToCourses = new Map<string, IntentionallyAny>();
      // Maps dept names to dept objects to group profs
      const deptToProfs = new Map<string, IntentionallyAny>();

      // For each course
      courseData.forEach((course) => {
        if (course.course_desc !== 'NaN') {
          // Concatenate all the professors that teach it
          if (
            course.course_professors.length > 0 &&
            course.course_professors[0] !== 'NaN' &&
            !course.course_dept_general_name.includes(
              'No Department for',
            )
          ) {
            let profConcat = course.course_professors[0];
            for (
              let i = 1;
              i < course.course_professors.length;
              i++
            ) {
              profConcat += ', ' + course.course_professors[i];
            }

            // If the professor has no datum yet, make the datum
            const profKey =
              course.course_dept_specific_abbr + profConcat;
            if (!profToCourses.has(profKey)) {
              profToCourses.set(profKey, {
                name: profConcat,
                children: [],
              });
            }

            // Add the course to the professor
            const profObj = profToCourses.get(profKey);
            profObj.children.push({
              // note: we're skipping sections here because there's way too much
              name: course.course_num_name,
              children: [],
              value: course.num_section,
            });

            // Finally, if the department of this course/prof doesn't exist, add one
            if (!deptToProfs.has(course.course_dept_general_name)) {
              deptToProfs.set(course.course_dept_general_name, {
                name: course.course_dept_general_name,
                children: [],
              });
            }
            const deptObj = deptToProfs.get(
              course.course_dept_general_name,
            );
            // Add professor to department if we haven't already done so
            let includesProf = false;
            for (let i = 0; i < deptObj.children.length; i++)
              if (deptObj.children[i].name === profObj.name)
                includesProf = true;
            if (!includesProf) deptObj.children.push(profObj);
          }
        }
      });

      const sunburstData = {
        name: 'UT',
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
        width={window.innerWidth * 1.0}
        height={window.innerHeight * 1.0}
      />
    </div>
  );
};

export default ProviderSunburst;
