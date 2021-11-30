import React from 'react';
import { useState, useEffect } from 'react';

import type { IntentionallyAny } from '../../../utilities';

const ProviderSunburst: React.FunctionComponent = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<IntentionallyAny>(null);

  useEffect(() => {
    const fetchDataAsync = async () => {
      // Fetch course data
      const courseData = [
        {
          college: 'College of Liberal Arts',
          days: 'TTH',
          'dept general': 'Center for Asian American Studies',
          'dept specific': 'AAS',
          desc: 'Examine the changing population of the United States from colonial times to present.',
          hours: ['12:30 PM - 02:00 PM'],
          'num name': 'AAS 302 IMMIGRATION AND ETHNICITY',
          professors: ['HSU, M'],
          section: ['32815'],
          syllabus:
            'http://utdirect.utexas.edu/apps/student/coursedocs/nlogon/download/11294301',
        },
      ];

      // Maps prof names to prof objects to group courses
      const profToCourses = new Map();
      // Maps dept names to dept objects to group profs
      const deptToProfs = new Map();

      // For each course
      courseData.forEach((course) => {
        // For each professor that teaches it
        course.professors.forEach((prof) => {
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

  if (loading) return <p>Loading</p>;

  return <div />;
};

export default ProviderSunburst;
