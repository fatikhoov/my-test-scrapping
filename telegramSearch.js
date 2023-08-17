const axios = require('axios')
const cheerio = require('cheerio')

/* const url = 'https://tgstat.com/ru/crypto' */
const url = 'https://uk.tgstat.com/gambling'

async function getChannelInfo() {
  try {
    const response = await axios.get(url)
    const $ = cheerio.load(response.data)

    const channelInfo = []
    $('.card.card-body.peer-item-box').each((index, element) => {
      const link = $(element).find('a.text-body').attr('href')
      const name = $(element)
        .find('.font-16.text-dark.text-truncate')
        .text()
        .trim()
      const subscribers = $(element)
        .find('.font-12.text-truncate b')
        .text()
        .trim()
      channelInfo.push({ link, name, subscribers })
    })

    return channelInfo
  } catch (error) {
    console.error('Error:', error.message)
  }
}

;(async () => {
  const channelInfo = await getChannelInfo()

  for (let i = 0; i < channelInfo.length; i++) {
    const { link, name, subscribers } = channelInfo[i]
    /* const shortLink = link.replace('https://tgstat.com/ru/channel/', '') */
    const shortLink = link.replace('https://uk.tgstat.com/channel/', '')

    console.log(` ${shortLink}, ${name}`)
  }
})()
