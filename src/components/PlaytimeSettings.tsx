import { useState } from 'react'
import { FaClosedCaptioning } from 'react-icons/fa'
import { MdOutlineOpacity } from 'react-icons/md'


const PlaytimeSettings = () => {

  const [isSubtitle, setIsSubtitle] = useState(false)
  const [opacity, setOpacity] = useState<number>(1.0);
  
  const handleOpacity = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newOpacity = parseFloat(event.target.value);
    setOpacity(newOpacity);
    console.log("Volume slider value:", newOpacity);

    // if (videoRef.current) {
    //   videoRef.current.volume = newOpacity;
    // }
  };


  return (
    <div className="origin-bottom-right absolute bottom-full right-0 w-[220px] rounded-md shadow-lg bg-white text-gray-700 ring-1 ring-black ring-opacity-5 z-50">
        <div className="py-1  w-[100%]">
            <button
            className="flex justify-between place-items-center w-[100%] px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 text-left"
            onClick={()=>handleOpacity}
            >
            <div className='flex gap-2 place-items-center'><MdOutlineOpacity className='-my-1 text-2xl'/> Opacity </div>
            <input type="range" min={0} max={10} name="video-opacity" className='w-20' id="" />
            </button>

            <button
            className="flex justify-between place-items-center w-[100%] px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 text-left"
            onClick={()=>handleOpacity}
            >
            <div className='flex gap-2 place-items-center'> 
              <FaClosedCaptioning className={`w-[100%] ${isSubtitle?'text-red-500':''} text-2xl`} />
               Subtitles 
            </div>
            <label className="switch">
              <input type="checkbox" className='w-20' onChange={()=>setIsSubtitle(!isSubtitle)} name="subtitle" />
              <span className="slider round"></span>
            </label>
            </button>
         
       
        </div>
    </div>
  )
}

export default PlaytimeSettings