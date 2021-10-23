import React from 'react';

import Button from 'react-bootstrap/Button';
import {
  BsChevronLeft,
  BsChevronRight,
  BsChevronDoubleLeft,
  BsChevronDoubleRight,
} from 'react-icons/bs';

import styles from './PaginationRelay.module.css';

type PaginationRelayProps = {
  curPage: number; // Current page, zero-indexed
  pageSize: number;
  totalElements: number;
  setPage: React.Dispatch<React.SetStateAction<number>>; // setPage function for table
};

/*
 * Helper component for pagination
 * Should display currently shown elements, total elements,
 * and have buttons to change page
 */
const PaginationRelay: React.FunctionComponent<PaginationRelayProps> =
  ({
    curPage,
    pageSize,
    totalElements,
    setPage,
  }: PaginationRelayProps) => {
    const startElt = curPage * pageSize + 1;
    const curPages = `${startElt} - ${Math.min(
      totalElements,
      startElt + pageSize,
    )}`;
    const lastPage = Math.floor((totalElements - 1) / pageSize);

    return (
      <div>
        <div>
          Showing items {curPages} of {totalElements}.
        </div>
        <div className={styles.ButtonContainer}>
          {/* First Page button */}
          <Button
            className={styles.PageButton + ' btn btn-outline-info'}
            disabled={curPage === 0}
            onClick={() => setPage(0)}
            title="Jump to First Page"
          >
            <BsChevronDoubleLeft className={styles.IconAdjust} />
          </Button>

          {/* Previous Page button */}
          <Button
            className={styles.PageButton + ' btn btn-outline-info'}
            disabled={curPage === 0}
            onClick={() => setPage(curPage - 1)}
            title="Previous Page"
          >
            <BsChevronLeft className={styles.IconAdjust} />
          </Button>

          {/* Next Page button */}
          <Button
            className={styles.PageButton + ' btn btn-outline-info'}
            disabled={curPage === lastPage}
            onClick={() => setPage(curPage + 1)}
            title="Next Page"
          >
            <BsChevronRight className={styles.IconAdjust} />
          </Button>

          {/* Last Page button */}
          <Button
            className={styles.PageButton + ' btn btn-outline-info'}
            disabled={curPage === lastPage}
            onClick={() => setPage(lastPage)}
            title="Jump to Last Page"
          >
            <BsChevronDoubleRight className={styles.IconAdjust} />
          </Button>
        </div>
      </div>
    );
  };

export default PaginationRelay;
