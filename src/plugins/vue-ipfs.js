const IPFS = require('ipfs')

const plugin = {
  install(Vue, opts = {}) {

    Vue.prototype.$startIPFS = async function () {
      
      const ipfs = await IPFS.create({
        // We need to enable pubsub...
        EXPERIMENTAL: {
          pubsub: true
        },
        config: {
          Addresses: {
            Swarm: [
              '/dns4/wrtc-star1.par.dwebops.pub/tcp/443/wss/p2p-webrtc-star/',
              '/dns4/wrtc-star2.sjc.dwebops.pub/tcp/443/wss/p2p-webrtc-star/',
              '/dns4/webrtc-star.discovery.libp2p.io/tcp/443/wss/p2p-webrtc-star/'
            ]
          }
        }
      })

      window.ipfs = ipfs
      return ipfs
    }

  }
}

export default plugin
