import React from 'react';
import styles from './AboutMemberCard.module.css';

import type { Member } from './AboutPage';

const BACKGROUND_ALPHA = '60';

type CardProps = {
  member: Member;
};

const AboutMemberCard: React.FunctionComponent<CardProps> = ({
  member,
}: CardProps) => {
  const colors = {
    color: member.color ?? '#000000',
    bgc: member.color ? member.color + BACKGROUND_ALPHA : '#fff',
  };

  return (
    <div className={styles.Centering}>
      <div
        className={styles.MemberContainer}
        style={{
          borderColor: colors.color,
          backgroundColor: colors.bgc,
        }}
      >
        <div
          className={styles.Image}
          style={{ backgroundColor: colors.color }}
        >
          {member.img && <img alt={member.name} src={member.img} />}
        </div>

        <div className={styles.StatsContainer}>
          <h2 className={styles.MemberName + ' ' + styles.NoPad}>
            {member.name}
          </h2>
          <h5 className={styles.MemberUsername + ' ' + styles.NoPad}>
            @{member.username}
          </h5>

          <h3>
            <strong>Role: {member.role}</strong>
          </h3>

          {member.bio && <p className={styles.Bio}>{member.bio}</p>}

          <div className={styles.SmallStats}>
            <p className={styles.NoPad}>
              Contributions to the Repository:
            </p>
            <ul>
              <li>
                <strong>Issues Closed:</strong> {member.issues}
              </li>
              <li>
                <strong>Commits made:</strong> {member.commits}
              </li>
              <li>
                <strong>Unit Tests Written:</strong>{' '}
                {member.unitTests}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutMemberCard;
