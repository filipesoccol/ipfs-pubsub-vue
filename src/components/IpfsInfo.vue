<template>
  <div class="ipfs-info">
    <img class="ipfs-logo" alt="IPFS logo" src="../assets/logo.svg" />
    <form v-on:submit.prevent="sendMessage">
      <div id="messages" class="messages">
        <p v-for="(m,idx) in messages" :key="idx">{{ m }}</p>
      </div>
      <input size="50" v-model="message" placeholder="Write something and press enter."/>
    </form>
    <h4>{{ status }}</h4>
    <h5>ID: {{ id }}</h5>
    <h5>Agent version: {{ agentVersion }}</h5>
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
      agentVersion: "",
      message: "",
      messages: [],
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
          this.messages.push(m.data.toString());
          var elem = document.getElementById('messages');
          elem.scrollTop = elem.scrollHeight;
        })

        window.room = room
        const {agentVersion, id} = await ipfs.id()
        this.id = id
        this.agentVersion = agentVersion
      } catch (err) {
        // Set error status text.
        this.status = `Error: ${err}`;
      }
    },
    sendMessage () {
      window.room.broadcast(this.message)
      this.message = ''
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.ipfs-logo {
  height: 10rem;
}
.messages {
  display: flex;
  flex-direction: column;
  flex-flow: column;
  align-items: center;
  overflow-y: scroll;
  max-height: 300px;
}
.messages p {
  max-width: 300px;
}

</style>