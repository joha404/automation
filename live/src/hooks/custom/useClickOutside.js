import { useEffect } from "react"

const useClickOutside = (ref, myfunction, isOpen) => 
{
  useEffect(() =>
  {
    const handleClickOutside = (event) =>
    {
      if(ref.current && !ref.current.contains(event.target))
      {
        myfunction();
      }
    }

    if(isOpen)
    {
      document.addEventListener('mousedown', handleClickOutside)
    }
    else
    {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () =>
      {
        document.removeEventListener('mousedown', handleClickOutside);
      }
  }, [ref, myfunction, isOpen])
}

export default useClickOutside;