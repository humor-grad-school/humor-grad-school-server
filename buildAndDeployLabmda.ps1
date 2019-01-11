node buildLambdaOnDocker;
npx @("sls", "deploy", "--package", "$PSScriptRoot\lambdaDist\package", "--aws-profile", "hgs");