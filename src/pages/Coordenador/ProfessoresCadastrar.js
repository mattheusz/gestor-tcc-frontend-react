import React, { useRef } from 'react';
import api from '../../api/api'

import { Icon, Menu, Table } from 'semantic-ui-react'
import 'semantic-ui-css/semantic.min.css';

import Button from '../../components/Button'
import { BiSearch } from 'react-icons/bi';

import BoxSearchButton, { SearchButton, SearchInput } from '../../components/BoxSearchButton/BoxSearchButton';
import Select from '../../components/Select'

import DashboardUI from '../../components/DashboardUI';
import { useEffect } from 'react';
import { useState } from 'react';
import SearchBar from '../../components/SearchBar';
import { LeftSearchBar, RightSearchBar } from '../../components/SearchBar/SearchBar';
import { AiOutlineUserAdd } from 'react-icons/ai';

function ProfessoresCadastrar(props) {
    const [searchText, setSearchText] = useState('');
    const [professores, setProfessores] = useState([]);
    const [selectedValue, setSelectedValue] = useState('ativo');
    const [noUserFound, setNoUserFound] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);

    const isInitialMount = useRef(true);

    useEffect(() => {

        api.get('usuarios/todos_usuarios/professor/1')
            .then(({ data }) => {
                console.log('Current page:', data.page)
                setCurrentPage(data.page)
                setNoUserFound(false);
                setProfessores(data.docs);

            })
            .catch(error => {
                if (error.response) {
                    const msg = error.response.data;
                    console.log(msg);
                    setNoUserFound(true)
                }
                if (error.request) {
                    console.log(error.request);
                }
                else {
                    console.log('Error', error.message);
                }
            });
    }, []);

    const onSubmit = e => {
        e.preventDefault();
        let path;
        if (searchText === '') {
            path = 'usuarios/todos_usuarios/professor/1'
        }
        else {
            path = `usuarios/listar_usuarios/${searchText}/1`;
        }

        api.get(path)
            .then(response => {
                console.log(response.data);
                setNoUserFound(false);
                setProfessores(response.data.docs);

            })
            .catch(error => {
                if (error.response) {
                    const msg = error.response.data;
                    console.log(msg);
                    setNoUserFound(true)
                }
                if (error.request) {
                    console.log(error.request);
                }
                else {
                    console.log('Error', error.message);
                }
            });
    }

    // filter useEffect
    useEffect(() => {
        console.debug(selectedValue)
        if (isInitialMount.current) {
            isInitialMount.current = false;
        } else {
            api.get(`usuarios/todos_usuarios/professor/${selectedValue}/1`)
                .then(response => {
                    console.log(response.data)
                    setNoUserFound(false)
                    setProfessores(response.data.docs)

                })
                .catch(error => {
                    if (error.response) {
                        const msg = error.response.data;
                        console.log(msg);
                        setNoUserFound(true)
                    }
                    if (error.request) {
                        console.log(error.request);
                    }
                    else {
                        console.log('Error', error.message);
                    }
                });
        }


    }, [selectedValue])

    const onChangeSelect = e => {
        setSelectedValue(e.target.value)


    }

    return (
        <DashboardUI screenName='Cadastrar Professor'>


        </DashboardUI>
    );
}

export default ProfessoresCadastrar;