export function detectUserType(userType, isCoordinator, available) {
    if (userType === 'professor' && (isCoordinator === false || isCoordinator === undefined))
        return 'professor'
    else if (userType === 'professor' && isCoordinator === true)
        return 'coordenador'
    else if (userType === 'aluno' && available === true)
        return 'aluno-pre-projeto'
    else if (userType === 'aluno' && available === false)
        return 'aluno-orientando'
    else if (userType === 'administrativo')
        return 'administrativo'
    else
        return '';

}