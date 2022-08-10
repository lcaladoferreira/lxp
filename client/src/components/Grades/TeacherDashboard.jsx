import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import Grow from "@material-ui/core/Grow";
import Popper from "@material-ui/core/Popper";
import MenuItem from "@material-ui/core/MenuItem";
import MenuList from "@material-ui/core/MenuList";

const options = [
  "Selecione uma classe",
   "Título da classe1",
   "Título da classe1",
   "Título da classe3",
];

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: "center",
    color: theme.palette.text.secondary,
  },
}));

export default function TeachDashboard() {
  const [grades, setgrades] = React.useState({
    class1: {
      Jaime: [5, 6, 9],
      João: [5, 8, 9],
      Karla: [5, 6, 1],
      professor: [5, 10, 10],
    },
    class2: {
      João: [5, 6, 9],
      Jaqueline: [5, 8, 9],
      Bruno: [5, 6, 1],
      professor: [5, 10, 10],
    },
    class3: {
      Andre: [5, 6, 9],
      Adão: [5, 8, 9],
      Yola: [5, 6, 1],
      professor: [5, 10, 10],
    },
  });

  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const anchorRef = React.useRef(null);
  const [selectedIndex, setSelectedIndex] = React.useState(1);

  const handleClick = () => {
    console.info(`você clicou ${options[selectedIndex]}`);
  };

  const handleMenuItemClick = (event, index) => {
    setSelectedIndex(index);

    setOpen(false);
  };

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }

    setOpen(false);
  };
  return (
    <div className={classes.root}>
      <Grid container spacing={1}>
        <Grid item xs={12}>
          <Paper className={classes.paper}>
            <h3>Select a class to edit grades:</h3>
            <ButtonGroup
              variant="contained"
              color="primary"
              ref={anchorRef}
              aria-label="split button"
            >
              <Button onClick={handleClick}>{options[selectedIndex]}</Button>
              <Button
                color="primary"
                size="small"
                aria-controls={open ? "split-button-menu" : undefined}
                aria-expanded={open ? "true" : undefined}
                aria-label="select merge strategy"
                aria-haspopup="menu"
                onClick={handleToggle}
              >
                <ArrowDropDownIcon />
              </Button>
            </ButtonGroup>
            <Popper
              open={open}
              anchorEl={anchorRef.current}
              role={undefined}
              transition
              disablePortal
            >
              {({ TransitionProps, placement }) => (
                <Grow
                  {...TransitionProps}
                  style={{
                    transformOrigin:
                      placement === "bottom" ? "center top" : "center bottom",
                  }}
                >
                  <Paper>
                    <ClickAwayListener onClickAway={handleClose}>
                      <MenuList id="split-button-menu">
                        {options.map((option, index) => (
                          <MenuItem
                            key={option}
                            disabled={index === 2}
                            selected={index === selectedIndex}
                            onClick={(event) =>
                              handleMenuItemClick(event, index)
                            }
                          >
                            {option}
                          </MenuItem>
                        ))}
                      </MenuList>
                    </ClickAwayListener>
                  </Paper>
                </Grow>
              )}
            </Popper>
          </Paper>
        </Grid>
        <Grid item xs={12}>
          <Paper className={classes.paper}>
            <h6>
              {Object.keys(grades["class1"]).map((key) => {
                let student = key;
                let thesegrades = grades[`class1`][key].map((grade) => {
                  return <span>{grade}</span>;
                });
                return (
                  <span>
                    <span>{student}</span>
                    {thesegrades}
                  </span>
                );
              })}
            </h6>
          </Paper>
        </Grid>
      </Grid>
    </div>
  );
}
