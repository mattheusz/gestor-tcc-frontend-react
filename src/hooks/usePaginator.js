import { useRef, useState } from "react";

function usePaginatorNumbers() {

    let paginatorNumbers = useRef([])
    const [popPaginator, setPopPaginator] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState();

    function populatePaginator(currentPage, totalPages) {
        setPopPaginator(true);
        paginatorNumbers.current = [];
        setCurrentPage(currentPage);
        setTotalPages(totalPages);
    }

    console.log('total pages', totalPages);

    function getReadyPaginator() {
        return paginatorNumbers.current;
    }

    if (totalPages > 5) {
        // alterar aqui
        paginatorNumbers.current = [
            currentPage - 2,
            currentPage - 1,
            currentPage,
            currentPage + 1,
            currentPage + 2
        ]

    } if (totalPages === 5) {
        paginatorNumbers.current = [1, 2, 3, 4, 5]
    }
    if (totalPages < 5) {
        for (let i = 0; i < totalPages; i++) {
            paginatorNumbers.current[i] = i + 1;
        }
    }

    console.log('paginator atual', paginatorNumbers.current);

    return { getReadyPaginator, populatePaginator }
}

export default usePaginatorNumbers;