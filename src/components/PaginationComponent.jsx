import React from 'react';
import { Pagination } from '@mui/material';

const PaginationComponent = ({ totalItems, itemsPerPage, currentPage, onPageChange }) => {
    const pageCount = Math.ceil(totalItems / itemsPerPage);

    return (
        <Pagination
            count={pageCount}
            page={currentPage}
            onChange={onPageChange}
            sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}
        />
    );
};

export default PaginationComponent;