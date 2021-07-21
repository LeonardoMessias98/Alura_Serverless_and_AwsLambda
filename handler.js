"use strict";
const AWS = require("aws-sdk");

const dynamoDb = new AWS.DynamoDB.DocumentClient();
const params = {
  TableName: "PACIENTES",
};

module.exports.listarPacientes = async (event) => {
  try {
    let data = await dynamoDb.scan(params).promise();

    return {
      statusCode: 200,
      body: JSON.stringify(data),
    };
  } catch (error) {
    console.log(error, "error");

    return {
      statusCode: error.statusCode || 500,
      body: JSON.stringify({
        error: error.name || "Exception",
        message: error.message || "Unknow error",
      }),
    };
  }
};

module.exports.obterPaciente = async (event) => {
  const { pacienteId } = event.pathParameters;

  const paciente = pacientes.find((paciente) => paciente.id == pacienteId);

  if (paciente === undefined) {
    return {
      statusCode: 404,
      body: JSON.stringify({ error: "Paciente not found" }),
    };
  }

  return {
    statusCode: 200,
    body: JSON.stringify(
      {
        paciente,
      },
      null,
      2
    ),
  };
};
