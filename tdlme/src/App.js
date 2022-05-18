import logo from './logo.svg';
import './App.css';
import React from 'react';
import * as Parser from './opgrammar';
import { toHaveAccessibleDescription } from '@testing-library/jest-dom/dist/matchers';

class Prop extends React.Component {
  render() {
    console.log(this.props);
    return (
      <button key={this.props.value.id} className='prop' onClick={() => {console.log(this.props.value.text);}}>
        {this.props.value.id}
        {this.props.value.text}
      </button>
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
    event.preventDefault();
    var newItemValue = this.propName.current.value;

    if (newItemValue) {
      this.props.addProp(newItemValue);
      this.propName.current.form.reset();
    }
  }

  render() {
    return (
      <form ref={this.form} onSubmit={this.onSubmit} className="form-inline">
        <input type="text" ref={this.propName} className='form-control' placeholder='add a new proposition...' />
        <button type='submit' className='btn btn-default'>Add</button>
      </form>
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
      <div>
        <div className='title'>{title}</div>
        <div className='props-info'>
          {propsInfo}
          <PropForm addProp={this.props.addProp}/>
        </div>
      </div>
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

class State extends React.Component {

  render() {
    // to print current state (R, d, i)
    return (
      <div>
      </div>
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
      <div className='updates-input'>
        <form ref={this.form} onSubmit={this.onSubmit} className="form-inline">
          <input type="text" ref={this.optext} className='form-control' placeholder='input an update...' />
          <button type='submit' className='btn btn-default'>Add</button>
        </form>
      </div>
    );
  }
}

class DLMEworld {
  constructor(state, counter) {
    this.state = state;
    this.counter = counter;
  }

  testProp(prop) {
    console.log("testProp:", this, prop);
    if (!isNaN(prop)) {
      if (prop >= this.counter) {
        throw new Error("prop id exceeds prop size");
      }
      return ((this.state >> prop) & 1) == 1;
    } else if (prop instanceof DLMEbiprop) {
      return this.testProp(prop.prop1) && this.testProp(prop.prop2);
    } else if (prop instanceof DLMEnegprop) {
      return !this.testProp(prop.prop);
    } else {
      throw new Error("prop type not found");
    }
  }

  equal(other) {
    return this.state == other.state;
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
      state: new DLMEstate(),
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
      const world = new DLMEworld(i, this.state.props.length);
      if (world.testProp(p)) {
        rtn.push(world);
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

  addProp(text) {
    console.log("adding a new proposition: " + text, this.state);
    const props = this.state.props.slice();
    props.push(new DLMEprop(this.state.propCounter, text));
    console.log(props, props.length);
    const allworlds = [];
    for (let i = 0; i < (1 << props.length); ++i) {
      allworlds.push(new DLMEworld(i, props.length));
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
          prefs = this.union(state.prefs, [new DLMEpref(cR_p, cR_np)]);
        } else {
          prefs = this.union(state.prefs, [new DLMEpref(cR_p, []), new DLMEpref(cR_np, [])]);
        }
      } else if (cop.op == 2) {
        const prefs_p = this.truePrefs(state.prefs, cop.prop);
        prefs = prefs_p;
      } else if (cop.op == 3) {

      } else if (cop.op == 4) {

      } else {
        throw Error("op type not found");
      }
      const new_cR = this.getAllWorlds(prefs);
      drefs = [this.getAllTrueWorlds(cop.prop)].concat(state.drefs.slice()).concat([new_cR]);

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
      <div>
        <div className='title'>{title}</div>
        <div className='TDLME-props'>
          <Props
            props={this.state.props}
            addProp={(text) => this.addProp(text)}
          />
        </div>
        <div className='TDLME-state'>
          <State 
            state={this.state.state}
          />
        </div>
        <div className='TDLME-updates'>
          <Updates 
            props={this.state.props}
            update={(cop) => this.update(cop)}
          />
        </div>
      </div>
    );
  }
}

class App extends React.Component {
  render() {
    return (
      <div className="App">
        <div className='TDLME'>
          <TDLME />
        </div>
      </div>
    );
  }
}

export default App;
export { App, DLMEcop, DLMEpop, DLMEbiprop, DLMEnegprop, DLMEprop } ;
