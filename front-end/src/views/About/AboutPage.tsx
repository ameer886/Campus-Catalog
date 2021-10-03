import React from 'react';
import { useEffect, useRef, useState } from 'react';
import './AboutPage.css';

import axios from 'axios';
import type { IntentionallyAny } from '../../utilities';

// Basic types to help process contributors
type OurNames =
  | 'Ryan Gahagan'
  | 'David He'
  | 'Andrew Luo'
  | 'Richa Gadre'
  | 'Brandon Hinh'
  | 'UNKNOWN';

type Member = {
  name: OurNames;
  commits: number;
};

// We map commits to author by email, so this function is useful
function mapEmailToName(email: string): OurNames {
  switch (email) {
    case 'ryangahagan18@gmail.com':
      return 'Ryan Gahagan';
    case 'richagadre@gmail.com':
      return 'Richa Gadre';
    case 'luoandrew27@gmail.com':
      return 'Andrew Luo';
    case 'brandonhinh@utexas.edu':
      return 'Brandon Hinh';
    case 'ameer886@outlook.com':
      return 'David He';
    default:
      return 'UNKNOWN';
  }
}

// The information about a single commit returned by our API
type CommitInfo = {
  id: string;
  short_id: string;
  created_at: string;
  parent_ids: Array<string>;
  title: string;
  message: string;
  author_name: string;
  author_email: string;
  authored_date: string;
  committer_name: string;
  committer_email: string;
  committed_date: string;
  web_url: string;
  // Trailers is always an empty object so this is intentional
  trailers: IntentionallyAny;
};

/*
 * The About page
 * Should eventually contain personal info and commit info
 * Setting this up is very complicated and easy
 * to build circular dependencies, so I'll try to
 * explain as best as I can
 */
const AboutPage: React.FunctionComponent = () => {
  // Build an array to our current members and their commit info
  const [members, setMembers] = useState<Member[]>([
    {
      name: 'Ryan Gahagan',
      commits: 0,
    },
    {
      name: 'Andrew Luo',
      commits: 0,
    },
    {
      name: 'Brandon Hinh',
      commits: 0,
    },
    {
      name: 'Richa Gadre',
      commits: 0,
    },
    {
      name: 'David He',
      commits: 0,
    },
  ]);

  // Copy our array and get its actual reference
  const membersCopy: Member[] = JSON.parse(JSON.stringify(members));
  const { current: membersCopyRef } = useRef(membersCopy);

  // Fetch data has side effects, so put it into useEffect
  useEffect(() => {
    // Axios is a library that allows us to easily ping gitlab
    axios
      .get(
        'https://gitlab.com/api/v4/projects/29886588/repository/commits?all&ref_name=main',
      )
      .then((res) => {
        // res is the response/resolution of a promise
        // res.data is the JSON response we receive
        const arr = res.data as CommitInfo[];
        arr.forEach((commit) => {
          // Figure out who did each commit
          const name = mapEmailToName(commit.author_email);
          if (name === 'UNKNOWN') {
            console.log('Unrecognized email: ', commit.author_email);
          } else {
            const m = membersCopyRef.find(
              (member) => member.name === name,
            );
            // Count number of commits per person
            if (m) m.commits++;
          }
        });

        // This is a spread operator
        // This unpacks the objects into a new array reference
        setMembers([...membersCopyRef]);
      });
  }, [membersCopyRef]);
  // The above line memoizes/stores the data for the reference to the copy

  console.log(members);

  return (
    <div className="About">
      <h1>About</h1>

      {members.map((member, index) => (
        <div key={index}>
          <h2>{member.name}</h2>
          <p>
            This member has made {member.commits} commits to main.
          </p>
        </div>
      ))}
    </div>
  );
};

export default AboutPage;
