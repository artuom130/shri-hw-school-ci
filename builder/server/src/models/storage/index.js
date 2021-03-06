const axios = require('axios');
const https = require('https');
const config = require('../../config');

const axiosAPI = axios.create({
  baseURL: config.apiBaseUrl,
  httpsAgent: new https.Agent({
    rejectUnauthorized: false,
  }),
  headers: { Authorization: `Bearer ${config.apiToken}` },
});

class Storage {
  constructor(axiosInstance) {
    this.axiosInstance = axiosInstance;
  }

  async getSettings() {
    const response = await this.axiosInstance.get('/conf');
    return response.data.data;
  }

  async getBuildsList(offset, limit) {
    const response = await this.axiosInstance.get(`/build/list?offset=${offset}&limit=${limit}`);
    return response.data.data;
  }

  async getBuildDetails(buildId) {
    const response = await this.axiosInstance.get(`/build/details?buildId=${buildId}`);
    return response.data.data;
  }

  /**
   * @param {object} buildStartDTO Information about started build process
   * @param {string} buildStartDTO.buildId
   * @param {string} buildStartDTO.dateTime dateTime in ISO format 2020-03-14T07:56:21.843Z
   */
  async buildStart(buildStartDTO) {
    const response = await this.axiosInstance.post('/build/start', buildStartDTO);
    return response.data.data;
  }

  /**
   * @param {object} buildFinishDTO Information about finished build process
   * @param {string} buildFinishDTO.buildId
   * @param {number} buildFinishDTO.duration duration in sec
   * @param {boolean} buildFinishDTO.success
   * @param {string} buildFinishDTO.buildLog
   */
  async buildFinish(buildFinishDTO) {
    const response = await this.axiosInstance.post('/build/finish', buildFinishDTO);
    return response.data.data;
  }
}

const storageInstance = new Storage(axiosAPI);

module.exports = storageInstance;
