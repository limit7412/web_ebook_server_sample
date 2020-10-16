import { APIGatewayProxyHandler, CloudFrontRequestHandler } from 'aws-lambda';
import 'source-map-support/register';

const accessKey = 'demo-key'

export const CreateURL: APIGatewayProxyHandler = async (event, _context) => {
  const url = 'https://hogehoge.hoge'

  return {
    statusCode: 200,
    body: JSON.stringify({
      url: url,
    }, null, 2),
  };
}

export const GetContent: CloudFrontRequestHandler = async (event, _context) => {
  const request = event.Records[0].cf.request;
  console.log(`request: ${JSON.stringify(request)}`)
  // request.uri =
  return request
}