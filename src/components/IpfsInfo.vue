<template>
  <div class="ipfs-info">
    <img class="ipfs-logo" alt="IPFS logo" src="../assets/logo.svg" />
    <h1>{{ status }}</h1>
    <h2>ID: {{ id }}</h2>
    <h2>Agent version: {{ agentVersion }}</h2>
  </div>
</template>

<script>
const Room = require('ipfs-pubsub-room')

export default {
  name: "IpfsInfo",
  data: function() {
    return {
      status: "Connecting to IPFS...",
      id: "",
      agentVersion: ""
    };
  },
  mounted: function() {
    this.startIPFS();
  },
  methods: {
    async startIPFS() {
      try {
        const ipfs = await this.$startIPFS();

        this.status = 'IPFS started!'

        const room = new Room(ipfs, 'fruits')

        room.on('peer joined', (peer) => {
          console.log('Peer joined the room', peer)
        })
        
        room.on('peer left', (peer) => {
          console.log('Peer left...', peer)
        })

        // now started to listen to room
        room.on('subscribed', () => {
          console.log('Now connected!')
        })

        // now started to listen to room
        room.on('message', (m) => {
          console.log(m)
          this.status = m.data
        })

        window.room = room
        const {AgentVersion, id} = await ipfs.id()
        this.id = id
      } catch (err) {
        // Set error status text.
        this.status = `Error: ${err}`;
      }
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.ipfs-logo {
  height: 10rem;
}
</style>