//////////////////////////////////////////
// storeDirectory.mjs
// Stores a directory of files in IPFS using nft.storage API
// usage: $ node storeDirectory.mjs <directory-path>


import { NFTStorage } from 'nft.storage'
import { filesFromPath } from 'files-from-path'
import path from 'path'

const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweEU1ODI2QTZiMzZmYzg0ODU3RkFEM2FjM2VhNGU5RDc5RUNiRDQ4RmEiLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTY1ODc5NTAyOTc1MCwibmFtZSI6IndhdGVyZHJvcCJ9.IoiNblj3aWmg-kLRLZb5sbhydzITDUAoq8jj4olfdgY' // nft.storage token
// console.log(token)

async function main() {
  // you'll probably want more sophisticated argument parsing in a real app
  if (process.argv.length !== 3) {
    console.error(`usage: ${process.argv[0]} ${process.argv[1]} <directory-path>`)
  }
  const directoryPath = process.argv[2]
  const files = filesFromPath(directoryPath, {
    pathPrefix: path.resolve(directoryPath), // see the note about pathPrefix below
    hidden: true, // use the default of false if you want to ignore files that start with '.'
  })

  const storage = new NFTStorage({ token })

  console.log(`storing file(s) from ${path}`)
  const cid = await storage.storeDirectory(files)
  console.log({ cid })

  const status = await storage.status(cid)
  console.log(status)
}
main()