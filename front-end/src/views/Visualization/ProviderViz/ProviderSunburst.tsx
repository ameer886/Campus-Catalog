import React from 'react';
import { useState, useEffect } from 'react';

import type { IntentionallyAny } from '../../../utilities';

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
      const profToCourses = new Map();
      // Maps dept names to dept objects to group profs
      const deptToProfs = new Map();

      // For each course
      courseData.forEach((course) => {
        // For each professor that teaches it
        course.professors.forEach((prof) => {
          if (prof !== 'NaN') {
            // If the professor has no datum yet, make the datum
            if (!profToCourses.has(prof))
              profToCourses.set(prof, {
                name: prof,
                children: [],
              });

            const profObj = profToCourses.get(prof);
            // Add the course to the professor
            profObj.children.push({
              name: course['num name'],
              // Children of a course is every section
              children: course.section.map((s) => {
                return {
                  name: s,
                  children: [],
                  value: 1,
                };
              }),
            });

            // Finally, if the department of this course/prof doesn't exist, add one
            if (!deptToProfs.has(course['dept ganeral']))
              deptToProfs.set(course['dept general'], {
                name: course['dept general'],
                children: [],
              });
            const deptObj = deptToProfs.get(course['dept general']);
            // Add professor to department if we haven't already done so
            if (!deptObj.children.includes(profObj))
              deptObj.children.push(profObj);
          }
        });
      });

      const sunburstData = {
        name: 'Bevos',
        children: Array.from(deptToProfs.values()),
      };
      console.log(sunburstData);
      setData(sunburstData);
      setLoading(false);
    };
    fetchDataAsync();
  }, []);

  if (loading) return <p>Loading</p>;

  return <div />;
};

export default ProviderSunburst;
