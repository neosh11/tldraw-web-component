import React from 'react'
import { useMakeReal } from '../hooks/useMakeReal'
import { MakeRealFunc } from '../interfaces'

export const maxDuration = 120

export function MakeRealButton({ makeRealFunc }: {
    makeRealFunc?: MakeRealFunc
}) {
    if (!makeRealFunc) {
        return null
    }

    const makeReal = useMakeReal({ makeRealFunc })
    return (
        <div style={{ display: 'flex' }}>
            <button
                onClick={makeReal}
                className="makereal_button"
                style={{ cursor: 'pointer', zIndex: 100000, pointerEvents: 'all' }}
            >
                Make Real

            </button>
        </div>
    )
}