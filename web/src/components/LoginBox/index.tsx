import { useContext } from 'react';
import { VscGithubInverted } from 'react-icons/vsc';
import { AuthContext } from '../../context/auth';

import styles from './styles.module.scss';

export function LoginBox() {
    //const [ signInUrl, setSignInUrl ] = useState('');

    const { signInUrl } = useContext(AuthContext);
    return (
        <div className={styles.loginBoxWrapper}>
            <strong>Entre e compartilhe sua messagem</strong>
            <a href={signInUrl} className={styles.signInWithGitHub}>
                <VscGithubInverted size="24" />
                Entre com o GitHub
            </a>
        </div>
    )
}