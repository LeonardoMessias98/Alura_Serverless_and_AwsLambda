"use strict";
const AWS = require("aws-sdk");
const { v4: uuidv4 } = require("uuid");

const dynamoDb = new AWS.DynamoDB.DocumentClient();
const params = {
  TableName: "PACIENTES",
};

module.exports.listarPacientes = async (event) => {
  try {
    let data = await dynamoDb.scan(params).promise();

    return {
      statusCode: 200,
      body: JSON.stringify(data?.Items),
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
  try {
    const { pacienteId } = event.pathParameters;

    const data = await dynamoDb
      .get({
        ...params,
        Key: { paciente_id: pacienteId },
      })
      .promise();

    if (!data.Item) {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: "Paciente not found" }),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        paciente: data.Item,
      }),
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

module.exports.cadastrarPaciente = async (event) => {
  try {
    const time = new Date().getTime();

    let dados = JSON.parse(event.body);

    const { nome, email, phone, dataNasc } = dados;

    const paciente = {
      nome,
      email,
      phone,
      dataNasc,
      paciente_id: uuidv4(),
      status: true,
      created_at: time,
      updated_at: time,
    };

    await dynamoDb
      .put({
        TableName: "PACIENTES",
        Item: paciente,
      })
      .promise();

    return {
      statusCode: 201,
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

module.exports.atualizarPaciente = async (event) => {
  const { pacienteId } = event.pathParameters;

  try {
    const time = new Date().getTime();

    const dados = JSON.parse(event.body);

    const { nome, data_nasc, email, phone } = dados;

    await dynamoDb
      .update({
        ...params,
        Key: {
          paciente_id: pacienteId,
        },
        UpdateExpression:
          "SET nome = :nome, data_nasc = :dt, email = :email, phone = :phone, updated_at = :updated_at",
        ConditionExpression: "attribute_exists(paciente_id)",
        ExpressionAttributeValues: {
          ":nome": nome,
          ":dt": data_nasc,
          ":email": email,
          ":phone": phone,
          ":updated_at": time,
        },
      })
      .promise();

    return {
      statusCode: 204,
    };
  } catch (error) {
    console.log(error, "error");

    if (error?.name === "ConditionalCheckFailedException") {
      return {
        statusCode: "404",
        body: JSON.stringify({
          error: "Paciente not found",
        }),
      };
    }

    return {
      statusCode: error.statusCode || 500,
      body: JSON.stringify({
        error: error.name || "Exception",
        message: error.message || "Unknow error",
      }),
    };
  }
};

module.exports.excluirPaciente = async (event) => {
  const { pacienteId } = event.pathParameters;

  try {
    await dynamoDb
      .delete({
        ...params,
        Key: {
          paciente_id: pacienteId,
        },
        ConditionExpression: "attribute_exists(paciente_id)",
      })
      .promise();

    return {
      statusCode: 204,
    };
  } catch (error) {
    console.log(error, "error");

    if (error?.name === "ConditionalCheckFailedException") {
      return {
        statusCode: "404",
        body: JSON.stringify({
          error: "Paciente not found",
        }),
      };
    }

    return {
      statusCode: error.statusCode || 500,
      body: JSON.stringify({
        error: error.name || "Exception",
        message: error.message || "Unknow error",
      }),
    };
  }
};
