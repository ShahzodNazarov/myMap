import React, { useContext } from 'react'
import MyContex from './mycontex'
import {contex} from "./mycontex"
export function SuperContex () {
      return useContext(contex);
}
