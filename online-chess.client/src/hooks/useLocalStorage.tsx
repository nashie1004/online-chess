import React, { useState } from 'react'

export default function useLocalStorage(key: string, initialValue: any) {
  const [data, setData] = useState<string>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      return initialValue;
    }
  });  
  
  const setValue = (data: any) => {
    try{
      const item = JSON.stringify(data);
      
      setData(data);
      localStorage.setItem(key, item);
    } catch (err){

    }
  }

  return { setValue, data }
}
