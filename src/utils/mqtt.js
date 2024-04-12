import mqtt from "mqtt"
import store from "@/store"
class MqttHandle {
  constructor(topic, qos = 0) {
    this.connection = {
      // for more options, please refer to https://github.com/mqttjs/MQTT.js#mqttclientstreambuilder-options
      clean: true,
      connectTimeout: 30 * 1000, // ms
      reconnectPeriod: 4000, // ms
      clientId: 'client_guest',
    }
    this.subscription = {
      topic,
      qos,
    }
    this.client = {
      connected: false,
    }
    this.subscribeSuccess = false
    this.connecting = false
    this.retryTimes = 0
  }
  initData() {
    this.client = {
      connected: false,
    }
    this.retryTimes = 0
    this.connecting = false
    this.subscribeSuccess = false
  }
  handleOnReConnect() {
    this.retryTimes += 1
    if (this.retryTimes > 5) {
      try {
        this.client.end()
        this.initData()
        this.$message.error('Connection maxReconnectTimes limit, stop retry')
      } catch (error) {
        this.$message.error(error.toString())
      }
    }
  }
  handleOnMessage(topic, message) {
    console.info(`Received message ${message} from topic ${topic}`)
  }
  createConnection(handleOnMessageFunc = this.handleOnMessage) {
    const userInfo = store.getters.getUserInfo
    if (!userInfo || !userInfo.identity_token) {
      console.error('Missing userinfo')
      return
    }
    this.connection.clientId = 'client_' + userInfo.identity_token
    try {
      this.connecting = true
      const options = this.connection
      const connectUrl = process.env.VUE_APP_MQTT || `${location.protocol.replace('http','ws')}//${location.hostname}/mqtt`
      this.client = mqtt.connect(connectUrl, options)
      if (this.client.on) {
        this.client.on('connect', () => {
          this.connecting = false
          console.info('Connection succeeded!')
        })
        this.client.on('reconnect', this.handleOnReConnect)
        this.client.on('error', (error) => {
          console.error('Connection failed', error)
        })
        this.client.on('message', handleOnMessageFunc)
      }
    } catch (error) {
      this.connecting = false
      console.error('mqtt.connect error', error)
    }
  }
  // subscribe topic
  // https://github.com/mqttjs/MQTT.js#mqttclientsubscribetopictopic-arraytopic-object-options-callback
  doSubscribe() {
    const { topic, qos } = this.subscription
    this.client.subscribe(topic, { qos }, (error, res) => {
      if (error) {
        console.error('Subscribe to topics error', error)
        return
      }
      this.subscribeSuccess = true
      console.info('Subscribe to topics res', res)
    })
  }
  // unsubscribe topic
  // https://github.com/mqttjs/MQTT.js#mqttclientunsubscribetopictopic-array-options-callback
  doUnSubscribe() {
    const { topic } = this.subscription
    this.client.unsubscribe(topic, (error) => {
      if (error) {
        console.error('Unsubscribe error', error)
      }
    })
  }
  // disconnect
  // https://github.com/mqttjs/MQTT.js#mqttclientendforce-options-callback
  destroyConnection() {
    if (this.client.connected) {
      try {
        this.client.end(false, () => {
          this.initData()
          console.info('Successfully disconnected!')
        })
      } catch (error) {
        console.error('Disconnect failed', error.toString())
      }
    }
  }
}

export default MqttHandle
