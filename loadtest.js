import loadtest from 'loadtest';

const bearer = process.env.AUTH_BEARER_TOKEN;

if (!bearer) {
  console.error('Erro: Variável de ambiente AUTH_SECRET não definida.');
  process.exit(1);
}

const options = {
  url: 'http://localhost:3000/users',
  method: 'GET',
  maxRequests: 500,
  concurrency: 20,
  headers: {
    'Authorization': bearer
  },
  statusCallback: function (error, result) {
    if (error) {
      console.error('Erro:', error);
    } else {
      console.log(`✔️ - ${result.requestIndex + 1} - Status: ${result.statusCode}`);
    }
  }
};

loadtest.loadTest(options, function (error, result) {
  if (error) {
    return console.error('Erro no teste de carga:', error);
  }

  console.log('\n✅ Teste finalizado');
  console.log('Resumo:');
  console.log(`- Total de Requisições: ${result.totalRequests}`);
  console.log(`- Erros: ${result.totalErrors}`);
  console.log(`- Latência média: ${result.meanLatencyMs} ms`);
  console.log(`- Requisições por segundo: ${result.rps}`);
});
