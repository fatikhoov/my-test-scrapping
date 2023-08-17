const axios = require('axios')
const cheerio = require('cheerio')

const API_KEY = 'AIzaSyDuUYvGyxlJ1Cl3FTg28hH2sAcD6sNdMOk'
const SEARCH_ENGINE_ID = 'a69898c440f074c6b'
const SEARCH_KEYWORD = 'Мебельная фабрика'
const num = 10
let scrapedData = []

async function searchContacts() {
  try {
    for (let start = 1; scrapedData.length < num; start += num) {
      const response = await axios.get(
        'https://www.googleapis.com/customsearch/v1',
        {
          params: {
            key: API_KEY,
            cx: SEARCH_ENGINE_ID,
            q: `${SEARCH_KEYWORD}`,
            num: num,
            start: start,
          },
        }
      )

      const items = response.data.items

      for (const item of items) {
        const title = item.title
        const link = item.link

        /* if (await scrapeContactInfo(link, title)) {
          successfulScrapes++
        }
        if (successfulScrapes >= num) {
          break
        } */

        const scrapeResult = await scrapeContactInfo(link, title)
        if (scrapeResult) {
          scrapedData.push(scrapeResult)
          console.log(scrapedData.length)
        }
        if (scrapedData.length >= num) {
          break
        }
      }
    }

    console.log(`Успешно найдено ${scrapedData.length} контактов!`)
    console.log(scrapedData)
  } catch (error) {
    console.error('Ошибка поиска:', error.message)
  }
}

async function scrapeContactInfo(link, title) {
  try {
    const response = await axios.get(link)
    const $ = cheerio.load(response.data)

    /* const company = $('h1').text() */
    const emailLink = $('a[href^="mailto:"]').attr('href')
    let brand, email

    if (emailLink) {
      email = emailLink.replace('mailto:', '')
      console.log(title, email, link)
      return {
        company: title,
        email: email,
        link: link,
      }
    } else {
      email = 'Почты на сайте нет'
      return null
    }
  } catch (error) {
    console.error('Нет результата:', error.message)
    return null
  }
}

searchContacts()
