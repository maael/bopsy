const title = 'Bopsy | Recognise the tunes'
const description = 'Recognise the tunes you hear.'
const url = 'https://bopsy.mael.tech/'

module.exports = {
  title,
  description,
  canonical: url,
  openGraph: {
    title,
    description,
    url,
    site_name: title,
    type: 'website',
    locale: 'en_GB',
  },
  twitter: {
    handle: '@mattaelphick',
    site: '@mattaelphick',
    cardType: 'summary_large_image',
  },
}
