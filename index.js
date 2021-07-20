const moment = require('moment');

const pacientes = [
    { id: 1, nome: "Maria", dataNasc: '1984-01-11' },
    { id: 2, nome: "João", dataNasc: '1983-09-16' },
    { id: 3, nome: "José", dataNasc: '1959-07-15' },
]

function buscarPaciente(id) {
    return pacientes.find(paciente => paciente.id == id);
}

function calcularIdade(paciente) {
    const hoje = moment();
    const dataNasc = moment(paciente.dataNasc, 'YYYY-MM-DD');
    
    return hoje.diff(dataNasc, 'years');
}

exports.handler = async event => {
    console.log('DEPLOY CLI');
    console.log('Paciente informado: ' + event.pacienteId);

    let pacienteEncontrado;

    if (event.pacienteId) {
        pacienteEncontrado = buscarPaciente(event.pacienteId);
        pacienteEncontrado.idade = calcularIdade(pacienteEncontrado);

        return {
            statusCode: 200,
            body: JSON.stringify(pacienteEncontrado),
        }
    }

    const todosPacientes = pacientes.map(paciente => ({ ...paciente, idade: calcularIdade(paciente) }));

    return {
        statusCode: 200,
        body: JSON.stringify(todosPacientes)
    }
}