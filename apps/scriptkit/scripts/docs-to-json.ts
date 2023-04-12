import '@johnlindquist/kit'
import {getDiscussions, Category} from '../src/lib/get-discussions.js'

let run = async () => {
  console.log(`Starting discussion json generation:`)

  let jsonfile = await npm('jsonfile')
  let docs = await getDiscussions(Category.Guide)
  let outfile = path.resolve(`./public/data/docs.json`)
  await jsonfile.writeFile(outfile, docs)

  console.log(`Docs written to json: ${outfile} 👏`)
}

run()
