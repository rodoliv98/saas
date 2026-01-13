import { useEffect, useState } from 'react'
import { useRefreshHook } from '../utils/refresh-hook';

function TelaInicialDashboard () {
  const [data, setData] = useState({});
  const { refreshHook } = useRefreshHook();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await refreshHook('get', '/tenant-data');
        const profile = Object.entries(res.data).map(([key, value]) => {
          return `${key}: ${value}`;
        })
        
        setData(profile);
        
      } catch (err) {
        console.log(err);
      }
    }

    fetchData();
  }, []);
  
  return (
    <>
      <h1>hellow-test</h1>
      {/* <p>{data}</p> */}
    </>
  )
}

export default TelaInicialDashboard