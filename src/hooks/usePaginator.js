import { useRef } from "react";

function usePaginatorNumbers(currentPage, totalPages) {

    let paginatorNumbers = useRef()

    paginatorNumbers.current = [];

    if (parseInt(totalPages) > 5) {
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
    setMountedPagination(true);
    let paginatorShowedNumbers = paginatorNumbers.current;

    return { paginatorShowedNumbers }
}

export default usePaginatorNumbers;