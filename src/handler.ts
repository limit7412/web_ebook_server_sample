import { APIGatewayProxyHandler, CloudFrontRequestHandler } from 'aws-lambda';
import 'source-map-support/register';

const accessKey = 'demo-key'
const sampleContent = 'sample_content'

export const CreateURL: APIGatewayProxyHandler = async (event, _context) => {
  const env = process.env
  const url = `${env['BASE_URL']}/viewer/bibi/index.html?book=${sampleContent}:${accessKey}`

  return {
    statusCode: 200,
    body: JSON.stringify({
      url: url,
    }, null, 2),
  }
}

export const GetContent: CloudFrontRequestHandler = async (event, _context) => {
  let request = event.Records[0].cf.request

  const book = request.uri.split('/')[3]
  const requestKey = book.split(':')[1]

  console.log(`book: ${book}`)
  console.log(`requestKey: ${requestKey}`)

  // NOTE: bibiでは利用できないがいくつかのビューアーではrefererを利用できる
  // (Referer: https://xxxxx.net/viewer/bibi/index.html?book=${sampleContent}&key=${accessKey})
  // const headers = request.headers
  // let requestKey: string | string[]
  // if (!!headers['referer']) {
  //   const referer = headers.referer[0].value
  //   const queryParameters = querystring.parse(referer)
  //   requestKey = queryParameters['key']
  // }

  if (requestKey != accessKey) {
    return {
      status: '403',
      statusDescription: `Forbidden`,
      body: '403 Forbidden'
    }
  }

  const replaceURI = request.uri
    .replace('viewer/bibi-bookshelf/', 'content/')
    .replace(`:${requestKey}`, '')

  request.uri = replaceURI
  return request
}