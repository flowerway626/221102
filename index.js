import 'dotenv/config'
import linebot from 'linebot'
import { scheduleJob } from 'node-schedule'
import fetchCourse from './commands/fetchCourse.js'
import raeteUpdate from './utils/raeteUpdate.js'
// import fetchAnime from './commands/fetchAnime.js'

const bot = linebot({
  channelId: process.env.CHANNEL_ID,
  channelSecret: process.env.CHANNEL_SECRET,
  channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN
})

let USDTWD = 30
const updateRate = async () => {
  USDTWD = await raeteUpdate()
}
scheduleJob('0 0 * * *', (updateRate))
updateRate()

bot.on('message', event => {
  if (event.message.type !== 'text') return

  if (event.message.text === '共通課程') {
    fetchCourse(event)
  } else if (event.message.text.startsWith('查匯率')) {
    event.reply(USDTWD.toString())
  }
  // else if (event.message.text.startWith('查動畫')) {
  // fetchAnime(event)
  // }
})

bot.listen('/', process.env.PORT || 3000, () => {
  console.log('機器人啟動')
})
