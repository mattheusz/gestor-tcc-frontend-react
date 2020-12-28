export function detectUserType(userType, isCoordinator, available) {
    if (userType === 'professor' && (isCoordinator === false || isCoordinator === undefined))
        return 'professor'
    else if (userType === 'professor' && isCoordinator === true)
        return 'coordenador'
    else if (userType === 'aluno' && available === 'sim')
        return 'aluno-pre'
    else if (userType === 'aluno' && available === 'não')
        return 'aluno-orientando'
    else if (userType === 'administrativo')
        return 'administrativo'
    else
        return '';

}