var environments = {};

environments.staging = {
    'httpPort': 3000,
    'envName': 'Staging'
}

environments.production = {
    'httpPort': 5000,
    'envName': 'Production'
}

var currentEnvironment = typeof(process.env.NODE_ENV) == 'string' ? process.env.NODE_ENV.toLowerCase() : '';
console.log("currentEnvironment==>>", currentEnvironment);
var environmentToExport = typeof(environments[currentEnvironment]) == 'object' ? environments[currentEnvironment] : environments.staging;

module.exports = environmentToExport;