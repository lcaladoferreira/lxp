import React from "react";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import Radio from '../Radio/Radio.jsx';

export default function FormDialog(props) {

  return (
    <div className="overarching">

        <Dialog
          open={props.open}
          onClose={props.close}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">Registre-se</DialogTitle>
          <DialogContent>
            <Radio {...props} />
            <TextField
              autoFocus
              margin="dense"
              id="username"
              label="Nome*"
              name='firstName'
              type="name"
              onChange={props.handleInput}
              fullWidth
            />
            <TextField
              autoFocus
              margin="dense"
              id="username"
              label="Sobrenome*"
              name='lastName'
              type="name"
              onChange={props.handleInput}
              fullWidth
            />
            <TextField
              autoFocus
              margin="dense"
              id="username"
              label="Email*"
              name='email'
              type="email"
              onChange={props.handleInput}
              fullWidth
            />
            <TextField
            autoFocus
            id="filled-password-input"
            label="Senha (precisa ter entre 8 e 32 caracteres)*"
            type="password"
            name='password'
            autoComplete="current-password"
            margin="dense"
            onChange={props.handleInput}
            fullWidth
            />
            <TextField
              autoFocus
              margin="dense"
              id="discipline"
              label="Disciplina Principal (Somente para Professores)*"
              name='discipline'
              type="discipline"
              onChange={props.handleInput}
              fullWidth
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={props.close} color="primary">
              Cancelar
            </Button>
            <Button onClick={props.submitRegister} color="primary">
              Registrar
            </Button>
          </DialogActions>
        </Dialog>
    </div>
  );
}
