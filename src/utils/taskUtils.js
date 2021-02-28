import isAfter from 'date-fns/isAfter';
import parseISO from 'date-fns/parseISO'

export const verifyTaskSituation = (situation, deadline) => {
    let taskSituation;
    let TaskDeadline = parseISO(deadline);
    console.debug('SITUAÇÃO VINDA DO BANCO', situation)

    console.log('Situation, deadline and current date', situation, deadline, new Date())

    console.log('deadline maior que data atual', isAfter(TaskDeadline, new Date()))

    if (
        situation == 'concluída' ||
        situation == 'recusada' ||
        situation == 'entregue com atraso' ||
        situation == 'entregue') {
        taskSituation = situation;
        return taskSituation;
    }
    else if ((situation === 'iniciada' || situation === 'em revisão') &&
        isAfter(TaskDeadline, new Date())) {
        situation === 'iniciada' ? taskSituation = 'em execução' : taskSituation = 'em revisão';
        return taskSituation;
    }
    else {
        return taskSituation = 'em atraso'
    }
}