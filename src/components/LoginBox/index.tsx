import { useContext } from 'react'
import {VscGithubInverted} from 'react-icons/vsc'
import { AuthContext } from '../../contexts/auth'

import styles from "./styles.module.scss"

export function LoginBox(){
 const {signinURL} = useContext(AuthContext)
  return (
    <div className={styles.loginBoxWrapper}>
      <strong>Entre e compartilhe sua mensagem</strong>
      <a href={signinURL} className={styles.signInWithGithub} > 
        <VscGithubInverted size={24} />Entrar com GitHub
      </a>
    </div>
  )
}