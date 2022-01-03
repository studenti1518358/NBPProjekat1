import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import Navbar from './components/Navbar'
import Topbar from './components/Topbar'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Pocetna from './stranice/Pocetna/Pocetna'
import PrijaviSe from './stranice/PrijaviSe/PrijaviSe'
import RegistrujSe from './stranice/PrijaviSe/RegistrujSe'
import FormularPrva from './stranice/Formular/FormPrva'
import FormularDruga from './stranice/Formular/FormDruga'
import FormularTreca from './stranice/Formular/FormTreca'
import UspesnoRegistrovanje from './stranice/PrijaviSe/UspesnoRegistrovanje'
import Profil from './stranice/Profil/Profil'
import Novosti from './stranice/Novosti/Novosti'
import Predlozi from './stranice/Predlozi/Predlozi'
import {Chat} from "./stranice/chat/Chat"
function App() {
  return (
   <div>
  
   <>
      <Router>
        <Navbar />
        <Topbar/>
        <Routes>
        <Route path='/' element={<Pocetna/>}/>
        <Route path='/prijaviSe' element={<PrijaviSe/>}/>
        <Route path='/registrujSe' element={<RegistrujSe/>}/>
        <Route path='/formPrva' element={<FormularPrva/>}/>
        <Route path='/formDruga' element={<FormularDruga/>}/>
        <Route path='/formTreca' element={<FormularTreca/>}/>
        <Route path='/UspesnoRegistrovanje' element={<UspesnoRegistrovanje/>}/>
        <Route path='/Profil' element={<Profil/>}/>
        <Route path='/PocetnaStrana' element={<Novosti/>}/>
        <Route path='/Predlozi' element={<Predlozi/>}/>
        <Route path='/Chat' element={<Chat/>}/>
        </Routes>
      
      </Router>
    </>
   </div> 
  )
}

export default App
