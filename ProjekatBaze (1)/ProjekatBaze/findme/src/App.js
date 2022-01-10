import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import Navbar from './components/Navbar'
import Topbar from './components/Topbar'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Pocetna from './stranice/Pocetna/Pocetna'
import PrijaviSe from './stranice/PrijaviSe/PrijaviSe'

import UspesnoRegistrovanje from './stranice/PrijaviSe/UspesnoRegistrovanje'
import Profil from './stranice/Profil/Profil'
import Novosti from './stranice/Novosti/Novosti'
import Predlozi from './stranice/Predlozi/Predlozi'
import {Chat} from "./stranice/chat/Chat"
import Registracija from './stranice/PrijaviSe/Registracija'
import Store from './context/Store'
import Fotografije from './stranice/Fotografije/Fotografije'
import Informacije from './stranice/Informacije/Informacije'
import Pratioci from './stranice/Pratioci/Pratioci'
import Prati from './stranice/Prati/Prati'
function App() {
  return (
   <div>
  
   <>
   <Store>
      <Router>
        <Navbar />
        <Topbar/>
        <Routes>
        <Route path='/' element={<Pocetna/>}/>
        <Route path='/prijaviSe' element={<PrijaviSe/>}/>
        <Route path='/registracija/*' element={<Registracija/>}/>
        <Route path='/Fotografije' element={<Fotografije/>}/>
        <Route path='/Informacije' element={<Informacije/>}/>
        <Route path='/Pratioci' element={<Pratioci/>}/>
        <Route path='/Prati' element={<Prati/>}/>
        <Route path='/UspesnoRegistrovanje' element={<UspesnoRegistrovanje/>}/>
        <Route path='/Profil' element={<Profil/>}/>
        <Route path='/PocetnaStrana' element={<Novosti/>}/>
        <Route path='/Predlozi/*' element={<Predlozi/>}/>
        <Route path='/Chat' element={<Chat/>}/>
        </Routes>
      
      </Router>
      </Store>
    </>
   </div> 
  )
}

export default App
