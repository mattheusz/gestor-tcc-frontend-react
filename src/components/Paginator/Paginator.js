import React from 'react';
import { Icon, Menu, Table } from 'semantic-ui-react';
import light from '../../themes/light';

function Paginator({ totalPages, currentPage, paginationNumbers, choosePage }) {
    console.debug('Pagination Numbers: ', paginationNumbers);
    console.debug('Total pages: ', totalPages);
    return (
        <>
            {
                totalPages > 1 && <>
                    <Table.Footer>
                        <Table.Row>
                            <Table.HeaderCell colSpan='4'>
                                <Menu floated='right' pagination>
                                    {totalPages > 3 && currentPage !== 1 && <Menu.Item as='a' icon onClick={e => {
                                        if (currentPage === 1)
                                            return;
                                        choosePage(e, 1)
                                    }}>
                                        <Icon name='chevron left' />
                                        <Icon name='chevron left' />
                                    </Menu.Item>}
                                    {totalPages >= 2 && currentPage === 1 ?
                                        <></> :
                                        <Menu.Item as='a' icon onClick={e => {
                                            if (currentPage === 1)
                                                return;
                                            choosePage(e, currentPage - 1)
                                        }}>
                                            <Icon name='chevron left' />
                                        </Menu.Item>
                                    }
                                    {paginationNumbers.map((value, index) => {
                                        let activeStyle = {};
                                        if (currentPage === value)
                                            activeStyle = {
                                                backgroundColor: light.color.primary,
                                                color: 'white'
                                            }
                                        if (value === '...')
                                            return <Menu.Item key={index} as='a' style={activeStyle} >
                                                {value}
                                            </Menu.Item>

                                        return <Menu.Item key={index} as='a' style={activeStyle} onClick={e => choosePage(e, value)}>
                                            {value}
                                        </Menu.Item>
                                    }
                                    )}
                                    {totalPages === currentPage ?
                                        <></> :
                                        <Menu.Item as='a' icon onClick={e => {
                                            if (currentPage === totalPages)
                                                return;
                                            choosePage(e, currentPage + 1)
                                        }}>
                                            <Icon name='chevron right' />
                                        </Menu.Item>
                                    }
                                    {totalPages > 3 && currentPage !== totalPages &&
                                        <Menu.Item as='a' icon onClick={e => {
                                            if (currentPage === totalPages)
                                                return;
                                            choosePage(e, totalPages)
                                        }}>
                                            <Icon name='chevron right' />
                                            <Icon name='chevron right' />
                                        </Menu.Item>
                                    }

                                </Menu>
                            </Table.HeaderCell>
                        </Table.Row>
                    </Table.Footer>
                </>
            }
        </>);
}

export default Paginator;