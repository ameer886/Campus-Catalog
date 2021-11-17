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
  curPage: number; // Current page, one-indexed
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
    const startElt = (curPage - 1) * pageSize + 1;
    let curPages = `${startElt} - ${Math.min(
      totalElements,
      startElt + pageSize - 1,
    )}`;
    let lastPage =
      totalElements % pageSize === 0
        ? Math.ceil((totalElements - 1) / pageSize)
        : Math.ceil(totalElements / pageSize);

    if (totalElements === 0) {
      lastPage = 1;
      curPages = '0 - 0';
    }

    return (
      <div>
        <div>
          Showing items {curPages} of {totalElements}.
        </div>
        <div className={styles.ButtonContainer}>
          {/* First Page button */}
          <Button
            aria-label="first"
            className={styles.PageButton + ' btn btn-outline-info'}
            disabled={curPage === 1}
            onClick={() => setPage(1)}
            title="Jump to First Page"
          >
            <BsChevronDoubleLeft className={styles.IconAdjust} />
          </Button>

          {/* Previous Page button */}
          <Button
            aria-label="prev"
            className={styles.PageButton + ' btn btn-outline-info'}
            disabled={curPage === 1}
            onClick={() => setPage(curPage - 1)}
            title="Previous Page"
          >
            <BsChevronLeft className={styles.IconAdjust} />
          </Button>

          {/* Next Page button */}
          <Button
            aria-label="next"
            className={styles.PageButton + ' btn btn-outline-info'}
            disabled={curPage === lastPage}
            onClick={() => setPage(curPage + 1)}
            title="Next Page"
          >
            <BsChevronRight className={styles.IconAdjust} />
          </Button>

          {/* Last Page button */}
          <Button
            aria-label="last"
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
