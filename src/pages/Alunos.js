import React from 'react';
import { Table, Input, Menu, Icon, Form, Button, Select } from 'semantic-ui-react';
import DashboardUI from '../components/DashboardUI';

const genderOptions = [
    { key: 'm', text: 'Male', value: 'male' },
    { key: 'f', text: 'Female', value: 'female' },
    { key: 'o', text: 'Other', value: 'other' },
]

function Alunos(props) {
    return (
        <DashboardUI screenName='Alunos'>
            <Form>
                <Form.Group>
                    <Form.Field width={8}>
                        <Input
                            icon={<Icon onClick={() => alert('Oi')} name='search' inverted circular link />}
                            placeholder='Pesquisar...'
                        />

                    </Form.Field>
                    <Form.Field
                        size='medium'
                        width={4}
                        control={Select}
                        options={genderOptions}
                        placeholder='Classificar'
                        search
                        searchInput={{ id: 'form-select-control-gender' }}
                    />

                    <Button size='medium' color='green'> Novo Aluno</Button>



                </Form.Group>
            </Form>
            <Table basic='very' singleLine selectable>
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell width={7}>Nome</Table.HeaderCell>
                        <Table.HeaderCell width={2}>Matrícula</Table.HeaderCell>
                        <Table.HeaderCell width={5}>E-mail</Table.HeaderCell>
                        <Table.HeaderCell width={1}></Table.HeaderCell>
                        <Table.HeaderCell collapsing></Table.HeaderCell>
                    </Table.Row>
                </Table.Header>

                <Table.Body>
                    <Table.Row>
                        <Table.Cell>John Lilki</Table.Cell>
                        <Table.Cell>123456789123</Table.Cell>
                        <Table.Cell>jhlilk22@yahoo.com</Table.Cell>
                        <Table.Cell>
                            <Button icon='search plus' size='small' color='blue' />
                        </Table.Cell>
                        <Table.Cell>
                            <Button icon='remove' size='small' color='red' />
                        </Table.Cell>

                    </Table.Row>
                    <Table.Row>
                        <Table.Cell>Jamie Harington Morris</Table.Cell>
                        <Table.Cell>123456789123</Table.Cell>
                        <Table.Cell>jamieharingonton@yahoo.com</Table.Cell><Table.Cell>
                            <Button icon='search plus' size='small' color='blue' />
                        </Table.Cell>
                        <Table.Cell>
                            <Button icon='remove' size='small' color='red' />
                        </Table.Cell>
                    </Table.Row>
                    <Table.Row>
                        <Table.Cell>Jill Lewis</Table.Cell>
                        <Table.Cell>123456789123</Table.Cell>
                        <Table.Cell>jilsewris22@yahoo.com</Table.Cell><Table.Cell>
                            <Button icon='search plus' size='small' color='blue' />
                        </Table.Cell>
                        <Table.Cell>
                            <Button icon='remove' size='small' color='red' />
                        </Table.Cell>
                    </Table.Row>
                    <Table.Row>
                        <Table.Cell>John Lilki</Table.Cell>
                        <Table.Cell>123456789123</Table.Cell>
                        <Table.Cell>jhlilk22@yahoo.com</Table.Cell><Table.Cell>
                            <Button icon='search plus' size='small' color='blue' />
                        </Table.Cell>
                        <Table.Cell>
                            <Button icon='remove' size='small' color='red' />
                        </Table.Cell>
                    </Table.Row>
                    <Table.Row>
                        <Table.Cell>John Lilki</Table.Cell>
                        <Table.Cell>123456789123</Table.Cell>
                        <Table.Cell>jhlilk22@yahoo.com</Table.Cell><Table.Cell>
                            <Button icon='search plus' size='small' color='blue' />
                        </Table.Cell>
                        <Table.Cell>
                            <Button icon='remove' size='small' color='red' />
                        </Table.Cell>
                    </Table.Row>

                </Table.Body>
                <Table.Footer>
                    <Table.Row>
                        <Table.HeaderCell colSpan='5'>
                            <Menu floated='right' pagination>
                                <Menu.Item as='a' icon>
                                    <Icon name='chevron left' />
                                </Menu.Item>
                                <Menu.Item as='a'>1</Menu.Item>
                                <Menu.Item as='a'>2</Menu.Item>
                                <Menu.Item as='a'>3</Menu.Item>
                                <Menu.Item as='a'>4</Menu.Item>
                                <Menu.Item as='a' icon>
                                    <Icon name='chevron right' />
                                </Menu.Item>
                            </Menu>
                        </Table.HeaderCell>
                    </Table.Row>
                </Table.Footer>
            </Table>
        </DashboardUI>
    );
}

export default Alunos;