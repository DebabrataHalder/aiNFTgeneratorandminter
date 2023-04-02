import { ethers } from 'ethers';

const Navigation = ({ account, setAccount }) => {
    const connectHandler = async () => {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        const account = ethers.utils.getAddress(accounts[0])
        setAccount(account);
    }

    return (

        <nav className="px-2 py-3 bg-black  text-white  rounded-xl mb-3 mt-0 ">
            <div className=' flex flex-row justify-between '>
                <h2 className='font-semibold text-3xl ml-5'>Mint your own AI Generated NFT</h2>
                <div>
                {account ? (    
                   <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full  mr-9 w-48">
                       {account.slice(0, 6) + '...' + account.slice(38, 42)}
                   </button>) : 
                    (<button type="button" className="bg-blue-500   text-white font-bold py-2 px-4 rounded-full  mr-9 w-48  hover:bg-white hover:text-black" onClick={connectHandler} > {"Connect Wallet" }</button>
                )}
                </div>
            </div>
           
        </nav>




















        
    );
}

export default Navigation;