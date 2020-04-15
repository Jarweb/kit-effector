import React, {useEffect} from 'react';
import { useStore } from 'effector-react'
import {counter, incre, decre, reset} from './models/counter';
import { userinfo, fetchData } from './models/user';
import './page.css';

function App() {
  const value = useStore(counter)
  const user = useStore(userinfo)
  console.log(user, value)

  useEffect(() => {
    fetchData()
  }, [])

  return (
    <div className="App">
      <div>
        <div>counter: {value}</div>  
        <button onClick={() => incre(2)}>incre</button>
        <button onClick={() => decre(1)}>decre</button>
        <button onClick={() => reset()}>reset</button>
      </div>      

      <div>
        <div>userinfo</div>
        <button onClick={() => fetchData()}>fetch</button>
        <div>
          {user.loading ? 'loading' : null}
          {user.error ? 'error' : null}

          {user.lists.map((item: any, index: number) => (
            <div key={index}>{item.name}</div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
