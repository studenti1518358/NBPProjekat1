import React,{useState} from 'react'
import '../components/Topbar.css'
const Search =({pretrazi})=>{

    const [pretrazivac,setPretrazivac]=useState('')

    const onInputChange=(value)=>{
        setPretrazivac(value)
        pretrazi(value)

    }
    return(
        <input
        type="text"
        className='searchInput'
        placeholder='Pretrazi...'
        value={pretrazivac}
        onChange={(e)=>onInputChange(e.target.value)}
        />
    )
}
export default Search