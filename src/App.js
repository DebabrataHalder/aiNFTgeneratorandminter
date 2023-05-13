import { useState, useEffect } from 'react';
import { NFTStorage, File } from 'nft.storage'
import { Buffer } from 'buffer';
import { ethers } from 'ethers';
import axios from 'axios';
import dog from "./dog.png"

// Components

import Navigation from './components/Navigation';

// ABIs
import NFT from './abis/NFT.json'

// Config
import config from './config.json';

function App() {
  const [provider, setProvider] = useState(null)
  const [account, setAccount] = useState(null)
  const [nft,setNFT]=useState(null)

  const  [name,setName]=useState("");
  const  [description,setDescription]=useState("");
  const  [image,setImage]=useState(dog);
  const  [url,setURL]=useState(null);
  
  const  [isWaiting,setIsWaiting]=useState(false);
  const  [message,setMessage]=useState("");

  



  const loadBlockchainData = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    setProvider(provider)

    const network=await provider.getNetwork()
    const nft=new ethers.Contract(config[network.chainId].nft.address,NFT,provider)
    setNFT(nft)

    // const balance = await provider.getBalance(config[network.chainId].nft.address);
    // console.log(balance);
    // const name=await nft.name()
    // console.log("name",name)
  }

  


  const submitHandler=async(e)=>{
    e.preventDefault()

    if (name===""||description===""){
      window.alert("Please provide a name and description")
      return
    }
    setIsWaiting(true)
    const imageData= await createImage()
    


    const url =await uploadImage(imageData)

    // console.log("url",url)
    await mintImage(url)
    setIsWaiting(false)
    
    console.log("success")
    
    
  }




  const createImage=async()=>{
    setMessage("Generating Image.....")

    const URL=`https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-2-1`
    console.log(`processing`)


    const response=await axios({
      url:URL,
      method:"POST",
      headers:{
        Authorization:`Bearer ${process.env.REACT_APP_HUGGING_FACE_API_KEY}` ,
        Accept:'application/json',
        'Content-Type':'application/json',
      },
      data:JSON.stringify({
        inputs:description,options:{wait_for_model:true},
      }),
      responseType:"arraybuffer",
    })
  

    const type=response.headers["content-type"];
    const data= response.data

    const base64data=Buffer.from(data).toString("base64")
    const img=`data:${type};base64,`+base64data;
    setImage(img)
    return data
  }
  const uploadImage = async (imageData) => {
    setMessage("Uploading Image...")

    // Create instance to NFT.Storage
    const nftstorage = new NFTStorage({ token: process.env.REACT_APP_NFT_STORAGE_API_KEY })

    // Send request to store image
    const { ipnft } = await nftstorage.store({
      image: new File([imageData], "image.jpeg", { type: "image/jpeg" }),
      name: name,
      description: description,
    })

    // Save the URL
    const url = `https://ipfs.io/ipfs/${ipnft}/metadata.json`
    setURL(url)

    return url
  }

  const mintImage =async(tokenURI)=>{
    setMessage("Processing.. Waiting for Mint...")
    const signer=await provider.getSigner()
    const transaction= await nft.connect(signer).mint(tokenURI,{value:ethers.utils.parseUnits('2', 'ether')})
    await transaction.wait()
  }




  useEffect(() => {
    loadBlockchainData()
  }, [])

  return (
//     <>
//         <Navigation account={account} setAccount={setAccount} />

// <div className="bg-gray- min-h-screen flex items-end text-lg h-screen rounded-3xl ">
// <form action="" className="p-10 md:w-2/3 lg:w-1/2  rounded border-black ">
//  <div className="shadow w-8/12 ">
//    <div className="flex items-center bg-purple-400 rounded-full border-purple-500 border-b  ">
//      <label for="name" className="w-20 text-right mr-8 p-4 text-slate-800">Name</label>
//      <input type="text" name="name" id="name" placeholder="     Put in a name" className="flex-1 p-4 pl-0 bg-transparent placeholder-white  outline-none text-white overflow-ellipsis overflow-hidden"/>
//    </div>
//    <div className="flex items-center bg-purple-400  rounded-full   border-purple-500 ">
//      <label for="twitter" className="w-20 text-right p-4 mr-8 text-slate-800">Description</label>
//      <input type="text" name="twitter" id="twitter" placeholder="     Describe the kind of portrait" className="flex-1 p-4 pl-0 bg-transparent placeholder-white outline-none text-white overflow-ellipsis overflow-hidden"/>
//    </div>
//  </div>
//  <button className="bg-rose-500 block w-8/12 rounded-2xl py-4 text-white font-bold shadow ">Submit</button>

// </form>
// </div>

//     </>







<div className='0 h-screen mt-9'>
      <Navigation account={account} setAccount={setAccount} />
        <div className='bg-zinc-400  rounded-xl flex  justify-start min-h-screen'>
          
            <form onSubmit={submitHandler} className='flex flex-col w-1/2 '>
              <div className="w-5/6 h-80 flex flex-col  rounded-3xl  ml-16 mt-14">
                  <input className='bg-black h-full rounded-t-2xl mb-10 text-gray-300 text-bold text-4xl p-8' type="text" placeholder="Give a name to your NFT..." onChange={(e) => { setName(e.target.value) }} />
                  <input className='bg-white h-full rounded-b-2xl text-bold text-4xl  p-8' type="text" placeholder="Give description..." onChange={(e) => setDescription(e.target.value)} />
              </div>
              <div className='flex justify-around'>
                  <input className="bg-red-700 h-20 text-neutral-50 rounded-2xl border-solid w-2/5  mt-8 text-bold text-4xl"  type="submit" value="Create & Mint " />
              </div>
   

              
             {!isWaiting && url&& (
                <button className=" ml-3.5 w-48  mt-56 text-2xl bg-zinc-600 text-white rounded-2xl
                p-3 ">
                   View&nbsp;<a href={url} target="_blank" rel="noreferrer">Metadata</a>
                </button>
            
            )}
              
              
            </form>

            <div className=" flex flex-col ml-0 justify-start w-1/2">
              {!isWaiting&&image?(
                  <img className=" border-4 m-10 mt-10 rounded-2xl w-4/6 h-4/6" src={image} alt="AI generated image" />
              ):isWaiting?(
                <div className="   border-4 m-10 mt-10 rounded-2xl w-4/6 h-4/6 flex align-middle">
                  {/* <Spinner animation="border"/> */}
                  <p className=" text-black m-56 text-3xl">{message}</p>
                </div>
              ):(
                <></>
              )}

              

            </div>  
             
            
      </div>
        
  </div>




















 



  );
}

export default App;
