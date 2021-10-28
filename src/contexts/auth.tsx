import { createContext, ReactNode, useEffect, useState } from "react";
import { API } from "../services/api";

type User = {
  id:string;
  name:string;
  login:string;
  avatar_url:string;
}

// contexto que aplica propriedades ao contexto criado "state" no redux
type AuthContextData = {
  user:User | null;
  signinURL:string;
  signOut: ()=> void;
}

type AuthResponse = {
  token:string;
  user:User
}

export const AuthContext = createContext({} as AuthContextData)

//tipagem para o component compreender a children
type AuthProviderProps = {
  children:ReactNode
}

export function AuthProvider({children}:AuthProviderProps){
  const [user, setUser ] = useState<User | null>(null)

  const signinURL = `https://github.com/login/oauth/authorize?scope=user&client_id=900b121c519761e5e15a&redirect_uri=http://localhost:3000`;

  // funcao para realizar login - seria reducer no redux
  const signin = async(gitCode:string)=>{
    //crio uma sessao na base de dados
    const {data} = await API.post<AuthResponse>("authenticate", {code:gitCode});

    localStorage.setItem('token', data.token)
    
    API.defaults.headers.common.authorization =`Bearer ${data.token}`
    setUser(data.user)
  }

  const signOut = ()=>{
    localStorage.removeItem('token')
    setUser(null)
  }

  //seria o action disparada no redux
  useEffect(()=>{
    const url = window.location.href;
    const hasGithubCode = url.includes("?code=")

    if(hasGithubCode) {
      const code = url.split("?code=")[1]
      window.history.pushState({}, '', window.location.origin)
      signin(code)
    }
  }, [])

  useEffect(()=>{
    const token = localStorage.getItem('token')

    if(token) {
      API.defaults.headers.common.authorization =`Bearer ${token}`
      API.get<User>("/profile").then(({data})=>{
        setUser(data)
      })
    }
  }, [])
  
  return (
    // value retorna os valores a serem acessados o que lembra os selectors
    <AuthContext.Provider value={{signinURL, user, signOut}}>
      {children}
    </AuthContext.Provider>
  )
}