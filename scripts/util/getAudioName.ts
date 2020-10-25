export default function getAudioName(name: string) {
  return encodeURIComponent(name.toLowerCase().replace(/ /g, '-'))
}
