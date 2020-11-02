import React from 'react';
import { AiOutlineUserAdd } from 'react-icons/ai';
import { BiSearch } from 'react-icons/bi';
import Button from '../../components/Button'
import Select from '../../components/Select'
import BoxSearchButton, { SearchButton, SearchInput } from '../BoxSearchButton/BoxSearchButton';
import { LeftSearchBar, RightSearchBar, StyledSearchBar } from './styled';

function SearchBar({ searchText, setSearchText, selectedValue, onChangeSelect, addUser }) {
    return (
        <StyledSearchBar >
            <LeftSearchBar>
                <BoxSearchButton>
                    <SearchInput value={searchText} onChange={(e) => setSearchText(e.target.value)} placeholder='Pesquisar...' />
                    <SearchButton>
                        <BiSearch style={{ color: 'white' }} />
                    </SearchButton>
                </BoxSearchButton>
                <Select value={selectedValue} onChange={e => onChangeSelect(e)}>
                    <option value="ativo">Ativos</option>
                    <option value="inativo">Inativos</option>
                    <option value="todos">Todos</option>
                </Select>
            </LeftSearchBar>
            <RightSearchBar>
                <Button type='button' onClick={() => addUser()} new={true} width='90px' >
                    Novo &nbsp;
                    <AiOutlineUserAdd />
                </Button>
            </RightSearchBar>
        </StyledSearchBar>
    );
}

export default SearchBar;



/*

<SearchBar>
                    <LeftSearchBar>
                        <BoxSearchButton>
                            <SearchInput value={searchText} onChange={(e) => setSearchText(e.target.value)} placeholder='Pesquisar...' />
                            <SearchButton>
                                <BiSearch style={{ color: 'white' }} />
                            </SearchButton>
                        </BoxSearchButton>
                        <Select value={selectedValue} onChange={e => onChangeSelect(e)}>
                            <option value="ativo">Ativos</option>
                            <option value="inativo">Inativos</option>
                            <option value="todos">Todos</option>
                        </Select>
                    </LeftSearchBar>
                    <RightSearchBar>
                        <Button type='button' onClick={() => addProfessor()} new={true} width='90px' >
                            Novo &nbsp;
                            <AiOutlineUserAdd />
                        </Button>
                    </RightSearchBar>
                </SearchBar>

*/