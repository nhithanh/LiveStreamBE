import axios from 'axios'

import {wowzaAccessKey, wowzaApiDest, wowzaApiKey} from '../../configs'

export class TranscoderRepository {
  static async startTranscoder({transcoderId}) {
    const {data} = await axios.put(`${wowzaApiDest}/${transcoderId}/start`, null, {
      headers: {
        'wsc-api-key': wowzaApiKey,
        'wsc-access-key': wowzaAccessKey
      }
    })
    return data
  }

  static async stopTranscoder({transcoderId}) {
    const {data} = await axios.put(`${wowzaApiDest}/${transcoderId}/stop`, null, {
      headers: {
        'wsc-api-key': wowzaApiKey,
        'wsc-access-key': wowzaAccessKey
      }
    });
    console.log(data);
  }

  static async fetchTranscoderState({transcoderId}) {
    const {
      data: {
        live_stream: state
      }
    } = await axios.get(`${wowzaApiDest}/${transcoderId}/state`, {
      headers: {
        'wsc-api-key': wowzaApiKey,
        'wsc-access-key': wowzaAccessKey
      }
    })
    return {state}
  }
}