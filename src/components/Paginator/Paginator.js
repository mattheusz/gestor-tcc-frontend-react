import React from 'react';

function Paginator(props) {
    return (
        {
            totalPages.current > 1 && <>
                <Table.Footer>
                    <Table.Row>
                        <Table.HeaderCell colSpan='4'>
                            <Menu floated='right' pagination>
                                {totalPages.current > 2 && currentPage != 1 && <Menu.Item as='a' icon onClick={e => {
                                    if (currentPage === 1)
                                        return;
                                    choosePage(e, 1)
                                }}>
                                    <Icon name='chevron left' />
                                    <Icon name='chevron left' />
                                </Menu.Item>}
                                {totalPages.current >= 2 && currentPage == 1 ?
                                    <></> :
                                    <Menu.Item as='a' icon onClick={e => {
                                        if (currentPage === 1)
                                            return;
                                        choosePage(e, currentPage - 1)
                                    }}>
                                        <Icon name='chevron left' />
                                    </Menu.Item>
                                }
                                {paginationNumbers.current.map((value, index) => {
                                    let activeStyle = {};
                                    if (currentPage === value)
                                        activeStyle = {
                                            backgroundColor: light.color.primary,
                                            color: 'white'
                                        }
                                    return <Menu.Item key={index} as='a' style={activeStyle} onClick={e => choosePage(e, value)}>
                                        {value}
                                    </Menu.Item>
                                }
                                )}
                                {totalPages.current == currentPage ?
                                    <></> :
                                    <Menu.Item as='a' icon onClick={e => {
                                        if (currentPage === totalPages.current)
                                            return;
                                        choosePage(e, currentPage + 1)
                                    }}>
                                        <Icon name='chevron right' />
                                    </Menu.Item>
                                }
                                {totalPages.current > 2 && currentPage != totalPages.current &&
                                    <Menu.Item as='a' icon onClick={e => {
                                        if (currentPage === totalPages.current)
                                            return;
                                        choosePage(e, totalPages.current)
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
    );
}

export default Paginator;