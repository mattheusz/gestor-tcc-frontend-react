import { useRef, useState } from "react";

function usePaginatorNumbers() {

    let paginatorNumbers = useRef([]);
    let totalPages = useRef();
    let actualPage = useRef([]);
    const [popPaginator, setPopPaginator] = useState(false);

    function populatePaginator(currentPage, totPages) {
        setPopPaginator(!popPaginator);
        paginatorNumbers.current = [];
        actualPage.current = currentPage;
        totalPages.current = totPages;
    }

    //array with numbers to show in paginator
    function getReadyPaginator() {
        return paginatorNumbers.current;
    }

    function getTotalPages() {
        return totalPages.current;
    }

    if (totalPages.current > 5) {
        // alterar aqui
        let mod = 1;
        // mod: indica o valor subtraído do total de páginas que somado ao iterador exibirá o valor a ser exibido no paginador
        for (let i = 0; i < 5; i++) {
            if (actualPage.current > totalPages.current - 4) {
                if (actualPage.current == totalPages.current - 3) mod = 1;
                if (actualPage.current == totalPages.current - 2) mod = 2;
                if (actualPage.current == totalPages.current - 1) mod = 3;
                if (actualPage.current == totalPages.current) mod = 4;
                paginatorNumbers.current[i] = i + actualPage.current - mod;

            }
            else {
                paginatorNumbers.current[i] = i + actualPage.current;
            }
        }
        if (actualPage.current < totalPages.current - 4) {
            paginatorNumbers.current[4] = '...';
            paginatorNumbers.current[5] = totalPages.current;
        }
        console.log('paginator atual dentro do if', paginatorNumbers.current);
        console.log('current page dentro do if', actualPage.current);
    }
    if (totalPages.current <= 5) {
        for (let i = 0; i < totalPages.current; i++) {
            paginatorNumbers.current[i] = i + 1;
        }
    }
    console.log('current page', actualPage.current);
    console.log('paginator atual', paginatorNumbers.current);

    return { getReadyPaginator, getTotalPages, populatePaginator }
}

export default usePaginatorNumbers;