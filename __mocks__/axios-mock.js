jest.mock('axios')
const axios = require('axios')

axios.get = async (url, options) => {
  console.log(url)
  switch (url) {
    case 'https://a0.p.awsstatic.com/pricing/1.0/ec2/region/eu-west-1/ondemand/linux/index.json':
      return {
        status: 200,
        data: {
          prices: [{
            attributes: { 'aws:ec2:type': 'test', 'aws:region': 'test' }
          }]
        }
      }
    default:
      return Promise.reject(new Error('Error occured'))
  }
}

module.exports = axios
