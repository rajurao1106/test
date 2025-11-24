import { client } from "./client.js";


async function init(){
    await client.set("id:2", "rao")
    const result = await client.get("id:2")
    console.log("Result => ", result)
}

init()