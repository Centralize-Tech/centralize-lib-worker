export default {
  queue:{
    queueName: process.env.QUEUE_NAME || 'DEFAULT_QUEUE',
    queueNameError: process.env.QUEUE_NAME_ERROR,
    autoSendToQueueError: process.env.AUTO_SEND_TO_QUEUE_ERROR || 'false',
    autoAckParam: process.env.AUTO_ACK === 'true',
    prefetchParam: process.env.PRE_FETCH || 1,
  },
  messages:{
    emptyMessage:'Mensaje vacio',
    invalidMessage:'Mensaje no valido',
    badMessage:'Mensaje mal formado',
  },
  debug: process.env.DEBUG || true
};
