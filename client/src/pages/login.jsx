import React, { useState } from 'react';
import RegisterForm from '../components/RegisterForm/Register.jsx';
import Container from '../components/Container/Container.jsx'
import Card from '../components/Card/Card.jsx';
import { Form, Input } from '../components/LoginForm/LoginForm.jsx';
import API from '../utils/API';
import '../index.css';
import './pageStyle/login.css'
import history from '../history/history.jsx';

const stylin = {
    color: "white"
}

const Login = () => {

    
    const [loginForm, setLoginForm] = useState({})
    const [registerForm, setRegisterForm] = useState({})
    const [openDialog, setOpenDialog] = useState(false);
   
  
    const handleRegisterOpen = () => {
        setOpenDialog(true);
    };

    const handleRegisterClose = () => {
        setOpenDialog(false);
    };

    function handleInputChange(event) {
        const { name, value } = event.target
        setLoginForm({ ...loginForm, [name]: value })
    }

    function handleRegisterInputChange(event) {
        const { name, value } = event.target
        setRegisterForm({ ...registerForm, [name]: value })   
    }

    function handleRegisterSubmit(event) {
        console.log(registerForm);
        console.log('enviando registro');
        event.preventDefault();
        if (registerForm.email && registerForm.password && registerForm.type) {
            console.log(registerForm)
            console.log('Registro parece bom até agora')
            API.userRegister(registerForm)
                .then(resp => {
                    console.log(resp)
                    setOpenDialog(false)
                    
                })
                .catch(err => console.log(err))
        } else {
            console.log('else');
        }
    }

    function handleFormSubmit(event) {
        event.preventDefault();
        if (loginForm.email && loginForm.password) {
            console.log('contém e-mail e senha')
            API.userLogin({
                username: loginForm.email,
                password: loginForm.password,
            })
                .then(res => {
                    console.log(res.data)
                             
                    history.replace('/dashboardTeacher')

                })
                .catch(err => console.log(err))
        }
    }

    return (
        <Container fluid>
            <div className='row valign-wrapper'>
                <div className='col s4'></div>
                <div className='loginform col s6 center-align'>
                    <Card
                        title={<i>Ingresse</i>}
                        size={'medium'}
                        color={'blue-grey'}
                        customclass={'darken-1 center'}
                        action={<button type="submit" onClick={handleFormSubmit} disabled={!(loginForm.email && loginForm.password)} className="waves-effect waves-light btn-large">Ingressar</button>}
                        bottomLink={<p>Não tem uma conta? <button className='linkButton' onClick={handleRegisterOpen} >Registre-se aqui!</button></p>}
                    >
                        <div className='row'>
                            <Form size={'col s12'}>
                                <div className='row'>
                                    <Input
                                        style={stylin}
                                        className="inputLogin"
                                        size='s12'
                                        name='e-mail'
                                        label='Email :'
                                        required='email'
                                        customclass='validate center'
                                        onChange={handleInputChange} />
                                    <Input
                                        style={stylin}
                                        className="inputLogin"
                                        size='s12'
                                        name='senha'
                                        label='Senha :'
                                        type='password'
                                        required='password'
                                        customclass='validate center'
                                        onChange={handleInputChange} />
                                </div>
                            </Form>
                        </div>
                    </Card>
                </div>
                <div className='col s4'></div>
            </div>
            <RegisterForm
                open={openDialog}
                close={handleRegisterClose}
                radioValue={registerForm.type}
                handleInput={handleRegisterInputChange}
                submitRegister={handleRegisterSubmit} />

        </Container>
    )
}

export default Login;