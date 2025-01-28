import { createContext, useContext } from 'react'
import { MakeRealFunc } from '../interfaces'

interface MakeRealFuncContextType {
    makeRealFunc: MakeRealFunc | undefined
}
export const MakeRealFuncContext = createContext<MakeRealFuncContextType>({
    makeRealFunc: () => {
        throw new Error('makeRealFunc not implemented!')
    },
})

export function useMakeRealFunc() {
    return useContext(MakeRealFuncContext)
}
