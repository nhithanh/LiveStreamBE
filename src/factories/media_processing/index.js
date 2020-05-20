import axios from 'axios'

import {wowzaAccessKey, wowzaApiKey, wowzaApiDest} from '../../configs'

export class MediaProcessingFactory {
  static async createMediaProcessing({username}) {
    const {data: {
        live_stream
      }} = await axios.post(wowzaApiDest, {
      live_stream: {
        name: username,
        aspect_ratio_height: 720,
        aspect_ratio_width: 1280,
        billing_mode: "pay_as_you_go",
        broadcast_location: "asia_pacific_singapore",
        encoder: "other_rtsp",
        transcoder_type: "transcoded",
        closed_caption_type: "none",
        delivery_method: "push",
        delivery_protocols: [
          "rtmp", "wowz"
        ],
        delivery_type: "single-bitrate",
        disable_authentication: true,
        hosted_page: false,
        low_latency: true,
        player_reponsive: true,
        target_delivery_protocol: "hls-https",
        recording: false
      }
    }, {
      headers: {
        'wsc-api-key': wowzaApiKey,
        'wsc-access-key': wowzaAccessKey
      }
    });
    return live_stream;
  }
}