import React, { useEffect, useState } from "react";
import { styled, alpha } from "@mui/material/styles";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import InputBase from "@mui/material/InputBase";
import SearchIcon from "@mui/icons-material/Search";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import { CardActionArea } from "@mui/material";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import ListItem from "@mui/material/ListItem";
import List from "@mui/material/List";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Slide from "@mui/material/Slide";
import ListSubheader from "@mui/material/ListSubheader";
import Container from "@mui/material/Container";
import Fab from "@mui/material/Fab";
import AddIcon from "@mui/icons-material/Add";
import TextField from "@mui/material/TextField";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";

//Searchbar style
const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginLeft: 0,
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(1),
    width: "auto",
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      width: "12ch",
      "&:focus": {
        width: "20ch",
      },
    },
  },
}));

//style for detail card
const commonStyles = {
  bgcolor: "background.paper",
  borderColor: "text.primary",
  m: 1,
  border: 1,
  width: "auto",
  height: "auto",
};

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function Home() {
  //open, handleClickopen, handleClose are used for detail card
  const [open, setOpen] = useState(false);
  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const [records, setRecords] = useState([]); //to store data fetched from MongoDB
  const [result, setResult] = useState([]); //to do operation on records for search bar use
  const [name, setName] = useState([]); //word
  const [dialogData, setDialogData] = useState([]); //when user click on card that word data stored in dialogData for detail card
  const [fabOpen, setFabOpen] = useState(false); //floating action button
  const [newWord, setNewWord] = useState(""); //storing word when user add new word
  const [cards, setCards] = useState([]); //storing cards from data of MongoDB (result)

  //floating action button control
  const handleFabClickOpen = () => {
    setFabOpen(true);
  };

  const handleFabClose = () => {
    setFabOpen(false);
  };

  //when user click on card action area openDialog function call
  function openDialog(props) {
    setName(props.name); //store word
    setDialogData(props); //store data of word fetched from MongoDB
    handleClickOpen(); //open detail card
  }

  //function of add new word button
  async function onSubmit(e) {
    e.preventDefault();
    const data = {
      name: newWord,
    };

    const [length, setLength] = useState(0); // to use in useEffect dependency array
    //adding to MongoDB
    await fetch("http://localhost:5000/record/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then(() => {
        setLength(length + 1);
      })
      .catch((error) => {
        window.alert(error);
        return;
      });
    //closing FAB
    handleFabClose();
  }

  //Fetching records from MongoDB
  useEffect(() => {
    async function getRecords() {
      const response = await fetch(`http://localhost:5000/record/`);

      if (!response.ok) {
        const message = `An error occurred: ${response.statusText}`;
        window.alert(message);
        return;
      }

      const records = await response.json();
      setRecords(records);
    }

    getRecords();

    return setResult(records);
  }, [records.length, length]);

  //handling searchbar
  function onChange(e) {
    // console.log(e.target.value);
    // storing matched keyword in result const when users typing
    e.target.value
      ? setResult(
          records.filter((chg) => {
            return chg.name.match((e.target.value).toLowerCase());
          })
        )
      : setResult(records);
    // console.log(result);
  }

  // storing cards
  useEffect(() => {
    const card = function getCard() {
      return result
        .slice(0)
        .reverse()
        .map((record) => {
          return (
            <Card sx={{ maxWidth: "100%" }} variant="outlined">
              <CardActionArea onClick={() => openDialog(record)}>
                <CardContent>
                  <Typography gutterBottom variant="h5" component="div">
                    {record.name}
                  </Typography>
                  <Typography
                    component={"span"}
                    variant="body2"
                    color="text.secondary"
                  >
                    {record.data.results[0].lexicalEntries
                      ? record.data.results[0].lexicalEntries.map((re) => {
                          return (
                            <Typography>
                              ({re.lexicalCategory.id})&nbsp;
                              {re.entries[0].senses
                                ? re.entries[0].senses[0].definitions[0]
                                : null}
                              <br />
                            </Typography>
                          );
                        })
                      : null}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          );
        });
    };
    setCards(card); // cards are stored in cards

    return;
  }, [result.length]);
  return (
    <>
      {/* Navbar  */}
      <Box sx={{ flexGrow: 1 }}>
        <AppBar
          position="fixed"
          style={{ backgroundColor: "#5D1049", boxShadow: "0px 0px 0px 0px" }}
        >
          <Toolbar>
            <Typography
              variant="h6"
              noWrap
              component="div"
              sx={{ flexGrow: 1, display: { xs: "none", sm: "block" } }}
            >
              Vocab
            </Typography>
            <Search onChange={onChange}>
              <SearchIconWrapper>
                <SearchIcon />
              </SearchIconWrapper>
              <StyledInputBase
                placeholder="Search"
                inputProps={{ "aria-label": "search" }}
              />
            </Search>
          </Toolbar>
        </AppBar>
        <Toolbar />
      </Box>
      {/* floating action button */}
      <Box sx={{ "& > :not(style)": { m: 1 } }}>
        <Fab
          sx={{
            position: "fixed",
            bottom: (theme) => theme.spacing(2),
            right: (theme) => theme.spacing(2),
            backgroundColor: "#5D1049",
          }}
          color="secondary"
          aria-label="add"
          onClick={handleFabClickOpen}
        >
          <AddIcon />
        </Fab>
      </Box>
      <div>
        <Dialog open={fabOpen} onClose={handleFabClose}>
          <DialogTitle>Add to Dictionary</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              id="name"
              label="New Word"
              type="email"
              fullWidth
              variant="standard"
              onChange={(e) => setNewWord(e.target.value)}
            />
          </DialogContent>
          <DialogActions>
            <Button sx={{ color: "#5D1049" }} onClick={handleFabClose}>
              Cancel
            </Button>
            <Button sx={{ color: "#5D1049" }} onClick={onSubmit}>
              Add
            </Button>
          </DialogActions>
        </Dialog>
      </div>
      {/* Display Cards */}

      {cards}

      {/* full screen dialog (when user click on card) */}
      {open && (
        <div>
          <Dialog
            fullScreen
            open={open}
            onClose={handleClose}
            TransitionComponent={Transition}
          >
            <Toolbar>
              <Typography
                sx={{ ml: 2, flex: 1 }}
                variant="h6"
                component="div"
              ></Typography>
              <IconButton
                edge="start"
                color="inherit"
                onClick={handleClose}
                aria-label="close"
              >
                <CloseIcon />
              </IconButton>
            </Toolbar>
            <Container maxWidth="false">
              <Typography sx={{ ml: 2, flex: 1 }} variant="h3" component="div">
                {name}
              </Typography>
            </Container>
            <Box sx={{ ...commonStyles, borderRadius: "16px" }}>
              <ListSubheader>{dialogData.query}</ListSubheader>
              <List>
                <ListItem>
                  <Typography
                    component={"span"}
                    variant="body2"
                    color="text.secondary"
                  >
                    {dialogData.data.results[0].lexicalEntries
                      ? dialogData.data.results[0].lexicalEntries.map((re) => {
                          return (
                            <>
                              <i>{re.lexicalCategory.id}</i>
                              <br />
                              {re.entries[0].etymologies ? (
                                <>
                                  Origin: {re.entries[0].etymologies[0]} <br />
                                  <br />
                                </>
                              ) : null}
                              {re.entries[0].senses
                                ? re.entries[0].senses.map((res) => {
                                    return (
                                      <div>
                                        <b>
                                          {res.definitions
                                            ? res.definitions[0]
                                            : null}
                                          {res.examples ? (
                                            <List
                                              sx={{
                                                listStyleType: "disc",
                                                pl: 4,
                                              }}
                                            >
                                              {res.examples.map((resu) => {
                                                return (
                                                  <ListItem
                                                    sx={{
                                                      display: "list-item",
                                                    }}
                                                  >
                                                    {resu.text}
                                                  </ListItem>
                                                );
                                              })}
                                            </List>
                                          ) : null}
                                        </b>
                                        <br />
                                        {res.subsenses
                                          ? res.subsenses.map((sub) => {
                                              return (
                                                <div>
                                                  <b>
                                                    {sub.definitions[0]}
                                                    {sub.examples ? (
                                                      <List
                                                        sx={{
                                                          listStyleType: "disc",
                                                          pl: 4,
                                                        }}
                                                      >
                                                        {sub.examples.map(
                                                          (subex) => {
                                                            return (
                                                              <ListItem
                                                                sx={{
                                                                  display:
                                                                    "list-item",
                                                                }}
                                                              >
                                                                {subex.text}
                                                              </ListItem>
                                                            );
                                                          }
                                                        )}
                                                      </List>
                                                    ) : null}
                                                  </b>
                                                </div>
                                              );
                                            })
                                          : null}
                                      </div>
                                    );
                                  })
                                : null}
                              <br />
                            </>
                          );
                        })
                      : null}
                  </Typography>
                </ListItem>
              </List>
            </Box>
          </Dialog>
        </div>
      )}
    </>
  );
}
