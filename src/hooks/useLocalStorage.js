import React, { useState, useEffect } from 'react'

const PREFIX = 'live-chat-'

export default function useLocalStorage(key) {

//    const [value, setValue] = useState()

    // const [value, setValue] = useState(() => {
    //     const jsonValue = localStorage.getItem(PREFIX + key)
    //     if (jsonValue != null) return JSON.parse(jsonValue)
    // })

    // useEffect(() => {
    //     localStorage.setItem(PREFIX + key, JSON.stringify(value))
    // }, [value])

    const loadValue = (recipient) => {
        const jsonValue = localStorage.getItem(PREFIX + key + "-" + recipient)
        if (jsonValue != null)
            return JSON.parse(jsonValue)
        else return false
    }

    const saveValue = (recipient, valueToSave) => {
        localStorage.setItem(PREFIX + key + "-" + recipient, JSON.stringify(valueToSave))

    }


    return [loadValue, saveValue]
}

