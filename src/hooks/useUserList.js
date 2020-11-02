import { useState } from 'react';
import api from '../api/api';

function useUserList(userType, page, setUsers, setUserNoFound) {

    api.get(`usuarios/todos_usuarios/${userType}/${page}`)
        .then(response => {
            console.log(response.data)
            setUsers(response.data.docs)

        })
        .catch(error => {
            if (error.response) {
                const msg = error.response.data;
                console.log(msg);
            }
            if (error.request) {
                console.log(error.request);
            }
            else {
                console.log('Error', error.message);
            }
        });

    return [value, bind];
}

export default useInput;