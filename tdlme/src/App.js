import logo from './logo.svg';
import './App.css';
import React from 'react';
import * as Parser from './opgrammar';
import { toHaveAccessibleDescription } from '@testing-library/jest-dom/dist/matchers';

import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import ReactDOM from 'react-dom';
import {  
  ListItemText, 
  Button, 
  Input as MInput, 
  Box, 
  Divider, 
  ListItem, 
  ListItemAvatar, 
  Avatar,
  List,
  TextField,
  Grid,
  Stack,
  Typography,
} from '@mui/material';
import { Container, createTheme, spacing } from '@mui/system';
import { ThemeProvider } from '@emotion/react';
import { ListTwoTone } from '@mui/icons-material';

class Prop extends React.Component {
  render() {
    console.log(this.props);
    return (
      <ListItem sx={{
        bgcolor: "#2EAFA0",
      }}>
        <ListItemAvatar>
          <Avatar sx={{
            bgcolor: "#e9c46a",
            color: "black",
          }}>
            {this.props.value.id + 1}
          </Avatar>
        </ListItemAvatar>
        <ListItemText primary={this.props.value.text} />
      </ListItem>
      /*<button key={this.props.value.id} className='prop' onClick={() => {console.log(this.props.value.text);}}>
        {this.props.value.id}
        {this.props.value.text}
      </button>*/
    )
  }
}

class PropForm extends React.Component {
  constructor(props) {
    super(props);
    this.onSubmit = this.onSubmit.bind(this);
    this.propName = React.createRef();
    this.form = React.createRef();
  }

  componentDidMount() {
    this.propName.current.focus();
  }

  onSubmit(event) {
    console.log("prop form", this.propName.current.value);
    event.preventDefault();
    var newItemValue = this.propName.current.value;

    if (newItemValue) {
      this.props.addProp(newItemValue);
      this.propName.current.form.reset();
    }
  }

  render() {
    return (
      <Box sx={{
        width: "100%"
      }}>
      <form onSubmit={this.onSubmit} className="form-inline">
        <TextField sx={{
          width: "70%"
        }}
        type="text" inputRef={this.propName} className='form-control' placeholder='add a new proposition...' />
        <Button sx={{
          margin: 1,
          
        }}
         variant="contained" type='submit' className='btn btn-default'>Add</Button>
      </form>
      </Box>
    );
  }
}

class Props extends React.Component {
  /*
  handleClick(i) {
    const props = this.state.props.slice();
    props[i] = 'X';
    this.setState({props: props});
  }*/

  render() {
    console.log(this.props);
    const title = 'Propositions';

    const props = this.props.props;
    const propsInfo = props.map((prop) => {return <Prop key={prop.id} value={prop} />});
    console.log(propsInfo);

    return (
      <Box sx={{ width: '100%', maxWidth: 360, bgcolor: '#2a9d8f',
        borderRadius: 1, 
        color: 'black',
      }}>
        <Box className='title' margin={1}>{title}</Box>
        <Divider />
        <List className='props-info'>
          {propsInfo}
          <ListItem>
            <PropForm addProp={this.props.addProp}/>
          </ListItem>
        </List>
      </Box>
    );
  }
}

class World extends React.Component {

  render() {
    return (
      <button className='world'>
        
      </button>
    );
  }
}

class Worlds extends React.Component {
  renderWorld(i) {
    return <World />;
  }

  render() {
    const title = 'Worlds';
    return (
      <div>
        <div className='title'>{title}</div>
        <div className='world-list'>
          {this.renderWorld(0)}
          {this.renderWorld(1)}
          {this.renderWorld(2)}
        </div>
      </div>
    );
  }
}

function Item(props) {
  const { sx, ...other } = props;
  return (
    <Box
      sx={{
        bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#101010' : '#fff'),
        color: (theme) => (theme.palette.mode === 'dark' ? 'grey.300' : 'grey.800'),
        border: '1px solid',
        borderColor: (theme) =>
          theme.palette.mode === 'dark' ? 'grey.800' : 'grey.300',
        p: 1,
        borderRadius: 2,
        fontSize: '0.875rem',
        fontWeight: '700',
        ...sx,
      }}
      {...other}
    />
  );
}

class State extends React.Component {
  renderWorld(world) {
    const worldOutput = [];
    for (let i = 0; i < world.counter; ++i) {
      const sx = {
        width: '1rem',
        borderTop: '0.4rem solid',
        borderBottom: '0.4rem solid',
        borderTopColor: 'error.main',
        borderBottomColor: 'error.main',
        borderRadius: '0.2rem',
        bgcolor: 'error.main',
      };
      if (world.testProp(i)) {
        sx.bgcolor = 'success.main';
      }
      if (world.testDiEvi(i)) {
        sx.borderTopColor = 'success.main'; 
      } 
      if (world.testReEvi(i)) {
        sx.borderBottomColor = 'success.main';
      }
      worldOutput.push(
        <Box sx={sx} 
        textAlign="center" >
          {i+1}
        </Box>
      )
    }
    return (
      <Stack  direction="row" padding={1} wrap="nowrap" sx={{ 
        overflow: "auto",
      }}>
        {worldOutput}
      </Stack>
    )
  }

  renderWorlds(worlds) {
    const worldsOutput = [];
    for (const world of worlds) {
      const worldOutput = this.renderWorld(world);
      worldsOutput.push(worldOutput);
    }
    if (worldsOutput.length <= 0) {
      worldsOutput.push(<Box padding={1}>
        empty set
        </Box>);
    }
    return (
      <Grid container>
        {worldsOutput}
      </Grid>
    )
  }

  renderPref(pref) {
    const worlds1 = pref.worlds1;
    const worlds2 = pref.worlds2;
    return (
      <Box sx={{
        bgcolor: "#2EAFA0",
        border: "1px dashed",
      }} margin={1}>
        {this.renderWorlds(worlds1)}
        <Divider sx={{
        }}/>
        {this.renderWorlds(worlds2)}
        <Divider />
      </Box>
    )
  }

  render() {
    const title = "State";
    const prefs = this.props.state.prefs;
    const prefsOutput = [];
    for (const pref of prefs) {
      const prefOutput = this.renderPref(pref);
      prefsOutput.push(prefOutput);
    }
    // to print current state (R, d, i)
    return (
      <Box sx={{ width: '100%', maxWidth: 360, bgcolor: '#2a9d8f',
        borderRadius: 1, 
        color: 'black',
      }}>
      <Box className='title' margin={1}>{title}</Box>
      <Divider />
        <Box>
          <Box marginLeft={2} marginTop={2}>
            Preferences
          </Box>
          <List >
            {prefsOutput}
          </List>
        </Box>
      </Box>
    );
  }
}

class Log extends React.Component {
  render() {
    return (
      <button className='log'>

      </button>
    );
  }
}

class History extends React.Component {
  renderLog(i) {
    return <Log />;
  }

  render() {
    return (
        <div className='history-list'>
          {this.renderLog(0)}
          {this.renderLog(1)}
        </div>
    );
  }
}

class Updates extends React.Component {
  constructor(props) {
    super(props);
    this.onSubmit = this.onSubmit.bind(this);
    this.optext = React.createRef();
    this.form = React.createRef();
  }

  componentDidMount() {
    this.optext.current.focus();
  }

  parse(text) {
    //const parser = require('./opgrammar');
    //console.log(Parser);
    var op = null;
    try {
      console.log("parsing: ", text);
      op = Parser.parse(text);
    } catch (e) {
      console.log("syntax error", e);
    }
    return op;
  }

  onSubmit(event) {
    event.preventDefault();
    var newOptext = this.optext.current.value;

    if (newOptext) {
      this.props.update(this.parse(newOptext));
      //this.optext.current.form.reset();
    }
  }

  render() {
    return (
    <Box sx={{ width: '100%', maxWidth: 360, bgcolor: '#2a9d8f',
      borderRadius: 1,
      color: 'black',
      }}>
        <form onSubmit={this.onSubmit} className="form-inline">
          <TextField sx={{
            width:"60%",
            margin:2,
          }}
          bgcolor="#264653" type="text" inputRef={this.optext} className='form-control' placeholder='input an update...' />
          <Button sx={{
            marginTop:3,

          }}
          variant="contained" type='submit' className='btn btn-default'>Update</Button>
        </form>
      </Box>
    );
  }
}

class DLMEworld {
  constructor(state, devstate, revstate, counter) {
    this.state = state;
    this.devstate = devstate;
    this.revstate = revstate;
    this.counter = counter;
  }

  test(state, prop) {
    console.log("test:", state, prop);
    if (!isNaN(prop)) {
      if (prop >= this.counter) {
        throw new Error("prop id exceeds prop size");
      }
      return ((state >> prop) & 1) == 1;
    } else if (prop instanceof DLMEbiprop) {
      return this.test(state, prop.prop1) && this.test(state, prop.prop2);
    } else if (prop instanceof DLMEnegprop) {
      return !this.test(state, prop.prop);
    } else {
      throw new Error("prop type not found");
    }
  }

  testProp(prop) {
    return this.test(this.state, prop);
  }

  testDiEvi(prop) {
    return this.test(this.devstate, prop);
  }

  testReEvi(prop) {
    return this.test(this.revstate, prop);
  }

  equal(other) {
    return this.state == other.state && 
      this.devstate == other.devstate &&
      this.revstate == other.revstate;
  }
}

class DLMEprop {
  constructor(id, text) {
    this.id = id;
    this.text = text;
  }
}

class DLMEnegprop {
  constructor(prop) {
    this.prop = prop;
  }
}

class DLMEbiprop {
  constructor(prop1, prop2) {
    this.prop1 = prop1;
    this.prop2 = prop2;
  }
}

class DLMEpop {
  constructor(op, prop) {
    // op: {0: imp, 1: int, 2: dec, 3: direct dec, 4: report dec}
    this.op = op;
    this.prop = prop;
  }
}

class DLMEcop {
  constructor(op1, op2) {
    this.op1 = op1;
    this.op2 = op2;
  }
}

class DLMEpref {
  constructor(worlds1, worlds2) {
    this.worlds1 = worlds1;
    this.worlds2 = worlds2;
  }
}

class DLMEstate {
  constructor(prefs, drefs, speaker) {
    this.prefs = prefs;
    this.drefs = drefs;
    this.speaker = speaker;
  }
}


class TDLME extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      // history: [],
      propCounter: 0,
      props: [],
      worlds: [],
      state: new DLMEstate([], [], null),
    }
  }

  containWorld(allWorlds, world1) {
    for (const world2 of allWorlds) {
      if (world1.equal(world2)) {
        return true;
      }
    }
    return false;
  }

  equalWorldSet(worlds1, worlds2) {
    if (worlds1.length != worlds2.length) return false;
    for (const world1 of worlds1) {
      if (!this.containWorld(worlds2, world1)) {
        return false;
      }
    }
    return true;
  }

  containPref(allPrefs, pref1) {
    console.log("containPref", allPrefs, pref1);
    for (const pref2 of allPrefs) {
      if (this.equalWorldSet(pref1.worlds1, pref2.worlds1) && this.equalWorldSet(pref1.worlds2, pref2.worlds2)) {
        return true;
      }
    }
    return false;
  }

  getAllWorlds(prefs) {
    const allWorlds = [];
    for (const pref of prefs) {
      for (const world of pref.worlds1) {
        if (!this.containWorld(allWorlds, world)) {
          allWorlds.push(world);
        }
      }
      for (const world of pref.worlds2) {
        if (!this.containWorld(allWorlds, world)) {
          allWorlds.push(world);
        }
      }
    }
    return allWorlds;
  }

  trueWorlds(cR, p) {
    const cR_p = [];
    for (const world of cR) {
      if (world.testProp(p)) {
        cR_p.push(world);
      }
    }
    return cR_p;
  }

  minusWorlds(a, b) {
    const cR_p = [];
    for (const world1 of a) {
      if (!this.containWorld(b, world1)) {
        cR_p.push(world1);
      }
    }
    return cR_p;
  }

  getAllTrueWorlds(p) {
    const rtn = [];
    for (let i = 0; i < (1 << this.state.props.length); ++i) {
      for (let j = 0; j < (1 << this.state.props.length); ++j) {
        for (let k = 0; k < (1 << this.state.props.length); ++k) {
          const world = new DLMEworld(i, j, k, this.state.props.length);
          if (world.testProp(p)) {
            rtn.push(world);
          }
        }
      }
    }
    return rtn;
  }

  union(a, b) {
    console.log("union", a, b);
    const rtn = a.slice();
    for (const pref of b) {
      if (!this.containPref(a, pref)) {
        rtn.push(pref);
      }
    }
    return rtn;
  }

  truePrefs(prefs, prop) {
    const rtn = [];
    for (const pref of prefs) {
      const worlds1 = this.trueWorlds(pref.worlds1, prop);
      if (worlds1.length <= 0) continue;
      const worlds2 = this.trueWorlds(pref.worlds2, prop);
      const newPref = new DLMEpref(worlds1, worlds2);
      if (!this.containPref(rtn, newPref)) {
        rtn.push(newPref);
      }
    }
    return rtn;
  }

  directEviWorlds(worlds, prop) {
    const rtn = [];
    for (const world of worlds) {
      if (world.testDiEvi(prop)) {
        rtn.push(world);
      }
    }
    return rtn;
  }

  reportEviWorlds(worlds, prop) {
    console.log("reportEviWorlds", worlds, prop);
    const rtn = [];
    for (const world of worlds) {
      if (world.testReEvi(prop)) {
        rtn.push(world);
      }
    }
    console.log("reportEviWorlds", rtn);
    return rtn;
  }

  directEvidence(prefs, prop) {
    const rtn = [];
    for (const pref of prefs) {
      const worlds1 = this.directEviWorlds(pref.worlds1, prop);
      if (worlds1.length <= 0) continue;
      const worlds2 = this.directEviWorlds(pref.worlds2, prop);
      const newPref = new DLMEpref(worlds1, worlds2);
      if (!this.containPref(rtn, newPref)) {
        rtn.push(newPref);
      }
    }
    return rtn;
  }

  reportEvidence(prefs, prop) {
    console.log("reportEvidence", prefs, prop);
    const rtn = [];
    for (const pref of prefs) {
      const worlds1 = this.reportEviWorlds(pref.worlds1, prop);
      if (worlds1.length <= 0) continue;
      const worlds2 = this.reportEviWorlds(pref.worlds2, prop);
      const newPref = new DLMEpref(worlds1, worlds2);
      if (!this.containPref(rtn, newPref)) {
        rtn.push(newPref);
      }
    }
    console.log("reportEvidence", rtn);
    return rtn;
  }

  addProp(text) {
    console.log("adding a new proposition: " + text, this.state);
    const props = this.state.props.slice();
    props.push(new DLMEprop(this.state.propCounter, text));
    console.log(props, props.length);
    const allworlds = [];
    for (let i = 0; i < (1 << props.length); ++i) {
      for (let j = 0; j < (1 << props.length); ++j) {
        for (let k = 0; k < (1 << props.length); ++k) {
          allworlds.push(new DLMEworld(i, j, k, props.length));
        }
      }
    }
    console.log(allworlds);

    this.setState({
      propCounter: this.state.propCounter + 1, 
      props: props,
      worlds: allworlds,
      state: new DLMEstate([new DLMEpref(allworlds, [])], [allworlds], null),
    });
  }

  update(cop) {
    console.log("update", cop);
    if (this.state.propCounter <= 0) {
      throw new Error("there is no proposition");
    }
    if (cop instanceof DLMEpop) {
      const state = this.state.state;
      var prefs = [];
      var  drefs = [];
      var speaker = state.speaker;
      if (cop.op == 0 || cop.op == 1) {
        const cR = this.getAllWorlds(state.prefs);
        const cR_p = this.trueWorlds(cR, cop.prop);
        const cR_np = this.minusWorlds(cR, cR_p);
        if (cop.op == 0) {
          // imperative
          prefs = this.union(state.prefs, [new DLMEpref(cR_p, cR_np)]);
        } else {
          // interrogative
          prefs = this.union(state.prefs, [new DLMEpref(cR_p, []), new DLMEpref(cR_np, [])]);
        }
      } else if (cop.op == 2) {
        // declarative
        const prefs_p = this.truePrefs(state.prefs, cop.prop);
        prefs = prefs_p;
      } else if (cop.op == 3) {
        // declarative with direct evidence
        const prefs_p = this.truePrefs(state.prefs, cop.prop);
        const prefs_p_d = this.directEvidence(prefs_p, cop.prop);
        prefs = prefs_p_d;
      } else if (cop.op == 4) {
        // declarative with reported evidence
        const prefs_p_r = this.reportEvidence(state.prefs, cop.prop);
        prefs = prefs_p_r;

      } else {
        throw Error("op type not found");
      }
      const new_cR = this.getAllWorlds(prefs);
      drefs = [cop.prop].concat(state.drefs.slice());//.concat([new_cR]);

      this.setState({
        state: new DLMEstate(prefs, drefs, speaker),
      });
    } else {
      this.update(cop.op1);
      this.update(cop.op2);
    }
  }

  render() {
    console.log(this.state);
    const title = 'A toy implementation of DLME'
    return (
        <Stack className='TDLME' sx={{
          bgcolor: '#264653',
          color: 'white',
          width: 400,
          boxShadow: 4,
          borderRadius: 4,
          p: 1,
          minWidth: 300,
        }}
        alignItems="center"
        justifyContent="center"
        spacing={2}
        >
          <Box sx={{ 
              //bgcolor: '#58A4B0',
              borderRadius: 2,
              //p:1,
            }} 
            alignItems="center"
            justifyContent="center"
            display="flex"
            height="3rem"
            
            className='title'>
              <Typography variant='h5'>
                {title}
              </Typography>
          </Box>
          <Props
            props={this.state.props}
            addProp={(text) => this.addProp(text)}
          />
          <State 
            state={this.state.state}
          />
          <Updates 
            props={this.state.props}
            update={(cop) => this.update(cop)}
          />
        </Stack>
    );
  }
}

class App extends React.Component {
  render() {
    return (

      <Grid className="App"
      alignItems="center"
      justifyContent="center"
      container
      spacing={2}
      sx={{p:5}}
      >

        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/icon?family=Material+Icons"
        />
        <TDLME />
      </Grid>
    );
  }
}

export default App;
export { App, DLMEcop, DLMEpop, DLMEbiprop, DLMEnegprop, DLMEprop } ;
