'use strict';

const pacientes = [
  { id: 1, nome: "Maria", dataNasc: '1984-01-11' },
  { id: 2, nome: "João", dataNasc: '1983-09-16' },
  { id: 3, nome: "José", dataNasc: '1959-07-15' },
]

module.exports.listarPacientes = async (event) => {
  return {
    statusCode: 200,
    body: JSON.stringify(
      {
        pacientes
      },
      null,
      2
    ),
  };

};

module.exports.obterPaciente = async (event) => {
  const { pacienteId } = event.pathParameters;

  const paciente = pacientes.find((paciente) => paciente.id == pacienteId)

  return {
    statusCode: 200,
    body: JSON.stringify(
      {
        paciente
      },
      null,
      2
    ),
  };

};
