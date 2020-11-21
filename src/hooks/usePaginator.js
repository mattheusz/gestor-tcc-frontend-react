import { useRef, useState } from "react";

function usePaginatorNumbers() {

    let paginatorNumbers = useRef([]);
    let totalPages = useRef();
    const [popPaginator, setPopPaginator] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);

    function populatePaginator(currentPage, totPages) {
        setPopPaginator(true);
        paginatorNumbers.current = [];
        setCurrentPage(currentPage);
        totalPages.current = totPages;
    }

    function getReadyPaginator() {
        return paginatorNumbers.current;
    }

    function getTotalPages() {
        return totalPages.current;
    }

    if (totalPages.current > 5) {
        // alterar aqui
        paginatorNumbers.current = [
            currentPage - 2,
            currentPage - 1,
            currentPage,
            currentPage + 1,
            currentPage + 2
        ]

    } if (totalPages.current === 5) {
        paginatorNumbers.current = [1, 2, 3, 4, 5]
    }
    if (totalPages.current < 5) {
        for (let i = 0; i < totalPages.current; i++) {
            paginatorNumbers.current[i] = i + 1;
        }
    }

    console.log('paginator atual', paginatorNumbers.current);

    return { getReadyPaginator, getTotalPages, populatePaginator }
}

export default usePaginatorNumbers;