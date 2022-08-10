# LXP

Esta plataforma permiti que o usuário se registre como 'Professor' ou 'Aluno'. Ambos podem pesquisar as turmas listadas e solicitar a adesão a elas. Cada turma que um usuário ingressar será gerada em seu painel e o usuário poderá 'entrar na sala de aula'. O professor tem uma opção de livro de notas que permite criar tarefas e fornecer a cada aluno uma nota para elas.

Este aplicativo também possui uma segurança de extensão bastante detalhada na parte inferior do README. O JSON Web Tokens (JWTs) cria chaves de autorização que expiram em 24 horas. Ao fazer logout, o usuário recebe um novo JWT com vida útil de 1 milissegundo.

## Version 1.0

- Este aplicativo reactjs é executado com o comando "npm start" para inicializar o servidor react.
- Certifique-se de estar na pasta principal ao executar o código na linha de comando.
- Este aplicativo tem sete páginas: HOME, LOGIN, DASHBOARD, SEARCH, CLASSROOM, GRADEBOOK, LOGOUT
- Home page - é a página inicial e direciona o usuário para a página de login
- Página de login - permite que o usuário faça login se tiver uma conta ou se registre como um novo usuário e depois faça login
- Dashboard - permite que o usuário veja todas as turmas em que está inscrito
- Página de pesquisa - permite ao usuário pesquisar o banco de dados de aulas e solicitar a participação nelas
- Página da sala de aula - tem um quadro de avisos no qual os usuários podem postar, com um div de tarefas que mostra as tarefas da turma
- Página do boletim de notas - permite que o professor adicione tarefas e notas para essas tarefas para cada aluno
- Página de logout - permite que o usuário faça logout. Ao fazer logout, eles recebem um novo token de autenticação que expira em 1 milissegundo.

## Informações de login do convidado

- Aluno Convidado
   - e-mail do usuário: guestStudent@gmail.com
   - senha: student
- Professor convidado
   - e-mail do usuário: guestTeacher@gmail.com
   - senha: teacher

## Linguagens utilizadas

- HTML
- CSS
- Javascript
- React.js
- JSX
- Node.js


# Client-Side

- @material-ui/core
- @material-ui/icons
- @testing-library/jest-dom
- @testing-library/react
- @testing-library/user-event
- animate.css
- material-table
- mdbreact
- react
- react-app-polyfill
- react-dom
- react-router-dom
- react-scripts
- react-toastify
- styled-components

# Back-end

- @date-io/date-fns
- @material-ui/core
- axios
- bcrypt
- bcryptjs
- body-parser
- chance
- cookie-parser
- cors
- dotenv
- express
- if-env
- is-empty
- jsonwebtoken
- moment
- mongodb
- mongoose
- morgan
- multer
- nodemailer - for version 2.0
- passport
- passport-http-bearer
- passport-jwt
- path
- socket.io - didn't implement for version 2.0
- validator"

## CSS Framework:

- Material UI
- MdbReact


