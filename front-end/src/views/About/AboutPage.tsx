import React from 'react';
import { useEffect, useRef, useState } from 'react';
import styles from './AboutPage.module.css';
import { Nav } from 'react-bootstrap';

import axios from 'axios';
import type { IntentionallyAny } from '../../utilities';
import AboutMemberCard from './AboutMemberCard';

import GitLabLogoImg from './Images/GitLabLogo.png';
import PostmanLogoImg from './Images/PostmanLogo.png';

import RyanGahaganImg from './Images/RyanGahagan.png';
import BrandonHinhImg from './Images/BrandonHinh.png';
import RichaGadreImg from './Images/RichaGadre.png';
import DavidHeImg from './Images/DavidHe.png';
import AndrewLuoImg from './Images/AndrewLuo.png';
import { ToolGrid, APIGrid } from './AboutGrids';

// Basic types to help process contributors
type OurNames =
  | 'Ryan Gahagan'
  | 'David He'
  | 'Andrew Luo'
  | 'Richa Gadre'
  | 'Brandon Hinh'
  | 'UNKNOWN';

export type Member = {
  name: OurNames;
  username: string;
  commits: number;
  issues: number;
  unitTests: number;
  role: string;
  img?: string; // images should be 360px wide exactly
  color?: string;
  bio?: string;
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
      username: 'RG8452',
      commits: 0,
      issues: 0,
      unitTests: 29,
      color: '#31052f',
      role: 'Frontend Lead Developr',
      img: RyanGahaganImg,
      bio: "Ryan is a senior at UT Austin. He's from Dripping Springs, TX. \
            He takes math courses on the side, and plays video games as though \
            he didn't get 4 hours of sleep all semester. Most of his experience \
            is in front end programming, although he enjoys almost all CS topics. \
            Next year he'll be working full time at Facebook in Seattle.",
    },
    {
      name: 'Andrew Luo',
      username: 'Glynkaw',
      commits: 0,
      issues: 0,
      unitTests: 8,
      color: '#ebda8a',
      role: 'Backend Devops',
      img: AndrewLuoImg,
      bio: 'Andrew is a junior from Plano, Texas. Has no idea how he managed to get \
            to this point. Enjoys cooking, playing tennis, and watching anime.',
    },
    {
      name: 'Brandon Hinh',
      username: 'bhinh',
      commits: 0,
      issues: 0,
      unitTests: 10,
      color: '#90ee90',
      role: 'Backend Developer',
      img: BrandonHinhImg,
      bio: 'Brandon is currently a junior CS and Actuarial Science major. He is \
            from Houston, TX. He is interested in full-stack web development and \
            machine learning. In his free time, he enjoys dancing, playing video \
            games, and trying new foods.',
    },
    {
      name: 'Richa Gadre',
      username: 'richagadre',
      commits: 0,
      issues: 0,
      unitTests: 6,
      role: 'Frontend Developer',
      color: '#ff7f7f',
      img: RichaGadreImg,
      bio: 'Richa is currently studying Computer Science and minoring in Business \
            at UT. She is originally from Sugar Land, TX. Richa is interested in web and \
            mobile development and social entrepreneurship. In her free time, Richa is \
            watching 90s sitcoms, going on walks, and trying new coffee shops.',
    },
    {
      name: 'David He',
      username: 'ameer886',
      commits: 0,
      issues: 0,
      unitTests: 3,
      color: '#7df9ff',
      role: 'Backend Lead Developer',
      img: DavidHeImg,
      bio: 'David is a senior CS major at UT. He is from Shanghai, China. He is working \
            on backend development and database management for the site. He is also \
            interested in full stack development. He enjoys playing soccer, video \
            games, and taking care of animals.',
    },
  ]);

  const [totalIssues, setTotalIssues] = useState(0);
  const [totalCommits, setTotalCommits] = useState(0);

  // Copy our array and get its actual reference
  const membersCopy: Member[] = JSON.parse(JSON.stringify(members));
  const { current: membersCopyRef } = useRef(membersCopy);

  // Fetch data has side effects, so put it into useEffect
  useEffect(() => {
    // Axios is a library that allows us to easily ping gitlab
    const issuePrefix =
      'https://gitlab.com/api/v4/projects/29886588/issues_statistics?assignee_username=';
    const requestArray = members.map((member) =>
      axios.get(issuePrefix + member.username),
    );

    // First, find the number of issues by assignee
    axios
      .all([...requestArray])
      .then(
        axios.spread((...responses) => {
          let issuesCount = 0;
          for (let i = 0; i < responses.length; i++) {
            const response = JSON.parse(JSON.stringify(responses[i]));
            const numClosed = response.data.statistics.counts.closed;
            membersCopyRef[i].issues = numClosed;
            issuesCount += numClosed;
          }

          setTotalIssues(issuesCount);
        }),
      )
      .catch((errors) => console.error(errors));

    // Next, track the number of commits
    axios
      .get(
        'https://gitlab.com/api/v4/projects/29886588/repository/commits?all&ref_name=main&per_page=-1',
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
        setTotalCommits(arr.length);
      })
      .catch((errors) => console.error(errors));
  }, [membersCopyRef]);
  // The above line memoizes/stores the data for the reference to the copy

  let totalUnitTests = 0;
  members.forEach((member) => (totalUnitTests += member.unitTests));

  return (
    <div className={styles.About}>
      <h1 className={styles.Title}>About</h1>

      {/* Mission Statement */}
      <h3 className={styles.Section}>Our Mission</h3>
      <div className={styles.Centering}>
        <p className={styles.Info} style={{ maxWidth: '850px' }}>
          Finding a college is one of life&#39;s biggest decisions, so
          we feel that it is important to be as informed as possible.
          This website has compiled universities, apartments, and
          recreational amenities around the country to help people
          determine how good a college is, where they could live
          there, and what there is to do for fun.
        </p>
      </div>

      {/* Interesting Results */}
      <h3 className={styles.Section}>Why Use Our Website?</h3>
      <div className={styles.Centering}>
        <p className={styles.Info} style={{ maxWidth: '850px' }}>
          Being able to combine different datasets allowed us to find
          out interesting things about Universities and the areas that
          surround them. For example, there tend to be significantly
          more available amenities near universities in urban areas
          than rural areas, but the tuition and apartment prices also
          tend to be higher. Using our website will allow users to
          find similar connections and get a deeper understanding of
          the colleges that they&#39;re interested in.
        </p>
      </div>

      {/* Members and statistics */}
      <h3 className={styles.Section}>Us</h3>
      <p className={styles.Info}>
        Come and meet the people who built this project!
      </p>

      {members.map((member, index) => (
        <AboutMemberCard member={member} key={index} />
      ))}

      <p className={styles.Info}>
        This project has a total of {totalIssues} total issues,{' '}
        {totalCommits} total commits, and {totalUnitTests} total unit
        tests.
      </p>

      <h3 className={styles.Section}>Our Codebase</h3>
      <div
        className={styles.Centering}
        style={{ minHeight: '360px' }}
      >
        <div className={styles.BigLogoContainer}>
          <img
            className={styles.BigLogo}
            src={GitLabLogoImg}
            alt="GitLab Logo"
          />
          <Nav.Link
            className={styles.About}
            href="https://gitlab.com/RG8452/campus-catalog/"
          >
            Our GitLab repository
          </Nav.Link>
        </div>
        <div className={styles.BigLogoContainer}>
          <img
            className={styles.BigLogo}
            src={PostmanLogoImg}
            alt="Postman Logo"
          />
          <Nav.Link
            className={styles.About}
            href="https://documenter.getpostman.com/view/17627995/UUy3A7Rd"
          >
            Our Postman docs
          </Nav.Link>
        </div>
      </div>

      <h3 className={styles.Section}>Our Tools</h3>
      <ToolGrid />

      <h3 className={styles.Section} style={{ marginTop: '96px' }}>
        Our APIs
      </h3>
      <APIGrid />
    </div>
  );
};

export default AboutPage;
